"use client";

import { Calendar, Clock, Trophy, Flame } from "lucide-react";
import { MemberAttendanceStats as Stats } from '../../types/member-attendance';

interface MemberAttendanceStatsProps {
  stats: Stats;
}

export default function MemberAttendanceStats({ stats }: MemberAttendanceStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-red-600/10">
            <Flame className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Streak</p>
        </div>
        <p className="text-2xl font-black text-white">{stats.streak}</p>
        <p className="text-[10px] text-zinc-600">days</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-green-600/10">
            <Calendar className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">This Month</p>
        </div>
        <p className="text-2xl font-black text-white">{stats.monthVisits}</p>
        <p className="text-[10px] text-zinc-600">visits</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-blue-600/10">
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Today</p>
        </div>
        <p className="text-2xl font-black text-white">{stats.todayVisits}</p>
        <p className="text-[10px] text-zinc-600">visits</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-purple-600/10">
            <Trophy className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</p>
        </div>
        <p className="text-2xl font-black text-white">{stats.totalVisits}</p>
        <p className="text-[10px] text-zinc-600">visits</p>
      </div>
    </div>
  );
}