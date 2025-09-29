#!/bin/bash

# Script สำหรับแก้ไขปัญหา 502 Bad Gateway
echo "🔧 แก้ไขปัญหา 502 Bad Gateway"
echo "=============================="

# 1. หยุด services ทั้งหมด
echo "⏹️  หยุด services ทั้งหมด..."
docker-compose down

# 2. ลบ containers และ images เก่า
echo "🗑️  ลบ containers และ images เก่า..."
docker system prune -f
docker image prune -f

# 3. Build ใหม่
echo "🔨 Build Docker image ใหม่..."
docker build -t bamboo-platform .

# 4. ตรวจสอบว่า build สำเร็จ
if [ $? -eq 0 ]; then
    echo "✅ Build สำเร็จ"
else
    echo "❌ Build ล้มเหลว"
    exit 1
fi

# 5. Start services ใหม่
echo "🚀 เริ่ม services ใหม่..."
docker-compose up -d

# 6. รอให้ services เริ่มทำงาน
echo "⏳ รอให้ services เริ่มทำงาน..."
sleep 10

# 7. ตรวจสอบสถานะ
echo "🔍 ตรวจสอบสถานะ services:"
docker-compose ps

# 8. ตรวจสอบ logs
echo "📋 ตรวจสอบ logs ล่าสุด:"
docker-compose logs --tail=20 bamboo-platform

# 9. ทดสอบการเข้าถึง
echo "🌐 ทดสอบการเข้าถึง localhost:"
curl -I http://localhost/healthz || echo "❌ ไม่สามารถเข้าถึงได้"

echo ""
echo "✅ การแก้ไขเสร็จสิ้น"
echo "🌐 ลองเข้าถึง: http://43.208.154.243"
echo "📝 หากยังมีปัญหา ให้ตรวจสอบ logs ด้านบน"
