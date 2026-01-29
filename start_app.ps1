# Start HeartMuLa Studio Application
Write-Host "Starting HeartMuLa Studio..." -ForegroundColor Green

# 1. Start Backend in background
Write-Host "Launching Backend (FastAPI)..." -ForegroundColor Gray
Start-Process -FilePath "$PSScriptRoot\.venv\Scripts\python.exe" -ArgumentList "heartmula_backend\main.py" -WorkingDirectory $PSScriptRoot -WindowStyle Hidden

# 2. Start Frontend in background
Write-Host "Launching Frontend (Vite)..." -ForegroundColor Gray
cd "$PSScriptRoot\heartmula_ui"
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot\heartmula_ui" -WindowStyle Hidden

Write-Host "`nHeartMuLa Studio is starting up!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend: http://localhost:8000"
Write-Host "`nNote: Both processes are running in the background."
