#!/bin/bash

# Script สำหรับแก้ไขปัญหา 502 Bad Gateway บนเซิร์ฟเวอร์
echo "🔧 แก้ไขปัญหา 502 Bad Gateway"
echo "=============================="

# 1. หยุด services ทั้งหมด
echo "⏹️  หยุด services ทั้งหมด..."
docker-compose down

# 2. ลบ containers และ images เก่า
echo "🗑️  ลบ containers และ images เก่า..."
docker system prune -f

# 3. ตรวจสอบไฟล์ที่จำเป็น
echo "📁 ตรวจสอบไฟล์ที่จำเป็น..."
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ไม่พบ docker-compose.yml"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ ไม่พบ Dockerfile"
    exit 1
fi

if [ ! -f "nginx.conf" ]; then
    echo "❌ ไม่พบ nginx.conf"
    exit 1
fi

echo "✅ พบไฟล์ที่จำเป็นทั้งหมด"

# 4. Build Docker image ใหม่
echo "🔨 Build Docker image ใหม่..."
docker build -t bamboo-platform . --no-cache

# 5. ตรวจสอบว่า build สำเร็จ
if [ $? -eq 0 ]; then
    echo "✅ Build สำเร็จ"
else
    echo "❌ Build ล้มเหลว"
    exit 1
fi

# 6. Start services ใหม่
echo "🚀 เริ่ม services ใหม่..."
docker-compose up -d

# 7. รอให้ services เริ่มทำงาน
echo "⏳ รอให้ services เริ่มทำงาน..."
sleep 15

# 8. ตรวจสอบสถานะ
echo "🔍 ตรวจสอบสถานะ services:"
docker-compose ps

# 9. ตรวจสอบ logs
echo "📋 ตรวจสอบ logs ล่าสุด:"
docker-compose logs --tail=20 bamboo-platform

# 10. ทดสอบการเข้าถึง
echo "🌐 ทดสอบการเข้าถึง:"
echo "Testing localhost:80..."
curl -I http://localhost/healthz || echo "❌ localhost:80 ไม่ทำงาน"

echo "Testing localhost:80/health..."
curl -I http://localhost/health || echo "❌ localhost:80/health ไม่ทำงาน"

# 11. ตรวจสอบ port ที่เปิดอยู่
echo "🔌 ตรวจสอบ port ที่เปิดอยู่:"
netstat -tlnp | grep :80

echo ""
echo "✅ การแก้ไขเสร็จสิ้น"
echo "🌐 ลองเข้าถึง: http://43.208.154.243"
echo "🔍 Health Check: http://43.208.154.243/healthz"
echo "📝 หากยังมีปัญหา ให้ตรวจสอบ logs ด้านบน"
