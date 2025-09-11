import React, { useState } from 'react';
import { FullPreciseLogo } from './constants';
import FarmerRegistrationFlow from './features/farmer/registration/FarmerRegistrationFlow';

// ไอคอนสำหรับเมนูต่างๆ
const AdminIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} src="/Group 37375.png" alt="Admin" />
);

const RegistrationIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} src="/Group 37301 (1).png" alt="Registration" />
);

const FarmerIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} src="/Group 37383 (1).png" alt="Farmer" />
);

// คอมโพเนนต์สำหรับปุ่มเมนู
const MenuButton: React.FC<{
  icon: React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>;
  text: string;
  onClick: () => void;
}> = ({ icon: Icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 text-white hover:bg-white/10 transition-all duration-300 rounded-lg group"
  >
    <Icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform duration-300 mx-auto" />
    <span className="text-xs font-medium text-center leading-tight">{text}</span>
  </button>
);

const DemoLineMenu: React.FC = () => {
  const [showRegistration, setShowRegistration] = useState(false);

  const handleContactAdmin = () => {
    alert('ติดต่อแอดมิน');
  };

  const handleReportProblem = () => {
    alert('แจ้งปัญหา');
  };

  const handleLogin = () => {
    // แสดงหน้าสมัครสมาชิกเกษตรกร
    setShowRegistration(true);
  };

  const handleBackToMenu = () => {
    setShowRegistration(false);
  };

  // แสดงหน้าสมัครสมาชิกถ้า showRegistration เป็น true
  if (showRegistration) {
    return <FarmerRegistrationFlow 
      onBack={handleBackToMenu}
    />;
  }

  return (
    <div className="min-h-screen bg-[#4C93FF] relative overflow-hidden">

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Section with Background Image */}
        <div className="flex-1 flex items-end justify-center">
          <img 
            src="/Frame 1597884579 (1).png" 
            alt="PRECISE Platform Background" 
            className="w-full h-auto object-cover transform -translate-y-[5%]"
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
                  onClick={handleContactAdmin}
                />
                {/* เส้นขาวด้านขวา */}
                <div className="absolute top-0 right-0 w-[2px] h-full bg-white"></div>
              </div>
              
              {/* สมัครสมาชิก */}
              <div className="relative">
                <div className="transform translate-x-[20%]">
                  <MenuButton
                    icon={RegistrationIcon}
                    text="สมัครสมาชิก"
                    onClick={handleReportProblem}
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
                    onClick={handleLogin}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLineMenu;
