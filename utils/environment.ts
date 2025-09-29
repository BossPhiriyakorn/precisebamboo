// Environment Configuration
// ตรวจสอบ environment และการตั้งค่าต่างๆ

export const isDevelopment = (import.meta as any).env?.DEV;
export const isProduction = (import.meta as any).env?.PROD;

// ตรวจสอบว่าใช้ mock data หรือไม่
export const useMockData = isDevelopment;

// ตรวจสอบว่าใช้ database หรือไม่
export const useDatabase = isProduction;

// Environment variables
export const environment = {
  mode: isDevelopment ? 'development' : 'production',
  useMockData,
  useDatabase,
  apiBaseUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000',
  productionDomain: (import.meta as any).env?.VITE_PRODUCTION_DOMAIN || 'https://yourdomain.com'
};

export default environment;
