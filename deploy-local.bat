@echo off
REM Local Server Deployment Script for Windows
REM สำหรับ Deploy React + Vite App ไปยัง Local Server

echo 🚀 เริ่มต้น Deploy Bamboo Platform ไปยัง Local Server...

REM ตรวจสอบว่ามี serve ติดตั้งหรือไม่
where serve >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 กำลังติดตั้ง serve...
    npm install -g serve
)

REM Build project
echo 🔨 กำลัง Build Project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build ล้มเหลว
    pause
    exit /b 1
)

REM ตรวจสอบว่า port 3000 ใช้งานอยู่หรือไม่
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 ใช้งานอยู่ กำลังหยุด server เดิม...
    taskkill /f /im node.exe >nul 2>nul
    timeout /t 2 >nul
)

REM Start server
echo 🚀 กำลัง Start Local Server...
echo 🌐 Website กำลังทำงานที่: http://localhost:3000
echo 📝 กด Ctrl+C เพื่อหยุด server

serve -s dist -l 3000
