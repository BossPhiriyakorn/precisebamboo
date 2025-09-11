#!/bin/bash

# Quick Deploy Script สำหรับ Bamboo Platform
# เลือกวิธีการ Deploy ที่ต้องการ

echo "🚀 Bamboo Platform - Quick Deploy"
echo "=================================="
echo ""
echo "เลือกวิธีการ Deploy:"
echo "1) AWS S3 + CloudFront (แนะนำ - ง่ายที่สุด)"
echo "2) AWS Amplify (CI/CD อัตโนมัติ)"
echo "3) AWS EC2 + Docker (ควบคุมเต็มที่)"
echo "4) AWS Elastic Beanstalk (Auto-scaling)"
echo ""

read -p "กรุณาเลือก (1-4): " choice

case $choice in
    1)
        echo "🔧 กำลัง Deploy ไปยัง AWS S3 + CloudFront..."
        chmod +x deploy-s3.sh
        ./deploy-s3.sh
        ;;
    2)
        echo "🔧 กำลัง Deploy ไปยัง AWS Amplify..."
        chmod +x deploy-amplify.sh
        ./deploy-amplify.sh
        ;;
    3)
        echo "🔧 กำลัง Deploy ไปยัง AWS EC2 + Docker..."
        chmod +x deploy-ec2.sh
        ./deploy-ec2.sh
        ;;
    4)
        echo "🔧 กำลัง Deploy ไปยัง AWS Elastic Beanstalk..."
        echo "📝 กรุณาดูคู่มือใน DEPLOYMENT_GUIDE.md"
        ;;
    *)
        echo "❌ ตัวเลือกไม่ถูกต้อง"
        exit 1
        ;;
esac

echo ""
echo "✅ เสร็จสิ้น! ตรวจสอบผลลัพธ์ด้านบน"
echo "📖 อ่านคู่มือเพิ่มเติมได้ที่: DEPLOYMENT_GUIDE.md"
