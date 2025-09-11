// features/farmer/FarmerHeader.tsx
// คอมโพเนนต์ส่วนหัว (Header) สำหรับมุมมองเกษตรกร (ใหม่)
// มีดีไซน์พื้นหลังและแสดงชื่อของหน้าปัจจุบัน

import React from 'react';
import * as Icons from '../../constants';

// Props
interface FarmerHeaderProps {
    title: string;
    onMenuClick: () => void;
    onNotificationClick: () => void;
    onBackClick?: () => void;
}

const FarmerHeader: React.FC<FarmerHeaderProps> = ({ title, onMenuClick, onNotificationClick, onBackClick }) => {
    return (
        <div 
            className="relative h-[198px] bg-cover bg-center text-white px-4 -mt-[15px] mb-[30px]"
            style={{ backgroundImage: "url('/images/banners/ดีไซน์ที่ยังไม่ได้ตั้งชื่อ (1) 3.png')" }}
        >
            <div className="absolute inset-0 bg-[#005596]/80"></div>
            <div className="relative z-10 flex items-center h-full">
                {/* Left side: Back or Menu */}
                {onBackClick ? (
                     <button 
                        onClick={onBackClick}
                        className="p-2"
                    >
                        <Icons.ChevronLeftIcon className="w-7 h-7 text-white"/>
                    </button>
                ) : (
                    <button 
                        onClick={onMenuClick}
                        className="p-2"
                    >
                        <Icons.Bars3Icon className="w-7 h-7 text-white"/>
                    </button>
                )}
                
                {/* Center: Page Title */}
                <h1 className={`text-xl font-bold flex-1 ${onBackClick ? 'text-center -ml-4' : 'text-center'}`}>{title}</h1>
                
                {/* Right side: Notification Bell - Only show when not in back mode */}
                {!onBackClick && (
                    <div className="relative">
                        <button onClick={onNotificationClick} className="bg-white/95 p-3 rounded-full shadow-md">
                            <Icons.BellIcon className="w-6 h-6 text-slate-700" />
                        </button>
                        <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmerHeader;