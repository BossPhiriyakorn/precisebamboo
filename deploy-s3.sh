#!/bin/bash

# AWS S3 + CloudFront Deployment Script
# สำหรับ Deploy React + Vite App ไปยัง AWS S3

echo "🚀 เริ่มต้น Deploy Bamboo Platform ไปยัง AWS S3..."

# ตรวจสอบว่ามี AWS CLI ติดตั้งหรือไม่
if ! command -v aws &> /dev/null; then
    echo "❌ กรุณาติดตั้ง AWS CLI ก่อน: https://aws.amazon.com/cli/"
    exit 1
fi

# ตรวจสอบการ login AWS
echo "🔐 ตรวจสอบการเชื่อมต่อ AWS..."
aws sts get-caller-identity

if [ $? -ne 0 ]; then
    echo "❌ กรุณา login AWS CLI ก่อน: aws configure"
    exit 1
fi

# Build project
echo "🔨 กำลัง Build Project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build ล้มเหลว"
    exit 1
fi

# ตั้งค่า S3 Bucket Name (เปลี่ยนตามต้องการ)
BUCKET_NAME="bamboo-platform-$(date +%s)"
REGION="ap-southeast-1"  # Singapore region

echo "📦 สร้าง S3 Bucket: $BUCKET_NAME"

# สร้าง S3 Bucket
aws s3 mb s3://$BUCKET_NAME --region $REGION

# ตั้งค่า Static Website Hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Upload ไฟล์
echo "📤 กำลัง Upload ไฟล์..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# ตั้งค่า Public Read Policy
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# ลบไฟล์ policy
rm bucket-policy.json

echo "✅ Deploy สำเร็จ!"
echo "🌐 Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "📝 หมายเหตุ: ควรตั้งค่า CloudFront เพื่อใช้ HTTPS และ Custom Domain"
