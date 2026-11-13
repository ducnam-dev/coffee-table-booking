@echo off
title Tat toan bo Server Pam Coffee & Tea
echo Dang tat cac tien trinh dang chiem port 8080 (Backend) va 8081 (Frontend)...

:: Tat tien trinh tren port 8080 (FastAPI Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

:: Tat tien trinh tren port 8081 (React Native Expo)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

echo Da giai phong port 8080 va 8081 thanh cong!
pause

