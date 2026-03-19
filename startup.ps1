# startup.ps1
Write-Host "-------------------------------------------" -ForegroundColor Cyan
Write-Host "   Multi-Vendor Campus Marketplace Setup   " -ForegroundColor Cyan
Write-Host "-------------------------------------------" -ForegroundColor Cyan

# 1. Start Backend in a new window
Write-Host "[1/2] Launching Django Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command cd backend; .\venv\Scripts\activate; python manage.py runserver 8000"

# 2. Check for Node and start Frontend
Write-Host "[2/2] Refreshing environment and checking for Node.js..." -ForegroundColor Yellow

# Force refresh Path for current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$NODE_CMD = Get-Command node -ErrorAction SilentlyContinue
$DEFAULT_NODE = "C:\Program Files\nodejs\node.exe"

if ($NODE_CMD -or (Test-Path $DEFAULT_NODE)) {
    Write-Host "Node.js detected! Launching Next.js Frontend..." -ForegroundColor Green
    
    # If not in path, add it temporarily so npm works
    if (-not $NODE_CMD) { $env:Path += ";C:\Program Files\nodejs\" }
    
    if (Test-Path "frontend") {
        Start-Process powershell -ArgumentList "-NoExit -Command cd frontend; npm run dev"
    }
    else {
        Write-Host "Frontend directory not found. Please ensure Next.js project is initialized." -ForegroundColor Red
    }
}
else {
    Write-Host "!!! WARNING: Node.js not found !!!" -ForegroundColor Red
    Write-Host "If you just installed it, please restart your computer or ensure it is in C:\Program Files\nodejs\" -ForegroundColor Gray
    Write-Host "Fallback: You can browse the backend at http://localhost:8000/admin/" -ForegroundColor Magenta
}

# 3. Start Log Streamer
Write-Host "[3/3] Starting Live Log Stream..." -ForegroundColor Cyan
if (Test-Path "backend/debug.log") {
    Start-Process powershell -ArgumentList "-NoExit -Command Get-Content backend/debug.log -Wait -Tail 10"
}
else {
    # If file doesn't exist yet, wait for it
    Start-Process powershell -ArgumentList "-NoExit -Command While (!(Test-Path backend/debug.log)) { Start-Sleep 1 }; Get-Content backend/debug.log -Wait"
}

Write-Host "`nSystem initialized. A dedicated window is now streaming backend/debug.log." -ForegroundColor Cyan
Write-Host "The frontend will be available at http://localhost:3000" -ForegroundColor Green
Write-Host "The backend will be available at http://localhost:8000" -ForegroundColor Green

