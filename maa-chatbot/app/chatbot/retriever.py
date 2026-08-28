import json
import re
from pathlib import Path

KNOWLEDGE_DIR = Path(__file__).resolve().parents[2] / "knowledge_base"

FALLBACK = (
    "I don't have reliable information about that in the available MAA knowledge base. "
    "Please contact MAA support through the contact details in the website footer."
)

GREETINGS = {"hi", "hello", "hey", "salam", "assalam o alaikum", "assalamualaikum", "aoa"}

STOP_WORDS = {
    "a", "about", "an", "and", "are", "can", "do", "for", "how", "i", "is", "me", "my",
    "of", "on", "please", "tell", "the", "to", "what", "where", "who", "with", "does",
    "kya", "hai", "hain", "ka", "ki", "ke", "mein", "mai", "se", "ko", "aur", "koi",
    "bhi", "ho", "hy", "hu",
}

# Very short follow-up questions where we should reuse the previous topic's context
FOLLOW_UP_HINTS = {"eligibility", "documents", "process", "cost", "fee", "fees", "how", "why", "when", "where"}

# In-memory per-conversation state (fine for a student demo; use a real store for production)
_CONVERSATION_STATE: dict[str, set[str]] = {}


def _tokens(value: str) -> set[str]:
    return {token for token in re.findall(r"[a-z0-9]+", value.lower()) if token not in STOP_WORDS}


def load_entries() -> list[dict]:
    entries: list[dict] = []
    for knowledge_file in sorted(KNOWLEDGE_DIR.glob("*.json")):
        with knowledge_file.open(encoding="utf-8") as file_handle:
            entries.extend(json.load(file_handle))
    return entries


def retrieve(message: str, extra_tokens: set[str] | None = None, limit: int = 3) -> list[dict]:
    query_tokens = _tokens(message) | (extra_tokens or set())
    scored_entries = []
    for entry in load_entries():
        title_tokens = _tokens(entry["title"])
        body_tokens = _tokens(" ".join([entry["answer"], " ".join(entry.get("keywords", []))]))
        # title matches count extra, since they usually signal the exact topic
        score = 2 * len(query_tokens & title_tokens) + len(query_tokens & body_tokens)
        if score:
            scored_entries.append((score, entry))
    scored_entries.sort(key=lambda item: item[0], reverse=True)
    return [entry for _, entry in scored_entries[:limit]]


def answer(message: str, conversation_id: str | None = None) -> tuple[str, list[str]]:
    normalized_message = message.strip().lower()
    if not normalized_message:
        return "Please enter a question about MAA, its services, or how to get support.", []

    if normalized_message in GREETINGS:
        return (
            "Welcome to MAA. I can help with information about the platform, Home Made Food, "
            "Medicine and Health, Travel Assistance, Talk to MAA, account help, or reporting a problem.",
            ["Welcome guide"],
        )

    query_tokens = _tokens(message)
    reuse_history = bool(conversation_id) and len(query_tokens - FOLLOW_UP_HINTS) <= 1
    extra_tokens = _CONVERSATION_STATE.get(conversation_id, set()) if reuse_history else set()

    matches = retrieve(message, extra_tokens=extra_tokens)
    if not matches:
        return FALLBACK, []

    best_match = matches[0]
    sources = [match["source"] for match in matches]

    if conversation_id:
        _CONVERSATION_STATE[conversation_id] = _tokens(best_match["title"])

    return best_match["answer"], sources
