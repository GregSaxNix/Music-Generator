import json
import os
from typing import List
from config import SONGS_METADATA_FILE
from models import SongMetadata

def load_songs() -> List[SongMetadata]:
    if not os.path.exists(SONGS_METADATA_FILE):
        return []
    with open(SONGS_METADATA_FILE, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            return [SongMetadata(**item) for item in data]
        except:
            return []

def save_song(metadata: SongMetadata):
    songs = load_songs()
    songs.insert(0, metadata) # Add to the beginning (most recent first)
    with open(SONGS_METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump([s.dict() for s in songs], f, indent=2)

def get_song_by_id(song_id: str) -> SongMetadata:
    songs = load_songs()
    for song in songs:
        if song.song_id == song_id:
            return song
    return None

def delete_song(song_id: str) -> bool:
    songs = load_songs()
    song_to_delete = None
    for song in songs:
        if song.song_id == song_id:
            song_to_delete = song
            break
    
    if not song_to_delete:
        return False
    
    # Remove from metadata list
    songs = [s for s in songs if s.song_id != song_id]
    
    # Delete audio file if it exists
    if os.path.exists(song_to_delete.audio_file_path):
        os.remove(song_to_delete.audio_file_path)
    
    # Save updated metadata
    with open(SONGS_METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump([s.dict() for s in songs], f, indent=2)
    
    return True
