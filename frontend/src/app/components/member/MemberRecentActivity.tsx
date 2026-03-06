"use client";

import { Calendar, CheckCircle } from "lucide-react";
import { MemberCheckInRecord } from '../../types/member-attendance';
import { formatDisplayDate } from '../../lib/utils';

interface MemberRecentActivityProps {
  attendance: MemberCheckInRecord[];
}

export default function MemberRecentActivity({ attendance }: MemberRecentActivityProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-white mb-4">Recent Activity</h2>
      
      {attendance.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">No attendance records yet</p>
          <p className="text-xs text-zinc-600 mt-1">Check in to start tracking your progress!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {attendance
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-600/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{formatDisplayDate(record.date)}</p>
                    <p className="text-[10px] text-zinc-500">{record.time}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-500 uppercase">Checked In</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}