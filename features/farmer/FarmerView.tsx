// features/farmer/FarmerView.tsx
// คอมโพเนนต์หลักสำหรับมุมมองของเกษตรกร (Farmer)
// ทำหน้าที่เป็น Layout หลักและจัดการ State ที่ใช้ร่วมกันระหว่างหน้าย่อยต่างๆ ของเกษตรกร

import React, { useState, useMemo } from 'react';
// FIX: Import FarmerBooking to use as a specific type for new bookings.
import { Page, UserRole, Booking, BookingStatus, Profile, FarmerBooking } from '../../types';
import * as mockData from '../../data/mockData';
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
    const [profile, setProfile] = useState<Profile>(mockData.farmerProfile); // State ข้อมูลโปรไฟล์
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [currentView, setCurrentView] = useState<'main' | 'registration'>('main');
    const [isEditMode, setIsEditMode] = useState(false);


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
        </div>
    );
};

export default FarmerView;