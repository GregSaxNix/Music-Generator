# Music-Generator Workflow

This workflow starts the Music-Generator backend (FastAPI) and frontend (Vite) servers.

### Unified Startup (Recommended)
You can now start both the backend and frontend with a single command:
// turbo
```powershell
./start_app.ps1
```

### Manual Individual Startup

1. Start the backend server:
// turbo
```powershell
cd heartmula_backend
..\.venv\Scripts\python.exe main.py
```

2. Start the frontend server:
// turbo
```powershell
cd heartmula_ui
npm run dev
```

3. Open the application in your browser: [http://localhost:3000](http://localhost:3000)

4. Output files are stored in the root `Output` folder.
