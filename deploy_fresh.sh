#!/bin/bash

# Script สำหรับ Deploy ใหม่ทั้งหมด
echo "🚀 Deploy Bamboo Platform ใหม่ทั้งหมด"
echo "====================================="

# 1. ตรวจสอบว่าอยู่ใน directory ที่ถูกต้อง
if [ ! -f "package.json" ]; then
    echo "❌ ไม่พบ package.json กรุณาเปลี่ยนไปยัง directory ของโปรเจค"
    exit 1
fi

# 2. หยุด services ทั้งหมด
echo "⏹️  หยุด services ทั้งหมด..."
docker-compose down 2>/dev/null || true

# 3. ลบ containers, images และ volumes เก่าทั้งหมด
echo "🗑️  ลบ containers, images และ volumes เก่าทั้งหมด..."
docker-compose down -v --remove-orphans 2>/dev/null || true
docker system prune -af
docker volume prune -f

# 4. ตรวจสอบไฟล์ที่จำเป็น
echo "📁 ตรวจสอบไฟล์ที่จำเป็น..."
required_files=("Dockerfile" "docker-compose.yml" "nginx.conf" "package.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ ไม่พบไฟล์: $file"
        exit 1
    fi
    echo "✅ พบไฟล์: $file"
done

# 5. Build Docker image ใหม่
echo "🔨 Build Docker image ใหม่..."
docker build -t bamboo-platform . --no-cache

# 6. ตรวจสอบว่า build สำเร็จ
if [ $? -eq 0 ]; then
    echo "✅ Build สำเร็จ"
else
    echo "❌ Build ล้มเหลว"
    echo "📋 ตรวจสอบ logs ด้านบนเพื่อหาสาเหตุ"
    exit 1
fi

# 7. Start services
echo "🚀 เริ่ม services..."
docker-compose up -d

# 8. รอให้ services เริ่มทำงาน
echo "⏳ รอให้ services เริ่มทำงาน (30 วินาที)..."
sleep 30

# 9. ตรวจสอบสถานะ
echo "🔍 ตรวจสอบสถานะ services:"
docker-compose ps

# 10. ตรวจสอบ logs
echo "📋 ตรวจสอบ logs:"
docker-compose logs --tail=30 bamboo-platform

# 11. ทดสอบการเข้าถึง
echo "🌐 ทดสอบการเข้าถึง:"
echo "Testing localhost..."
curl -I http://localhost/healthz 2>/dev/null && echo "✅ localhost ทำงาน" || echo "❌ localhost ไม่ทำงาน"

echo ""
echo "✅ Deploy เสร็จสิ้น!"
echo "🌐 Website: http://43.208.154.243"
echo "🔍 Health Check: http://43.208.154.243/healthz"
echo ""
echo "📝 หากยังมีปัญหา:"
echo "1. ตรวจสอบ Security Group ของ EC2 (Port 80 ต้องเปิด)"
echo "2. ตรวจสอบ logs: docker-compose logs bamboo-platform"
echo "3. ตรวจสอบ nginx config: docker exec bamboo-platform_1 nginx -t"
