// utils/lineCallback.ts
// ระบบ callback สำหรับ LINE Login

import { UserRole } from '../types';

/**
 * ตรวจสอบและจัดการ LINE Login Callback
 * @returns Object ที่มีข้อมูลการล็อกอิน
 */
export function handleLineCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');
  
  // Debug: แสดงข้อมูลที่ได้รับ
  console.log('LINE Callback Debug:', {
    code: code ? 'present' : 'missing',
    state: state,
    error: error,
    errorDescription: urlParams.get('error_description'),
    fullUrl: window.location.href
  });
  
  console.log('URL Parameters:', {
    code: code,
    state: state,
    error: error,
    errorDescription: urlParams.get('error_description')
  });
  
  if (error) {
    return {
      success: false,
      error: error,
      errorDescription: urlParams.get('error_description') || 'เกิดข้อผิดพลาดในการล็อกอิน'
    };
  }
  
  if (code) {
    // ตรวจสอบ state parameter เพื่อระบุ role
    // แปลง state จากภาษาอังกฤษเป็น UserRole
    const roleMap: Record<string, UserRole> = {
      'farmer': UserRole.FARMER,
      'admin': UserRole.ADMIN,
      'factory': UserRole.FACTORY
    };
    
    // ตรวจสอบ state parameter อย่างระมัดระวัง
    const normalizedState = state ? state.toLowerCase().trim() : 'farmer';
    const role = roleMap[normalizedState] || UserRole.FARMER; // default เป็น farmer
    
    // Debug: ตรวจสอบการ mapping
    console.log('UserRole values:', {
      FARMER: UserRole.FARMER,
      ADMIN: UserRole.ADMIN,
      FACTORY: UserRole.FACTORY
    });
    
    console.log('Role mapping:', {
      originalState: state,
      normalizedState: normalizedState,
      mappedRole: role,
      roleMap: roleMap,
      isFarmer: role === UserRole.FARMER,
      roleComparison: {
        mappedRole: role,
        userRoleFarmer: UserRole.FARMER,
        strictEqual: role === UserRole.FARMER,
        looseEqual: role == UserRole.FARMER
      }
    });
    
    return {
      success: true,
      code: code,
      role: role,
      // ข้อมูลเพิ่มเติมที่อาจได้จาก LINE API
      profile: {
        userId: 'U' + Math.random().toString(36).substr(2, 9),
        displayName: 'ผู้ใช้ LINE',
        pictureUrl: 'https://via.placeholder.com/150'
      }
    };
  }
  
  return {
    success: false,
    error: 'no_code',
    errorDescription: 'ไม่พบ authorization code'
  };
}

/**
 * สร้างลิงค์สำหรับ LINE Login
 * @param role - บทบาทที่ต้องการ
 * @param redirectUri - URL ที่จะกลับมาหลังจากล็อกอิน
 * @returns URL สำหรับ LINE Login
 */
export function createLineLoginUrl(role: UserRole, redirectUri: string): string {
  const clientId = (import.meta as any).env?.VITE_LINE_CHANNEL_ID || 'YOUR_LINE_CHANNEL_ID';
  
  // แปลง UserRole เป็น string สำหรับ state parameter
  const roleMap: Record<UserRole, string> = {
    [UserRole.FARMER]: 'farmer',
    [UserRole.ADMIN]: 'admin',
    [UserRole.FACTORY]: 'factory'
  };
  
  const state = roleMap[role] || 'farmer';
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: 'profile openid',
    prompt: 'consent'
  });
  
  return `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
}

/**
 * สร้างลิงค์สำหรับเกษตรกรผ่าน LINE Login
 * @param baseUrl - URL ฐานของแอป
 * @returns URL สำหรับ LINE Login ของเกษตรกร
 */
export function createFarmerLineLoginUrl(baseUrl: string): string {
  const redirectUri = `${baseUrl}/?action=line_callback`;
  return createLineLoginUrl(UserRole.FARMER, redirectUri);
}

/**
 * สร้างลิงค์สำหรับแอดมินผ่าน LINE Login
 * @param baseUrl - URL ฐานของแอป
 * @returns URL สำหรับ LINE Login ของแอดมิน
 */
export function createAdminLineLoginUrl(baseUrl: string): string {
  const redirectUri = `${baseUrl}/?action=line_callback`;
  return createLineLoginUrl(UserRole.ADMIN, redirectUri);
}

/**
 * สร้างลิงค์สำหรับโรงงานผ่าน LINE Login
 * @param baseUrl - URL ฐานของแอป
 * @returns URL สำหรับ LINE Login ของโรงงาน
 */
export function createFactoryLineLoginUrl(baseUrl: string): string {
  const redirectUri = `${baseUrl}/?action=line_callback`;
  return createLineLoginUrl(UserRole.FACTORY, redirectUri);
}
