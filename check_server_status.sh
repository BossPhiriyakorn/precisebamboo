#!/bin/bash

# Script สำหรับตรวจสอบสถานะเซิร์ฟเวอร์ Bamboo Platform
echo "🔍 ตรวจสอบสถานะเซิร์ฟเวอร์ Bamboo Platform"
echo "=============================================="

# 1. ตรวจสอบสถานะ Docker
echo "📦 ตรวจสอบสถานะ Docker:"
docker --version
docker ps -a
echo ""

# 2. ตรวจสอบ Docker Compose services
echo "🐳 ตรวจสอบ Docker Compose Services:"
docker-compose ps
echo ""

# 3. ตรวจสอบ logs ของ container
echo "📋 ตรวจสอบ Logs ของ Bamboo Platform:"
docker-compose logs --tail=50 bamboo-platform
echo ""

# 4. ตรวจสอบสถานะ nginx
echo "🌐 ตรวจสอบสถานะ Nginx:"
docker exec bamboo-platform_1 nginx -t 2>/dev/null || echo "Nginx config test failed"
echo ""

# 5. ตรวจสอบ port ที่เปิดอยู่
echo "🔌 ตรวจสอบ Port ที่เปิดอยู่:"
netstat -tlnp | grep :80
echo ""

# 6. ตรวจสอบ disk space
echo "💾 ตรวจสอบ Disk Space:"
df -h
echo ""

# 7. ตรวจสอบ memory usage
echo "🧠 ตรวจสอบ Memory Usage:"
free -h
echo ""

# 8. ตรวจสอบ system load
echo "⚡ ตรวจสอบ System Load:"
uptime
echo ""

echo "✅ การตรวจสอบเสร็จสิ้น"
echo "📝 หากพบปัญหา ให้ดู logs ด้านบนเพื่อหาสาเหตุ"
