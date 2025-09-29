// utils/navigation.ts
// ฟังก์ชันสำหรับการจัดการการนำทาง (ใช้ config ใหม่)

import { UserRole } from '../types';
import { createAppLink, createLineLoginUrl, createRoleLoginUrl } from './config';

// Query parameters สำหรับการเลือก Role
export interface RoleNavigationParams {
  role?: UserRole;
  action?: 'login' | 'register' | 'direct';
  returnUrl?: string;
}

/**
 * สร้างลิงค์สำหรับการเลือก Role
 */
export function createRoleLink(
  role: UserRole,
  action: 'login' | 'register' | 'direct' = 'direct',
  returnUrl?: string
): string {
  const params: Record<string, string> = {
    role: role.toLowerCase(),
    action
  };

  if (returnUrl) {
    params.return = returnUrl;
  }

  return createAppLink('/', params);
}

/**
 * สร้างลิงค์สำหรับการสมัครสมาชิก
 */
export function createRegistrationLink(returnUrl?: string): string {
  const params: Record<string, string> = {
    action: 'register'
  };
  
  if (returnUrl) {
    params.return = returnUrl;
  }
  
  return createAppLink('/', params);
}

/**
 * อ่าน parameters จาก URL
 */
export function parseUrlParams(): RoleNavigationParams {
  const urlParams = new URLSearchParams(window.location.search);

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
 */
export function createFarmerLineLoginUrl(): string {
  return createLineLoginUrl(UserRole.FARMER);
}

/**
 * สร้างลิงค์สำหรับแต่ละ Role
 */
export function createRoleLinks() {
  return {
    farmer: createRoleLoginUrl(UserRole.FARMER),
    admin: createRoleLoginUrl(UserRole.ADMIN),
    factory: createRoleLoginUrl(UserRole.FACTORY),
    register: createRegistrationLink()
  };
}
