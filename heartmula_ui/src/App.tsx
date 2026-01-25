import { useState, useEffect } from 'react';
import {
    Music,
    Send,
    Sparkles,
    History as HistoryIcon,
    Download,
    Play,
    Pause,
    Loader2,
    Users,
    FileText,
    Clock,
    Tag,
    Trash2
} from 'lucide-react';
import axios from 'axios';

interface SongMetadata {
    song_id: string;
    title: string;
    created_at: string;
    tags: string[];
    instrumental: boolean;
    language: string;
    duration_seconds: number;
    model_size: string;
    lyrics: string;
}

function App() {
    // Setup State
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');
    const [genre, setGenre] = useState('Pop');
    const [mood, setMood] = useState<string[]>([]);
    const [tempo, setTempo] = useState('Medium');
    const [instruments, setInstruments] = useState<string[]>([]);
    const [instrumental, setInstrumental] = useState(false);
    const [language, setLanguage] = useState('English');
    const [duration, setDuration] = useState(120);
    const [modelSize, setModelSize] = useState('3b');

    // Lyrics State
    const [lyrics, setLyrics] = useState('');
    const [activeTab, setActiveTab] = useState<'manual' | 'ai' | 'transcript'>('manual');
    const [transcript, setTranscript] = useState('');
    const [aiTone, setAiTone] = useState('Fun');
    const [aiLength, setAiLength] = useState(512);

    // Status State
    const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
    const [isGeneratingSong, setIsGeneratingSong] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [error, setError] = useState<string | null>(null);

    // History State
    const [songs, setSongs] = useState<SongMetadata[]>([]);
    const [playingSongId, setPlayingSongId] = useState<string | null>(null);

    const genres = [
        'Pop', 'Rock', 'Hip Hop', 'RnB', 'EDM', 'Lo-fi', 'Country', 'Metal',
        'Jazz', 'Blues', 'Soul', 'Classical', 'Latin', 'Reggae', 'Funk', 'Acoustic', 'Orchestral', 'Cinematic'
    ];
    const moods = ['Happy', 'Sad', 'Energetic', 'Calm', 'Epic', 'Romantic', 'Uplifting'];
    const instrumentOptions = ['Piano', 'Guitar', 'Drums', 'Bass', 'Synth', 'Strings', 'Brass', 'Pads'];

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const response = await axios.get('/api/list-songs');
            setSongs(response.data);
        } catch (err) {
            console.error("Failed to fetch songs", err);
        }
    };

    const handleGenerateLyrics = async () => {
        setIsGeneratingLyrics(true);
        setError(null);
        try {
            const response = await axios.post('/api/generate-lyrics', {
                source: activeTab === 'transcript' ? 'transcript' : 'prompt',
                base_prompt: prompt,
                transcript_text: activeTab === 'transcript' ? transcript : undefined,
                language,
                style: genre,
                tone: aiTone,
                max_tokens: aiLength
            });
            setLyrics(response.data.lyrics);
            setGenerationStatus("");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to generate lyrics");
            setGenerationStatus("");
        } finally {
            setIsGeneratingLyrics(false);
        }
    };

    const handleGenerateSong = async () => {
        if (!title || !lyrics) {
            setError("Title and lyrics are required");
            return;
        }

        setIsGeneratingSong(true);
        setGenerationStatus("Starting HeartMuLa...");
        setError(null);

        const tags = [genre.toLowerCase(), ...mood.map(m => m.toLowerCase()), tempo.toLowerCase(), ...instruments.map(i => i.toLowerCase())];

        try {
            const response = await axios.post('/api/generate-song', {
                title,
                lyrics,
                tags,
                instrumental,
                language,
                duration_seconds: duration,
                model_size: modelSize
            });

            setSongs([response.data.metadata, ...songs]);
            setGenerationStatus("Success!");
            setTimeout(() => setGenerationStatus(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Generation failed. Check VRAM or model checkpoints.");
        } finally {
            setIsGeneratingSong(false);
        }
    };

    const handleDeleteSong = async (songId: string) => {
        if (!window.confirm("Are you sure you want to delete this song?")) return;

        try {
            await axios.delete(`/api/delete-song/${songId}`);
            setSongs(songs.filter(s => s.song_id !== songId));
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to delete song");
        }
    };

    const toggleMood = (m: string) => {
        setMood(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
    };

    const toggleInstrument = (i: string) => {
        setInstruments(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    };

    const tagPreview = [genre, ...mood, tempo, ...instruments].join(', ').toLowerCase();

    return (
        <div className="flex flex-col min-h-screen bg-background text-white font-sans p-4 md:p-8 max-w-7xl mx-auto custom-scrollbar">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                        <Music size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">HeartMuLa Studio</h1>
                        <p className="text-gray-400 text-sm">Local AI music powered by HeartMuLa and Ollama</p>
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                {/* Left Column: Setup */}
                <div className="bg-card rounded-2xl p-6 border border-white/5 flex flex-col gap-6 shadow-xl">
                    <h2 className="text-xl font-semibold border-b border-white/5 pb-4">Song Setup</h2>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Song Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Morning Coffee Melodies"
                            className="bg-secondary rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Song Idea or Description</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the vibe, theme, or story..."
                            className="bg-secondary rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:border-primary h-24 resize-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-gray-400">Genre</label>
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                title="Select Genre"
                                className="bg-secondary rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:border-primary appearance-none cursor-pointer"
                            >
                                {genres.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-gray-400">Tempo</label>
                            <select
                                value={tempo}
                                onChange={(e) => setTempo(e.target.value)}
                                title="Select Tempo"
                                className="bg-secondary rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:border-primary appearance-none cursor-pointer"
                            >
                                <option value="Slow">Slow</option>
                                <option value="Medium">Medium</option>
                                <option value="Fast">Fast</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Mood</label>
                        <div className="flex flex-wrap gap-2">
                            {moods.map(m => (
                                <button
                                    key={m}
                                    onClick={() => toggleMood(m)}
                                    className={`px-3 py-1 rounded-full text-xs transition-all ${mood.includes(m) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary text-gray-400 border border-white/5 hover:border-white/20'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Instruments</label>
                        <div className="flex flex-wrap gap-2">
                            {instrumentOptions.map(i => (
                                <button
                                    key={i}
                                    onClick={() => toggleInstrument(i)}
                                    className={`px-3 py-1 rounded-full text-xs transition-all ${instruments.includes(i) ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-secondary text-gray-400 border border-white/5 hover:border-white/20'}`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${instrumental ? 'bg-primary' : 'bg-secondary'}`}>
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${instrumental ? 'translate-x-5' : ''}`} />
                            </div>
                            <input type="checkbox" checked={instrumental} onChange={() => setInstrumental(!instrumental)} className="hidden" />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Instrumental</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-gray-400">Model Size</label>
                            <div className="flex bg-secondary p-1 rounded-lg">
                                <button
                                    onClick={() => setModelSize('3b')}
                                    className={`flex-1 py-1.5 text-xs rounded-md transition-all ${modelSize === '3b' ? 'bg-card text-white shadow' : 'text-gray-500'}`}
                                >
                                    3B (Fast)
                                </button>
                                <button
                                    onClick={() => setModelSize('7b')}
                                    disabled={true}
                                    title="7B model is not yet released for HeartMuLa-oss"
                                    className={`flex-1 py-1.5 text-xs rounded-md transition-all ${modelSize === '7b' ? 'bg-card text-white shadow' : 'text-gray-500 opacity-50 cursor-not-allowed'}`}
                                >
                                    7B (Coming Soon)
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-gray-400">Max Duration: {duration}s</label>
                            <input
                                type="range" min="10" max="240" step="10"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="w-full accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer mt-3"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Lyrics */}
                <div className="bg-card rounded-2xl p-6 border border-white/5 flex flex-col gap-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('manual')}
                                className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'manual' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                Manual
                            </button>
                            <button
                                onClick={() => setActiveTab('ai')}
                                className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'ai' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                AI Lyrics
                            </button>
                            <button
                                onClick={() => setActiveTab('transcript')}
                                className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'transcript' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                Transcript
                            </button>
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles size={10} /> Powered by Ollama
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 min-h-[400px]">
                        {activeTab === 'manual' && (
                            <textarea
                                value={lyrics}
                                onChange={(e) => setLyrics(e.target.value)}
                                title="Lyrics Editor"
                                placeholder="[intro]
[verse]
Type your lyrics here...
[chorus]
..."
                                className="flex-1 bg-[#0a0a0a] rounded-xl px-4 py-4 border border-white/10 focus:outline-none focus:border-primary resize-none font-mono text-sm leading-relaxed custom-scrollbar"
                            />
                        )}

                        {activeTab === 'ai' && (
                            <div className="flex flex-col gap-6 h-full">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm text-gray-400">Tone</label>
                                        <select
                                            value={aiTone}
                                            onChange={(e) => setAiTone(e.target.value)}
                                            title="AI Lyrics Tone"
                                            className="bg-secondary rounded-lg px-4 py-2 border border-white/10"
                                        >
                                            <option value="Fun">Fun</option>
                                            <option value="Serious">Serious</option>
                                            <option value="Inspirational">Inspirational</option>
                                            <option value="Storytelling">Storytelling</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm text-gray-400">Length</label>
                                        <select
                                            className="bg-secondary rounded-lg px-4 py-2 border border-white/10"
                                            title="AI Lyrics Length"
                                            onChange={(e) => setAiLength(parseInt(e.target.value))}
                                        >
                                            <option value="256">Short</option>
                                            <option value="512">Medium</option>
                                            <option value="1024">Long</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerateLyrics}
                                    disabled={isGeneratingLyrics}
                                    className="bg-accent hover:bg-accent/80 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isGeneratingLyrics ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                                    Generate AI Lyrics
                                </button>

                                {isGeneratingLyrics && (
                                    <div className="flex flex-col gap-2">
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-accent animate-[loading_2s_ease-in-out_infinite] w-1/3 rounded-full" />
                                        </div>
                                        <p className="text-[10px] text-accent animate-pulse text-center">Ollama is crafting your lyrics...</p>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 italic text-center">AI will use your Song Idea and Genre to draft lyrics.</p>
                                <textarea
                                    value={lyrics}
                                    onChange={(e) => setLyrics(e.target.value)}
                                    title="AI Generated Lyrics Preview"
                                    placeholder="AI generated lyrics will appear here..."
                                    className="flex-1 bg-[#0a0a0a] rounded-xl px-4 py-4 border border-white/10 font-mono text-sm leading-relaxed custom-scrollbar"
                                />
                            </div>
                        )}

                        {activeTab === 'transcript' && (
                            <div className="flex flex-col gap-6 h-full">
                                <textarea
                                    value={transcript}
                                    onChange={(e) => setTranscript(e.target.value)}
                                    placeholder="Paste Microsoft Teams transcript here..."
                                    className="h-48 bg-secondary rounded-xl px-4 py-4 border border-white/10 focus:outline-none focus:border-accent resize-none text-sm leading-relaxed"
                                />
                                <button
                                    onClick={handleGenerateLyrics}
                                    disabled={isGeneratingLyrics}
                                    className="bg-accent hover:bg-accent/80 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isGeneratingLyrics ? <Loader2 className="animate-spin" /> : <Users size={18} />}
                                    Turn Transcript into Song
                                </button>

                                {isGeneratingLyrics && (
                                    <div className="flex flex-col gap-2">
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-accent animate-[loading_2s_ease-in-out_infinite] w-1/3 rounded-full" />
                                        </div>
                                        <p className="text-[10px] text-accent animate-pulse text-center">Analyzing transcript and composing...</p>
                                    </div>
                                )}

                                <textarea
                                    value={lyrics}
                                    onChange={(e) => setLyrics(e.target.value)}
                                    title="Transcript Lyrics Preview"
                                    placeholder="Lyrics from transcript will appear here..."
                                    className="flex-1 bg-[#0a0a0a] rounded-xl px-4 py-4 border border-white/10 font-mono text-sm leading-relaxed custom-scrollbar"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="sticky bottom-6 flex flex-col gap-4 bg-background/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 border-t-2 shadow-2xl z-10">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Tag size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-500 font-mono italic">Tag Preview: {tagPreview}</span>
                    </div>
                    {generationStatus && <span className="text-xs text-accent font-medium">{generationStatus}</span>}
                    {error && <span className="text-xs text-primary font-medium">{error}</span>}
                </div>

                <button
                    onClick={handleGenerateSong}
                    disabled={isGeneratingSong}
                    className="bg-primary hover:bg-primary/90 text-white text-lg font-bold py-5 rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
                >
                    {isGeneratingSong ? <Loader2 className="animate-spin size-6" /> : <Send size={24} />}
                    {isGeneratingSong ? 'Processing Engine...' : 'Generate New Song'}
                </button>
            </div>

            {/* Recent Songs */}
            <section className="mt-16 mb-20">
                <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                    <HistoryIcon className="text-gray-400" size={24} />
                    <h2 className="text-2xl font-bold">Recent Songs</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {songs.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-card rounded-2xl border border-dashed border-white/10">
                            No songs generated yet. Time to create magic!
                        </div>
                    ) : (
                        songs.map((song) => (
                            <div key={song.song_id} className="bg-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group flex flex-col gap-4 shadow-lg hover:shadow-2xl hover:translate-y-[-4px]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight mb-1">{song.title}</h3>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                            <Clock size={10} /> {new Date(song.created_at).toLocaleDateString('en-AU')} at {new Date(song.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="bg-secondary text-[10px] uppercase px-1.5 py-0.5 rounded text-gray-400 font-bold">{song.model_size}</span>
                                        <a
                                            href={`/api/download-song/${song.song_id}`}
                                            download
                                            title="Download Song"
                                            className="p-1.5 hover:bg-secondary rounded-lg text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Download size={18} />
                                        </a>
                                        <button
                                            onClick={() => handleDeleteSong(song.song_id)}
                                            title="Delete Song"
                                            className="p-1.5 hover:bg-secondary rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <audio
                                    controls
                                    src={`/api/download-song/${song.song_id}`}
                                    className="w-full h-10 invert opacity-80"
                                />

                                <div className="flex flex-wrap gap-1.5">
                                    {song.tags.slice(0, 4).map(t => (
                                        <span key={t} className="text-[10px] bg-secondary/50 text-gray-300 px-2 py-0.5 rounded-full border border-white/5">{t}</span>
                                    ))}
                                    {song.tags.length > 4 && <span className="text-[10px] text-gray-500">+{song.tags.length - 4}</span>}
                                </div>

                                <details className="mt-2">
                                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-white transition-colors">View Lyrics</summary>
                                    <pre className="mt-2 text-[10px] font-mono leading-relaxed bg-[#0a0a0a] p-3 rounded-lg max-h-32 overflow-y-auto custom-scrollbar text-gray-400">
                                        {song.lyrics}
                                    </pre>
                                </details>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-8 border-t border-white/5 text-center text-gray-600 text-[10px] tracking-widest uppercase">
                HeartMuLa Studio • Professional Local Audio Engine • v1.0
            </footer>
        </div>
    );
}

export default App;
