// features/farmer/PracticeCalendarEnhanced.tsx
// หน้าปฎิทินการปฎิบัตรแบบ Enhanced พร้อมฟีเจอร์จาก DayPilot

import React, { useState, useEffect } from 'react';
import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import FarmerHeader from './FarmerHeader';
import './PracticeCalendarEnhanced.css';

interface PracticeCalendarEnhancedProps {
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

const PracticeCalendarEnhanced: React.FC<PracticeCalendarEnhancedProps> = ({ 
    onMenuClick, 
    onNotificationClick 
}) => {
    const [calendar, setCalendar] = useState(null);
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState("2025-08-01");

    // ข้อมูลกิจกรรมตัวอย่าง
    useEffect(() => {
        const practiceEvents = [
            {
                id: 1,
                text: "การปลูกไผ่ - แปลง A",
                start: "2025-08-13",
                end: "2025-08-13",
                backColor: "#3d85c6",
                barColor: "#2c5aa0"
            },
            {
                id: 2,
                text: "การตัดไผ่ - แปลง B",
                start: "2025-08-19",
                end: "2025-08-19",
                backColor: "#6aa84f",
                barColor: "#4a7c3a"
            },
            {
                id: 3,
                text: "การใส่ปุ๋ย - แปลง C",
                start: "2025-08-25",
                end: "2025-08-25",
                backColor: "#ecb823",
                barColor: "#d4a017"
            },
            {
                id: 4,
                text: "การตรวจสอบโรค - แปลง A",
                start: "2025-08-28",
                end: "2025-08-28",
                backColor: "#d5663e",
                barColor: "#b84d2a"
            }
        ];
        setEvents(practiceEvents);
    }, []);

    // การตั้งค่าปฎิทิน
    const config = {
        eventHeight: 30,
        headerHeight: 30,
        cellHeaderHeight: 25,
        locale: 'th-th', // ภาษาไทย
        onBeforeEventRender: args => {
            args.data.borderColor = "darker";
            if (args.data.backColor) {
                args.data.barColor = DayPilot.ColorUtil.lighter(args.data.backColor, 1);
            }
        },
        contextMenu: new DayPilot.Menu({
            items: [
                {
                    text: "ลบกิจกรรม",
                    onClick: args => {
                        const e = args.source;
                        calendar.events.remove(e);
                    }
                },
                {
                    text: "-"
                },
                {
                    text: "สีน้ำเงิน",
                    icon: "icon icon-blue",
                    color: "#3d85c6",
                    onClick: args => updateColor(args.source, args.item.color)
                },
                {
                    text: "สีเขียว",
                    icon: "icon icon-green",
                    color: "#6aa84f",
                    onClick: args => updateColor(args.source, args.item.color)
                },
                {
                    text: "สีเหลือง",
                    icon: "icon icon-yellow",
                    color: "#ecb823",
                    onClick: args => updateColor(args.source, args.item.color)
                },
                {
                    text: "สีแดง",
                    icon: "icon icon-red",
                    color: "#d5663e",
                    onClick: args => updateColor(args.source, args.item.color)
                },
                {
                    text: "สีอัตโนมัติ",
                    color: null,
                    onClick: args => updateColor(args.source, args.item.color)
                }
            ]
        }),
        onTimeRangeSelected: async args => {
            const modal = await DayPilot.Modal.prompt("สร้างกิจกรรมใหม่:", "กิจกรรมใหม่");

            if (!modal.result) {
                return;
            }

            calendar.clearSelection();

            calendar.events.add({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                text: modal.result,
                backColor: "#B0E5F8"
            });
        },
        onEventClick: args => {
            const modal = DayPilot.Modal.alert("รายละเอียดกิจกรรม", args.e.text());
        }
    };

    const updateColor = (e, color) => {
        e.data.backColor = color;
        calendar.events.update(e);
    };

    const changeMonth = (direction) => {
        const currentDate = new Date(startDate);
        if (direction === 'prev') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        setStartDate(currentDate.toISOString().split('T')[0]);
    };

    const getThaiMonthName = (dateString) => {
        const date = new Date(dateString);
        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        return thaiMonths[date.getMonth()];
    };

    const getBuddhistYear = (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear() + 543;
    };

    const thaiMonth = getThaiMonthName(startDate);
    const buddhistYear = getBuddhistYear(startDate);

    return (
        <div className="min-h-screen bg-white">
            <FarmerHeader 
                title="ปฎิทินการปฎิบัตร"
                onMenuClick={onMenuClick}
                onNotificationClick={onNotificationClick}
            />

            <main className="container mx-auto -mt-16 relative z-10">
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

                {/* DayPilot Calendar */}
                <div className="px-6">
                    <DayPilotMonth
                        {...config}
                        events={events}
                        startDate={startDate}
                        controlRef={setCalendar}
                    />
                </div>

                {/* Instructions */}
                <div className="mt-6 px-6 pb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">วิธีใช้งาน</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• คลิกที่วันที่เพื่อสร้างกิจกรรมใหม่</li>
                            <li>• คลิกขวาที่กิจกรรมเพื่อแก้ไขหรือลบ</li>
                            <li>• เปลี่ยนสีกิจกรรมได้จากเมนูคลิกขวา</li>
                            <li>• คลิกที่กิจกรรมเพื่อดูรายละเอียด</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PracticeCalendarEnhanced;
