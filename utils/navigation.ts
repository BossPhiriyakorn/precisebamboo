// utils/navigation.ts
// ฟังก์ชันสำหรับการจัดการการนำทางและสร้างลิงค์สำหรับการเลือก Role

import { UserRole } from '../types';
import { APP_CONFIG, createProductionLink } from './config';

// Query parameters สำหรับการเลือก Role
export interface RoleNavigationParams {
  role?: UserRole;
  action?: 'login' | 'register' | 'direct';
  returnUrl?: string;
}

/**
 * สร้างลิงค์สำหรับการเลือก Role (ใช้โดเมนจริง)
 * @param role - บทบาทที่ต้องการ
 * @param action - การกระทำ (login, register, direct)
 * @param returnUrl - URL ที่จะกลับไปหลังจากเสร็จสิ้น
 * @returns URL string
 */
export function createRoleLink(
  role: UserRole,
  action: 'login' | 'register' | 'direct' = 'direct',
  returnUrl?: string
): string {
  // แปลง role เป็นภาษาอังกฤษสำหรับ URL
  const roleMap: Record<UserRole, string> = {
    [UserRole.FARMER]: 'farmer',
    [UserRole.ADMIN]: 'admin',
    [UserRole.FACTORY]: 'factory'
  };

  const params: Record<string, string> = {
    role: roleMap[role],
    action
  };

  if (returnUrl) {
    params.return = returnUrl;
  }

  return createProductionLink('/', params);
}

/**
 * สร้างลิงค์สำหรับการสมัครสมาชิก (ใช้โดเมนจริง)
 * @param returnUrl - URL ที่จะกลับไปหลังจากเสร็จสิ้น
 * @returns URL string
 */
export function createRegistrationLink(returnUrl?: string): string {
  const params: Record<string, string> = {
    action: 'register'
  };
  
  if (returnUrl) {
    params.return = returnUrl;
  }
  
  return createProductionLink('/', params);
}

/**
 * อ่าน parameters จาก URL
 * @returns RoleNavigationParams
 */
export function parseUrlParams(): RoleNavigationParams {
  const urlParams = new URLSearchParams(window.location.search);

  // แปลง role จากภาษาอังกฤษกลับเป็น UserRole
  const roleMap: Record<string, UserRole> = {
    'farmer': UserRole.FARMER,
    'admin': UserRole.ADMIN,
    'factory': UserRole.FACTORY
  };

  const roleParam = urlParams.get('role');
  const role = roleParam ? roleMap[roleParam] : undefined;

  return {
    role: role,
    action: urlParams.get('action') as 'login' | 'register' | 'direct' || undefined,
    returnUrl: urlParams.get('return') || undefined,
  };
}

/**
 * สร้างลิงค์สำหรับเกษตรกร (ใช้ LINE Authorization URL)
 * @returns URL string สำหรับ LINE Authorization
 */
export function createFarmerLineLoginUrl(): string {
  const params = new URLSearchParams();
  params.append('response_type', 'code');
  params.append('client_id', (import.meta as any).env?.VITE_LINE_CHANNEL_ID || 'YOUR_LINE_CHANNEL_ID');
  params.append('redirect_uri', (import.meta as any).env?.VITE_LINE_CALLBACK_URL || 'https://yourdomain.com/?action=line_callback');
  params.append('state', 'farmer'); // ใช้ภาษาอังกฤษ
  params.append('scope', 'profile openid');
  params.append('prompt', 'consent'); // บังคับให้แสดงหน้าขออนุญาตทุกครั้ง

  return `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
}

/**
 * สร้างลิงค์สำหรับแต่ละ Role (ใช้โดเมนจริง)
 * @returns Object ที่มีลิงค์สำหรับแต่ละ Role
 */
export function createRoleLinks() {
  return {
    farmer: createFarmerLineLoginUrl(), // ใช้ LINE Authorization URL
    admin: createRoleLink(UserRole.ADMIN, 'login'), // ใช้ลิงค์แอปปกติ (ต้อง login)
    factory: createRoleLink(UserRole.FACTORY, 'direct'), // ใช้ลิงค์แอปปกติ
    register: createRegistrationLink()
  };
}
