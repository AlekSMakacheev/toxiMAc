@echo off
chcp 65001 >nul
title toxiMAc

start "" "%~dp0jre\bin\javaw.exe" -jar "%~dp0toximas.jar"

timeout /t 15 /nobreak >nul

start http://localhost:8080

exit