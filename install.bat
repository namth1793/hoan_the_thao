@echo off
echo === Cai dat Web Ban Giay Da Bong - SoccerPro ===
echo.
echo [1/2] Cai dat backend...
cd backend
call npm install
cd ..
echo.
echo [2/2] Cai dat frontend...
cd frontend
call npm install
cd ..
echo.
echo === Cai dat hoan tat! Chay start.bat de khoi dong ===
pause
