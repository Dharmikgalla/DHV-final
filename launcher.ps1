# Hierarchical Clustering Visualization Launcher
# PowerShell Script

Write-Host "========================================" -ForegroundColor Green
Write-Host "  HIERARCHICAL CLUSTERING VISUALIZATION" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$projectPath = "C:\Users\SANJAY\Downloads\DHV\DHV-project-2"

Write-Host "Project Path: $projectPath" -ForegroundColor Yellow
Write-Host ""

Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1. Start Development Server (with hot reload)" -ForegroundColor White
Write-Host "2. Start Production Server (optimized)" -ForegroundColor White
Write-Host "3. Install/Update Dependencies" -ForegroundColor White
Write-Host "4. Build Production Version" -ForegroundColor White
Write-Host "5. Open Project Folder" -ForegroundColor White
Write-Host "6. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

Set-Location $projectPath

switch ($choice) {
    "1" {
        Write-Host "Starting Development Server..." -ForegroundColor Green
        Write-Host "Your app will be available at: http://localhost:3000" -ForegroundColor Yellow
        Write-Host "If port 3000 is busy, it will use port 3001" -ForegroundColor Yellow
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
        Write-Host ""
        npm run dev
    }
    "2" {
        Write-Host "Starting Production Server..." -ForegroundColor Green
        Write-Host "Your app will be available at: http://localhost:3000" -ForegroundColor Yellow
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
        Write-Host ""
        npm start
    }
    "3" {
        Write-Host "Installing Dependencies..." -ForegroundColor Green
        npm install
        Write-Host "Dependencies installed successfully!" -ForegroundColor Green
        Read-Host "Press Enter to continue"
    }
    "4" {
        Write-Host "Building Production Version..." -ForegroundColor Green
        npm run build
        Write-Host "Build completed successfully!" -ForegroundColor Green
        Read-Host "Press Enter to continue"
    }
    "5" {
        Write-Host "Opening Project Folder..." -ForegroundColor Green
        Invoke-Item $projectPath
    }
    "6" {
        Write-Host "Goodbye!" -ForegroundColor Green
        exit
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        Read-Host "Press Enter to continue"
    }
}
