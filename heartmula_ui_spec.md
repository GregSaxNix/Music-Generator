# Project: HeartMuLa Studio – Suno-Style Local AI Music UI

You are an AI pair programmer working inside Google Antigravity.

Your task is to design and build a **local-only web application** that provides a **Suno-style user experience** on top of the open-source **HeartMuLa / heartlib** music generation project.

The user is non-technical and is following MattVidPro’s HeartMuLa + Antigravity walkthrough.  
You must handle **all technical decisions**, but ASK the user if anything in the HeartMuLa repo is ambiguous.

---

## Core intent (read this carefully)

The user wants:

- A **beautiful, simple UI** for generating music with HeartMuLa
- A flow similar to **Suno’s “Custom” tab**, not a research tool
- Ability to:
  - Select genre, mood, tempo, instruments
  - Paste lyrics OR generate lyrics with AI
  - Optionally turn a **Microsoft Teams meeting recap** into a song
  - Generate music locally and play it back
- Everything runs **locally on one machine**
- Ollama is used for lyrics generation
- HeartMuLa does the music generation
- Antigravity is expected to scaffold and wire everything together

---

## Hard constraints

- Local-only (no cloud services)
- No paid APIs
- Ollama must be accessed via:
  - `http://localhost:11434`
- HeartMuLa must be called exactly as intended by its repo
- If scripts, paths, or flags are unclear:
  - ASK before guessing

---

## Architecture Overview

### Backend responsibilities:
- Provide REST endpoints for lyrics generation using Ollama
- Provide REST endpoints to generate songs via HeartMuLa
- Store metadata about generations
- Serve or stream generated audio files

### Frontend responsibilities:
- Provide Suno style two column layout
- Collect settings and lyrics
- Call backend endpoints
- Show progress and errors clearly
- Show recent songs list with player and download

---

## Backend Requirements
- **Language**: Python 3 (FastAPI)
- **Folder**: `heartmula_backend`
- **Minimum Files**:
  - `main.py` (FastAPI app)
  - `config.py` (paths and defaults)
  - `models.py` (Pydantic models)
  - `lyrics_ollama.py` (Ollama client)
  - `heartmula_runner.py` (HeartMuLa runner)
  - `storage.py` (metadata persistence)
- **CORS**: Enabled for frontend dev server.
- **Storage**: JSON file (`songs.json`) or SQLite (Keep it simple).

### Configuration (`.env` or `config.py`)
- `HEARTMULA_PROJECT_ROOT`: path to heartlib repo
- `HEARTMULA_LYRICS_PATH`: path to lyrics.txt
- `HEARTMULA_TAGS_PATH`: path to tags.txt
- `HEARTMULA_OUTPUT_DIR`: directory for generated audio
- `OLLAMA_BASE_URL`: `http://localhost:11434`
- `OLLAMA_MODEL`: `llama3.2` or other installed model
- `BACKEND_HOST` and `BACKEND_PORT`

---

## API Endpoints

### 1. POST `/api/generate-lyrics`
**Purpose**: Generate structured lyrics using Ollama.
**Request**:
- `source`: "prompt" or "transcript"
- `base_prompt`: string
- `transcript_text`: string (optional)
- `language`: string (default "en")
- `style`: string (default "pop")
- `tone`: string (default "fun")
- `max_tokens`: integer (default 512)

**Behavior**:
Construct prompt for Ollama to output lyrics with structure markers: `[intro]`, `[verse]`, `[pre-chorus]`, `[chorus]`, `[bridge]`, `[outro]`.

### 2. POST `/api/generate-song`
**Purpose**: Generate music via HeartMuLa from lyrics and tags.
**Request**:
- `title`: string
- `lyrics`: string
- `tags`: array of strings
- `instrumental`: boolean
- `language`: string
- `duration_seconds`: integer
- `model_size`: "3b" or "7b"

**Behavior**:
A) Write lyrics to `HEARTMULA_LYRICS_PATH`.
B) Write CSV tags to `HEARTMULA_TAGS_PATH`.
C) Run HeartMuLa via `subprocess`.
D) Capture logs.
E) Save metadata and return `song_id` and `audio_url`.

### 3. GET `/api/list-songs`
- Return array of stored metadata (descending order).

### 4. GET `/api/download-song/{song_id}`
- Stream audio file with correct content type.

---

## Frontend Requirements
- **Stack**: React TypeScript (Vite).
- **Styling**: Tailwind CSS (Dark theme default).
- **Layout**: Two-column (Setup vs Lyrics) + Recent Songs list.

---

## Visual Design Notes
- Dark theme, clean spacing, rounded cards.
- Do not copy Suno branding/assets; emulate the workflow feel.

---

## Implementation Process
1. **Step 1**: Inspect repo for inference workflow (Done).
2. **Step 2**: Implement backend.
3. **Step 3**: Implement frontend UI.
4. **Step 4**: End-to-end test with short clip.
5. **Step 5**: confirm everything works.
