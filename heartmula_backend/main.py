from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from datetime import datetime
import os

from models import LyricsRequest, LyricsResponse, SongRequest, SongResponse, SongMetadata
from lyrics_ollama import generate_lyrics_with_ollama
from heartmula_runner import run_heartmula_generation
from storage import save_song, load_songs, get_song_by_id, delete_song
from config import BACKEND_HOST, BACKEND_PORT

app = FastAPI(title="HeartMuLa Studio API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate-lyrics", response_model=LyricsResponse)
async def generate_lyrics(request: LyricsRequest):
    try:
        lyrics = await generate_lyrics_with_ollama(request)
        return LyricsResponse(lyrics=lyrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-song", response_model=SongResponse)
async def generate_song(request: SongRequest):
    try:
        # For now, we do it synchronously as requested in "Simplest acceptable approach"
        # In a real app, this should be a background task or job queue.
        song_id, audio_file_path = run_heartmula_generation(request)
        
        metadata = SongMetadata(
            song_id=song_id,
            title=request.title,
            created_at=datetime.now().isoformat(),
            tags=request.tags,
            instrumental=request.instrumental,
            language=request.language,
            duration_seconds=request.duration_seconds,
            model_size=request.model_size,
            audio_file_path=audio_file_path,
            lyrics=request.lyrics
        )
        
        save_song(metadata)
        
        return SongResponse(
            status="success",
            song_id=song_id,
            title=request.title,
            audio_url=f"/api/download-song/{song_id}",
            metadata=metadata
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/list-songs")
async def list_songs():
    return load_songs()

@app.get("/api/download-song/{song_id}")
async def download_song(song_id: str):
    metadata = get_song_by_id(song_id)
    if not metadata:
        raise HTTPException(status_code=404, detail="Song not found")
    
    if not os.path.exists(metadata.audio_file_path):
        raise HTTPException(status_code=404, detail="Audio file not found on disk")
    
    return FileResponse(
        path=metadata.audio_file_path,
        media_type="audio/mpeg",
        filename=f"{metadata.title}.mp3"
    )

@app.delete("/api/delete-song/{song_id}")
async def delete_song_endpoint(song_id: str):
    success = delete_song(song_id)
    if not success:
        raise HTTPException(status_code=404, detail="Song not found")
    return {"status": "success", "message": "Song deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=BACKEND_HOST, port=BACKEND_PORT)
