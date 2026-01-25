# HeartMuLa Studio 🎶

A local-only, Suno-style web application for generating high-fidelity music using the HeartMuLa foundation models and Ollama.

## Features
- **Suno-Style UI**: A beautiful, clean interface for custom song generation.
- **AI Lyrics**: Integration with local Ollama for drafting lyrics from prompts or Teams transcripts.
- **Local Generation**: Uses the HeartMuLa (heartlib) engine to generate high-fidelity music on your GPU.
- **Project History**: Keep track of your generated songs, play them back, or download them.

## Prerequisites
1. **HeartMuLa Environment**: Ensure you have installed the dependencies in this repo (done already if you followed the Antigravity setup).
2. **Model Weights**: The weights for HeartMuLa (3B) and HeartCodec must be in the `ckpt` folder.
3. **Ollama**: Install [Ollama](https://ollama.com/) and download a model (e.g., `ollama run deepseek-coder:6.7b`).

## Setup & Running

### 1. Backend
The backend is a FastAPI server that manages Ollama calls and HeartMuLa execution.
```powershell
cd heartmula_backend
# Ensure you are in your python environment
python main.py
```

### 2. Frontend
The frontend is a React application built with Vite.
```powershell
cd heartmula_ui
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration
You can customize paths in `heartmula_backend/config.py` or via environment variables:
- `OLLAMA_MODEL`: Default is `deepseek-coder:6.7b`.
- `HEARTMULA_PROJECT_ROOT`: Path to the heartlib directory.
- `BACKEND_PORT`: Default is `8000`.

## Troubleshooting
- **VRAM Errors**: If your GPU is out of memory, the runner uses `--lazy_load true` by default to minimize peak usage. You can also try generating shorter clips (e.g., 30s).
- **Missing Weights**: Ensure the `ckpt` folder matches the structure expected by `heartlib`.
- **Ollama Error**: Check if Ollama is running at `http://localhost:11434`.

---
Build with 🤍 by Antigravity
