# AI Instructions - Music-Generator Studio 🎶

This file provides critical instructions for AI assistants managing this repository.

## 🚀 How to Start the Application
To start the HeartMuLa Studio (Backend + Frontend), any AI assistant should follow these steps:

1.  **Preferred Method**: Execute the workflow defined in `.agent/workflows/start-app.md`.
2.  **CLI Method**: Run `./start_app.ps1` (PowerShell) or `start_app.bat` (Batch) from the root directory.
3.  **NPM Method**: Run `npm start` from the root directory.

## 📁 Project Structure
- `heartmula_backend/`: FastAPI server (Port 8000). Handles inference and song storage.
- `heartmula_ui/`: Vite/React frontend (Port 3000).
- `.venv/`: Python virtual environment with `heartlib` and `torch+cu121` installed.
- `Output/`: Directory where generated songs and `songs.json` metadata are stored.

## ⚠️ Critical Notes
- **GPU Usage**: Generation requires an NVIDIA GPU with CUDA. The runner is configured for `torch+cu121`.
- **Inference Time**: Generation usually takes ~3 minutes for a standard song.
- **Workflow Discovery**: Always check `.agent/workflows/` before investigating how to run manual commands.
