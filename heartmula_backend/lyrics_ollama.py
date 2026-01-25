import httpx
from config import OLLAMA_BASE_URL, OLLAMA_MODEL
from models import LyricsRequest

async def generate_lyrics_with_ollama(request: LyricsRequest) -> str:
    # Llama 3.2 is excellent at creative writing, so we can use a natural prompt
    system_directive = "You are an expert songwriter. You write structured, expressive, and high-quality song lyrics based on user themes."
    
    if request.source == "transcript":
        full_prompt = f"{system_directive}\n\nAnalyze this Microsoft Teams transcript and write a {request.style} team anthem in {request.language} with a {request.tone} tone.\n\nTranscript:\n{request.transcript_text}\n\nOutput only the lyrics with structure markers like [intro], [verse], [chorus], etc. No conversation or intro text."
    else:
        full_prompt = f"{system_directive}\n\nWrite structured {request.style} lyrics in {request.language} about: {request.base_prompt}\nTone: {request.tone}\n\nOutput only the lyrics with structure markers like [intro], [verse], [chorus], etc. No conversation or intro text."

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": full_prompt,
        "stream": False,
        "options": {
            "num_predict": request.max_tokens or 512,
            "temperature": 0.75
        }
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "").strip()
        except Exception as e:
            raise Exception(f"Failed to connect to Ollama: {str(e)}")
