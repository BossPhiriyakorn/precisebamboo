// features/farmer/FarmerSidebar.tsx

import React from 'react';
import { Page, Profile } from '../../types';
import * as Icons from '../../constants';
import { ScooterIcon } from '../../constants';

interface FarmerSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

const sidebarItems = [
    { label: 'หน้าหลัก', page: Page.DASHBOARD, icon: 'line-md_home (1).png', isImage: true },
    { label: 'แปลงปลูก', page: Page.PLOT_MANAGEMENT, icon: 'Icon Menu (1).png', isImage: true },
    { label: 'สัญญา', page: Page.CONTRACT, icon: 'Icon Menu (2).png', isImage: true },
    { label: 'ตรวจสอบสถานะ', page: Page.CHECK_STATUS, icon: 'Frame 1597884474.png', isImage: true },
    { label: 'จองคิว', page: Page.BOOKING, icon: 'Icon Menu (3).png', isImage: true },
    { label: 'สถานะขนส่ง', page: Page.SHIPMENT_STATUS, icon: 'Icon Menu (4).png', isImage: true },
    { label: 'ปฎิทินการปฎิบัตร', page: Page.PRACTICE_CALENDAR, icon: 'Icon Menu (3).png', isImage: true },
];


const FarmerSidebar: React.FC<FarmerSidebarProps> = ({ isOpen, onClose, profile, onNavigate, onLogout }) => {

    const handleNavigate = (page: Page) => {
        onNavigate(page);
        onClose();
    };

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#005596] from-0% via-[#005596] via-60% to-[#009DDC] to-100% text-white w-72 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 rounded-r-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
            >
                <div className="flex flex-col h-full p-4">
                    {/* Header */}
                    <div className="flex items-center justify-center pt-8 pb-6">
                        <img 
                            src="/logo-humber2.svg" 
                            alt="Precise Logo" 
                            className="h-10 w-auto" 
                        />
                    </div>
                    <div className="w-full h-0.5 bg-white mb-4"></div>


                    {/* Profile */}
                    <button 
                        onClick={() => handleNavigate(Page.PROFILE)} 
                        className="flex items-center gap-4 py-2.8 px-2 text-left w-full hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <img src={profile.avatarUrl} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white/50 object-cover" />
                        <div>
                            <p id="sidebar-title" className="font-bold text-lg">{`${profile.firstName} ${profile.lastName}`}</p>
                        </div>
                    </button>

                    {/* Navigation */}
                    <nav className="flex-grow pt-6 pb-4 space-y-2">
                        {sidebarItems.map(item => {
                            const isPlotManagement = item.page === Page.PLOT_MANAGEMENT;
                            const isBooking = item.page === Page.BOOKING;
                            const isShipmentStatus = item.page === Page.SHIPMENT_STATUS;
                            const isDisabled = isPlotManagement || isShipmentStatus;
                            return (
                                <button
                                    key={item.page}
                                    onClick={isDisabled ? undefined : () => handleNavigate(item.page)}
                                    disabled={isDisabled}
                                    className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-lg text-left text-lg font-medium transition-colors ${
                                        isDisabled
                                            ? 'text-blue-100/50 cursor-not-allowed'
                                            : 'text-blue-100 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {item.isImage ? (
                                            <img 
                                                src={`/${item.icon}`} 
                                                alt={item.label} 
                                                className="w-8.4 h-8.4 flex-shrink-0" 
                                            />
                                        ) : (
                                            <item.icon />
                                        )}
                                        <span>{item.label}</span>
                                    </div>
                                    {isDisabled && (
                                        <span className="text-xs font-bold bg-amber-400 text-black px-2 py-0.5 rounded-full">
                                            เร็วๆ นี้
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-auto pt-4 border-t border-white/20">
                         <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left text-lg font-medium text-red-200 hover:bg-red-500/50 hover:text-white transition-colors"
                        >
                            <Icons.LogoutIcon className="w-7 h-7 flex-shrink-0" />
                            <span>ออกจากระบบ</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default FarmerSidebar;