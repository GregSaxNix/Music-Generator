import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Project Root
BASE_DIR = Path(__file__).parent.parent.absolute()

# HeartMuLa Paths
HEARTMULA_PROJECT_ROOT = os.getenv("HEARTMULA_PROJECT_ROOT", str(BASE_DIR))
HEARTMULA_LYRICS_PATH = os.getenv("HEARTMULA_LYRICS_PATH", str(BASE_DIR / "assets" / "lyrics.txt"))
HEARTMULA_TAGS_PATH = os.getenv("HEARTMULA_TAGS_PATH", str(BASE_DIR / "assets" / "tags.txt"))
HEARTMULA_OUTPUT_DIR = Path(os.getenv("HEARTMULA_OUTPUT_DIR", str(BASE_DIR / "Output")))
HEARTMULA_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Ollama Config
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

# Backend Config
BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", 8000))

# Storage
SONGS_METADATA_FILE = BASE_DIR / "Output" / "songs.json"
