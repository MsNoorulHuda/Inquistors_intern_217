# Requirements Document — MAA Intelligent Chatbot

## 1. Project analysis (Phase 1)
MAA is a digital companion web platform (Home Made Food, Medicine and Health, Travel Assistance, and an AI Companion called "Talk to MAA"). Since no live MAA website or real backend data exists yet, the knowledge base for this chatbot was written from the official MAA Project Description document, organised by topic.

**Target users:** students, working professionals, senior citizens, people living away from home, travelers, and users who want an AI based companion.

**Common information needs:** what MAA is, what services it offers, how to use Food, Medicine and Travel, how to register/login, emergency numbers, how to talk to the AI, and how to report a problem.

## 2. Functional requirements
- The chatbot shall answer general questions about what MAA is and its purpose.
- The chatbot shall explain each service: Home Made Food, Medicine and Health, Travel Assistance, and Talk to MAA.
- The chatbot shall provide emergency contact information (Police, Ambulance, Women Helpline, Tourist Helpline).
- The chatbot shall politely decline out-of-scope questions instead of guessing.
- The chatbot shall return source references with every knowledge-based answer.
- The chatbot shall support simple follow-up questions within the same conversation.

## 3. Non-functional requirements
- Typical response time should stay under 1 second (in-memory keyword retrieval).
- The chatbot must not invent MAA facts that are not in the knowledge base(hallucination guardrail — falls back to a clear "I don't know" message).
- The knowledge base must be organised by topic so it stays maintainable, not a single unstructured text blob.
- The system should degrade gracefully empty, invalid, or unrelated input should never crash the API.

## 4. Out of scope for this version
- Real MAA account data, live orders, and live trip booking (no real backend exists).
- Paid membership/subscription — not defined in the current MAA description.
- Voice interaction, admin dashboard, and full multilingual NLP (listed only as possible future enhancements in the guide, Version 4).