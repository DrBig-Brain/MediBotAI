from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys

# Add the LLM directory to the path so we can import inference
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'LLM'))

from inference import load_model, generate

app = FastAPI(title="MediBot API", description="API for MediBot chatbot")

# Enable CORS so the React frontend can call the API (including OPTIONS preflight)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This will hold the loaded model, tokenizer, and device
model_data = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.on_event("startup")
def startup_event():
    global model_data
    # Load the model when the app starts
    model, tokenizer, device = load_model()
    model_data = (model, tokenizer, device)
    print("Model loaded successfully!")

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if model_data is None:
        return ChatResponse(response="Error: Model not loaded")

    model, tokenizer, device = model_data

    # Generate response using the LLM
    response_text = generate(model, tokenizer, device, request.message)

    return ChatResponse(response=response_text)


@app.get("/")
def root():
    return {"message": "MediBot API running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)