# MediBot

MediBot is a healthcare-focused assistant web app that combines:
- fine-tuned LLM backend for domain-aware medical responses,
- React frontend with Tailwind CSS for a modern interactive UI,
- deployment-ready architecture for fast prototyping and production.

## 🧩 Features

- **LLM Fine-Tuning (NLP Core)**
  - Train a base language model with medical-specific data (symptoms, triage, medication, guidance).
  - Uses a fine-tune pipeline to improve reliability in healthcare questions.
  - Supports prompt templates and post-processing safety checks.

- **React + Tailwind UI**
  - Chat interface with user input and model assistant responses.
  - Session list and conversation history.
  - Responsive design for desktop/mobile.

- **API Layer**
  - `/api/chat` endpoint to handle chat requests.
  - Optional user auth and rate limit for safe usage.

## 🚀 Getting Started

### Prerequisites

- **Node 18+** with npm or yarn
- **Python 3.10+** with conda environment (dependencies already installed)
- **Git** (optional, for cloning)
- **Two terminal windows** (one for backend, one for frontend)

### Quick Start (5 minutes)

#### Terminal 1: Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd /home/drbigbrain/Desktop/Projects/MediBot/backend
   ```

2. Ensure your conda environment is activated (it should have PyTorch, transformers, peft, etc.):
   ```bash
   conda activate your_env_name  # Replace with your actual env name
   ```

3. Run the FastAPI server:
   ```bash
   python main.py
   ```

4. You should see output like:
   ```
   [*] Device           : cuda (or cpu)
   [*] Base model       : EleutherAI/pythia-1b
   [*] LoRA adapter     : ./LLM/medical_lora_adapter
   [✓] Model loaded successfully.
   
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

   ✅ **Backend is ready at `http://localhost:8000`**

#### Terminal 2: Start the Frontend

1. Navigate to the client directory:
   ```bash
   cd /home/drbigbrain/Desktop/Projects/MediBot/client
   ```

2. Install frontend dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. You should see output like:
   ```
   VITE v8.0.7 ready in 184 ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

   ✅ **Frontend is ready at `http://localhost:5173`**

### 🎯 Using MediBot

1. **Open your browser** and go to `http://localhost:5173`
2. You'll see a beautiful chat interface with:
   - A **conversation sidebar** on the left to save/load conversations
   - A **chat area** in the center
   - A **message input** at the bottom with a send button
3. **Type a medical question** like:
   - "What should I do for a headache?"
   - "Describe symptoms of the flu"
   - "Tell me about diabetes"
4. Press **Enter** (or click the send button) and wait for MediBot's response
5. **Start a new chat** by clicking "New Chat" in the sidebar to save your current conversation

### 📋 Full Setup Guide

If you're setting up from scratch:

1. **Clone Repository:**
   ```bash
   git clone <repo-url>
   cd MediBot
   ```

2. **Install Frontend:**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Verify Python Environment:**
   ```bash
   python --version  # Should be 3.10+
   pip list | grep -E "torch|transformers|peft|fastapi"
   ```

4. **Install Backend Dependencies (if needed):**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

5. **Run both in separate terminals:**
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   python main.py
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd client
   npm run dev
   ```

### ⚙️ Environment Variables (Optional)

No `.env` file needed for basic setup! The backend will:
- Auto-detect GPU/CPU
- Auto-load the model from `LLM/medical_lora_adapter/`
- Listen on `0.0.0.0:8000`

The frontend will:
- Auto-connect to `http://localhost:8000`
- Run on `http://localhost:5173`

### 🛠 Troubleshooting

**Backend won't start:**
- ❌ `ModuleNotFoundError: torch` → Conda env not activated. Run `conda activate your_env`
- ❌ `Port 8000 in use` → Kill existing process: `lsof -i :8000` then `kill -9 <PID>`
- ❌ Model loading fails → Ensure `LLM/medical_lora_adapter/` exists with all files

**Frontend won't start:**
- ❌ `npm command not found` → Install Node.js 18+
- ❌ `Port 5173 in use` → Use different port: `npm run dev -- --port 5174`
- ❌ API connection fails → Ensure backend is running on `http://localhost:8000`

**Chat not responding:**
- ❌ Check backend terminal for errors
- ❌ Verify backend and frontend are on correct ports
- ❌ Try a simpler question first


## 🛠 Model Training

### Training Status
✅ **Model trained and adapter saved!**

The medical LoRA adapter has been successfully trained and saved to `LLM/medical_lora_adapter/`:
- `adapter_config.json` - LoRA adapter configuration
- `adapter_model.safetensors` - Trained adapter weights
- `tokenizer_config.json` & `tokenizer.json` - Tokenizer configuration

### Training Workflow
1. Training data was prepared and used to fine-tune a base language model.
2. LoRA (Low-Rank Adaptation) was applied to efficiently adapt the model for medical domain.
3. The trained adapter was saved with its configuration and tokenizer.

### Integration
To use the trained adapter in the backend:
1. Load the base model and apply the LoRA adapter from `LLM/medical_lora_adapter/`
2. Configure the API to use the adapter for medical queries
3. Set `MEDIBOT_ADAPTER_PATH=./LLM/medical_lora_adapter`

## 🧪 Feature Walkthrough

### Chat Interface
- **Message bubbles** with timestamps (user messages are green, bot responses are white)
- **Auto-scrolling** to latest message
- **Typing indicator** while bot is thinking
- **Shift+Enter** for multi-line messages
- **Responsive design** works on desktop, tablet, mobile

### Conversation Management
- **Save conversations** by starting new chat
- **Load past conversations** from the sidebar
- **Delete conversations** with trash icon
- **View message count** for each conversation

### Medical Responses
- Powered by fine-tuned LLM (EleutherAI/pythia-1b with medical LoRA adapter)
- Fast inference with PyTorch
- Contextual medical domain responses
- 60 token limit per response (configurable)

## 🗂 Project Structure

```
MediBot/
├── LLM/                          # Model training & inference
│   ├── model.ipynb               # Training notebook (Jupyter)
│   ├── inference.py              # Model loading & generation script
│   └── medical_lora_adapter/     # Pre-trained adapter (⭐ READY TO USE)
│       ├── adapter_config.json
│       ├── adapter_model.safetensors
│       ├── tokenizer.json
│       └── tokenizer_config.json
│
├── backend/                      # FastAPI server
│   ├── main.py                   # ⭐ START HERE: `python main.py`
│   ├── requirements.txt           # Python dependencies
│   └── README.md
│
├── client/                       # React + Tailwind frontend
│   ├── src/
│   │   ├── App.jsx               # Main chat interface
│   │   ├── App.css               # Animations & custom styles
│   │   ├── index.css             # Tailwind + base styles
│   │   ├── main.jsx              # React entry point
│   │   └── components/
│   │       ├── ChatMessage.jsx   # Message bubble component
│   │       └── ConversationHistory.jsx  # Sidebar conversations
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── vite.config.js            # Vite bundler config
│   ├── package.json              # Dependencies (React, Lucide, Tailwind)
│   └── README.md
│
└── README.md                     # This file
```

### Frontend Stack
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons (Menu, Plus, Send, Trash, etc.)
- **Vite 8** - Fast bundler

### Backend Stack
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **PyTorch** - Deep learning
- **Transformers** - LLM models
- **PEFT** - LoRA adapter loading

### Model
- **Base Model**: EleutherAI/pythia-1b (1.4B parameters)
- **Fine-tuning**: LoRA (Low-Rank Adaptation)
- **Domain**: Medical Q&A
- **Adapter Path**: `LLM/medical_lora_adapter/`

## 🌐 API Documentation

### Endpoints

**POST /chat**
- **Description**: Send a message to MediBot
- **Request**:
  ```json
  {
    "message": "What should I do for a headache?"
  }
  ```
- **Response**:
  ```json
  {
    "response": "For a headache, you can try: 1. Rest in a quiet, dark room 2. Stay hydrated 3. Take over-the-counter pain relievers..."
  }
  ```

**GET /docs**
- Swagger UI interactive API documentation
- Visit: `http://localhost:8000/docs`

**GET /redoc**
- ReDoc API documentation
- Visit: `http://localhost:8000/redoc`

### Model Parameters
- `max_new_tokens`: 60 (tokens to generate)
- `temperature`: 0.7 (randomness, 0=deterministic)
- `top_p`: 0.9 (nucleus sampling)
- `repetition_penalty`: 1.2 (avoid repetition)

These are configured in `backend/main.py` and can be modified.

## 📚 Development

### Frontend Development
```bash
cd client

# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Backend Development
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload (note: model loading takes time)
python main.py

# Run tests (if available)
# pytest
```

### Adding New Features

**Frontend:**
- Components go in `src/components/`
- Styles use Tailwind classes (see `tailwind.config.js`)
- Icons from Lucide React: `import { IconName } from 'lucide-react'`

**Backend:**
- API endpoints in `backend/main.py`
- Use `@app.post("/endpoint")` decorator
- Return JSON with `ChatResponse` model

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Backend: `Model loading takes forever`** | This is normal! First load can take 2-5 minutes. Subsequent runs are cached. |
| **Backend: `RuntimeError: CUDA out of memory`** | Use CPU instead: Check device auto-detection in `inference.py` |
| **Frontend: `Cannot POST http://localhost:8000/chat`** | Backend is not running. Start it first in Terminal 1 |
| **Frontend: `Module not found lucide-react`** | Run `npm install` in `client/` directory |
| **BOTH: `Address already in use`** | Different port: Backend `uvicorn main.py --port 8001` or Frontend `npm run dev -- --port 5174` |

## 📈 Performance Notes

- **First run**: Model initialization (~2-5 min)
- **Subsequent runs**: Fast startup (model cached in memory)
- **Response time**: ~1-3 seconds per query (depends on GPU/CPU)
- **Memory**: ~4GB RAM or GPU (nvidia-cuda recommended)

## 🔒 Security Notes

⚠️ **FOR DEVELOPMENT ONLY** - Before production:
- Add user authentication
- Implement rate limiting per user
- Add medical disclaimers
- Validate and sanitize inputs
- Use HTTPS/WSS encryption
- Add CORS configuration
- Log all interactions for audit trails

## 🚀 Deployment

### Docker (Optional)

Would require creating:
- `Dockerfile` for backend
- `Dockerfile` for frontend
- `docker-compose.yml` for orchestration

### Cloud Deployment

Compatible with:
- **Heroku**, **Railway**, **Render** (FastAPI)
- **Vercel**, **Netlify** (React frontend)
- **AWS**, **GCP**, **Azure** (both)

## 📝 License

MIT - Feel free to use for educational and commercial purposes.

## 👨‍💻 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ❓ FAQ

**Q: Can I use a different LLM?**
A: Yes! Modify `LLM/inference.py` to load a different base model. Retrain the LoRA adapter or use the new model as-is.

**Q: How do I retrain the model?**
A: Use `LLM/model.ipynb` with your own medical dataset. See LoRA documentation for fine-tuning.

**Q: Is this production-ready?**
A: This is a prototype/demo. Add authentication, rate limiting, and error handling before production use.

**Q: How can I improve response quality?**
A: Fine-tune with more medical data, increase model size, or use better models (Llama, Mistral, etc.)

**Q: Is medical advice from MediBot accurate?**
A: ⚠️ No! This is an educational project. Always consult real doctors. Add disclaimers in your app.

