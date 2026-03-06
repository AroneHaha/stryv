"use client";

import { useState, useMemo } from "react";
import { Search, X, UserPlus, ChevronDown } from "lucide-react";
import { AttendanceRecord, Member, TodayStats } from '../../types/attendance';
import { STORAGE_KEYS } from '../../lib/constants';
import { getInitialData, getPhilippinesDateTime, getTodayStats } from '../../lib/utils';
import { 
  AttendanceStats, 
  AttendanceForm, 
  AttendanceTable, 
  AttendanceDetailModal 
} from '../../components/attendance';

export default function AttendancePage() {
  const [members] = useState<Member[]>(() => getInitialData(STORAGE_KEYS.MEMBERS) as Member[]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => 
    getInitialData(STORAGE_KEYS.ATTENDANCE) as AttendanceRecord[]
  );
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter States
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Handle new attendance submission
  const handleAttendanceSubmit = (record: AttendanceRecord) => {
    const updatedAttendance = [record, ...attendance];
    setAttendance(updatedAttendance);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updatedAttendance));
  };

  // Handle view detail
  const handleViewDetail = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  // Filter attendance records
  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) => {
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !filterDate || record.date === filterDate;
      const matchesType = filterType === "All" ? true : record.type === filterType;
      return matchesSearch && matchesDate && matchesType;
    });
  }, [attendance, searchTerm, filterDate, filterType]);

  // Get today's stats
  const todayStats: TodayStats = useMemo(() => {
    return getTodayStats(attendance);
  }, [attendance]);

  // Clear date filter
  const clearDateFilter = () => setFilterDate("");

  return (
    <div className="flex flex-col h-full w-full gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-950 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Attendance</h1>
            <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">
              Track member and walk-in attendance.
            </p>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-all shadow-[0_4px_14px_0_rgba(200,0,0,0)] hover:shadow-[0_6px_20px_0_rgba(200,0,0,0.3)]"
          >
            <UserPlus className="h-4 w-4" />
            <span>Record Attendance</span>
          </button>
        </div>

        {/* Today's Stats */}
        <AttendanceStats stats={todayStats} />

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-600/20 focus:border-red-600 placeholder-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Date Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="date"
                className="w-full sm:w-40 bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-red-600 [color-scheme:dark] pr-8"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button
                  onClick={clearDateFilter}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-32 justify-between"
              >
                <span className="truncate">
                  {filterType === 'All' ? 'All Types' : filterType}
                </span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  {['All', 'Member', 'Walk-in', 'Expired'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowTypeDropdown(false);
                      }}
                      className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    >
                      {type === 'All' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="flex-1 min-h-0 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto h-full overflow-y-auto">
          <AttendanceTable records={filteredAttendance} onViewDetail={handleViewDetail} />
        </div>
      </div>

      {/* Record Attendance Modal */}
      <AttendanceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAttendanceSubmit}
        members={members}
        existingAttendance={attendance}
      />

      {/* Attendance Detail Modal */}
      <AttendanceDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}