@echo off
title Hierarchical Clustering Visualization
color 0A

echo.
echo ========================================
echo   HIERARCHICAL CLUSTERING VISUALIZATION
echo ========================================
echo.
echo Choose an option:
echo.
echo 1. Start Development Server (with hot reload)
echo 2. Start Production Server (optimized)
echo 3. Install/Update Dependencies
echo 4. Build Production Version
echo 5. Open Project Folder
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto install
if "%choice%"=="4" goto build
if "%choice%"=="5" goto folder
if "%choice%"=="6" goto exit

:dev
echo.
echo Starting Development Server...
cd /d "C:\Users\SANJAY\Downloads\DHV\DHV-project-2"
call npm run dev
goto end

:prod
echo.
echo Starting Production Server...
cd /d "C:\Users\SANJAY\Downloads\DHV\DHV-project-2"
call npm start
goto end

:install
echo.
echo Installing Dependencies...
cd /d "C:\Users\SANJAY\Downloads\DHV\DHV-project-2"
call npm install
echo Dependencies installed successfully!
pause
goto menu

:build
echo.
echo Building Production Version...
cd /d "C:\Users\SANJAY\Downloads\DHV\DHV-project-2"
call npm run build
echo Build completed successfully!
pause
goto menu

:folder
echo.
echo Opening Project Folder...
explorer "C:\Users\SANJAY\Downloads\DHV\DHV-project-2"
goto menu

:menu
cls
goto start

:exit
echo.
echo Goodbye!
exit

:end
echo.
echo Server stopped. Press any key to return to menu...
pause
goto menu
