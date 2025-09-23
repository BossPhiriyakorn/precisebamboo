// features/farmer/PracticeCalendarPage.tsx
// หน้าปฎิทินการปฎิบัตรสำหรับเกษตรกร

import React, { useState } from 'react';
import Card from '../../components/Card';

interface PracticeCalendarPageProps {
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

const PracticeCalendarPage: React.FC<PracticeCalendarPageProps> = ({ 
    onMenuClick, 
    onNotificationClick 
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'day'>('month');

    // ฟังก์ชันสำหรับการแปลงปี พ.ศ. เป็น ค.ศ.
    const getBuddhistYear = (date: Date) => {
        return date.getFullYear() + 543;
    };

    // ฟังก์ชันสำหรับการแปลงปี ค.ศ. เป็น พ.ศ.
    const getGregorianYear = (buddhistYear: number) => {
        return buddhistYear - 543;
    };

    // ฟังก์ชันสำหรับการแปลงชื่อเดือนเป็นภาษาไทย
    const getThaiMonthName = (monthIndex: number) => {
        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        return thaiMonths[monthIndex];
    };

    // ฟังก์ชันสำหรับการสร้างปฏิทิน
    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const calendar = [];
        
        // เพิ่มวันว่างสำหรับวันแรกของเดือน
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendar.push(null);
        }
        
        // เพิ่มวันในเดือน
        for (let day = 1; day <= daysInMonth; day++) {
            calendar.push(day);
        }
        
        return calendar;
    };

    // ฟังก์ชันสำหรับการเปลี่ยนเดือน
    const changeMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            if (direction === 'prev') {
                newDate.setMonth(prevDate.getMonth() - 1);
            } else {
                newDate.setMonth(prevDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    // ข้อมูลตัวอย่างสำหรับวันที่ที่มีกิจกรรม
    const practiceDays = [13, 19]; // วันที่ 13 และ 19 มีกิจกรรม

    const calendar = generateCalendar();
    const thaiMonth = getThaiMonthName(currentDate.getMonth());
    const buddhistYear = getBuddhistYear(currentDate);

    return (
        <div className="min-h-screen bg-white">
            <main>
                    {/* View Toggle */}
                    <div className="flex justify-end mb-6 px-6 pt-3">
                        <div className="flex rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('month')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    viewMode === 'month'
                                        ? 'text-black'
                                        : 'text-black'
                                }`}
                                style={{
                                    backgroundColor: viewMode === 'month' ? '#B0E5F8' : '#E7E7E7',
                                    borderRadius: viewMode === 'month' ? '8px 0 0 8px' : '0'
                                }}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setViewMode('day')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    viewMode === 'day'
                                        ? 'text-black'
                                        : 'text-black'
                                }`}
                                style={{
                                    backgroundColor: viewMode === 'day' ? '#B0E5F8' : '#E7E7E7',
                                    borderRadius: viewMode === 'day' ? '0 8px 8px 0' : '0'
                                }}
                            >
                                Day
                            </button>
                        </div>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-center mb-6 px-6">
                        <button
                            onClick={() => changeMonth('prev')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold text-gray-900 mx-4">
                            {thaiMonth} {buddhistYear}
                        </h2>
                        <button
                            onClick={() => changeMonth('next')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px px-6">
                        {/* Days of Week Header */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                                {day}
                            </div>
                        ))}
                        
                        {/* Calendar Days */}
                        {calendar.map((day, index) => {
                            const dayOfWeek = index % 7; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                            const isEvenDayOfWeek = dayOfWeek % 2 === 0;
                            
                            return (
                                <div
                                    key={index}
                                    className={`p-3 text-center text-sm min-h-[60px] flex flex-col items-center justify-center ${
                                        day
                                            ? 'hover:opacity-80 cursor-pointer transition-all'
                                            : 'bg-transparent'
                                    }`}
                                    style={{
                                        backgroundColor: day ? (isEvenDayOfWeek ? '#B0E5F8' : '#E6F7FD') : 'transparent',
                                        borderRadius: day ? '2px' : '0'
                                    }}
                                >
                                    {day && (
                                        <>
                                            <span className="text-gray-900 font-medium">{day}</span>
                                            {practiceDays.includes(day) && (
                                                <div className="w-8 h-2 bg-blue-600 rounded-full mt-1"></div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex items-center justify-center gap-6 px-6 pb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-50 rounded"></div>
                            <span className="text-sm text-gray-600">วันปกติ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-50 rounded flex items-center justify-center">
                                <div className="w-6 h-1 bg-blue-600 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-600">วันที่มีกิจกรรม</span>
                        </div>
                    </div>
            </main>
        </div>
    );
};

export default PracticeCalendarPage;
