// components/RoleLinksDisplay.tsx
// คอมโพเนนต์สำหรับแสดงลิงค์เข้าสู่ระบบแต่ละ Role

import React, { useState } from 'react';
import { createAllRoleLinks } from '../utils/config';
import { UserRole } from '../types';

interface RoleLinksDisplayProps {
  className?: string;
  showQRCode?: boolean;
  showCopyButton?: boolean;
}

const RoleLinksDisplay: React.FC<RoleLinksDisplayProps> = ({ 
  className = '', 
  showQRCode = false, 
  showCopyButton = true 
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const roleLinksData = createAllRoleLinks();
  
  // แปลงข้อมูลให้ตรงกับ interface เดิม
  const roleLinks = [
    {
      role: UserRole.FARMER,
      url: roleLinksData.farmer,
      displayName: 'เกษตรกร',
      description: 'เข้าสู่ระบบสำหรับเกษตรกร'
    },
    {
      role: UserRole.ADMIN,
      url: roleLinksData.admin,
      displayName: 'แอดมิน',
      description: 'เข้าสู่ระบบสำหรับผู้ดูแลระบบ'
    },
    {
      role: UserRole.FACTORY,
      url: roleLinksData.factory,
      displayName: 'โรงงาน',
      description: 'เข้าสู่ระบบสำหรับโรงงานแปรรูป'
    }
  ];

  const handleCopyLink = async (url: string, role: UserRole) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(role);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(role);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.FARMER:
        return '🌾';
      case UserRole.FACTORY:
        return '🏭';
      case UserRole.ADMIN:
        return '👨‍💼';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.FARMER:
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case UserRole.FACTORY:
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case UserRole.ADMIN:
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ลิงค์เข้าสู่ระบบแต่ละ Role</h2>
        <p className="text-gray-600">คลิกเพื่อคัดลอกลิงค์หรือสแกน QR Code</p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {roleLinks.map((link) => (
          <div
            key={link.role}
            className={`p-6 rounded-lg border-2 transition-all duration-200 ${getRoleColor(link.role)}`}
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{getRoleIcon(link.role)}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{link.displayName}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-gray-500 mb-1">ลิงค์:</p>
                <p className="text-sm font-mono text-gray-800 break-all">{link.url}</p>
              </div>

              {showCopyButton && (
                <button
                  onClick={() => handleCopyLink(link.url, link.role)}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    copiedLink === link.role
                      ? 'bg-green-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {copiedLink === link.role ? 'คัดลอกแล้ว!' : 'คัดลอกลิงค์'}
                </button>
              )}

              {showQRCode && (
                <div className="text-center">
                  <div className="bg-white p-4 rounded border inline-block">
                    <p className="text-xs text-gray-500 mb-2">QR Code:</p>
                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">สแกนเพื่อเข้าสู่ระบบ</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">วิธีใช้งาน:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• คลิก "คัดลอกลิงค์" เพื่อคัดลอกลิงค์เข้าสู่ระบบ</li>
          <li>• แชร์ลิงค์ให้ผู้ใช้ที่ต้องการเข้าสู่ระบบใน Role นั้นๆ</li>
          <li>• ผู้ใช้จะเข้าสู่หน้าล็อกอินโดยตรงสำหรับ Role ที่ระบุ</li>
          <li>• ไม่ต้องผ่านหน้าเลือก Role อีก</li>
        </ul>
      </div>
    </div>
  );
};

export default RoleLinksDisplay;
