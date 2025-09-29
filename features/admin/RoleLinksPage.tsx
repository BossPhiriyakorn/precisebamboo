// features/admin/RoleLinksPage.tsx
// หน้าสำหรับแอดมินในการจัดการลิงค์เข้าสู่ระบบแต่ละ Role

import React, { useState } from 'react';
import RoleLinksDisplay from '../../components/RoleLinksDisplay';
import { createAllRoleLinks } from '../../utils/config';
import { UserRole } from '../../types';

const RoleLinksPage: React.FC = () => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
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

  const handleGenerateQRCode = (role: UserRole) => {
    setSelectedRole(role);
    setShowQRCode(true);
  };

  const handleDownloadLinks = () => {
    const linksText = roleLinks
      .map(link => `${link.displayName}: ${link.url}`)
      .join('\n');
    
    const blob = new Blob([linksText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'role-login-links.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">จัดการลิงค์เข้าสู่ระบบ</h1>
              <p className="text-gray-600 mt-1">สร้างและจัดการลิงค์เข้าสู่ระบบสำหรับแต่ละ Role</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showQRCode ? 'ซ่อน QR Code' : 'แสดง QR Code'}
              </button>
              <button
                onClick={handleDownloadLinks}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ดาวน์โหลดลิงค์
              </button>
            </div>
          </div>
        </div>

        {/* Role Links Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <RoleLinksDisplay 
            showQRCode={showQRCode}
            showCopyButton={true}
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">คำแนะนำการใช้งาน</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">สำหรับแอดมิน:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ใช้ลิงค์แอดมินสำหรับเข้าสู่ระบบจัดการ</li>
                <li>• แชร์ลิงค์เกษตรกรให้เกษตรกรที่ลงทะเบียนแล้ว</li>
                <li>• แชร์ลิงค์โรงงานให้โรงงานที่ลงทะเบียนแล้ว</li>
                <li>• ใช้ QR Code สำหรับการแชร์แบบออฟไลน์</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">สำหรับผู้ใช้:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• คลิกลิงค์ที่ได้รับเพื่อเข้าสู่ระบบโดยตรง</li>
                <li>• ไม่ต้องผ่านหน้าเลือก Role</li>
                <li>• เข้าสู่หน้าล็อกอินสำหรับ Role ที่ระบุทันที</li>
                <li>• ใช้ข้อมูลล็อกอินที่ได้รับจากแอดมิน</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="mt-6 bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h4 className="font-medium text-yellow-800 mb-2">ข้อมูล Environment:</h4>
          <div className="text-sm text-yellow-700">
            <p><strong>โดเมนหลัก:</strong> {(import.meta as any).env?.VITE_APP_DOMAIN || 'http://localhost:5173'}</p>
            <p><strong>Environment:</strong> {(import.meta as any).env?.NODE_ENV || 'development'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLinksPage;
