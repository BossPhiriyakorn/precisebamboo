// utils/authHandler.ts
// ระบบจัดการการเข้าสู่ระบบผ่านลิงค์

import { UserRole } from '../types';
import { parseUrlParams } from './navigation';
import { checkFarmerRegistration } from './farmerStorage';

// Interface สำหรับข้อมูลการเข้าสู่ระบบ
export interface AuthContext {
  role: UserRole | null;
  isDirectLogin: boolean;
  sourceUrl: string | null;
  isFarmerRegistered?: boolean;
}

// ฟังก์ชันสำหรับตรวจสอบและประมวลผลการเข้าสู่ระบบผ่าน URL
export const handleUrlBasedAuth = (): AuthContext => {
  const currentUrl = window.location.href;
  const urlParams = parseUrlParams();
  
  // ตรวจสอบว่าเป็นลิงค์เข้าสู่ระบบ Role หรือไม่
  if (urlParams.role) {
    const role = urlParams.role;
    
    // สำหรับเกษตรกร ตรวจสอบสถานะการลงทะเบียน
    if (role === UserRole.FARMER) {
      const isRegistered = checkFarmerRegistration();
      return {
        role,
        isDirectLogin: true,
        sourceUrl: currentUrl,
        isFarmerRegistered: isRegistered
      };
    }
    
    return {
      role,
      isDirectLogin: true,
      sourceUrl: currentUrl
    };
  }
  
  // ถ้าไม่ใช่ลิงค์เข้าสู่ระบบ Role
  return {
    role: null,
    isDirectLogin: false,
    sourceUrl: null
  };
};

// ฟังก์ชันสำหรับล้าง URL parameters หลังจากประมวลผลแล้ว
export const cleanUrlAfterAuth = (): void => {
  // ลบ query parameters ออกจาก URL
  window.history.replaceState({}, document.title, window.location.pathname);
};

// ฟังก์ชันสำหรับตรวจสอบว่าเป็นการเข้าสู่ระบบโดยตรงหรือไม่
export const isDirectRoleLogin = (): boolean => {
  const urlParams = parseUrlParams();
  return urlParams.role !== undefined;
};

// ฟังก์ชันสำหรับดึง Role จาก URL ปัจจุบัน
export const getCurrentUrlRole = (): UserRole | null => {
  const urlParams = parseUrlParams();
  return urlParams.role || null;
};

// ฟังก์ชันสำหรับตรวจสอบว่า URL มี parameters อื่นๆ หรือไม่
export const hasAdditionalUrlParams = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  
  // ถ้ามี parameters อื่นๆ นอกเหนือจาก role
  return urlParams.toString() !== (roleParam ? `role=${roleParam}` : '');
};

// ฟังก์ชันสำหรับเก็บข้อมูลการเข้าสู่ระบบใน session storage
export const storeAuthContext = (context: AuthContext): void => {
  try {
    sessionStorage.setItem('authContext', JSON.stringify(context));
  } catch (error) {
    console.error('Error storing auth context:', error);
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลการเข้าสู่ระบบจาก session storage
export const getStoredAuthContext = (): AuthContext | null => {
  try {
    const stored = sessionStorage.getItem('authContext');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving auth context:', error);
    return null;
  }
};

// ฟังก์ชันสำหรับล้างข้อมูลการเข้าสู่ระบบจาก session storage
export const clearStoredAuthContext = (): void => {
  try {
    sessionStorage.removeItem('authContext');
  } catch (error) {
    console.error('Error clearing auth context:', error);
  }
};
