// utils/config.ts
// ระบบ Configuration แบบรวมศูนย์สำหรับแอปพลิเคชัน

import { UserRole } from '../types';

// Environment Detection
const isDevelopment = (import.meta as any).env?.DEV;
const isProduction = (import.meta as any).env?.PROD;

// ฟังก์ชันสำหรับดึง environment variables
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return (import.meta as any).env?.[key] || defaultValue;
};

// ฟังก์ชันสำหรับดึงโดเมนปัจจุบัน (ใช้สำหรับ development และ production)
const getCurrentDomain = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback สำหรับ server-side
  return getEnvVar('VITE_APP_DOMAIN', 'http://localhost:5173');
};

// ฟังก์ชันสำหรับตรวจสอบว่าเป็น ngrok หรือไม่
const isNgrokDomain = (): boolean => {
  const domain = getCurrentDomain();
  return domain.includes('ngrok') || domain.includes('ngrok-free.app');
};

// ฟังก์ชันสำหรับดึงโดเมนสำหรับ production
const getProductionDomain = (): string => {
  return getEnvVar('VITE_PRODUCTION_DOMAIN', 'https://bamboo-app.precise.co.th');
};

// ฟังก์ชันสำหรับดึงโดเมนที่ใช้จริง (development หรือ production)
const getActiveDomain = (): string => {
  if (isDevelopment) {
    return getCurrentDomain();
  }
  return getProductionDomain();
};

// Configuration หลัก
export const APP_CONFIG = {
  // Environment
  isDevelopment,
  isProduction,
  
  // Domains
  currentDomain: getCurrentDomain(),
  productionDomain: getProductionDomain(),
  activeDomain: getActiveDomain(),
  isNgrok: isNgrokDomain(),
  
  // App Info
  appTitle: getEnvVar('VITE_APP_TITLE', 'Bamboo Platform'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // LINE Integration
  lineChannelId: getEnvVar('VITE_LINE_CHANNEL_ID', ''),
  lineChannelSecret: getEnvVar('VITE_LINE_CHANNEL_SECRET', ''),
  lineCallbackUrl: `${getActiveDomain()}/?action=line_callback`,
  
  // API
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
  
  // Share Info
  shareInfo: {
    title: getEnvVar('VITE_APP_TITLE', 'Bamboo Platform'),
    description: 'ระบบจัดการการปลูกไผ่และโรงงานแปรรูป',
    image: '/images/banners/bg-regis.png'
  }
};

// ฟังก์ชันสำหรับสร้างลิงค์
export const createAppLink = (path: string, params?: Record<string, string>): string => {
  const url = new URL(path, APP_CONFIG.activeDomain);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  
  return url.toString();
};

// ฟังก์ชันสำหรับสร้าง LINE Login URL
export const createLineLoginUrl = (role: UserRole): string => {
  if (!APP_CONFIG.lineChannelId) {
    console.error('LINE Channel ID not configured!');
    return '#';
  }
  
  const roleMap: Record<UserRole, string> = {
    [UserRole.FARMER]: 'farmer',
    [UserRole.ADMIN]: 'admin',
    [UserRole.FACTORY]: 'factory'
  };
  
  const state = roleMap[role] || 'farmer';
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: APP_CONFIG.lineChannelId,
    redirect_uri: APP_CONFIG.lineCallbackUrl,
    state: state,
    scope: 'profile openid',
    prompt: 'consent'
  });
  
  return `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
};

// ฟังก์ชันสำหรับสร้างลิงค์เข้าสู่ระบบแต่ละ Role
export const createRoleLoginUrl = (role: UserRole): string => {
  switch (role) {
    case UserRole.FARMER:
      return createLineLoginUrl(role);
    case UserRole.ADMIN:
    case UserRole.FACTORY:
      return createAppLink('/', { role: role.toLowerCase(), action: 'login' });
    default:
      return createAppLink('/', { action: 'register' });
  }
};

// ฟังก์ชันสำหรับสร้างลิงค์ทั้งหมด
export const createAllRoleLinks = () => {
  return {
    farmer: createRoleLoginUrl(UserRole.FARMER),
    admin: createRoleLoginUrl(UserRole.ADMIN),
    factory: createRoleLoginUrl(UserRole.FACTORY),
    register: createAppLink('/', { action: 'register' })
  };
};

// Debug function
export const debugConfig = () => {
  console.log('App Configuration:', {
    environment: isDevelopment ? 'development' : 'production',
    activeDomain: APP_CONFIG.activeDomain,
    isNgrok: APP_CONFIG.isNgrok,
    lineChannelId: APP_CONFIG.lineChannelId ? 'configured' : 'missing',
    lineCallbackUrl: APP_CONFIG.lineCallbackUrl,
    roleLinks: createAllRoleLinks()
  });
};
