# Order Management & Tracking Platform - One-Click Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting Order Management & Tracking Platform...       " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$scriptRoot = $PSScriptRoot

# 1. Start Spring Boot Backend in a separate window
Write-Host "[1/2] Launching Spring Boot Backend on http://localhost:8080..." -ForegroundColor Green
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$scriptRoot\backend'; .\mvnw.ps1 spring-boot:run"

# Wait a brief moment for backend initialization
Start-Sleep -Seconds 5

# 2. Start React Frontend in a separate window
Write-Host "[2/2] Launching React Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$scriptRoot\frontend'; npm run dev"

Start-Sleep -Seconds 3

# 3. Open Browser
Write-Host "Opening application in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host "`nAll services launched successfully!" -ForegroundColor Cyan
Write-Host "Default Logins:" -ForegroundColor White
Write-Host "  Admin:    admin / admin123" -ForegroundColor Gray
Write-Host "  Customer: customer / customer123" -ForegroundColor Gray
