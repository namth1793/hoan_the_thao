@echo off
echo === Khoi dong SoccerPro ===
echo Backend: http://localhost:5032
echo Frontend: http://localhost:5174
echo.
start "SoccerPro Backend" cmd /k "cd backend && npm start"
timeout /t 2 /nobreak >nul
start "SoccerPro Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5174
echo.
echo Da khoi dong! Nhan phim bat ky de thoat...
pause >nul
