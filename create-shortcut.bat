@echo off
echo Creating Desktop Shortcut...
echo.

set "projectPath=C:\Users\SANJAY\Downloads\DHV\DHV-project-2"
set "shortcutPath=%USERPROFILE%\Desktop\Hierarchical Clustering.lnk"
set "batchPath=%projectPath%\start-project.bat"

echo Creating shortcut to: %shortcutPath%
echo Target: %batchPath%

powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%shortcutPath%'); $Shortcut.TargetPath = '%batchPath%'; $Shortcut.WorkingDirectory = '%projectPath%'; $Shortcut.Description = 'Start Hierarchical Clustering Visualization'; $Shortcut.Save()"

echo.
echo Desktop shortcut created successfully!
echo You can now double-click "Hierarchical Clustering" on your desktop to start the project.
echo.
pause
