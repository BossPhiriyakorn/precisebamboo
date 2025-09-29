// features/farmer/FarmerView.tsx
// คอมโพเนนต์หลักสำหรับมุมมองของเกษตรกร (Farmer)
// ทำหน้าที่เป็น Layout หลักและจัดการ State ที่ใช้ร่วมกันระหว่างหน้าย่อยต่างๆ ของเกษตรกร

import React, { useState, useMemo, useEffect } from 'react';
// FIX: Import FarmerBooking to use as a specific type for new bookings.
import { Page, UserRole, Booking, BookingStatus, Profile, FarmerBooking, FarmerStatus, RegistrationStatus, PromoterStatus } from '../../types';
import * as mockData from '../../data/mockData';
import { getApprovedFarmer, saveFarmerRegistration, updateFarmerData, clearAllFarmerData, debugFarmerStorage } from '../../utils/farmerStorage';
import KnowledgeBasePage from '../../components/KnowledgeBasePage';
import FarmerDashboard from './FarmerDashboard';
import FarmerProfilePage from './FarmerProfilePage';
import FarmerBookingPage from './FarmerBookingPage';
import FinanceLogisticsPage from './FinanceLogisticsPage';
import FarmerHeader from './FarmerHeader';
import PlotManagementPage from './PlotManagementPage';
import Card from '../../components/Card';
import FarmerSidebar from './FarmerSidebar';
import NotificationSidebar from '../../components/NotificationSidebar';
import CheckStatusPage from './CheckStatusPage';
import FarmerRegistrationFlow from './registration/FarmerRegistrationFlow';
import ContractPage from './ContractPage';
import ShipmentStatusPage from './ShipmentStatusPage';
import PracticeCalendarPage from './PracticeCalendarPage';
import PracticeCalendarEnhanced from './PracticeCalendarEnhanced';


// Props ที่คอมโพเนนต์นี้ต้องการ
interface FarmerViewProps {
    onLogout: () => void; // ฟังก์ชันสำหรับ Logout
}

const FarmerView: React.FC<FarmerViewProps> = ({ onLogout }) => {
    // =================================================================
    // State Management
    // =================================================================
    const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD); // State สำหรับหน้าที่กำลังแสดงผล
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null); // ID ของบทความที่เลือก (สำหรับหน้าคลังความรู้)
    const [bookings, setBookings] = useState<Booking[]>(mockData.farmerBookings); // State สำหรับรายการจองคิว
    // ฟังก์ชันสำหรับสร้าง Profile ตามสถานะ
    const createProfileWithStatus = (farmerData: any, isDeveloperMode: boolean = false): Profile => {
        console.log('Creating profile with status:', { farmerData, isDeveloperMode });
        
        if (isDeveloperMode) {
            // โหมดนักพัฒนา - ใช้ mockData และแสดงข้อมูลทั้งหมด
            console.log('Using developer mode profile');
            return {
                ...mockData.developerProfile,
                id: farmerData?.id || 'dev-farmer-1',
                firstName: farmerData?.firstName || mockData.developerProfile.firstName,
                lastName: farmerData?.lastName || mockData.developerProfile.lastName,
                phone: farmerData?.phone || mockData.developerProfile.phone,
                email: farmerData?.email || mockData.developerProfile.email,
            };
        }

        if (farmerData) {
            // ข้อมูลจริง - ตรวจสอบสถานะการลงทะเบียน
            console.log('Using real farmer data:', farmerData);
            const hasSubmittedDocs = farmerData.hasSubmittedDocuments || false;
            const promoterStatus = farmerData.promoterStatus || PromoterStatus.NOT_ASSIGNED;
            
            const profile = {
                id: farmerData.id,
                firstName: farmerData.firstName,
                lastName: farmerData.lastName,
                phone: farmerData.phone,
                email: farmerData.email || '',
                address: hasSubmittedDocs ? farmerData.address : { 
                    province: '', district: '', subdistrict: '', postalCode: '', 
                    moo: '', street: '', soi: '', fullAddressText: '' 
                },
                status: FarmerStatus.APPROVED,
                promoterInfo: promoterStatus === PromoterStatus.CONFIRMED ? farmerData.promoterInfo : undefined,
                registrationStatus: hasSubmittedDocs ? RegistrationStatus.DOCUMENTS_SUBMITTED : RegistrationStatus.REGISTERED,
                promoterStatus: promoterStatus,
                hasSubmittedDocuments: hasSubmittedDocs,
                isDeveloperMode: false
            };
            
            console.log('Created profile from farmer data:', profile);
            return profile;
        }

        // Fallback - ใช้ unregisteredProfile
        console.log('Using unregistered profile fallback');
        return mockData.unregisteredProfile;
    };

    // ใช้ข้อมูลจริงจาก farmerStorage แทน mockData
    const [profile, setProfile] = useState<Profile>(() => {
        const farmerData = getApprovedFarmer();
        const isDeveloperMode = !farmerData; // ถ้าไม่มีข้อมูล = โหมดนักพัฒนา
        
        return createProfileWithStatus(farmerData, isDeveloperMode);
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [currentView, setCurrentView] = useState<'main' | 'registration'>('main');
    const [isEditMode, setIsEditMode] = useState(false);

    // =================================================================
    // Effects
    // =================================================================
    
    // อัปเดตข้อมูลโปรไฟล์เมื่อมีการเปลี่ยนแปลงใน farmerStorage
    useEffect(() => {
        const farmerData = getApprovedFarmer();
        const isDeveloperMode = !farmerData;
        setProfile(createProfileWithStatus(farmerData, isDeveloperMode));
    }, []);

    // ฟังก์ชันสำหรับรีเฟรชข้อมูลโปรไฟล์
    const refreshProfile = () => {
        console.log('Refreshing profile...');
        const farmerData = getApprovedFarmer();
        const isDeveloperMode = !farmerData;
        const newProfile = createProfileWithStatus(farmerData, isDeveloperMode);
        
        console.log('New profile data:', newProfile);
        setProfile(newProfile);
    };

    // ฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงใน localStorage
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'farmer_registrations') {
                console.log('Farmer registration data changed, refreshing profile...');
                refreshProfile();
            }
        };

        const handleRegistrationUpdate = () => {
            console.log('Farmer registration updated event received, refreshing profile...');
            refreshProfile();
        };

        // ฟังการเปลี่ยนแปลงใน localStorage
        window.addEventListener('storage', handleStorageChange);
        
        // ฟัง custom event สำหรับการอัปเดตข้อมูล
        window.addEventListener('farmerRegistrationUpdated', handleRegistrationUpdate);
        
        // ฟังการเปลี่ยนแปลงในหน้าต่างเดียวกัน (สำหรับกรณีที่บันทึกข้อมูลใน tab เดียวกัน)
        const interval = setInterval(() => {
            const currentFarmerData = getApprovedFarmer();
            const currentProfile = profile;
            
            // ตรวจสอบว่าข้อมูลเปลี่ยนแปลงหรือไม่
            if (currentFarmerData && currentProfile.id !== currentFarmerData.id) {
                console.log('Profile data mismatch detected, refreshing...');
                refreshProfile();
            }
        }, 1000); // ตรวจสอบทุก 1 วินาที

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('farmerRegistrationUpdated', handleRegistrationUpdate);
            clearInterval(interval);
        };
    }, [profile.id]);

    // =================================================================
    // Handlers
    // =================================================================
    
    // จัดการการคลิกเมนู
    const handleNavClick = (page: Page) => {
        // Prevent navigation to plot management for now
        if (page === Page.PLOT_MANAGEMENT) {
            return;
        }
        setSelectedArticleId(null); // เคลียร์บทความที่เลือกเมื่อเปลี่ยนหน้า
        setActivePage(page);
        setIsSidebarOpen(false); // Close sidebar on navigation
    };

    // จัดการเมื่อเลือกบทความจากหน้าอื่น (เช่น Dashboard)
    const handleSelectArticle = (articleId: string) => {
        setSelectedArticleId(articleId);
        setActivePage(Page.KNOWLEDGE); // เปลี่ยนไปหน้าคลังความรู้
    };

    // จัดการเมื่อมีการเพิ่มการจองใหม่
    const handleAddBooking = (newBookingData: Partial<Booking>) => {
        // FIX: Explicitly type as FarmerBooking as this view only creates bookings for farmers.
        // This resolves a TypeScript error where the compiler gets confused by the Booking union type.
        const newBooking: FarmerBooking = {
            id: `b${bookings.length + 1}-${Date.now()}`, // สร้าง ID ที่ไม่ซ้ำกัน
            status: BookingStatus.PENDING,
            userName: `${profile.firstName} ${profile.lastName}`,
            // Spread the detailed data from the new modal
            ...newBookingData,
            // Ensure essential fields have defaults if not provided
            date: newBookingData.date || new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace('พ.ศ. ',''),
            description: newBookingData.description || 'ไม่มีรายละเอียด',
            // FIX: Override userType after the spread to ensure it's always FARMER for this view.
            userType: UserRole.FARMER,
        };
        // เพิ่มการจองใหม่เข้าไปใน State โดยให้แสดงผลบนสุด
        setBookings(prevBookings => [newBooking, ...prevBookings]);
    };
    
    // จัดการการอัปเดตโปรไฟล์
    const handleUpdateProfile = (updatedProfile: Profile) => {
        setProfile(updatedProfile);
        
        // อัปเดตข้อมูลใน farmerStorage ด้วย
        const farmerData = getApprovedFarmer();
        if (farmerData) {
            const updatedData = {
                firstName: updatedProfile.firstName,
                lastName: updatedProfile.lastName,
                phone: updatedProfile.phone,
                email: updatedProfile.email
            };
            
            // ใช้ฟังก์ชัน updateFarmerData
            updateFarmerData(farmerData.id, updatedData);
        }
    };

    const handleStartRegistration = () => {
        setIsEditMode(false);
        setCurrentView('registration');
    };

    const handleStartEditRegistration = () => {
        setIsEditMode(true);
        setCurrentView('registration');
    };
    
    const handleBackToMain = () => {
        setCurrentView('main');
        setIsEditMode(false);
    };

    const handleSubmitSuccess = () => {
        setCurrentView('main');
        setIsEditMode(false);
        setActivePage(Page.CHECK_STATUS); 
        // In a real app, you might show a success toast here.
    };

    // ฟังก์ชันสำหรับ debug และรีเซ็ตข้อมูล
    const handleDebugStorage = () => {
        debugFarmerStorage();
    };

    const handleClearStorage = () => {
        clearAllFarmerData();
        refreshProfile();
        alert('ข้อมูลถูกล้างแล้ว');
    };

    if (currentView === 'registration') {
        return <FarmerRegistrationFlow 
                    onBackToDashboard={handleBackToMain} 
                    onSubmitSuccess={handleSubmitSuccess}
                    isEditMode={isEditMode}
                />;
    }

    // =================================================================
    // Render Logic
    // =================================================================
    
    const PlaceholderPage: React.FC<{title: string}> = ({title}) => (
        <Card className="text-center p-16">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="mt-4 text-slate-600">หน้านี้อยู่ในระหว่างการพัฒนา</p>
        </Card>
    );

    const renderPageContent = () => {
        switch(activePage) {
            case Page.DASHBOARD:
                return <FarmerDashboard onMenuClick={() => setIsSidebarOpen(true)} onNotificationClick={() => setNotificationOpen(true)} onNavigate={handleNavClick} onStartRegistration={handleStartRegistration} />;
            case Page.PLOT_MANAGEMENT:
                return <PlaceholderPage title="จัดการแปลงปลูก" />;
            case Page.PROFILE: 
                return <FarmerProfilePage 
                    profile={profile} 
                    onUpdateProfile={handleUpdateProfile}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onNotificationClick={() => setNotificationOpen(true)}
                />;
            case Page.BOOKING: 
                return <FarmerBookingPage 
                    bookings={bookings} 
                    onAddBooking={handleAddBooking} 
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onNotificationClick={() => setNotificationOpen(true)}
                />;
            case Page.FINANCE: return <FinanceLogisticsPage shipments={mockData.farmerShipments} payments={mockData.farmerPayments} />;
            case Page.KNOWLEDGE: 
                return <KnowledgeBasePage 
                            articles={mockData.knowledgeArticles.filter(a => a.status === 'เผยแพร่แล้ว')}
                            initialSelectedArticleId={selectedArticleId}
                            onClearSelection={() => setSelectedArticleId(null)}
                        />;
            case Page.CONTRACT:
                return <ContractPage
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onNotificationClick={() => setNotificationOpen(true)}
                />;
            case Page.CHECK_STATUS:
                return <CheckStatusPage 
                    onMenuClick={() => setIsSidebarOpen(true)} 
                    onNotificationClick={() => setNotificationOpen(true)} 
                    onStartEdit={handleStartEditRegistration}
                />;
            case Page.SHIPMENT_STATUS:
                return <ShipmentStatusPage 
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onNotificationClick={() => setNotificationOpen(true)}
                />;
            case Page.PRACTICE_CALENDAR:
                return <PracticeCalendarPage 
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onNotificationClick={() => setNotificationOpen(true)}
                />;
            default: 
                return <FarmerDashboard onMenuClick={() => setIsSidebarOpen(true)} onNotificationClick={() => setNotificationOpen(true)} onNavigate={handleNavClick} onStartRegistration={handleStartRegistration} />;
        }
    }
    
    const isDashboard = activePage === Page.DASHBOARD;
    const isProfilePage = activePage === Page.PROFILE;
    const isCheckStatusPage = activePage === Page.CHECK_STATUS;
    const isKnowledgePage = activePage === Page.KNOWLEDGE;
    const isContractPage = activePage === Page.CONTRACT;
    const isBookingPage = activePage === Page.BOOKING;
    const isShipmentStatusPage = activePage === Page.SHIPMENT_STATUS;
    const isPracticeCalendarPage = activePage === Page.PRACTICE_CALENDAR;

    // The main content is now rendered conditionally inside the main layout
    const mainContent = renderPageContent();

    return (
        <div className="bg-[#F0F5F9]">
            <FarmerSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                profile={profile}
                onNavigate={handleNavClick}
                onLogout={onLogout}
            />
            
            <NotificationSidebar
                isOpen={isNotificationOpen}
                onClose={() => setNotificationOpen(false)}
                notifications={mockData.mockSimpleNotifications}
            />
            
            {/* Conditional rendering for different page layouts */}
            {isDashboard && mainContent}
            {isProfilePage && mainContent}
            {isCheckStatusPage && mainContent}
            {isContractPage && mainContent}
            {isBookingPage && mainContent}
            {isShipmentStatusPage && mainContent}
            
            {!isDashboard && !isProfilePage && !isCheckStatusPage && !isContractPage && !isBookingPage && !isShipmentStatusPage && (
                <div>
                    <FarmerHeader 
                        title={activePage}
                        onMenuClick={() => setIsSidebarOpen(true)}
                        onNotificationClick={() => setNotificationOpen(true)}
                        onBackClick={isKnowledgePage ? () => handleNavClick(Page.DASHBOARD) : undefined}
                    />
                    <main className="container mx-auto -mt-16 relative z-10">
                        {mainContent}
                    </main>
                </div>
            )}
            
            {/* Debug buttons - แสดงเฉพาะใน development mode */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 space-x-2 z-50">
                    <button
                        onClick={handleDebugStorage}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                        Debug Storage
                    </button>
                    <button
                        onClick={handleClearStorage}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                        Clear Storage
                    </button>
                    <button
                        onClick={refreshProfile}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                        Refresh Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default FarmerView;