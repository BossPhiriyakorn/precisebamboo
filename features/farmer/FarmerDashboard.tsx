// features/farmer/FarmerDashboard.tsx
// คอมโพเนนต์สำหรับหน้าแดชบอร์ดของเกษตรกร (โฉมใหม่)

import React, { useState } from 'react';
import { KnowledgeArticle, KnowledgeArticleStatus, Page, RegistrationStatusType } from '../../types';
import * as Icons from '../../constants';
import * as mockData from '../../data/mockData';

// =================================================================
// Sub-components for the new Dashboard
// =================================================================

interface FarmerDashboardProps {
    onMenuClick: () => void;
    onNotificationClick: () => void;
    onNavigate: (page: Page) => void;
    onStartRegistration: () => void;
}

const DashboardHeader: React.FC<{ onMenuClick: () => void; onNotificationClick: () => void; }> = ({ onMenuClick, onNotificationClick }) => {
    return (
        <div 
            className="relative bg-cover bg-center rounded-b-3xl text-white px-4 flex flex-col justify-start"
            style={{ 
                height: '182px',
                paddingTop: '40px',
                backgroundImage: "linear-gradient(rgba(0, 85, 150, 0.8), rgba(0, 85, 150, 0.8)), url('/images/banners/ดีไซน์ที่ยังไม่ได้ตั้งชื่อ (1) 3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div className="absolute inset-0 bg-[#005596]/20 rounded-b-3xl"></div>
            <div className="relative z-10 flex items-center justify-between">
                <button onClick={onMenuClick} className="p-2">
                    <Icons.Bars3Icon className="w-7 h-7" />
                </button>
                <div className="text-center -mt-1">
                    <p className="text-xs text-white/80">Your location</p>
                    <p className="font-bold flex items-center gap-1">
                        <Icons.MapPinIcon className="w-4 h-4 text-orange-400" />
                        Gampaha, Sri Lanka
                    </p>
                </div>
                <div className="relative">
                    <button onClick={onNotificationClick} className="bg-white/95 p-3 rounded-full shadow-md">
                        <Icons.BellIcon className="w-6 h-6 text-slate-700" />
                    </button>
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                </div>
            </div>
        </div>
    );
};


const WeatherCard = () => (
    <div className="bg-white rounded-2xl shadow-lg p-4 mx-4 -mt-12 relative z-20 flex justify-between items-center" style={{ marginBottom: '28px' }}>
        <div>
            <p className="text-5xl font-bold text-slate-800">23°C</p>
            <p className="text-slate-600 font-semibold">Gampaha ,Sri Lanka</p>
        </div>
        <Icons.CloudLightningIcon className="w-20 h-20 text-yellow-400" />
    </div>
);

const CallToAction: React.FC<{onStartRegistration: () => void}> = ({ onStartRegistration }) => (
    <div 
        className="mx-4 mt-6 p-4 sm:p-6 bg-cover bg-center relative text-white h-48 flex items-center justify-end"
        style={{ 
            overflow: 'visible',
            borderRadius: '10px',
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/Frame 1597884470.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "multiply"
        }}
    >
        {/* ภาพด้านซ้าย */}
        <div className="absolute z-10" style={{ left: '-20px', top: '-14%' }}>
            <img src="/Project 2 (1) 1.svg" alt="Project illustration" className="h-50 w-auto opacity-100" style={{ filter: 'drop-shadow(0 0 0 transparent)' }} />
        </div>
        <div className="relative z-10 w-full md:w-7/12 text-right">
             <h2 className="font-bold text-lg md:text-xl leading-tight md:leading-snug mb-4">
                เริ่มต้นเข้าร่วมโครงการ<br/>
                ปลูกไผ่ได้ง่ายๆเพียง<br/>
                ลงทะเบียนผ่าน<br/>
                แบบฟอร์มออนไลน์
             </h2>
             <button onClick={onStartRegistration} className="bg-[#8CC63F] hover:bg-green-600 text-white font-bold text-base py-2 px-5 md:py-3 md:px-6 rounded-xl shadow-md transition-colors" style={{ marginLeft: 'auto' }}>
                ลงข้อมูลและส่งเอกสาร
            </button>
        </div>
    </div>
);

// ฟังก์ชันสำหรับดึงข้อมูลงานของวันนี้
const getTodayTask = () => {
    const today = new Date();
    const day = today.getDate();
    
    // ข้อมูลตัวอย่างสำหรับปฏิทินแนวทางปฏิบัติ
    const sampleCalendarTasks = {
        '13': {
            id: 1,
            title: 'เพาะปลูก',
            description: 'เตรียมดินและปลูกกล้าที่ได้รับมา',
            type: 'planting',
            day: 13,
            dayName: 'วันพฤหัสบดี'
        },
        '19': {
            id: 2,
            title: 'เพาะปลูก',
            description: 'เตรียมดินและปลูกกล้าที่ได้รับมา',
            type: 'planting',
            day: 19,
            dayName: 'วันพุธ'
        },
        '20': {
            id: 3,
            title: 'เตรียมดิน',
            description: 'เตรียมดินสำหรับปลูกไผ่ในแปลงที่ 2',
            type: 'practice',
            day: 20,
            dayName: 'วันพฤหัสบดี'
        },
        '21': {
            id: 4,
            title: 'รดน้ำต้นไม้',
            description: 'รดน้ำต้นไผ่ในแปลงที่ 1',
            type: 'practice',
            day: 21,
            dayName: 'วันศุกร์'
        },
        '22': {
            id: 5,
            title: 'ตรวจสอบสุขภาพต้นไม้',
            description: 'ตรวจสอบสุขภาพและโรคของต้นไผ่',
            type: 'practice',
            day: 22,
            dayName: 'วันเสาร์'
        },
        '23': {
            id: 6,
            title: 'เก็บเกี่ยวผลผลิต',
            description: 'เก็บเกี่ยวผลผลิตจากแปลงไผ่',
            type: 'harvest',
            day: 23,
            dayName: 'วันอาทิตย์'
        }
    };

    // ฟังก์ชันสำหรับแปลงชื่อวันเป็นภาษาไทย
    const getThaiDayName = (date: Date) => {
        const thaiDays = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
        return thaiDays[date.getDay()];
    };

    // ตรวจสอบว่ามีงานในวันนี้หรือไม่
    const todayTask = sampleCalendarTasks[day.toString()];
    
    if (todayTask) {
        return {
            ...todayTask,
            day: day,
            dayName: getThaiDayName(today)
        };
    }

    // ถ้าไม่มีงานในวันนี้ ให้แสดงข้อความว่าไม่มีงาน
    return {
        id: 0,
        title: 'ไม่มีงานในวันนี้',
        description: 'วันนี้ไม่มีงานที่ต้องทำ',
        type: 'none',
        day: day,
        dayName: getThaiDayName(today)
    };
};

// คอมโพเนนต์สำหรับแสดงรายการปฏิทิน
const CalendarTaskCard: React.FC<{ task: any; onClick: () => void }> = ({ task, onClick }) => {
    const isNoTask = task.type === 'none';
    
    return (
        <div 
            className={`flex items-center rounded-xl shadow-md ${
                isNoTask 
                    ? 'bg-cyan-100 cursor-default' 
                    : 'bg-white cursor-pointer hover:shadow-lg'
            }`}
            onClick={isNoTask ? undefined : onClick}
        >
            {/* ส่วนซ้าย - วันที่ */}
            <div className="bg-cyan-100 rounded-l-xl p-3 mr-4 flex-shrink-0 flex flex-col justify-center items-center min-h-[80px] w-[30%]">
                <div className="text-2xl font-bold text-blue-800 text-center">{task.day}</div>
                <div className="text-xs font-semibold text-blue-800 text-center mt-1">{task.dayName}</div>
            </div>
            
            {/* ส่วนขวา - ข้อมูลงาน */}
            <div className="flex-1 flex items-center justify-start relative pl-[10%]">
                <div className="flex items-center">
                    {isNoTask ? (
                        <Icons.CalendarIcon className="w-6 h-6 text-gray-500 mr-3" />
                    ) : (
                        <Icons.SproutIcon className="w-6 h-6 text-blue-800 mr-3" />
                    )}
                    <div>
                        <div className={`font-semibold ${isNoTask ? 'text-gray-500' : 'text-blue-800'}`}>
                            {task.title}
                        </div>
                    </div>
                </div>
                {!isNoTask && (
                    <Icons.ChevronRightIcon className="w-7 h-7 text-blue-800 absolute right-4" />
                )}
            </div>
        </div>
    );
};


const Section: React.FC<{ title: string; children: React.ReactNode; onViewMore?: () => void; }> = ({ title, children, onViewMore }) => (
    <div className="mt-6 px-4">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-medium text-slate-800">{title}</h3>
            {onViewMore && <button onClick={onViewMore} className="text-sm font-semibold text-cyan-500 hover:text-cyan-700">ดูเพิ่มเติม &gt;&gt;</button>}
        </div>
        {children}
    </div>
);

// Redesigned NewsCard for a grid view
const NewsCard: React.FC<{ article: KnowledgeArticle }> = ({ article }) => {
    const hasImage = article.imageUrl && article.imageUrl.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            {hasImage && (
                <img src={article.imageUrl} alt={article.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-bold text-slate-800 leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">{article.title}</h4>
                <p className="text-sm text-slate-600 mb-2 flex-grow line-clamp-2">{article.content}</p>
                <div className="flex items-center gap-2 mt-auto pt-2 text-xs text-slate-500">
                    <span>{article.postDate}</span>
                    <a href="#" className="font-semibold text-cyan-500 hover:text-cyan-700">อ่านเพิ่มเติม &gt;&gt;</a>
                </div>
            </div>
        </div>
    );
};


// =================================================================
// Main Dashboard Component
// =================================================================

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onMenuClick, onNotificationClick, onNavigate, onStartRegistration }) => {
    const [activeFilter, setActiveFilter] = useState('ทั้งหมด');
    
    // สร้างรายการฟิลเตอร์จากข้อมูลบทความโดยอัตโนมัติ
    const categories = [...new Set(mockData.knowledgeArticles.map(a => a.category))];
    const filters = ['ทั้งหมด', ...categories];

    // กรองบทความตามฟิลเตอร์ที่เลือก
    const filteredArticles = mockData.knowledgeArticles
        .filter(a => a.status === KnowledgeArticleStatus.PUBLISHED)
        .filter(article => activeFilter === 'ทั้งหมด' || article.category === activeFilter);

    // Helper function to get status styles
    const getStatusStyles = (status: RegistrationStatusType) => {
        switch (status) {
            case RegistrationStatusType.APPROVED: return { text: 'text-green-600' };
            case RegistrationStatusType.PENDING: return { text: 'text-orange-500' };
            case RegistrationStatusType.REJECTED: return { text: 'text-red-600' };
        }
    };

    const latestStatus = mockData.mockRegistrationStatuses[0];
    const statusStyle = latestStatus ? getStatusStyles(latestStatus.status) : null;

    return (
        <div 
            className="bg-white"
            style={{
                backgroundImage: "url('/Group-bg.png')",
                backgroundPosition: "bottom",
                backgroundSize: "auto",
                backgroundRepeat: "no-repeat"
            }}
        >
            <DashboardHeader onMenuClick={onMenuClick} onNotificationClick={onNotificationClick} />

            {/* Main content container */}
            <div className="pb-4">
                <WeatherCard />
                <CallToAction onStartRegistration={onStartRegistration} />

                <Section title="ปฏิทินแนวทางปฏิบัติ" onViewMore={() => onNavigate(Page.PRACTICE_CALENDAR)}>
                    <CalendarTaskCard 
                        task={getTodayTask()} 
                        onClick={() => onNavigate(Page.PRACTICE_CALENDAR)}
                    />
                </Section>

                <Section title="ตรวจสอบสถานะ" onViewMore={() => onNavigate(Page.CHECK_STATUS)}>
                    {latestStatus && statusStyle ? (
                        <div className="bg-white rounded-xl p-4 text-slate-800 border border-slate-200 flex justify-between items-center">
                            <div>
                                <p className="font-bold">{latestStatus.title}</p>
                                <p className="text-sm text-slate-500">อัปเดตล่าสุด: {latestStatus.date}</p>
                            </div>
                            <div className="text-right">
                                <span className={`font-bold text-sm ${statusStyle.text}`}>{latestStatus.status}</span>
                            </div>
                        </div>
                    ) : (
                         <div className="bg-white rounded-xl p-4 text-slate-500 text-center">
                            ไม่มีข้อมูลสถานะ
                        </div>
                    )}
                </Section>

                <Section title="ข่าวสาร" onViewMore={() => onNavigate(Page.KNOWLEDGE)}>
                    <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                                    activeFilter === filter
                                        ? 'bg-cyan-400 text-white shadow'
                                        : 'bg-white text-cyan-500 border border-cyan-400 hover:bg-cyan-50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                     {/* Wrapper for scrollable area */}
                    <div className="relative mt-4">
                        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 no-scrollbar">
                            {filteredArticles.map((article) => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default FarmerDashboard;