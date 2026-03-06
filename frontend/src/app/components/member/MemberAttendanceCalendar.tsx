"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarDay } from '../../types/member-attendance';
import { getMonthName } from '../../lib/utils';

interface MemberAttendanceCalendarProps {
  currentYear: number;
  currentMonth: number;
  calendarDays: CalendarDay[];
  attendanceDates: Set<string>;
  todayStr: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function MemberAttendanceCalendar({
  currentYear,
  currentMonth,
  calendarDays,
  attendanceDates,
  todayStr,
  onPrevMonth,
  onNextMonth
}: MemberAttendanceCalendarProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-white">Attendance Calendar</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-[120px] text-center">
            {getMonthName(currentMonth)} {currentYear}
          </span>
          <button 
            onClick={onNextMonth}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          if (!day.day) {
            return <div key={idx} className="aspect-square" />;
          }
          
          const hasAttendance = attendanceDates.has(day.dateStr);
          const isToday = day.dateStr === todayStr;
          const isFuture = new Date(day.dateStr) > new Date(todayStr);
          
          return (
            <div 
              key={idx}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium relative transition-all ${
                isToday ? 'ring-2 ring-red-600 ring-offset-1 ring-offset-zinc-900' : ''
              } ${
                hasAttendance 
                  ? 'bg-green-600/30 text-green-400' 
                  : isFuture 
                    ? 'text-zinc-700' 
                    : 'bg-zinc-800/50 text-zinc-500'
              }`}
              title={hasAttendance ? `Attended: ${day.dateStr}` : day.dateStr}
            >
              {day.day}
              {hasAttendance && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-600/30"></div>
          <span className="text-[10px] text-zinc-500">Attended</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-red-600 ring-offset-1 ring-offset-zinc-900"></div>
          <span className="text-[10px] text-zinc-500">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-zinc-800/50"></div>
          <span className="text-[10px] text-zinc-500">No Visit</span>
        </div>
      </div>
    </div>
  );
}