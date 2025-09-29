// features/farmer/FarmerProfilePage.tsx
// คอมโพเนนต์สำหรับหน้าโปรไฟล์ของเกษตรกร (ดีไซน์ใหม่)

import React, { useState } from 'react';
import { Profile, PromoterInfo, FarmerStatus, Page, RegistrationStatus, PromoterStatus } from '../../types';
import * as Icons from '../../constants';
import ProfileEditModal from './ProfileEditModal';
import FarmerHeader from './FarmerHeader';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface FarmerProfilePageProps {
    profile: Profile;
    onUpdateProfile: (updatedProfile: Profile) => void;
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

// Helper: คอมโพเนนต์สำหรับการ์ดแสดงข้อมูล
const InfoCard: React.FC<{
    title: string;
    children: React.ReactNode;
    statusElement?: React.ReactNode;
}> = ({ title, children, statusElement }) => (
    <div className="relative">
        <div className="absolute left-6 -top-5">
            <div className="bg-[#003A70] text-white font-bold py-2 px-6 rounded-full shadow-md">
                {title}
            </div>
        </div>
        {statusElement}
        <div className="bg-white rounded-2xl shadow-lg p-6 pt-10 space-y-5">
            {children}
        </div>
    </div>
);

// Helper: คอมโพเนนต์สำหรับแสดงข้อมูลแต่ละรายการ (ไอคอน, หัวข้อ, ข้อมูล)
const InfoItem: React.FC<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: string | undefined;
    className?: string;
}> = ({ icon: Icon, label, value, className }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#005596' }} />
        <div>
            <p className="text-sm text-slate-500" style={{ fontFamily: 'Kanit', fontWeight: 200 }}>{label}</p>
            <p className={`text-xs ${className || ''}`} style={{ fontFamily: 'Kanit', color: '#1F1F1F', fontWeight: 200 }}>{value || '-'}</p>
        </div>
    </div>
);


// ฟังก์ชันสำหรับตรวจสอบว่าควรแสดงข้อมูลที่อยู่หรือไม่
const shouldShowAddress = (profile: Profile): boolean => {
    return profile.isDeveloperMode || 
           profile.hasSubmittedDocuments || 
           profile.registrationStatus === RegistrationStatus.DOCUMENTS_SUBMITTED;
};

// ฟังก์ชันสำหรับตรวจสอบว่าควรแสดงข้อมูลนักส่งเสริมหรือไม่
const shouldShowPromoter = (profile: Profile): boolean => {
    return profile.isDeveloperMode || 
           profile.promoterStatus === PromoterStatus.CONFIRMED;
};

const FarmerProfilePage: React.FC<FarmerProfilePageProps> = ({ profile, onUpdateProfile, onMenuClick, onNotificationClick }) => {
    // State สำหรับควบคุมการเปิด/ปิด Modal แก้ไขโปรไฟล์
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    // ฟังก์ชันสำหรับจัดการเมื่อบันทึกข้อมูลที่แก้ไข
    const handleSaveProfile = (updatedProfile: Profile) => {
        onUpdateProfile(updatedProfile);
        setEditModalOpen(false);
    };

    // Helper function to determine status color
    const getStatusColor = (status: FarmerStatus) => {
        switch (status) {
            case FarmerStatus.APPROVED:
                return 'text-green-500';
            case FarmerStatus.PENDING:
                return 'text-yellow-500';
            case FarmerStatus.REJECTED:
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const statusElement = (
        <div className="absolute top-6 right-6 text-sm">
            <span className="font-bold text-slate-800">สถานะ : </span>
            <span className={`font-bold ${getStatusColor(profile.status)}`}>
                {profile.status}
            </span>
        </div>
    );

    return (
        <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #D7EDFD 40%, #005596 60%)' }}>
            <FarmerHeader 
                title={Page.PROFILE}
                onMenuClick={onMenuClick}
                onNotificationClick={onNotificationClick}
            />
            
            {/* Background Image */}
            <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none h-64">
                <img 
                    src="/Group-bg.png" 
                    alt="Background" 
                    className="w-full h-auto object-contain object-bottom"
                />
            </div>

            {/* Profile Picture */}
            <div className="absolute top-[119px] left-1/2 -translate-x-1/2 z-20">
                <div className="relative">
                    <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                         <img src={profile.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <button
                        onClick={() => setEditModalOpen(true)}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#005A9C] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-blue-800 transition-colors"
                        aria-label="แก้ไขโปรไฟล์"
                    >
                        <Icons.PencilIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Main Content */}
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 mt-3.5 relative z-10">
                <div className="mt-12 space-y-10 max-w-lg mx-auto">
                    {/* Personal Info Card */}
                    <InfoCard title="ข้อมูลส่วนตัว" statusElement={statusElement}>
                        <InfoItem 
                            icon={Icons.UserOutlineIcon}
                            label="ชื่อ นามสกุล"
                            value={`นาย${profile.firstName} ${profile.lastName}`}
                        />
                         <InfoItem 
                            icon={Icons.PhoneOutlineIcon}
                            label="เบอร์โทรศัพท์"
                            value={profile.phone}
                        />
                        {/* แสดงที่อยู่ตามเงื่อนไข */}
                        {shouldShowAddress(profile) ? (
                            <InfoItem 
                                icon={Icons.MapPinIcon}
                                label="ที่อยู่"
                                value={profile.address.fullAddressText || 'ยังไม่มีข้อมูลที่อยู่'}
                            />
                        ) : (
                            <InfoItem 
                                icon={Icons.MapPinIcon}
                                label="ที่อยู่"
                                value="ข้อมูลจะแสดงหลังจากลงทะเบียนและส่งเอกสาร"
                                className="text-gray-500 italic"
                            />
                        )}
                         <InfoItem 
                            icon={Icons.MailOutlineIcon}
                            label="อีเมล"
                            value={profile.email}
                        />
                    </InfoCard>

                    {/* Promoter Info Card - แสดงตามเงื่อนไข */}
                    {shouldShowPromoter(profile) ? (
                        <InfoCard title="ข้อมูลนักส่งเสริม">
                            {profile.promoterInfo ? (
                                <>
                                    <InfoItem 
                                        icon={Icons.UserOutlineIcon}
                                        label="ชื่อ นามสกุล"
                                        value={profile.promoterInfo.name}
                                    />
                                    <InfoItem 
                                        icon={Icons.PhoneOutlineIcon}
                                        label="เบอร์โทรศัพท์"
                                        value={profile.promoterInfo.phone}
                                    />
                                    <InfoItem 
                                        icon={Icons.MailOutlineIcon}
                                        label="อีเมล"
                                        value={profile.promoterInfo.email}
                                    />
                                </>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    <Icons.UserOutlineIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    <p>ยังไม่มีนักส่งเสริมดูแล</p>
                                    <p className="text-sm">ข้อมูลจะแสดงเมื่อมีนักส่งเสริมยืนยันการดูแล</p>
                                </div>
                            )}
                        </InfoCard>
                    ) : (
                        <InfoCard title="ข้อมูลนักส่งเสริม">
                            <div className="text-center py-4 text-gray-500">
                                <Icons.UserOutlineIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>ข้อมูลจะแสดงเมื่อมีนักส่งเสริมยืนยันการดูแล</p>
                            </div>
                        </InfoCard>
                    )}
                </div>
            </main>

            
             {/* Modal สำหรับแก้ไขโปรไฟล์ */}
            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                profile={profile}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

export default FarmerProfilePage;