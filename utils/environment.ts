// Environment Configuration
// ตรวจสอบ environment และการตั้งค่าต่างๆ

export const isDevelopment = (import.meta as any).env?.DEV;
export const isProduction = (import.meta as any).env?.PROD;

// ตรวจสอบ environment จาก URL หรือ environment variable
const isProductionByUrl = typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && 
   window.location.hostname !== '127.0.0.1' &&
   !window.location.hostname.includes('ngrok'));

// ใช้ environment variable หรือ URL detection
const isProductionMode = isProduction || isProductionByUrl;
const isDevelopmentMode = isDevelopment && !isProductionByUrl;

// ตรวจสอบว่าใช้ mock data หรือไม่ (ปิดใน production)
export const useMockData = isDevelopmentMode;

// ตรวจสอบว่าใช้ database หรือไม่ (เปิดใน production)
export const useDatabase = isProductionMode;

// Environment variables
export const environment = {
  mode: isProductionMode ? 'production' : 'development',
  useMockData,
  useDatabase,
  apiBaseUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000',
  productionDomain: (import.meta as any).env?.VITE_PRODUCTION_DOMAIN || 'https://yourdomain.com'
};

export default environment;
