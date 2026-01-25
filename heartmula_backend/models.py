from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class LyricsRequest(BaseModel):
    source: str = "prompt"  # "prompt" or "transcript"
    base_prompt: str
    transcript_text: Optional[str] = None
    language: str = "en"
    style: str = "pop"
    tone: str = "fun"
    max_tokens: int = 512

class LyricsResponse(BaseModel):
    lyrics: str

class SongRequest(BaseModel):
    title: str
    lyrics: str
    tags: List[str]
    instrumental: bool = False
    language: str = "en"
    duration_seconds: int = 180
    model_size: str = "3b"

class SongMetadata(BaseModel):
    song_id: str
    title: str
    created_at: str
    tags: List[str]
    instrumental: bool
    language: str
    duration_seconds: int
    model_size: str
    audio_file_path: str
    lyrics: str

class SongResponse(BaseModel):
    status: str
    song_id: str
    title: str
    audio_url: str
    metadata: SongMetadata
