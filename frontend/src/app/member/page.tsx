"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { Member } from '../types/member';
import { MemberCheckInRecord, MemberAttendanceStats, CalendarDay } from '../types/member-attendance';
import { STORAGE_KEYS } from '../lib/constants';
import { 
  getInitialData, 
  getPhilippinesDate, 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  getDaysUntilExpiration 
} from '../lib/utils';
import { 
  MemberCard, 
  MemberAttendanceStats as MemberAttendanceStatsComponent, 
  MemberAttendanceCalendar, 
  MemberRecentActivity 
} from '../components/member';

// Get Philippines time
function getPhilippinesTime(): string {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' })).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

export default function MemberAttendancePage() {
  const [members] = useState<Member[]>(() => getInitialData(STORAGE_KEYS.MEMBERS) as Member[]);
  const [attendance, setAttendance] = useState<MemberCheckInRecord[]>(() => getInitialData(STORAGE_KEYS.ATTENDANCE) as MemberCheckInRecord[]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  
  // Calendar navigation
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // Find the test member (or use first member for demo)
  const member = useMemo(() => {
    const found = members.find(m => m.name?.toLowerCase().includes('test'));
    return found || members[0] || null;
  }, [members]);

  // Get member's attendance records
  const memberAttendance = useMemo(() => {
    if (!member) return [];
    return attendance.filter(a => a.memberId === member.id || a.name === member.name);
  }, [attendance, member]);

  // Get attendance dates as Set for quick lookup
  const attendanceDates = useMemo(() => {
    return new Set(memberAttendance.map(a => a.date));
  }, [memberAttendance]);

  // Calculate stats
  const stats = useMemo((): MemberAttendanceStats => {
    const today = getPhilippinesDate();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const todayVisits = memberAttendance.filter(a => a.date === today).length;
    const monthVisits = memberAttendance.filter(a => {
      const date = new Date(a.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;
    const totalVisits = memberAttendance.length;
    
    // Calculate streak (consecutive days)
    let streak = 0;
    const sortedDates = memberAttendance
      .map(a => a.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (sortedDates.length > 0) {
      const uniqueDates = [...new Set(sortedDates)];
      let checkDate = new Date(today);
      
      for (let i = 0; i < uniqueDates.length; i++) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (uniqueDates.includes(checkStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split('T')[0];
          if (uniqueDates.includes(yesterdayStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    return { todayVisits, monthVisits, totalVisits, streak };
  }, [memberAttendance]);

  // Days until expiration
  const daysUntilExpiration = member ? getDaysUntilExpiration(member.expirationDate) : 0;
  const isExpired = daysUntilExpiration < 0;
  const isExpiringSoon = daysUntilExpiration >= 0 && daysUntilExpiration <= 7;

  // Handle check-in
  const handleCheckIn = () => {
    if (!member || isExpired) return;
    
    setIsCheckingIn(true);
    
    setTimeout(() => {
      const newAttendance: MemberCheckInRecord = {
        id: Date.now().toString(),
        memberId: member.id,
        name: member.name,
        type: 'Member',
        date: getPhilippinesDate(),
        time: getPhilippinesTime(),
        price: 0,
        paymentMethod: 'N/A',
        createdAt: new Date().toISOString()
      };
      
      const updatedAttendance = [...attendance, newAttendance];
      setAttendance(updatedAttendance);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updatedAttendance));
      
      setIsCheckingIn(false);
      setCheckInSuccess(true);
      
      setTimeout(() => setCheckInSuccess(false), 3000);
    }, 1000);
  };

  // Navigate months
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar days
  const calendarDays = useMemo((): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: CalendarDay[] = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, dateStr: '' });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ day, dateStr });
    }
    
    return days;
  }, [currentYear, currentMonth]);

  const todayStr = getPhilippinesDate();

  if (!member) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[60vh]">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Member Found</h2>
          <p className="text-zinc-400 text-sm">Please add a member first to view attendance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Member Card */}
      <MemberCard
        member={member}
        isExpired={isExpired}
        isExpiringSoon={isExpiringSoon}
        daysUntilExpiration={daysUntilExpiration}
        isCheckingIn={isCheckingIn}
        checkInSuccess={checkInSuccess}
        onCheckIn={handleCheckIn}
      />

      {/* Stats Cards */}
      <MemberAttendanceStatsComponent stats={stats} />

      {/* Attendance Calendar */}
      <MemberAttendanceCalendar
        currentYear={currentYear}
        currentMonth={currentMonth}
        calendarDays={calendarDays}
        attendanceDates={attendanceDates}
        todayStr={todayStr}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      {/* Recent Activity */}
      <MemberRecentActivity attendance={memberAttendance} />
    </div>
  );
}