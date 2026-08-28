# System Architecture MAA Intelligent Chatbot

```
Browser Chat UI (static/index.html, app.js, style.css)
        │  HTTP POST /api/chat
        ▼
FastAPI Backend (app/main.py)
        │
        ▼
Pipeline (app/chatbot/pipeline.py)
        │
        ├── Step 1: Retriever (app/chatbot/retriever.py)
        │     - tokenises the question
        │     - loads and merges every *.json file in knowledge_base/ 
        │     - scores overlap, keeps a small per-conversation topic memory
        │     - returns the top matching chunks (title + answer + source)
        │
        ├── If no chunk matches → return the fixed fallback message + log to
        │   analytics as a "fallback" query (guardrail: never call the LLM
        │   with nothing to ground it on)
        │
        ├── Feature: language detection (app/utils/language.py) — checks if
        │   the message looks like Roman Urdu / Hinglish, so the LLM is told
        │   to reply in the same style
        │
        ├── Step 2: LLM generation (app/services/llm_service.py)
        │     - sends the retrieved chunks + a guardrail system prompt
        │       (app/chatbot/prompts.py) to the Groq API (openai/gpt-oss-20b)
        │     - Groq writes the final natural-language answer, using
        │       ONLY the given chunks as context
        │     - if the API call fails or no key is set, the pipeline falls
        │       back to returning the raw retrieved chunk instead of crashing
        │
        └── Feature: analytics (app/services/analytics_service.py) — every
              query is logged as answered/fallback + its matched topic id
        │
        ▼
Answer + source list  →  JSON response  →  Chat UI renders answer + source chips
```
## Overview

MAA is a chatbot that offers information about the MAA platform and its various services. The chatbot has a browser‑based interface that connects to a FastAPI backend.

The main parts of the system include the chat interface, the FastAPI backend, the chatbot pipeline, the knowledge base, the retriever, the LLM service, language detection and analytics.

The user types a question into the chat interface. The request is sent to the backend by using POST /api/chat. The chatbot pipeline then examines the question. Searches the knowledge base for relevant information. If the LLM is enabled the retrieved information is forwarded to the LLM so that a natural response can be produced. The final answer then returns to the frontend with the source details.

## Frontend

The chatbot interface lives inside the static/ folder.
It contains:
- index.html. Which holds the structure of the chat page.
- App.js. Which manages sending messages to the backend and showing responses.
- Style.css. Which holds the styling of the chatbot interface.
The frontend talks to the FastAPI backend via the API. The user does not need to talk to the backend

## FastAPI Backend

The backend is built with FastAPI. The backend offers three endpoints:
- POST /api/chat. Which receives the users message and returns the chatbot response.
- GET /api/health. Which verifies whether the application is running.
- GET /api/analytics. Which displays basic usage statistics.
The backend receives the request from the frontend. Forwards it to the chatbot pipeline for processing.

## Knowledge Base

The chatbot pulls its information from the knowledge base.For this project the MAA‑specific information was created using the MAA Project Description supplied for the project.

## Retriever

When a user asks a question the retriever splits the question into tokens and compares them with the titles and keywords in the knowledge base. Title matches receive weight in the score calculation.

After scoring the retriever returns the relevant chunks, along with their title, answer and source.

## Chatbot Pipeline

The main processing logic is handled by the pipeline. The pipeline links the parts of the chatbot.

When a user sends a message the pipeline first processes the question. Checks the available knowledge. The retriever then finds the relevant information and the previous conversation topic can also be used for short follow-up questions.
After retrieval the available context is passed to the LLM when it is enabled.

## LLM Generation

The project uses the Groq API for the LLM step. The retrieved knowledge-base chunks are provided to the LLM as context. The LLM is mainly used to make the responses more natural and conversational.

If the API key is not available the application can still run in keyword- mode. If an LLM request fails the application falls back, to the retrieved knowledge-base answer of crashing.

## Guardrails

The system has a fallback response for questions that cannot be properly answered. When the LLM is disabled the application only returns knowledge base information or the fixed fallback message. This gives a code level restriction against generating unsupported information.

## Roman Urdu and Hinglish Support

If a message looks like Roman Urdu or English the LLM is asked to reply in the style.

## Casual and Personal Messages

During testing we found that casual messages were first treated as questions.

The prompt gives the model instructions depending on the type of message. MAA‑related questions should stay grounded in MAA information while casual or personal messages can receive an supportive response. If a message contains both a part and an MAA‑related question the chatbot can address both.

## Analytics

The system keeps track of questions, answered questions, fallback questions, most commonly asked topics.

The analytics are stored in memory. This means the values reset when the application restarts.

## Response

After processing the question the backend sends the response back, to the frontend.

## Current Limitations

There are some limitations in the version.
- The retriever uses keyword overlap of semantic embeddings. Because of this it may not always understand questions that use different words from the stored keywords.

- Roman Urdu detection is based on words and is therefore fairly simple.

- Conversation memory is stored in memory. Is not saved permanently. The same applies to analytics, which are also stored in memory.

- The project also does not connect to real MAA accounts orders, payments or travel‑booking systems because those services are not available through a backend for this project.

## Future Improvements

Some possible improvements are:

- Use embeddings for better semantic search.
- Add ChromaDB or another vector database.
- Store conversation history permanently.
- Store analytics in SQLite or another database.
- Improve multilingual support.
- Add better typo and fuzzy matching.
- Add a human support escalation feature.
- Connect the chatbot with real MAA backend services if they become available.