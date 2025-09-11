#!/bin/bash

# AWS Amplify Deployment Script
# สำหรับ Deploy React + Vite App ไปยัง AWS Amplify

echo "🚀 เริ่มต้น Deploy Bamboo Platform ไปยัง AWS Amplify..."

# ตรวจสอบว่ามี Amplify CLI ติดตั้งหรือไม่
if ! command -v amplify &> /dev/null; then
    echo "📦 กำลังติดตั้ง AWS Amplify CLI..."
    npm install -g @aws-amplify/cli
fi

# ตรวจสอบการ login AWS
echo "🔐 ตรวจสอบการเชื่อมต่อ AWS..."
aws sts get-caller-identity

if [ $? -ne 0 ]; then
    echo "❌ กรุณา login AWS CLI ก่อน: aws configure"
    exit 1
fi

# ตรวจสอบว่ามี amplify project หรือไม่
if [ ! -d "amplify" ]; then
    echo "🔧 กำลังตั้งค่า Amplify Project..."
    amplify init --yes
fi

# เพิ่ม hosting
echo "🌐 เพิ่ม Amplify Hosting..."
amplify add hosting

# Deploy
echo "🚀 กำลัง Deploy..."
amplify publish

echo "✅ Deploy สำเร็จ!"
echo "🌐 ตรวจสอบ URL ใน AWS Amplify Console"
