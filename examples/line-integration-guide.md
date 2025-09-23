# คู่มือการนำระบบไปใช้งานจริงกับ LINE

## 1. การตั้งค่า LINE Channel

### 1.1 สร้าง LINE Channel
1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง Provider ใหม่ (ถ้ายังไม่มี)
3. สร้าง Messaging API Channel
4. ตั้งค่า Channel Information:
   - **Channel name**: Bamboo Platform
   - **Channel description**: ระบบจัดการการปลูกไผ่และโรงงานแปรรูป
   - **Category**: Business
   - **Subcategory**: Agriculture

### 1.2 ตั้งค่า Callback URL
ใน LINE Developers Console:
- **Callback URL**: `https://yourdomain.com/?action=line_callback`
- **Webhook URL**: `https://yourdomain.com/webhook/line` (ถ้าต้องการ)

## 2. การตั้งค่า Environment Variables

### 2.1 สร้างไฟล์ .env
```env
# โดเมนจริงสำหรับการใช้งาน
VITE_PRODUCTION_DOMAIN=https://yourdomain.com

# LINE Channel Configuration
VITE_LINE_CHANNEL_ID=your_line_channel_id_here
VITE_LINE_CHANNEL_SECRET=your_line_channel_secret_here

# Callback URLs
VITE_LINE_CALLBACK_URL=https://yourdomain.com/?action=line_callback
```

### 2.2 อัปเดต utils/lineCallback.ts
เปลี่ยน `YOUR_LINE_CHANNEL_ID` เป็น Channel ID จริง:
```typescript
const clientId = 'YOUR_LINE_CHANNEL_ID'; // เปลี่ยนเป็น Channel ID จริง
```

## 3. ลิงค์สำหรับแต่ละ Role

### 3.1 เกษตรกร (ใช้ LINE Authorization URL)
```
https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=YOUR_LINE_CHANNEL_ID&redirect_uri=https://yourdomain.com/?action=line_callback&state=เกษตรกร&scope=profile%20openid&prompt=consent
```

**การทำงาน:**
- **ครั้งแรก**: ไปหน้าสมัครลงทะเบียน → ไปหน้าแรก
- **ครั้งที่ 2**: ไปหน้าแรกเลย (ตรวจสอบจาก localStorage)

### 3.2 แอดมิน (ใช้ลิงค์แอปปกติ)
```
https://yourdomain.com/?role=แอดมิน&action=login
```

### 3.3 โรงงาน (ใช้ลิงค์แอปปกติ)
```
https://yourdomain.com/?role=โรงงาน&action=login
```

### 3.4 สมัครสมาชิก
```
https://yourdomain.com/?action=register
```

## 4. การตั้งค่า LINE Rich Menu

### 4.1 สร้าง Rich Menu
1. ไปที่ LINE Developers Console
2. เลือก Channel ของคุณ
3. ไปที่ Messaging API > Rich Menu
4. สร้าง Rich Menu ใหม่

### 4.2 ตั้งค่าปุ่ม

#### ปุ่มเกษตรกร
- **Label**: "เกษตรกร"
- **Action Type**: "URI"
- **URI**: `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=YOUR_LINE_CHANNEL_ID&redirect_uri=https://yourdomain.com/?action=line_callback&state=เกษตรกร&scope=profile%20openid&prompt=consent`

#### ปุ่มแอดมิน
- **Label**: "แอดมิน"
- **Action Type**: "URI"
- **URI**: `https://yourdomain.com/?role=แอดมิน&action=login`

#### ปุ่มโรงงาน
- **Label**: "โรงงาน"
- **Action Type**: "URI"
- **URI**: `https://yourdomain.com/?role=โรงงาน&action=login`

#### ปุ่มสมัครสมาชิก
- **Label**: "สมัครสมาชิก"
- **Action Type**: "URI"
- **URI**: `https://yourdomain.com/?action=register`

## 5. การทดสอบระบบ

### 5.1 ทดสอบเกษตรกร
1. เปิดลิงค์: `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=YOUR_LINE_CHANNEL_ID&redirect_uri=https://yourdomain.com/?action=line_callback&state=เกษตรกร&scope=profile%20openid&prompt=consent`
2. **ครั้งแรก**: ควรไปหน้า LINE Allow → หน้าสมัครลงทะเบียน
3. สมัครเสร็จ → ไปหน้าแรก
4. เปิดลิงค์อีกครั้ง → ควรไปหน้าแรกเลย

### 5.2 ทดสอบแอดมิน/โรงงาน
1. เปิดลิงค์: `https://yourdomain.com/?role=แอดมิน&action=login`
2. ควรไปหน้า Login ในแอป
3. หลังจากล็อกอิน → ไปหน้าแรก

### 5.3 ทดสอบผ่าน LINE Rich Menu
1. ตั้งค่า Rich Menu ใน LINE
2. ทดสอบกดปุ่มแต่ละตัว
3. ตรวจสอบการทำงานตามที่คาดหวัง

## 6. การ Deploy

### 6.1 ตั้งค่า Domain
1. เปลี่ยน `VITE_PRODUCTION_DOMAIN` ใน `.env`
2. อัปเดต Callback URL ใน LINE Console
3. Deploy แอปไปยัง production

### 6.2 ตรวจสอบการทำงาน
1. ทดสอบลิงค์แต่ละตัว
2. ตรวจสอบ LINE Login
3. ตรวจสอบการบันทึกข้อมูลใน localStorage

## 7. การแก้ไขปัญหา

### 7.1 LINE Login ไม่ทำงาน
- ตรวจสอบ Channel ID และ Secret
- ตรวจสอบ Callback URL
- ตรวจสอบ CORS settings

### 7.2 เกษตรกรไม่ไปหน้าสมัคร
- ตรวจสอบ localStorage
- ลบข้อมูล: `localStorage.removeItem('bamboo_farmer_registered')`

### 7.3 โดเมนไม่ถูกต้อง
- ตรวจสอบ `VITE_PRODUCTION_DOMAIN` ใน `.env`
- ตรวจสอบการตั้งค่าใน LINE Console

## 8. หมายเหตุสำคัญ

- **เกษตรกร**: ใช้ localStorage เก็บสถานะการลงทะเบียน
- **แอดมิน/โรงงาน**: ใช้ LINE Login
- **การทดสอบ**: ใช้หน้าเลือก Role ในโปรเจค
- **การใช้งานจริง**: ใช้ลิงค์ที่สร้างขึ้น
