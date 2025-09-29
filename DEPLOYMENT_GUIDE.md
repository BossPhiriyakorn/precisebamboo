# 🚀 Deployment Guide สำหรับ Bamboo Platform

## 📋 ขั้นตอนการ Deploy สำหรับ Production

### 1. 🔧 ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ production environment
cp production.env .env

# แก้ไขไฟล์ .env ด้วยค่าจริง
nano .env
```

**แก้ไขค่าสำคัญในไฟล์ `.env`:**
```env
# เปลี่ยนเป็นโดเมนจริงของคุณ
VITE_APP_DOMAIN=https://yourdomain.com
VITE_PRODUCTION_DOMAIN=https://yourdomain.com

# เปลี่ยนเป็น LINE Channel ID และ Secret จริง
VITE_LINE_CHANNEL_ID=your_real_channel_id
VITE_LINE_CHANNEL_SECRET=your_real_channel_secret

# เปลี่ยนเป็น API URL จริง
VITE_API_BASE_URL=https://your-api-domain.com
```

### 2. 🏗️ Build สำหรับ Production

```bash
# Build โปรเจคสำหรับ production
npm run build:prod

# หรือ
NODE_ENV=production npm run build
```

### 3. 🌐 ตั้งค่า LINE Developer Console

1. เข้าไปที่ [LINE Developer Console](https://developers.line.biz/)
2. เลือก Channel ของคุณ
3. ไปที่ **LINE Login** tab
4. ตั้งค่า **Callback URL**: `https://yourdomain.com/?action=line_callback`
5. ตั้งค่า **Webhook URL**: `https://yourdomain.com/webhook` (ถ้ามี)

### 4. 🔐 ตั้งค่า Security Headers

**สำหรับ Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Static files
    location / {
        root /path/to/your/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### 5. 🚀 Deploy Scripts

**ใช้ไฟล์ deploy scripts ที่มีอยู่:**

```bash
# สำหรับ AWS S3
./deploy-s3.sh

# สำหรับ AWS EC2
./deploy-ec2.sh

# สำหรับ AWS Amplify
./deploy-amplify.sh

# Quick deploy
./quick-deploy.sh
```

### 6. ✅ ตรวจสอบการ Deploy

```bash
# ตรวจสอบว่า build สำเร็จ
ls -la dist/

# ตรวจสอบว่าไฟล์สำคัญมีอยู่
ls -la dist/index.html
ls -la dist/assets/

# ทดสอบการเข้าถึง
curl -I https://yourdomain.com
```

### 7. 🔍 Debug และ Monitoring

**เพิ่ม debug logging:**
```javascript
// ใน browser console
import { debugConfig } from './utils/config';
debugConfig();
```

**ตรวจสอบ environment:**
```javascript
// ตรวจสอบว่าเป็น production หรือไม่
console.log('Environment:', import.meta.env.MODE);
console.log('Use Mock Data:', import.meta.env.DEV);
```

### 8. 📱 ทดสอบการใช้งาน

**ทดสอบลิงค์ต่างๆ:**
- เกษตรกร: `https://yourdomain.com/?role=farmer&action=login`
- แอดมิน: `https://yourdomain.com/?role=admin&action=login`
- โรงงาน: `https://yourdomain.com/?role=factory&action=login`
- สมัครสมาชิก: `https://yourdomain.com/?action=register`

### 9. 🐛 แก้ไขปัญหาที่พบบ่อย

**ปัญหา: Mock Data ยังทำงานอยู่**
```javascript
// ตรวจสอบใน utils/environment.ts
export const useMockData = isDevelopmentMode; // ควรเป็น false ใน production
```

**ปัญหา: LINE Login ไม่ทำงาน**
```javascript
// ตรวจสอบ LINE Channel ID
console.log('LINE Channel ID:', import.meta.env.VITE_LINE_CHANNEL_ID);
```

**ปัญหา: API calls ไม่ทำงาน**
```javascript
// ตรวจสอบ API Base URL
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

### 10. 📊 Performance Optimization

**เพิ่มใน vite.config.ts:**
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        daypilot: ['@daypilot/daypilot-lite-react'],
        utils: ['moment', 'pdfjs-dist']
      }
    }
  }
}
```

## 🎯 Checklist สำหรับ Production

- [ ] ✅ ตั้งค่า Environment Variables
- [ ] ✅ Build โปรเจคสำหรับ production
- [ ] ✅ ตั้งค่า LINE Developer Console
- [ ] ✅ ตั้งค่า SSL Certificate
- [ ] ✅ ตั้งค่า Security Headers
- [ ] ✅ ทดสอบการเข้าถึงจากมือถือ
- [ ] ✅ ทดสอบ LINE Login
- [ ] ✅ ทดสอบการใช้งานทุก Role
- [ ] ✅ ตั้งค่า Monitoring และ Logging
- [ ] ✅ Backup และ Recovery Plan

## 🆘 Support

หากพบปัญหาในการ Deploy:
1. ตรวจสอบ Console Logs
2. ตรวจสอบ Network Tab ใน Developer Tools
3. ตรวจสอบ Environment Variables
4. ตรวจสอบ LINE Developer Console Settings
