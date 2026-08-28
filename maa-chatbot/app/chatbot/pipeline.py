"""RAG pipeline: retrieve relevant MAA knowledge chunks, then let the LLM decide
how to respond — grounded in the retrieved chunks for MAA-specific factual
questions, or as a warm, natural, mother-like reply for personal/casual/emotional
messages that don't need the knowledge base at all (see app/chatbot/prompts.py
for the exact routing rules given to the LLM).

Important fix: earlier versions only called the LLM when keyword retrieval found
a match, and returned a canned fallback otherwise. That silently broke two things:
1. Casual/emotional messages (which never match a knowledge-base keyword) always
   got the canned "I don't know" fallback instead of a warm reply.
2. Roman Urdu / Hinglish questions whose words don't overlap with the mostly
   English knowledge-base keywords also failed to match, even when the exact same
   question in English would have matched — so Hinglish users saw "not relevant"
   for things the bot could clearly answer in English.
Now the LLM is always consulted when enabled; retrieval only decides what
grounding Context (if any) gets attached, and the system prompt tells the LLM
what to do when there is no matching Context.
"""

import logging

import requests

from app.chatbot import retriever
from app.core.config import LLM_ENABLED
from app.services import analytics_service
from app.services.llm_service import generate_answer
from app.utils.language import is_roman_urdu

logger = logging.getLogger("maa.pipeline")


def answer(message: str, conversation_id: str | None = None) -> tuple[str, list[str]]:
    normalized_message = message.strip().lower()

    if not normalized_message:
        return "Please enter a message for MAA , a question, or just how you're feeling.", []

    if normalized_message in retriever.GREETINGS:
        analytics_service.log_query(topic="greeting", answered=True)
        return (
            "Welcome to MAA. I can help with information about the platform, Home Made Food, "
            "Medicine and Health, Travel Assistance, Talk to MAA, account help, reporting a "
            "problem — or just tell me how your day is going.",
            ["Welcome guide"],
        )

    # Step 1: retrieval — finds grounding Context if this looks MAA-specific.
    # An empty result is a normal, expected outcome for casual/emotional messages.
    query_tokens = retriever._tokens(message)
    reuse_history = bool(conversation_id) and len(query_tokens - retriever.FOLLOW_UP_HINTS) <= 1
    extra_tokens = retriever._CONVERSATION_STATE.get(conversation_id, set()) if reuse_history else set()
    matches = retriever.retrieve(message, extra_tokens=extra_tokens)

    sources = [match["source"] for match in matches]
    top_topic = matches[0]["id"] if matches else None
    if conversation_id and matches:
        retriever._CONVERSATION_STATE[conversation_id] = retriever._tokens(matches[0]["title"])

    # Step 2: generation.
    if not LLM_ENABLED:
        # No Groq key set: we cannot generate free-form warm/casual replies, so we
        # fall back to the older keyword-only behaviour (grounded answer or a fixed
        # "I don't know"). This is a real capability gap, not a bug — documented in
        # docs/installation.md.
        if matches:
            analytics_service.log_query(topic=top_topic, answered=True)
            return matches[0]["answer"], sources
        analytics_service.log_query(topic=None, answered=False)
        return retriever.FALLBACK, []

    try:
        roman_urdu = is_roman_urdu(message)
        generated = generate_answer(message, matches, reply_in_roman_urdu=roman_urdu)
        analytics_service.log_query(topic=top_topic, answered=True)
        return generated, sources
    except (requests.RequestException, KeyError, IndexError) as error:
        logger.warning("LLM call failed, falling back: %s", error)
        if matches:
            analytics_service.log_query(topic=top_topic, answered=True)
            return matches[0]["answer"], sources
        analytics_service.log_query(topic=None, answered=False)
        return retriever.FALLBACK, []
