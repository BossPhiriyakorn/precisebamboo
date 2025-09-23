// features/admin/AdminCalendarPage.tsx
// หน้าปฏิทินสำหรับแอดมิน

import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, View, Event } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/th';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking, BookingStatus } from '../../types';
import { Icons } from '../../constants';

// ตั้งค่า moment สำหรับภาษาไทย
moment.locale('th');

const localizer = momentLocalizer(moment);

interface AdminCalendarPageProps {
  bookings: Booking[];
}

const AdminCalendarPage: React.FC<AdminCalendarPageProps> = ({ 
  bookings 
}) => {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  // แปลงข้อมูล booking เป็น events สำหรับปฏิทิน
  const events = useMemo(() => {
    return bookings.map(booking => {
      // แปลงวันที่จากรูปแบบ DD/MM/YY เป็น Date object
      const [day, month, year] = booking.date.split('/');
      const fullYear = parseInt(year) + 2500; // แปลง พ.ศ. เป็น ค.ศ.
      const eventDate = new Date(fullYear, parseInt(month) - 1, parseInt(day));
      
      // กำหนดสีตามสถานะ
      let backgroundColor = '#3174ad'; // สีน้ำเงินเริ่มต้น
      switch (booking.status) {
        case BookingStatus.PENDING:
          backgroundColor = '#f59e0b'; // สีส้ม
          break;
        case BookingStatus.CONFIRMED:
          backgroundColor = '#3b82f6'; // สีน้ำเงิน
          break;
        case BookingStatus.COMPLETED:
          backgroundColor = '#10b981'; // สีเขียว
          break;
      }

      return {
        id: booking.id,
        title: booking.description,
        start: eventDate,
        end: eventDate,
        resource: {
          ...booking,
          color: backgroundColor
        }
      };
    });
  }, [bookings]);

  // กำหนดสไตล์ของ events
  const eventStyleGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.resource?.color || '#3174ad',
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 4px'
      }
    };
  };

  // จัดการเมื่อคลิกที่ event
  const handleSelectEvent = (event: Event) => {
    console.log('Selected event:', event);
    // สามารถเพิ่ม modal แสดงรายละเอียดได้ที่นี่
  };

  // จัดการเมื่อคลิกที่ช่องว่างในปฏิทิน
  const handleSelectSlot = (slotInfo: any) => {
    console.log('Selected slot:', slotInfo);
    // สามารถเพิ่มการสร้าง booking ใหม่ได้ที่นี่
  };

  // กำหนดข้อความภาษาไทย
  const messages = {
    next: 'ถัดไป',
    previous: 'ก่อนหน้า',
    today: 'วันนี้',
    month: 'เดือน',
    week: 'สัปดาห์',
    day: 'วัน',
    agenda: 'รายการ',
    date: 'วันที่',
    time: 'เวลา',
    event: 'เหตุการณ์',
    noEventsInRange: 'ไม่มีเหตุการณ์ในช่วงนี้',
    showMore: (total: number) => `+${total} เพิ่มเติม`
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">ปฏิทินระบบ</h1>
        <p className="text-slate-600">ดูภาพรวมการจองคิวและการทำงานของระบบทั้งหมด</p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 rounded-lg p-1 flex">
          {(['month', 'week', 'day'] as View[]).map((viewType) => (
            <button
              key={viewType}
              onClick={() => setView(viewType)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === viewType
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {viewType === 'month' ? 'เดือน' : 
               viewType === 'week' ? 'สัปดาห์' : 'วัน'}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          views={['month', 'week', 'day']}
          date={date}
          onNavigate={setDate}
          onView={setView}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          selectable
          popup
          messages={messages}
          culture="th"
          formats={{
            dayFormat: 'D',
            weekdayFormat: 'ddd',
            monthHeaderFormat: 'MMMM YYYY',
            dayHeaderFormat: 'dddd, MMMM Do',
            dayRangeHeaderFormat: 'MMM Do',
            agendaHeaderFormat: 'MMM Do',
            agendaDateFormat: 'ddd MMM Do',
            agendaTimeFormat: 'HH:mm',
            agendaTimeRangeFormat: 'HH:mm - HH:mm'
          }}
        />
      </div>

      {/* Legend */}
      <div className="mt-6 bg-slate-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">ความหมายของสี</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-sm text-slate-600">รอดำเนินการ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-sm text-slate-600">ยืนยันแล้ว</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-sm text-slate-600">เสร็จสิ้น</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendarPage;
