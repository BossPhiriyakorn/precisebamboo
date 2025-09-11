#!/bin/bash

# AWS EC2 Deployment Script
# สำหรับ Deploy React + Vite App ไปยัง AWS EC2

echo "🚀 เริ่มต้น Deploy Bamboo Platform ไปยัง AWS EC2..."

# ตรวจสอบว่ามี Docker ติดตั้งหรือไม่
if ! command -v docker &> /dev/null; then
    echo "❌ กรุณาติดตั้ง Docker ก่อน: https://docs.docker.com/get-docker/"
    exit 1
fi

# Build Docker image
echo "🔨 กำลัง Build Docker Image..."
docker build -t bamboo-platform .

# Run container
echo "🚀 กำลัง Start Container..."
docker-compose up -d

echo "✅ Deploy สำเร็จ!"
echo "🌐 Website กำลังทำงานที่: http://localhost"
echo "📝 หมายเหตุ: ควรตั้งค่า Security Group และ Load Balancer สำหรับ Production"
