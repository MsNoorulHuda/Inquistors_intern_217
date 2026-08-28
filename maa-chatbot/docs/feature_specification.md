# Feature Specification — MAA Intelligent Chatbot

## Core Features Implemented

The MAA Intelligent Chatbot currently includes a topic-based knowledge base containing 10 JSON files and 52 knowledge chunks. These files cover areas such as MAA information, food, medicine, travel, emergency situations, AI companion functionality, account-related information, navigation, support, and the application's design and benefits.

The chatbot uses a lightweight keyword-based retrieval system implemented in `app/chatbot/retriever.py`. The retriever loads and combines the available knowledge-base files, tokenizes the user's question, and calculates matching scores between the question and stored knowledge chunks. Matches in titles are given higher weight so that more relevant information can be selected. This approach currently acts as a lightweight alternative to the embeddings and vector-database approach described in the student guide.

After retrieval, the relevant knowledge is passed to the Groq LLM through `app/services/llm_service.py`. The application currently uses `openai/gpt-oss-20b` and applies the guardrail instructions defined in `app/chatbot/prompts.py`. The purpose of the LLM is to convert the retrieved information into a natural-language response while preventing it from inventing MAA-specific information that is not present in the provided context.

The complete RAG flow is handled by `app/chatbot/pipeline.py`. The pipeline retrieves relevant information first and then sends the available context to the LLM. If no useful knowledge-base match is available, the system can still allow the LLM to handle conversational or personal messages according to the routing rules. If the LLM service fails, the system can fall back to the retrieved knowledge instead of leaving the user without a response.

The chatbot also provides source attribution with its responses. The source file associated with the retrieved information is returned so that the origin of an answer can be identified.

A guardrail mechanism is also included for MAA-specific factual questions. When the system cannot find reliable information and the question requires information that should come from the knowledge base, it avoids making up an answer and returns a fixed fallback response indicating that reliable information is not available.

Common greetings such as "Hi", "Salam", and "AOA" are handled separately. Instead of unnecessarily sending these messages through the retrieval process, the chatbot responds with a friendly welcome and briefly explains the types of help MAA can provide.

MAA also has simple follow-up memory. The `_CONVERSATION_STATE` stores the most recently matched topic for each `conversation_id`. This allows very short follow-up questions such as "eligibility?" or "fees?" to be interpreted in relation to the previous topic rather than being treated as completely independent questions.

The project exposes a REST API with the following endpoints:

* `POST /api/chat` for sending user messages.
* `GET /api/health` for checking whether the service is running.
* `GET /api/analytics` for viewing chatbot usage statistics.

A responsive browser-based chat interface is included in the `static/` directory. The interface provides suggested questions to help users interact with the chatbot and displays source information through source chips.

### Multilingual Detection

The chatbot includes multilingual input detection through `app/utils/language.py`. It can identify common Roman Urdu and Hinglish patterns and instruct the LLM to respond in a similar conversational style. The response still follows the grounding rules, meaning that MAA-specific factual information must remain based on the available knowledge base.

### Usage Analytics

Basic usage analytics are implemented through `app/services/analytics_service.py`. The system records the total number of questions, the number of successfully answered questions, fallback counts, fallback rate, and the most frequently asked topics. These statistics can be accessed through the `GET /api/analytics` endpoint.

### Mother-Like Emotional and Casual Conversation

MAA is not restricted to factual question answering. The chatbot also supports casual, personal, and emotional conversations.

The routing rules in `app/chatbot/prompts.py` instruct the LLM to respond warmly when a user shares feelings, personal experiences, achievements, worries, or everyday situations. In these cases, MAA can provide comfort, encouragement, or gentle advice without requiring a knowledge-base match.

However, this behavior is separated from MAA-specific factual answering. When a user asks a factual question about MAA, the response must be grounded in retrieved knowledge. If a message contains both personal/emotional content and an MAA-related factual question, the chatbot handles both parts appropriately.

For unrelated trivia or questions outside MAA's intended purpose, the chatbot politely declines instead of pretending to have relevant knowledge.

The mother-like conversational behavior is supported by the research and design references documented in `docs/references.md` and the supporting `knowledge_base/mother_persona.json` file.

## Bug Fixes Made After Initial Testing

### Roman Urdu and Hinglish Questions

One of the major problems discovered during testing was that Roman Urdu and Hinglish questions were incorrectly receiving the "not relevant" fallback response.

The original pipeline only called the LLM when the keyword retriever found a matching knowledge-base entry. Since most of the knowledge-base keywords were written in English, a Roman Urdu version of the same question could receive a retrieval score of zero. As a result, the LLM never received the opportunity to understand the question.

This behavior was changed in `app/chatbot/pipeline.py`.

The LLM is now consulted whenever a Groq API key is configured. Retrieval is still used to provide grounding context when a relevant match exists, but a zero keyword score no longer automatically prevents the LLM from processing the user's message.

This allows Groq to understand Roman Urdu and Hinglish questions even when the lightweight keyword retriever cannot directly match their wording.

### Casual and Emotional Messages

Another issue was that casual and emotional messages could not receive natural responses.

The previous "no match → fallback" logic treated every unmatched message as irrelevant. This meant that messages involving personal feelings, symptoms, achievements, worries, or everyday situations could be rejected before reaching the LLM.

The retrieval gate was therefore removed for conversational messages. Combined with the routing rules in `prompts.py`, MAA can now recognize when a message is personal or emotional and respond naturally.

At the same time, the chatbot still avoids inventing MAA-specific facts. If a user asks for factual information that is not available in the knowledge base, the grounding rules remain active.

## Planned Enhancements

The current implementation is intentionally lightweight, but several improvements have been identified for future versions.

# Embeddings and ChromaDB

The current keyword-based retrieval system can eventually be replaced with real semantic embeddings and ChromaDB vector search. The replacement can be implemented behind the existing `retrieve()` interface, which means the main RAG pipeline would not need to be redesigned.

# Persistent Conversation History and Analytics

Conversation state and analytics are currently maintained in memory. A future version can move this information to SQLite so that conversation history and usage statistics persist even after the application restarts.

# Improved Multilingual NLP

The current multilingual functionality mainly relies on keyword-based Roman Urdu and Hinglish detection. A future enhancement would introduce a more comprehensive multilingual NLP approach capable of handling a wider range of Urdu, Roman Urdu, Hinglish, and other language variations.

# Human Support Escalation

A future version can include a human-support escalation mechanism. This would allow the chatbot to recognize situations where automated assistance is insufficient and guide the user toward an appropriate human support channel.
