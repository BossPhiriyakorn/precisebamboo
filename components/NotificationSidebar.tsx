// components/NotificationSidebar.tsx
// คอมโพเนนต์สำหรับหน้าต่างแจ้งเตือน (Notification) ในรูปแบบ Modal ที่แสดงผลตรงกลาง

import React from 'react';
import { SimpleNotification } from '../types';
import { XMarkIcon } from '../constants';

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SimpleNotification[];
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isOpen, onClose, notifications }) => {
    // แยกประเภทการแจ้งเตือนเป็น "ล่าสุด" และ "ก่อนหน้านี้"
    const latestNotifications = notifications.filter(n => n.isLatest);
    const previousNotifications = notifications.filter(n => !n.isLatest);

    // ไม่ต้อง render อะไรเลยถ้า Modal ไม่ได้เปิด
    if (!isOpen) {
        return null;
    }

    return (
        // Full screen overlay
        <div
            className="fixed inset-0 bg-white z-[60] transition-opacity duration-300"
            role="dialog"
            aria-modal="true"
        >
            {/* Full screen container */}
            <div
                className="bg-white text-slate-800 w-full h-full flex flex-col"
            >
                {/* ส่วนหัวของ Full Screen */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0 bg-white">
                    <h2 className="text-2xl font-bold text-slate-800">การแจ้งเตือน</h2>
                    <button onClick={onClose} className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                        <XMarkIcon className="w-7 h-7 text-slate-600" />
                    </button>
                </div>

                {/* เนื้อหาการแจ้งเตือน (สามารถเลื่อนได้) - Full Screen */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50">
                    {/* ส่วน "ล่าสุด" */}
                    {latestNotifications.length > 0 && (
                        <section>
                            <h3 className="font-bold text-xl mb-4 text-slate-700 px-2">ล่าสุด</h3>
                            <div className="space-y-4">
                                {latestNotifications.map(n => (
                                    <div key={n.id} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                                        <p className="text-base text-slate-700 leading-relaxed">{n.message}</p>
                                        <p className="text-sm text-slate-500 text-right mt-3 font-medium">{n.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ส่วน "ก่อนหน้านี้" */}
                    {previousNotifications.length > 0 && (
                        <section>
                            <h3 className="font-bold text-xl mb-4 text-slate-700 px-2">ก่อนหน้านี้</h3>
                            <div className="space-y-4">
                                {previousNotifications.map(n => (
                                    <div key={n.id} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-gray-400 hover:shadow-lg transition-shadow">
                                        <p className="text-base text-slate-700 leading-relaxed">{n.message}</p>
                                        <p className="text-sm text-slate-500 text-right mt-3 font-medium">{n.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* กรณีไม่มีการแจ้งเตือน */}
                    {notifications.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            <div className="text-6xl mb-4">🔔</div>
                            <p className="text-xl">ไม่มีการแจ้งเตือน</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationSidebar;