@echo off
echo Starting Hierarchical Clustering Visualization...
echo.
cd /d "C:\Users\SANJAY\Downloads\DHV\DHV-project-2"
echo Current directory: %CD%
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting development server...
echo Your app will be available at: http://localhost:3000
echo If port 3000 is busy, it will use port 3001
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
pause
