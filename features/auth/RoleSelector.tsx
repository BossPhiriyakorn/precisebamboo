// features/auth/RoleSelector.tsx
// คอมโพเนนต์สำหรับหน้าจอเลือกบทบาท (Role) ของผู้ใช้
// เป็นหน้าแรกที่ผู้ใช้จะเห็นก่อนเข้าสู่ระบบ

import React from 'react';
import { UserRole } from '../../types';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface RoleSelectorProps {
    onSelectRole: (role: UserRole) => void; // ฟังก์ชันที่จะทำงานเมื่อผู้ใช้เลือกบทบาท
    onStartRegistration: () => void; // ฟังก์ชันสำหรับเริ่มการสมัครสมาชิก
    onTestNotApproved: () => void; // ฟังก์ชันสำหรับทดสอบหน้า "ไม่อนุมัติ"
}

// ไอคอนสำหรับเมนูต่างๆ
const FarmerIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} src="/Group 37383 (1).png" alt="Farmer" />
);

const RegistrationIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} src="/Group 37301 (1).png" alt="Registration" />
);

const AdminIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} src="/Group 37375.png" alt="Admin" />
);

// คอมโพเนนต์สำหรับปุ่มเมนูแบบใหม่
const MenuButton: React.FC<{
  icon: React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>;
  text: string;
  onClick: () => void;
  isActive?: boolean;
}> = ({ icon: Icon, text, onClick, isActive = false }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 text-white hover:bg-white/10 transition-all duration-300 rounded-lg group ${
      isActive ? 'bg-white/20' : ''
    }`}
  >
    <Icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform duration-300 mx-auto" />
    <span className="text-sm font-medium text-center leading-tight">{text}</span>
  </button>
);

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole, onStartRegistration, onTestNotApproved }) => (
    <div className="min-h-screen bg-[#4C93FF] relative overflow-hidden">
      {/* Header Image */}
      <div className="absolute top-0 left-0 right-0 z-40">
        <img 
          src="/Group 3890.png" 
          alt="Header" 
          className="w-full h-auto object-cover"
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Section with Background Image */}
        <div className="flex-1 flex flex-col items-center justify-end">
          {/* Frame-card.png image positioned above the main background */}
          <div className="flex justify-end pr-4 mb-4 z-30 transform -translate-y-[15%] translate-x-[15%]">
            <img 
              src="/Frame-card.png" 
              alt="PRECISE Card" 
              className="w-auto h-auto max-w-xs"
            />
          </div>
          
          {/* Main background image */}
          <img 
            src="/Frame 1597884579 (1).png" 
            alt="PRECISE Platform Background" 
            className="w-full h-auto object-cover transform -translate-y-[15%]"
          />
        </div>

        {/* Menu Section - Overlay on top of image */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#0079B9] via-[#0067A7] to-[#005596] px-6 py-4 z-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3">
              {/* แอดมิน */}
              <div className="relative">
                <MenuButton
                  icon={AdminIcon}
                  text="แอดมิน"
                  onClick={() => onSelectRole(UserRole.ADMIN)}
                />
                {/* เส้นขาวด้านขวา */}
                <div className="absolute top-0 right-0 w-[2px] h-full bg-white"></div>
              </div>
              
              {/* สมัครสมาชิก */}
              <div className="relative">
                <div className="transform translate-x-[5%]">
                  <MenuButton
                    icon={RegistrationIcon}
                    text="สมัครสมาชิก"
                    onClick={onStartRegistration}
                  />
                </div>
                {/* เส้นขาวด้านขวา */}
                <div className="absolute top-0 right-0 w-[2px] h-full bg-white"></div>
              </div>
              
              {/* เกษตรกร */}
              <div className="relative">
                <div className="transform translate-x-[20%]">
                  <MenuButton
                    icon={FarmerIcon}
                    text="เกษตรกร"
                    onClick={() => onSelectRole(UserRole.FARMER)}
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
);

export default RoleSelector;