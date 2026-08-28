# Installation Instructions — MAA Intelligent Chatbot

## Requirements

* Python 3.11 or 3.12
* pip
* Groq API key for LLM functionality

Create a free API key from [Groq API Keys](https://console.groq.com/keys?utm_source=chatgpt.com).

The API key is optional. Without it, the application runs in keyword-only mode.

## Windows PowerShell
```powershell
cd maa-chatbot
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
notepad .env
```
Add your key to `.env`:
```text
GROQ_API_KEY=your_api_key_here
```
Run the application:

```powershell
uvicorn app.main:app --reload --port 8001
```

## macOS / Linux
```bash
cd maa-chatbot
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
nano .env
```
Add your key:
```text
GROQ_API_KEY=your_api_key_here
```
Run:
```bash
uvicorn app.main:app --reload --port 8001
```

## Verify Installation

**Health check**

Open:

`http://127.0.0.1:8001/api/health`

Expected response:

```json
{"status":"ok","service":"maa-chatbot"}
```

**Chat interface**

Open:

`http://127.0.0.1:8001`

Ask a question to test the chatbot.
**Analytics**
Open:
`http://127.0.0.1:8001/api/analytics`

It shows total questions, answered queries, fallback queries, fallback rate, and top topics.

## Troubleshooting

**Port already in use**
Run the application on another port:
```powershell
uvicorn app.main:app --reload --port 8002
```
Update `backendOrigin` and `backendPorts` in `static/app.js` if required.
**Browser cannot reach the assistant**
Open the application through:
`http://127.0.0.1:8001`
Do not open `static/index.html` directly.
**`pip install` fails**
Check the Python version:
```bash
python --version
```
Python 3.11 or 3.12 is required.
**Groq responses are not working**
Check that `.env` exists and contains:
```text
GROQ_API_KEY=your_api_key_here
```
Also check the Uvicorn terminal for an `LLM call failed` warning.
**401 error from Groq**
The API key is invalid or expired. Generate a new key from [Groq API Keys](https://console.groq.com/keys?utm_source=chatgpt.com).

**Model not found / decommissioned**

Check the current available models in [Groq Models Documentation](https://console.groq.com/docs/models?utm_source=chatgpt.com) and update `GROQ_MODEL` in `.env` if necessary.
