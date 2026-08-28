from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from app.chatbot.pipeline import answer
from app.services import analytics_service


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    conversation_id: str


app = FastAPI(title="MAA Intelligent Chatbot", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_directory = Path(__file__).resolve().parent.parent / "static"
app.mount("/static", StaticFiles(directory=static_directory), name="static")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "maa-chatbot"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    conversation_id = request.conversation_id or "demo-session"
    response, sources = answer(request.message, conversation_id=conversation_id)
    return ChatResponse(
        answer=response,
        sources=sources,
        conversation_id=conversation_id,
    )


@app.get("/api/analytics")
def analytics() -> dict:
    """Feature: lightweight usage analytics — total questions, how many were
    answered vs fell back, and the most common topics asked about."""
    return analytics_service.get_summary()


@app.get("/")
def index() -> FileResponse:
    return FileResponse(static_directory / "index.html")
