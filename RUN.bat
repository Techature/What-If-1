@echo off
cd /d "%~dp0"
echo.
echo  Shark Tank app — local preview
echo  Open in your browser:  http://localhost:8080/
echo  Press Ctrl+C to stop.
echo.
python -m http.server 8080