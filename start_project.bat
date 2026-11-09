@echo off
title Khoi dong Pam Coffee & Tea (FastAPI + React Native Expo)

echo ========================================================
echo   PAM COFFEE & TEA - HE THONG DAT BAN QUAN CA PHE
echo ========================================================
echo Dang khoi dong Backend FastAPI...
start "Pam Coffee Backend (FastAPI)" cmd /k "cd backend && pip install -r requirements.txt && python main.py"

echo Dang khoi dong Frontend React Native (Expo)...
start "Pam Coffee Frontend (Expo)" cmd /k "cd frontend && npm start"

echo ========================================================
echo   DA KHOI DONG THANH CONG!
echo   - Backend API: http://localhost:8080/docs
echo   - Frontend: Mo ung dung Expo Go tren dien thoai quet ma QR
echo ========================================================
pause
