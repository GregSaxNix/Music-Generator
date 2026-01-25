import subprocess
import os
import uuid
from pathlib import Path
from config import (
    HEARTMULA_PROJECT_ROOT, 
    HEARTMULA_LYRICS_PATH, 
    HEARTMULA_TAGS_PATH, 
    HEARTMULA_OUTPUT_DIR
)
from models import SongRequest

def run_heartmula_generation(request: SongRequest) -> str:
    # A) Write lyrics to HEARTMULA_LYRICS_PATH
    with open(HEARTMULA_LYRICS_PATH, "w", encoding="utf-8") as f:
        f.write(request.lyrics)
    
    # B) Write tags to HEARTMULA_TAGS_PATH
    # Use space separation as most music LLMs prefer it for tag prompts
    # We also prepend the genre twice to give it more "weight"
    genre = request.tags[0] if request.tags else "music"
    tags_line = f"{genre} {genre} " + " ".join(request.tags)
    with open(HEARTMULA_TAGS_PATH, "w", encoding="utf-8") as f:
        f.write(tags_line)
    
    # C) Construct command
    song_id = str(uuid.uuid4())[:8] # Short unique ID
    
    # Create a nice descriptive filename: Title_Genre_3B_ID.mp3
    safe_title = "".join([c if c.isalnum() else "-" for c in request.title]).strip("-")
    safe_genre = "".join([c if c.isalnum() else "-" for c in genre]).strip("-")
    filename = f"{safe_title}_{safe_genre}_{request.model_size}_{song_id}.mp3"
    
    save_path = HEARTMULA_OUTPUT_DIR / filename
    
    script_path = os.path.join(HEARTMULA_PROJECT_ROOT, "examples", "run_music_generation.py")
    model_path = os.path.join(HEARTMULA_PROJECT_ROOT, "ckpt")
    
    # Map model_size to 3B/7B
    version = request.model_size.upper()
    
    # Duration in ms
    max_audio_length_ms = request.duration_seconds * 1000
    
    cmd = [
        "python", script_path,
        "--model_path", model_path,
        "--lyrics", HEARTMULA_LYRICS_PATH,
        "--tags", HEARTMULA_TAGS_PATH,
        "--save_path", str(save_path),
        "--version", version,
        "--max_audio_length_ms", str(max_audio_length_ms),
        "--lazy_load", "true",
        "--cfg_scale", "2.0" # Increased CFG scale for better tag adherence
    ]
    
    print(f"Running command: {' '.join(cmd)}")
    
    # D) Run HeartMuLa
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=HEARTMULA_PROJECT_ROOT)
    
    if result.returncode != 0:
        error_msg = result.stderr or result.stdout
        raise Exception(f"HeartMuLa generation failed: {error_msg}")
    
    if not save_path.exists():
        raise Exception("HeartMuLa finished but output file was not created.")
        
    return song_id, str(save_path)
