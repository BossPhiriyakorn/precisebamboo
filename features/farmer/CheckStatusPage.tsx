// features/farmer/CheckStatusPage.tsx
// คอมโพเนนต์สำหรับหน้าตรวจสอบสถานะของเกษตรกร

import React, { useState } from 'react';
import { RegistrationStatusItem, RegistrationStatusType, Page } from '../../types';
import { mockRegistrationStatuses } from '../../data/mockData';
import * as Icons from '../../constants';
import FarmerHeader from './FarmerHeader';

// Props
interface CheckStatusPageProps {
    onMenuClick: () => void;
    onNotificationClick: () => void;
    onStartEdit: () => void;
}

// === ส่วนแสดงรายละเอียดสถานะ (FS-2, FS-3, FS-4) ===
const StatusDetailView: React.FC<{ 
    statusItem: RegistrationStatusItem; 
    onBack: () => void; 
    onStartEdit: () => void;
}> = ({ statusItem, onBack, onStartEdit }) => {

    const getStatusStyles = (status: RegistrationStatusType) => {
        switch (status) {
            case RegistrationStatusType.APPROVED: return { text: 'text-[#53B847]', label: 'อนุมัติ' };
            case RegistrationStatusType.PENDING: return { text: 'text-[#E87D1E]', label: 'รออนุมัติ' };
            case RegistrationStatusType.REJECTED: return { text: 'text-[#EA2027]', label: 'ไม่อนุมัติ' };
        }
    };
    const statusStyle = getStatusStyles(statusItem.status);
    const { personalInfo, plotInfo, promoterInfo } = statusItem.details;

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#005596] mb-4">ข้อมูลการลงทะเบียน</h2>

            <div className="space-y-6">
                 {/* Promoter Info - Show only for approved status */}
                {statusItem.status === RegistrationStatusType.APPROVED && (
                     <div className="bg-gradient-to-b from-[#01AAE7] to-[#005596] text-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">ข้อมูลนักส่งเสริม</h2>
                        <div className="space-y-2 text-sm font-bold">
                            <p><strong>ชื่อ-สกุล :</strong> <span className="font-thin">{promoterInfo.name}</span></p>
                            <p><strong>เบอร์โทร :</strong> <span className="font-thin">{promoterInfo.phone}</span></p>
                            <p><strong>อีเมล :</strong> <span className="font-thin">{promoterInfo.email}</span></p>
                        </div>
                    </div>
                )}

                {/* Personal Info & Plot Info Combined */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative">
                    <div className="absolute top-5 right-5 text-right">
                        <span className="text-sm text-slate-600">สถานะ :</span>
                        <span className={`font-bold ml-1 ${statusStyle.text}`}>{statusStyle.label}</span>
                    </div>
                    
                    {/* Personal Info Section */}
                    <h2 className="text-lg font-bold text-slate-800 mb-4">ข้อมูลส่วนตัว</h2>
                    <div className="space-y-2 text-base font-bold" style={{ color: 'rgba(0, 3, 4, 0.6)', marginBottom: '10px' }}>
                        <p><strong>ชื่อ-สกุล :</strong> <span className="font-thin">{`${personalInfo.firstName} ${personalInfo.lastName}`}</span></p>
                        <p><strong>เบอร์โทร :</strong> <span className="font-thin">{personalInfo.phone}</span></p>
                        <p><strong>อีเมล :</strong> <span className="font-thin">{personalInfo.email}</span></p>
                        <p><strong>ที่อยู่ :</strong> <span className="font-thin">{personalInfo.address.fullAddressText}</span></p>
                    </div>

                    {/* Divider Line */}
                    <div className="border-t border-slate-200" style={{ marginBottom: '10px' }}></div>

                    {/* Plot Info Section */}
                    <h2 className="text-lg font-bold text-slate-800 mb-4">ข้อมูลแปลงปลูก</h2>
                    <div className="space-y-2 text-base font-bold" style={{ color: 'rgba(0, 3, 4, 0.6)' }}>
                        <p><strong>พื้นที่ทั้งหมด :</strong> <span className="font-thin">{plotInfo.totalArea}</span></p>
                        <p><strong>จำนวนต้นไผ่ :</strong> <span className="font-thin">{plotInfo.bambooCount.toLocaleString()} ต้น</span></p>
                        <p><strong>แหล่งน้ำ :</strong> <span className="font-thin">{plotInfo.waterSource}</span></p>
                    </div>

                    {/* Rejection reason - Show only for rejected status */}
                    {statusItem.status === RegistrationStatusType.REJECTED && (
                        <div className="px-0 py-4">
                            <p className="text-[#EA2027] font-bold">*หมายเหตุ* {statusItem.rejectionReason}</p>
                        </div>
                    )}
                </div>

                {/* Edit button - Show only for rejected status */}
                {statusItem.status === RegistrationStatusType.REJECTED && (
                    <button 
                        onClick={onStartEdit}
                        className="w-full bg-[#53B847] hover:bg-[#53B847]/90 text-white font-bold py-3 rounded-[7px] shadow-md transition-colors"
                    >
                        แก้ไขข้อมูล
                    </button>
                )}
            </div>
        </div>
    );
};

// === ส่วนแสดงรายการสถานะ (FS-1) - Restyled ===
const StatusListView: React.FC<{ 
    onSelectStatus: (item: RegistrationStatusItem) => void;
}> = ({ onSelectStatus }) => {
    
     const getStatusStyles = (status: RegistrationStatusType) => {
        switch (status) {
            case RegistrationStatusType.APPROVED: return { text: 'text-[#53B847]' };
            case RegistrationStatusType.PENDING: return { text: 'text-[#E87D1E]' };
            case RegistrationStatusType.REJECTED: return { text: 'text-[#EA2027]' };
        }
    };

    return (
        <div className="space-y-4">
            {mockRegistrationStatuses.map(item => (
                <button 
                    key={item.id} 
                    onClick={() => onSelectStatus(item)}
                    className="w-full text-left bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-100"
                >
                    <div className="flex-grow">
                        <h2 className="text-base font-semibold" style={{ color: 'rgba(0, 3, 4, 0.6)' }}>{item.title}</h2>
                    </div>
                    <div className="flex items-center gap-5 ml-4">
                        <div className="text-right flex-shrink-0">
                            <span className={`font-bold text-base ${getStatusStyles(item.status).text}`}>
                                {item.status}
                            </span>
                            <p className="text-sm text-slate-500 mt-1">{item.date}</p>
                        </div>
                        <Icons.ChevronRightIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />
                    </div>
                </button>
            ))}
        </div>
    );
};

// === คอมโพเนนต์หลักของหน้า ===
const CheckStatusPage: React.FC<CheckStatusPageProps> = ({ onMenuClick, onNotificationClick, onStartEdit }) => {
    const [selectedStatus, setSelectedStatus] = useState<RegistrationStatusItem | null>(null);

    return (
        <div className={`relative min-h-screen overflow-x-hidden ${selectedStatus ? 'bg-white' : 'bg-[#005596]'}`}>
            <FarmerHeader 
                title={Page.CHECK_STATUS}
                onMenuClick={onMenuClick}
                onNotificationClick={onNotificationClick}
                onBackClick={selectedStatus ? () => setSelectedStatus(null) : undefined}
            />
            
            {/* Background Image */}
            <div className={`absolute bottom-0 left-0 w-full z-0 pointer-events-none ${selectedStatus ? 'h-auto' : 'h-64'}`}>
                <img 
                    src="/Group-bg.png" 
                    alt="Background" 
                    className={`w-full ${selectedStatus ? 'h-auto' : 'h-auto'} object-contain object-bottom`}
                />
            </div>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 mt-3.5 relative z-10">
                {selectedStatus 
                    ? <StatusDetailView statusItem={selectedStatus} onBack={() => setSelectedStatus(null)} onStartEdit={onStartEdit} />
                    : <StatusListView onSelectStatus={setSelectedStatus} />
                }
            </main>
        </div>
    );
};

export default CheckStatusPage;