"use client";

import { DailyChartData, MonthlyChartData } from '../../types/revenue';
import { getPhilippinesDate, getMonthName, getShortMonthName, formatCurrency } from '../../lib/utils';

interface RevenueChartProps {
  filterView: 'Day' | 'Month' | 'Year';
  dailyChartData: DailyChartData[];
  monthlyChartData: MonthlyChartData[];
  selectedMonth: string;
  selectedYear: string;
}

export default function RevenueChart({ 
  filterView, 
  dailyChartData, 
  monthlyChartData, 
  selectedMonth, 
  selectedYear 
}: RevenueChartProps) {
  const today = getPhilippinesDate();
  
  // Calculate max value for scaling
  const maxChartValue = filterView === "Month" 
    ? Math.max(...dailyChartData.map(d => d.total), 1)
    : filterView === "Year" 
      ? Math.max(...monthlyChartData.map(d => d.total), 1)
      : 1;

  return (
    <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
        <h3 className="text-sm sm:text-base font-bold text-white">
          {filterView === 'Month' ? 'Daily Revenue' : filterView === 'Year' ? 'Monthly Revenue' : 'Revenue'}
        </h3>
        <span className="text-[10px] sm:text-xs text-zinc-500">
          {filterView === 'Month' ? `${getMonthName(parseInt(selectedMonth) - 1)} ${selectedYear}` : selectedYear}
        </span>
      </div>
      
      {/* Bar Chart */}
      <div className="flex-1 flex items-end gap-0.5 sm:gap-1 min-h-0 pb-6 relative">
        {filterView === "Month" && dailyChartData.map((data, idx) => {
          const heightPercent = maxChartValue > 0 ? (data.total / maxChartValue) * 100 : 0;
          const isToday = data.date === today;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full min-w-[12px] sm:min-w-[16px]">
              <div 
                className={`w-full rounded-t-sm sm:rounded-t transition-all duration-300 hover:opacity-80 relative group ${
                  isToday ? 'bg-red-600' : data.total > 0 ? 'bg-red-600/60' : 'bg-zinc-800'
                }`}
                style={{ height: `${Math.max(heightPercent, 2)}%` }}
              >
                {/* Tooltip */}
                {data.total > 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {formatCurrency(data.total)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {filterView === "Year" && monthlyChartData.map((data, idx) => {
          const heightPercent = maxChartValue > 0 ? (data.total / maxChartValue) * 100 : 0;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full min-w-[20px] sm:min-w-[28px]">
              <div 
                className={`w-full rounded-t-sm sm:rounded-t transition-all duration-300 hover:opacity-80 relative group ${
                  data.total > 0 ? 'bg-red-600/60' : 'bg-zinc-800'
                }`}
                style={{ height: `${Math.max(heightPercent, 2)}%` }}
              >
                {/* Tooltip */}
                {data.total > 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {formatCurrency(data.total)}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 sm:gap-1">
          {filterView === "Month" && dailyChartData.map((data, idx) => (
            <div key={idx} className="flex-1 text-center">
              <span className="text-[8px] sm:text-[10px] text-zinc-600">{data.day}</span>
            </div>
          ))}
          {filterView === "Year" && monthlyChartData.map((data, idx) => (
            <div key={idx} className="flex-1 text-center">
              <span className="text-[8px] sm:text-[10px] text-zinc-600">{data.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-red-600"></div>
          <span className="text-[10px] text-zinc-500">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-red-600/60"></div>
          <span className="text-[10px] text-zinc-500">Has Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-zinc-800"></div>
          <span className="text-[10px] text-zinc-500">No Revenue</span>
        </div>
      </div>
    </div>
  );
}
