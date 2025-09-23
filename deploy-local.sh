#!/bin/bash

# Local Server Deployment Script
# สำหรับ Deploy React + Vite App ไปยัง Local Server

echo "🚀 เริ่มต้น Deploy Bamboo Platform ไปยัง Local Server..."

# ตรวจสอบว่ามี serve ติดตั้งหรือไม่
if ! command -v serve &> /dev/null; then
    echo "📦 กำลังติดตั้ง serve..."
    npm install -g serve
fi

# Build project
echo "🔨 กำลัง Build Project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build ล้มเหลว"
    exit 1
fi

# ตรวจสอบว่า port 3000 ใช้งานอยู่หรือไม่
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 ใช้งานอยู่ กำลังหยุด server เดิม..."
    pkill -f "serve.*3000"
    sleep 2
fi

# Start server
echo "🚀 กำลัง Start Local Server..."
echo "🌐 Website กำลังทำงานที่: http://localhost:3000"
echo "📝 กด Ctrl+C เพื่อหยุด server"

serve -s dist -l 3000
