"""Feature: lightweight analytics for the chatbot.

Tracks, in memory, how many questions were asked, how many were answered vs
fell back to "I don't know", and which topics come up most often. This is the
demo-scale version of the guide's Phase 8 Analytics feature (total
conversations, common questions, failed/out-of-scope questions).
"""

from collections import Counter

_total_queries = 0
_answered_queries = 0
_fallback_queries = 0
_topic_counter: Counter[str] = Counter()


def log_query(topic: str | None, answered: bool) -> None:
    global _total_queries, _answered_queries, _fallback_queries
    _total_queries += 1
    if answered:
        _answered_queries += 1
        if topic:
            _topic_counter[topic] += 1
    else:
        _fallback_queries += 1


def get_summary(top_n: int = 5) -> dict:
    return {
        "total_queries": _total_queries,
        "answered_queries": _answered_queries,
        "fallback_queries": _fallback_queries,
        "fallback_rate": round(_fallback_queries / _total_queries, 2) if _total_queries else 0,
        "top_topics": [{"topic": topic, "count": count} for topic, count in _topic_counter.most_common(top_n)],
    }
