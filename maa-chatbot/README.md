# MAA Intelligent Chatbot

A local MVP chatbot for the **MAA Digital Companion Platform**, covering Home Made Food, Medicine and Health, Travel Assistance, and Talk to MAA.

Since no live MAA website or backend data exists, the knowledge base was created from the official MAA Project Description and organised by topic.

**Architecture:**

`Browser Chat → FastAPI → Knowledge Retrieval → Groq LLM → Answer + Sources`

## Run Locally

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Open `http://127.0.0.1:8001` after starting the server.

## Current Scope

* FastAPI endpoints: `POST /api/chat`, `GET /api/health`, and `GET /api/analytics`
* Topic-organised knowledge base with 10 files and 52 chunks
* Coverage of the platform overview, four services, emergency contacts, account, navigation, support, and design/emotional benefits
* Keyword-based retrieval with title-weighted scoring in `app/chatbot/retriever.py`
* Groq LLM generation using `openai/gpt-oss-20b`
* Knowledge-grounded responses using `app/services/llm_service.py`, `app/chatbot/prompts.py`, and `app/chatbot/pipeline.py`
* Fallback handling when relevant knowledge cannot be retrieved or the LLM is unavailable
* Keyword-only mode when no Groq API key is configured
* Roman Urdu / Hinglish detection with same-style responses through `app/utils/language.py`
* Usage analytics through `app/services/analytics_service.py`
* Mother-like casual and emotional conversation for personal sharing, including feelings, worries, achievements, and everyday situations
* Research-based mother persona stored in `knowledge_base/mother_persona.json`, with references in `docs/references.md`
* Simple per-conversation memory for short follow-up questions such as `"eligibility?"`
* Responsive browser chat interface with source chips

## Data Sources

The knowledge base is based on the official MAA Project Description and paraphrased general research covering motherly qualities, health habits, travel safety, and Pakistani home cooking.

All sources are listed in `docs/references.md`.

## Documentation

* `requirements.md` — Functional and non-functional requirements
* `feature_specification.md` — Implemented and planned features
* `conversation_flows.md` — 10 conversation flows
* `test_cases.md` — 30 test cases and test report
* `architecture.md` — System architecture and RAG pipeline
* `user_guide.md` — Chatbot usage guide
* `installation.md` — Installation and setup instructions

## Next Enhancement Path

* Replace keyword retrieval with embeddings and ChromaDB while keeping the existing `retrieve()` interface
* Add persistent conversation history and analytics
* Improve multilingual NLP support
