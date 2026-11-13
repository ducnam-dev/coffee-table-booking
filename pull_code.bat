@echo off
title Keo Code An Toan - Pam Coffee & Tea
echo ========================================================
echo   DANG TAT SERVER CU DE TRANH NGHEN TERMINAL...
echo ========================================================

:: 1. Tat tien trinh tren port 8080 (FastAPI Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

:: 2. Tat tien trinh tren port 8081 (React Native Expo)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo ========================================================
echo   DANG PULL CODE MOI NHAT TU ORIGIN/MASTER...
echo ========================================================
git pull origin master

echo.
echo ========================================================
echo   HOAN TAT! Ban co the chay lai start_project.bat an toan.
echo ========================================================
pause

