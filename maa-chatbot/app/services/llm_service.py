"""Talks to the Groq API to turn retrieved knowledge-base chunks into a
natural, grounded answer. Groq exposes an OpenAI-compatible chat completions
endpoint, so this only needs `requests`, no extra SDK.
"""

import requests

from app.core.config import GROQ_API_KEY, GROQ_MODEL
from app.chatbot.prompts import SYSTEM_PROMPT, ROMAN_URDU_INSTRUCTION, build_user_prompt

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def generate_answer(question: str, context_chunks: list[dict], reply_in_roman_urdu: bool = False) -> str:
    """Calls Groq (openai/gpt-oss-20b) with the retrieved chunks as grounding context.

    Raises requests.RequestException on network/API failure so the caller
    (pipeline.py) can fall back to a safe response instead of crashing.
    """
    system_prompt = SYSTEM_PROMPT
    if reply_in_roman_urdu:
        system_prompt += "\n" + ROMAN_URDU_INSTRUCTION

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": build_user_prompt(question, context_chunks)},
        ],
        "temperature": 0.2,
        "max_tokens": 300,
    }

    response = requests.post(
        GROQ_URL,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()

    return data["choices"][0]["message"]["content"].strip()
