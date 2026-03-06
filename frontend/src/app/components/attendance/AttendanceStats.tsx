"use client";

import { TodayStats } from '../../types/attendance';

interface AttendanceStatsProps {
  stats: TodayStats;
}

export default function AttendanceStats({ stats }: AttendanceStatsProps) {
  const statItems = [
    { label: 'Today Total', value: stats.total, color: 'text-white' },
    { label: 'Members', value: stats.members, color: 'text-green-500' },
    { label: 'Walk-ins', value: stats.walkIns, color: 'text-blue-500' },
    { label: 'Expired', value: stats.expired, color: 'text-orange-500' },
    { label: 'Revenue (Today)', value: `₱${stats.revenue.toLocaleString()}`, color: 'text-red-500', isLast: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4 ${item.isLast ? 'col-span-2 sm:col-span-1' : ''}`}
        >
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
            {item.label}
          </p>
          <p className={`text-lg sm:text-xl font-black ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
