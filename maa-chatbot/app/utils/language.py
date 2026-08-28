"""Feature: basic multilingual detection (English vs Roman Urdu / Hinglish).

This is a lightweight heuristic, not real language-ID, matching the guide's
"test multilingual behaviour rather than assuming it works" note (Phase 8).
It looks for common Roman Urdu / Hindi words that Noor's own messages use.
"""

import re

ROMAN_URDU_MARKERS = {
    "kya", "hai", "hain", "kaise", "kahan", "kab", "kyun", "kyu", "mujhe",
    "mera", "meri", "mere", "apna", "apni", "karna", "krna", "batao", "btao",
    "chahiye", "chahye", "aur", "ka", "ki", "ke", "mein", "mai", "se", "ko",
    "nahi", "nhi", "acha", "theek", "thk", "kese", "krke", "wala", "wali",
}


def is_roman_urdu(message: str) -> bool:
    tokens = set(re.findall(r"[a-z0-9]+", message.lower()))
    return len(tokens & ROMAN_URDU_MARKERS) >= 1
