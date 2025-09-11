# 🚀 Bamboo Platform - AWS Deployment Guide

คู่มือการ Deploy Project Bamboo Platform ไปยัง AWS

## 📋 ข้อกำหนดเบื้องต้น

- Node.js 18+ 
- AWS Account
- AWS CLI ติดตั้งแล้ว
- Git (สำหรับบางวิธี)

## 🎯 ตัวเลือกการ Deploy

### 1. AWS S3 + CloudFront (แนะนำ - ง่ายที่สุด)

**เหมาะสำหรับ:** Static Website, ราคาถูก, ง่ายต่อการจัดการ

**ขั้นตอน:**

1. **เตรียม Environment Variables:**
```bash
# สร้างไฟล์ .env
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

2. **Build และ Deploy:**
```bash
# ให้สิทธิ์ execute
chmod +x deploy-s3.sh

# รัน script
./deploy-s3.sh
```

3. **ตั้งค่า CloudFront (Optional):**
   - ไปที่ AWS CloudFront Console
   - สร้าง Distribution ใหม่
   - ตั้งค่า Origin เป็น S3 bucket
   - ตั้งค่า Default Root Object เป็น `index.html`

### 2. AWS Amplify (แนะนำสำหรับ Frontend)

**เหมาะสำหรับ:** CI/CD อัตโนมัติ, ง่ายต่อการจัดการ

**ขั้นตอน:**

1. **ติดตั้ง Amplify CLI:**
```bash
npm install -g @aws-amplify/cli
```

2. **Deploy:**
```bash
chmod +x deploy-amplify.sh
./deploy-amplify.sh
```

### 3. AWS EC2 + Docker

**เหมาะสำหรับ:** ต้องการควบคุมเต็มที่, แอปที่ซับซ้อน

**ขั้นตอน:**

1. **สร้าง EC2 Instance:**
   - เลือก Ubuntu 20.04 LTS
   - t3.micro (Free Tier)
   - ตั้งค่า Security Group เปิด Port 80, 443, 22

2. **ติดตั้ง Docker บน EC2:**
```bash
# SSH เข้า EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# ติดตั้ง Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu
```

3. **Deploy:**
```bash
# Upload ไฟล์ไปยัง EC2
scp -i your-key.pem -r . ubuntu@your-ec2-ip:/home/ubuntu/bamboo-platform

# SSH เข้า EC2 และ Deploy
ssh -i your-key.pem ubuntu@your-ec2-ip
cd bamboo-platform
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

### 4. AWS Elastic Beanstalk

**เหมาะสำหรับ:** ต้องการ Auto-scaling, Load balancing

**ขั้นตอน:**

1. **สร้างไฟล์ .ebextensions/nginx.config:**
```yaml
files:
  "/etc/nginx/conf.d/proxy.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      client_max_body_size 50M;
      location / {
        try_files $uri $uri/ /index.html;
      }
```

2. **Deploy:**
```bash
# ติดตั้ง EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

## 🔧 การตั้งค่า Environment Variables

สร้างไฟล์ `.env` ใน root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
```

## 📊 เปรียบเทียบตัวเลือก

| ตัวเลือก | ราคา | ความซับซ้อน | Auto-scaling | CI/CD |
|---------|------|-------------|--------------|-------|
| S3 + CloudFront | ถูกที่สุด | ง่าย | ❌ | ❌ |
| Amplify | ถูก | ง่าย | ✅ | ✅ |
| EC2 + Docker | ปานกลาง | ปานกลาง | ❌ | ❌ |
| Elastic Beanstalk | แพง | ซับซ้อน | ✅ | ✅ |

## 🚨 ข้อควรระวัง

1. **Security Groups:** ตั้งค่าให้เปิดเฉพาะ Port ที่จำเป็น
2. **HTTPS:** ใช้ CloudFront หรือ Load Balancer สำหรับ HTTPS
3. **Domain:** ตั้งค่า Custom Domain ผ่าน Route 53
4. **Monitoring:** ใช้ CloudWatch สำหรับ Monitoring
5. **Backup:** ตั้งค่า Backup สำหรับ Production

## 🔍 Troubleshooting

### Build Error
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
npm run build
```

### AWS CLI Error
```bash
# ตั้งค่า AWS credentials
aws configure
```

### Docker Error
```bash
# ตรวจสอบ Docker status
docker ps
docker logs bamboo-platform
```

## 📞 การสนับสนุน

หากมีปัญหาการ Deploy สามารถติดต่อทีมพัฒนาได้ที่:
- Email: support@bamboo-platform.com
- GitHub Issues: [Project Repository]

---

**หมายเหตุ:** คู่มือนี้ครอบคลุมการ Deploy พื้นฐาน สำหรับ Production ควรมีการตั้งค่าเพิ่มเติมตาม Security Best Practices
