# ตัวอย่างลิงค์สำหรับแต่ละ Role

## การตั้งค่าโดเมนจริง

1. คัดลอกไฟล์ `env.example` เป็น `.env`
2. เปลี่ยนโดเมนจริงในไฟล์ `.env`:

```env
# เปลี่ยนเป็นโดเมนจริงของคุณ
VITE_PRODUCTION_DOMAIN=https://yourdomain.com
```

## ลิงค์สำหรับแต่ละ Role

### เกษตรกร (ใช้ LINE Authorization URL)
```
https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=YOUR_LINE_CHANNEL_ID&redirect_uri=https://yourdomain.com/?action=line_callback&state=เกษตรกร&scope=profile%20openid&prompt=consent
```
**การทำงาน:**
- **ครั้งแรก**: ไปหน้า LINE Allow → หน้าสมัครลงทะเบียน → ไปหน้าแรก
- **ครั้งที่ 2**: ไปหน้าแรกเลย (ตรวจสอบจาก localStorage)

### แอดมิน (ใช้ลิงค์แอปปกติ)
```
https://yourdomain.com/?role=แอดมิน&action=login
```

### โรงงาน (ใช้ลิงค์แอปปกติ)
```
https://yourdomain.com/?role=โรงงาน&action=login
```

### สมัครสมาชิก
```
https://yourdomain.com/?action=register
```

## การใช้งานใน LINE Rich Menu

1. ไปที่ LINE Developer Console
2. เลือก Channel ของคุณ
3. ไปที่ Messaging API > Rich Menu
4. สร้าง Rich Menu ใหม่
5. ตั้งค่า Action Type เป็น "URI"
6. วางลิงค์ที่ต้องการในช่อง URI
7. ตั้งค่า Label ตามที่ต้องการ
8. บันทึกและเปิดใช้งาน

## ตัวอย่างการตั้งค่า Rich Menu

### ปุ่มเกษตรกร
- **Label**: "เกษตรกร"
- **URI**: `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=YOUR_LINE_CHANNEL_ID&redirect_uri=https://yourdomain.com/?action=line_callback&state=เกษตรกร&scope=profile%20openid&prompt=consent`

### ปุ่มแอดมิน
- **Label**: "แอดมิน"
- **URI**: `https://yourdomain.com/?role=แอดมิน&action=login`

### ปุ่มโรงงาน
- **Label**: "โรงงาน"
- **URI**: `https://yourdomain.com/?role=โรงงาน&action=login`

### ปุ่มสมัครสมาชิก
- **Label**: "สมัครสมาชิก"
- **URI**: `https://yourdomain.com/?action=register`

## การทดสอบ

1. เปลี่ยนโดเมนในไฟล์ `.env` เป็นโดเมนจริง
2. ทดสอบลิงค์แต่ละตัวใน browser
3. ตรวจสอบว่าผู้ใช้เข้าสู่ระบบใน Role ที่ถูกต้อง

## หมายเหตุ

- ลิงค์ทั้งหมดใช้โดเมนจริงที่ตั้งค่าใน `.env`
- เกษตรกรจะเข้าสู่ระบบโดยตรง
- แอดมินและโรงงานจะต้องล็อกอินก่อน
- สมัครสมาชิกจะไปที่หน้าสมัครสมาชิก
