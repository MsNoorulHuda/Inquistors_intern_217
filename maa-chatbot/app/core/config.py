import os
from pathlib import Path

# Load a local .env file if python-dotenv is installed, so GROQ_API_KEY
# does not need to be exported manually every time.
try:
    from dotenv import load_dotenv

    load_dotenv(Path(__file__).resolve().parents[2] / ".env")
except ImportError:
    pass

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

# If no key is set, the pipeline falls back to returning the raw retrieved
# chunk instead of calling the LLM, so the app still runs during development.
LLM_ENABLED = bool(GROQ_API_KEY)
