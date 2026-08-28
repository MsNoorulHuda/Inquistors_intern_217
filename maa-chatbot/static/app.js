const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const suggestions = document.querySelector("#suggestions");
const resetButton = document.querySelector("#reset-button");
const backendOrigin = "http://127.0.0.1:8001";
const backendPorts = new Set(["8000", "8001"]);
const apiBase = window.location.protocol === "file:" || !backendPorts.has(window.location.port) ? backendOrigin : "";

async function requestChat(message) {
  const response = await fetch(`${apiBase}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversation_id: "demo-session" }),
  });
  if (!response.ok) throw new Error(`Chat request failed with status ${response.status}`);
  return response.json();
}

function addMessage(text, role, sources = []) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}-message`;
  if (role === "assistant") {
    const sourceMarkup = sources.map((source) => `<span class="source-chip">${source}</span>`).join(" ");
    wrapper.innerHTML = `<div class="avatar">M</div><div><p class="message-label">MAA ASSISTANT</p><p>${text}</p>${sourceMarkup}</div>`;
  } else {
    wrapper.innerHTML = `<p>${text}</p>`;
  }
  messages.insertBefore(wrapper, suggestions);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(message) {
  addMessage(message, "user");
  input.value = "";
  try {
    const data = await requestChat(message);
    addMessage(data.answer, "assistant", data.sources);
  } catch (error) {
    console.error(error);
    addMessage("I could not reach the MAA assistant. Start the backend with `uvicorn app.main:app --port 8001`, then open http://127.0.0.1:8001.", "assistant");
  }
}

form.addEventListener("submit", (event) => { event.preventDefault(); const message = input.value.trim(); if (message) sendMessage(message); });
suggestions.addEventListener("click", (event) => { if (event.target.dataset.question) sendMessage(event.target.dataset.question); });
resetButton.addEventListener("click", () => { window.location.reload(); });
