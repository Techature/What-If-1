@echo off
cd /d "%~dp0"
echo.
echo  Shark Tank app — local preview (Option C hybrid)
echo  Local data:  http://localhost:8080/
echo  Cloud mode:  http://localhost:8080/?cloud=1  (Supabase keys in config.js)
echo  Press Ctrl+C to stop.
echo.
python -m http.server 8080