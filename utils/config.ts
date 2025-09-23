// utils/config.ts
// การตั้งค่าสำหรับแอปพลิเคชัน

// โดเมนสำหรับการใช้งานจริง (อ่านจาก .env)
const getProductionDomain = () => {
  if (typeof window !== 'undefined') {
    // ใน browser - ใช้ Vite environment variables
    return (import.meta as any).env?.VITE_PRODUCTION_DOMAIN || 'https://yourdomain.com';
  }
  
  // Server-side fallback
  return process.env.VITE_PRODUCTION_DOMAIN || 'https://yourdomain.com';
};

// โดเมนปัจจุบัน
const getCurrentDomain = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return process.env.VITE_APP_BASE_URL || 'http://localhost:5173';
};

export const APP_CONFIG = {
  // โดเมนสำหรับการใช้งานจริง (อ่านจาก .env)
  PRODUCTION_DOMAIN: getProductionDomain(),
  
  // โดเมนปัจจุบัน
  CURRENT_DOMAIN: getCurrentDomain(),
  
  // ข้อมูลสำหรับการแชร์
  SHARE_INFO: {
    title: 'Bamboo Platform',
    description: 'ระบบจัดการการปลูกไผ่และโรงงานแปรรูป',
    image: '/images/banners/bg-regis.png'
  }
};

// ฟังก์ชันสำหรับสร้างลิงค์ที่ใช้โดเมนจริง
export const createProductionLink = (path: string, params?: Record<string, string>) => {
  const url = new URL(path, APP_CONFIG.PRODUCTION_DOMAIN);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  
  return url.toString();
};

// ฟังก์ชันสำหรับสร้างลิงค์ที่ใช้โดเมนปัจจุบัน
export const createCurrentLink = (path: string, params?: Record<string, string>) => {
  const url = new URL(path, APP_CONFIG.CURRENT_DOMAIN);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  
  return url.toString();
};
