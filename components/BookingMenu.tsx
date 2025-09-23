// components/BookingMenu.tsx
// คอมโพเนนต์เมนูจองคิวแบบ vertical list ตามตัวอย่างที่แสดง

import React from 'react';
import * as Icons from '../constants';

// Props สำหรับคอมโพเนนต์
interface BookingMenuProps {
    onMenuClick: (type: string, title: string) => void;
}

// ข้อมูลเมนูจองคิว
const BOOKING_MENU_ITEMS = [
    {
        id: 'appointment-list',
        title: 'รายการนัดหมาย',
        icon: Icons.AppointmentListIconNew,
        gradient: 'from-blue-400 to-blue-600',
        alignIcon: 'left' as const
    },
    {
        id: 'seedling-queue',
        title: 'จองคิวรับกล้าพันธุ์',
        icon: Icons.SeedlingQueueIconNew,
        gradient: 'from-blue-500 to-blue-700',
        alignIcon: 'right' as const
    },
    {
        id: 'cutting-queue',
        title: 'จองคิวการตัดไผ่',
        icon: Icons.CuttingQueueIconNew,
        gradient: 'from-blue-600 to-blue-800',
        alignIcon: 'left' as const
    },
    {
        id: 'contract-queue',
        title: 'จองคิวทำสัญญา',
        icon: Icons.ContractQueueIconNew,
        gradient: 'from-blue-700 to-blue-900',
        alignIcon: 'right' as const
    }
];

// คอมโพเนนต์ปุ่มเมนูแต่ละตัว
const MenuButton: React.FC<{
    item: typeof BOOKING_MENU_ITEMS[0];
    onClick: () => void;
}> = ({ item, onClick }) => {
    const Icon = item.icon;
    
    const iconElement = (
        <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <Icon className="w-10 h-10 text-white" />
        </div>
    );
    
    return (
        <button
            onClick={onClick}
            className={`w-full bg-gradient-to-r ${item.gradient} text-white rounded-2xl p-6 flex items-center justify-between shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform`}
        >
            {item.alignIcon === 'left' && iconElement}
            <span className={`text-2xl font-bold ${item.alignIcon === 'left' ? 'text-right' : 'text-left'}`}>
                {item.title}
            </span>
            {item.alignIcon === 'right' && iconElement}
        </button>
    );
};

// คอมโพเนนต์หลัก
const BookingMenu: React.FC<BookingMenuProps> = ({ onMenuClick }) => {
    const handleMenuClick = (item: typeof BOOKING_MENU_ITEMS[0]) => {
        onMenuClick(item.id, item.title);
    };

    return (
        <div className="space-y-4">
            {BOOKING_MENU_ITEMS.map((item) => (
                <MenuButton
                    key={item.id}
                    item={item}
                    onClick={() => handleMenuClick(item)}
                />
            ))}
        </div>
    );
};

export default BookingMenu;
