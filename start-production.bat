@echo off
echo Building Hierarchical Clustering Visualization for Production...
echo.
cd /d "C:\Users\SANJAY\Downloads\DHV\DHV-project-2"
echo Current directory: %CD%
echo.
echo Installing dependencies...
call npm install
echo.
echo Building production version...
call npm run build
echo.
echo Starting production server...
echo Your app will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
call npm start
pause
