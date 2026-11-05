@echo off
rem Opens the portfolio on a tiny local server so YouTube videos can play.
cd /d "%~dp0"
start "" "http://localhost:8000/index.html"
echo Portfolio running at http://localhost:8000  (close this window to stop it)
python -m http.server 8000
