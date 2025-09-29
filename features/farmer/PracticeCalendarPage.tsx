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

    // ฟังก์ชันสำหรับการแปลงชื่อวันเป็นภาษาไทย
    const getThaiDayName = (dayIndex: number) => {
        const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
        return thaiDays[dayIndex];
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

    // ฟังก์ชันสำหรับการสร้างตารางเวลา
    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let hour = 8; hour <= 24; hour += 2) {
            timeSlots.push({
                time: `${hour.toString().padStart(2, '0')}.00`,
                hour: hour
            });
        }
        return timeSlots;
    };

    // ฟังก์ชันสำหรับการดึงงานของวันที่สำหรับ Day View
    const getTasksForDayView = (date: Date) => {
        const day = date.getDate();
        return getTasksForDate(day);
    };

    // ฟังก์ชันช่วยในการคำนวณความสูงของ task block ให้แม่นยำ
    const calculateTaskBlockHeight = (startTime: string, endTime: string) => {
        const startHour = parseInt(startTime.split(':')[0]);
        const startMinute = parseInt(startTime.split(':')[1]);
        const endHour = parseInt(endTime.split(':')[0]);
        const endMinute = parseInt(endTime.split(':')[1]);
        
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        
        // คำนวณความสูงตามสัดส่วนที่แม่นยำ
        const pixelsPerMinute = 80 / 120; // 0.6667px per minute
        const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
        const heightInPixels = durationInMinutes * pixelsPerMinute;
        
        // กำหนดขอบเขตความสูง
        const minHeight = 20;
        const maxHeight = 500;
        const finalHeight = Math.max(Math.min(heightInPixels, maxHeight), minHeight);
        
        return {
            height: finalHeight,
            duration: durationInMinutes,
            isAligned: (endTimeInMinutes % 60) === 0 // ตรวจสอบการจบที่เส้นเวลาทุก 1 ชั่วโมง
        };
    };

    // ฟังก์ชันสำหรับการสร้างรายการวันในสัปดาห์
    const generateWeekDays = () => {
        const today = new Date(currentDate);
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }
        return weekDays;
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

    // ฟังก์ชันสำหรับการเปลี่ยนวัน
    const changeDay = (direction: 'prev' | 'next') => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            if (direction === 'prev') {
                newDate.setDate(prevDate.getDate() - 1);
            } else {
                newDate.setDate(prevDate.getDate() + 1);
            }
            return newDate;
        });
    };

    // ฟังก์ชันสำหรับการเลือกวันที่โดยตรง
    const selectDate = (date: Date) => {
        setCurrentDate(date);
    };

    // ฟังก์ชันสำหรับการเปลี่ยนไปยัง day view เมื่อคลิกวันที่
    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setCurrentDate(clickedDate);
        setViewMode('day');
    };

    // ฟังก์ชันสำหรับการดึงงานของวันที่
    const getTasksForDate = (day: number) => {
        // ใช้เฉพาะงานตัวอย่าง
        const sampleTasksForDay = sampleTasks[day.toString()] || [];
        
        return sampleTasksForDay;
    };

    // ข้อมูลตัวอย่างสำหรับงานที่ต้องทำ
    const sampleTasks = {
        '13': [
            {
                id: 1,
                title: 'รับกล้า',
                description: 'ไปรับกล้าพันธุ์ใหม่จากศูนย์วิจัย',
                type: 'practice',
                completed: false,
                startTime: '08:00',
                endTime: '10:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 13)
            }
        ],
        '19': [
            {
                id: 2,
                title: 'เพราะปลูก',
                description: 'เตรียมดินและปลูกกล้าที่ได้รับมา',
                type: 'planting',
                completed: false,
                startTime: '13:00',
                endTime: '15:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19)
            }
        ],
        '20': [
            {
                id: 3,
                title: 'เตรียมดิน แปลงไผ่ 2',
                description: 'เตรียมดินสำหรับปลูกไผ่ในแปลงที่ 2',
                type: 'practice',
                completed: false,
                startTime: '09:00',
                endTime: '11:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20)
            }
        ],
        '21': [
            {
                id: 4,
                title: 'รดน้ำต้นไม้ แปลงไผ่ 1',
                description: 'รดน้ำต้นไผ่ในแปลงที่ 1',
                type: 'practice',
                completed: false,
                startTime: '10:00',
                endTime: '12:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 21)
            },
            {
                id: 5,
                title: 'บรรจุภัณฑ์',
                description: 'บรรจุภัณฑ์ผลผลิตสำหรับจำหน่าย',
                type: 'practice',
                completed: false,
                startTime: '14:00',
                endTime: '16:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 21)
            },
            {
                id: 6,
                title: 'รดน้ำต้นไม้ แปลงไผ่ 1',
                description: 'รดน้ำต้นไผ่ในแปลงที่ 1 (รอบที่ 2)',
                type: 'practice',
                completed: false,
                startTime: '16:00',
                endTime: '18:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 21)
            }
        ],
        '22': [
            {
                id: 9,
                title: 'ตรวจสอบสุขภาพต้นไม้',
                description: 'ตรวจสอบสุขภาพและโรคของต้นไผ่',
                type: 'practice',
                completed: false,
                startTime: '14:00',
                endTime: '16:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22)
            }
        ],
        '23': [
            {
                id: 10,
                title: 'เก็บเกี่ยวผลผลิต',
                description: 'เก็บเกี่ยวผลผลิตจากแปลงไผ่',
                type: 'harvest',
                completed: false,
                startTime: '07:00',
                endTime: '09:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 23)
            },
            {
                id: 11,
                title: 'บรรจุภัณฑ์',
                description: 'บรรจุภัณฑ์ผลผลิตสำหรับจำหน่าย',
                type: 'practice',
                completed: false,
                startTime: '10:00',
                endTime: '12:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 23)
            }
        ],
        '24': [
            {
                id: 12,
                title: 'ประชุมทีม',
                description: 'ประชุมทีมเพื่อวางแผนการทำงาน',
                type: 'meeting',
                completed: false,
                startTime: '09:00',
                endTime: '11:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24)
            }
        ],
        '25': [
            {
                id: 13,
                title: 'รดน้ำตอนเช้า',
                description: 'รดน้ำต้นไม้ในตอนเช้า',
                type: 'practice',
                completed: false,
                startTime: '08:00',
                endTime: '10:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25)
            },
            {
                id: 14,
                title: 'ตรวจสอบระบบน้ำ',
                description: 'ตรวจสอบและซ่อมแซมระบบน้ำ',
                type: 'practice',
                completed: false,
                startTime: '14:00',
                endTime: '16:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25)
            }
        ],
        '26': [
            {
                id: 16,
                title: 'งานข้ามช่วงเวลา',
                description: 'งานที่ข้ามจาก 15:00 ถึง 17:00',
                type: 'practice',
                completed: false,
                startTime: '15:00',
                endTime: '17:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 26)
            }
        ],
        '27': [
            {
                id: 19,
                title: 'งานประจำวัน',
                description: 'งานประจำวันทั่วไป',
                type: 'practice',
                completed: false,
                startTime: '13:00',
                endTime: '15:00',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 27)
            }
        ]
    };

    const calendar = generateCalendar();
    const thaiMonth = getThaiMonthName(currentDate.getMonth());
    const buddhistYear = getBuddhistYear(currentDate);
    const timeSlots = generateTimeSlots();
    const weekDays = generateWeekDays();
    const dayTasks = getTasksForDayView(currentDate);

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

                    {viewMode === 'month' ? (
                        <>
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
                                    const dayTasks = day ? getTasksForDate(day) : [];
                                    
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
                                            onClick={() => day && handleDateClick(day)}
                                        >
                                            {day && (
                                                <>
                                                    <span className="text-gray-900 font-medium">{day}</span>
                                                    {dayTasks.length > 0 && (
                                                        <div className="w-8 h-2 bg-blue-600 rounded-full mt-1"></div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Day View */}
                            <div className="px-6">
                                {/* Week Navigation */}
                                <div className="flex items-center justify-center mb-6">
                                    <button
                                        onClick={() => changeDay('prev')}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <h2 className="text-xl font-semibold text-gray-900 mx-4">
                                        {currentDate.getDate()} {getThaiMonthName(currentDate.getMonth())} {getBuddhistYear(currentDate)}
                                    </h2>
                                    <button
                                        onClick={() => changeDay('next')}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Week Days Header */}
                                <div className="flex mb-6 gap-1">
                                    {weekDays.map((day, index) => {
                                        const isToday = day.toDateString() === currentDate.toDateString();
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => selectDate(day)}
                                                className={`flex-1 text-center py-3 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                                    isToday 
                                                        ? 'bg-blue-600 text-white font-semibold shadow-md' 
                                                        : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className="text-sm font-medium">{day.getDate()}</div>
                                                <div className="text-xs">{getThaiDayName(day.getDay())}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Schedule Header */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {currentDate.toDateString() === new Date().toDateString() 
                                            ? 'ตารางวันนี้' 
                                            : `ตารางวันที่ ${currentDate.getDate()} ${getThaiMonthName(currentDate.getMonth())}`
                                        }
                                    </h3>
                                </div>

                                {/* Time Schedule */}
                                <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="grid grid-cols-12 gap-0">
                                        {/* Time Column */}
                                        <div className="col-span-2 bg-gray-50">
                                            {timeSlots.map((slot, index) => (
                                                <div
                                                    key={index}
                                                    className="h-20 flex items-center justify-end pr-4 text-sm text-gray-500 border-b border-gray-200"
                                                >
                                                    {slot.time}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Schedule Column */}
                                        <div className="col-span-10 relative">
                                            {/* Time Lines */}
                                            {timeSlots.map((slot, index) => (
                                                <div
                                                    key={index}
                                                    className="h-20 border-b border-gray-200 relative"
                                                >
                                                </div>
                                            ))}
                                            
                                            {/* Task Blocks - แสดงนอก time slots เพื่อหลีกเลี่ยงการซ้ำ */}
                                            {dayTasks
                                                .filter(task => task.startTime && task.endTime)
                                                .map((task, taskIndex) => {
                                                    const startHour = parseInt(task.startTime.split(':')[0]);
                                                    const startMinute = parseInt(task.startTime.split(':')[1]);
                                                    const endHour = parseInt(task.endTime.split(':')[0]);
                                                    const endMinute = parseInt(task.endTime.split(':')[1]);
                                                    
                                                    // คำนวณตำแหน่งและขนาดที่แม่นยำ
                                                    const startTimeInMinutes = startHour * 60 + startMinute;
                                                    const endTimeInMinutes = endHour * 60 + endMinute;
                                                    const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
                                                    
                                                    // ใช้ฟังก์ชันช่วยในการคำนวณความสูง
                                                    const heightCalculation = calculateTaskBlockHeight(task.startTime, task.endTime);
                                                    
                                                    // คำนวณตำแหน่งและความสูงให้แม่นยำ
                                                    // แต่ละ time slot มีความสูง 80px และครอบคลุม 2 ชั่วโมง (120 นาที)
                                                    // ดังนั้น 1 นาที = 80px / 120 นาที = 0.6667px
                                                    const pixelsPerMinute = 80 / 120; // 0.6667px per minute
                                                    
                                                    // คำนวณตำแหน่งเริ่มต้นจาก 8:00 (480 นาที)
                                                    const startOffsetInMinutes = startTimeInMinutes - (8 * 60);
                                                    const startOffsetInPixels = startOffsetInMinutes * pixelsPerMinute;
                                                    
                                                    // คำนวณตำแหน่งสิ้นสุดจาก 8:00 (480 นาที)
                                                    const endOffsetInMinutes = endTimeInMinutes - (8 * 60);
                                                    const endOffsetInPixels = endOffsetInMinutes * pixelsPerMinute;
                                                    
                                                    // ปรับปรุงการคำนวณให้แม่นยำขึ้น
                                                    // ใช้ Math.floor สำหรับตำแหน่งเริ่มต้นเพื่อให้แน่ใจว่าไม่เกินขอบเขต
                                                    const adjustedStartOffset = Math.floor(startOffsetInPixels);
                                                    
                                                    // คำนวณความสูงที่แม่นยำจากตำแหน่งเริ่มต้นและสิ้นสุด
                                                    // ให้จบที่เส้นเวลาที่ถูกต้อง
                                                    const adjustedEndOffset = Math.round(endOffsetInPixels);
                                                    
                                                    // คำนวณความสูงที่แม่นยำโดยการหาความแตกต่างระหว่างตำแหน่งเริ่มต้นและสิ้นสุด
                                                    const preciseHeight = adjustedEndOffset - adjustedStartOffset;
                                                    
                                                    // ตรวจสอบว่าความสูงที่คำนวณได้ตรงกับเส้นเวลาหรือไม่
                                                    // หากไม่ตรง ให้ปรับให้ตรงกับเส้นเวลาที่ใกล้ที่สุด
                                                    const timeSlotHeight = 80; // ความสูงของแต่ละ time slot
                                                    const timeSlotDuration = 120; // ระยะเวลาในแต่ละ time slot (นาที)
                                                    
                                                    // คำนวณตำแหน่งที่ควรจะจบตามเส้นเวลา
                                                    const expectedEndOffset = Math.round((endTimeInMinutes - (8 * 60)) * (timeSlotHeight / timeSlotDuration));
                                                    
                                                    // คำนวณความสูงจากเวลาจริงที่แม่นยำ
                                                    // ใช้เวลาจริงในการคำนวณความสูง
                                                    const actualDurationInPixels = durationInMinutes * (timeSlotHeight / timeSlotDuration);
                                                    
                                                    // ปรับปรุงการคำนวณให้เต็มเวลาจริง
                                                    // ใช้ความสูงที่คำนวณจากเวลาจริงโดยตรง
                                                    const finalPreciseHeight = Math.max(actualDurationInPixels, 20);
                                                    
                                                    // ตรวจสอบว่าตำแหน่งสิ้นสุดตรงกับเส้นเวลาหรือไม่
                                                    const isEndTimeAligned = heightCalculation.isAligned;

                                                    // ตรวจสอบว่า event อยู่ในช่วงเวลาที่แสดง (8:00-24:00)
                                                    if (startTimeInMinutes < 8 * 60 || endTimeInMinutes > 24 * 60) {
                                                        return null;
                                                    }

                                                    // Debug: แสดงข้อมูลการคำนวณ
                                                    console.log(`Event: ${task.title}`, {
                                                        startTime: task.startTime,
                                                        endTime: task.endTime,
                                                        durationInMinutes: `${durationInMinutes} นาที`,
                                                        pixelsPerMinute: `${pixelsPerMinute}px/นาที`,
                                                        startOffsetInPixels: `${startOffsetInPixels}px`,
                                                        adjustedStartOffset: `${adjustedStartOffset}px`,
                                                        endOffsetInPixels: `${endOffsetInPixels}px`,
                                                        adjustedEndOffset: `${adjustedEndOffset}px`,
                                                        expectedEndOffset: `${expectedEndOffset}px`,
                                                        actualDurationInPixels: `${actualDurationInPixels}px`,
                                                        preciseHeight: `${preciseHeight}px`,
                                                        finalPreciseHeight: `${finalPreciseHeight}px`,
                                                        isEndTimeAligned: isEndTimeAligned,
                                                        timeRange: `${task.startTime} - ${task.endTime}`,
                                                        calculation: `เริ่มที่ ${adjustedStartOffset}px, สูง ${finalPreciseHeight}px (${durationInMinutes} นาที = ${actualDurationInPixels}px), จบตรงเส้นเวลา: ${isEndTimeAligned}`
                                                    });

                                                    return (
                                                        <div
                                                            key={taskIndex}
                                                            className="absolute text-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-center"
                                                            style={{
                                                                top: `${adjustedStartOffset}px`,
                                                                height: `${finalPreciseHeight}px`,
                                                                left: '8px',
                                                                right: '8px',
                                                                zIndex: 10,
                                                                padding: finalPreciseHeight < 40 ? '6px 12px' : '12px 16px',
                                                                backgroundColor: '#3B82F6', // สีน้ำเงินสดใสเหมือนรูปภาพ
                                                                borderRadius: '8px',
                                                                // เพิ่ม border-bottom เพื่อให้เห็นเส้นขอบล่างชัดเจน
                                                                borderBottom: isEndTimeAligned ? '2px solid #2563eb' : 'none',
                                                                // ปรับ margin-bottom เพื่อให้จบที่เส้นเวลาพอดี
                                                                marginBottom: isEndTimeAligned ? '0px' : '0px',
                                                                // ใช้ box-sizing: border-box เพื่อให้ความสูงรวม border
                                                                boxSizing: 'border-box',
                                                                // ปรับความสูงให้เต็มเวลาจริง
                                                                minHeight: '20px'
                                                            }}
                                                        >
                                                            <div className="font-semibold text-sm mb-1 truncate leading-tight">{task.title}</div>
                                                            <div className="flex items-center text-xs opacity-95">
                                                                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span className="truncate font-medium">{task.startTime} - {task.endTime}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

            </main>
        </div>
    );
};

export default PracticeCalendarPage;
