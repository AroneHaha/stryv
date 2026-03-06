"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { TransactionRecord, RevenueTotals, DailyChartData, MonthlyChartData } from '../../types/revenue';
import { STORAGE_KEYS } from '../../lib/constants';
import { 
  getInitialData, 
  getPhilippinesDate, 
  getMonthName, 
  getShortMonthName 
} from '../../lib/utils';
import { RevenueStats, RevenueChart, RecentTransactions } from '../../components/revenue';

export default function RevenuePage() {
  const [attendance] = useState<TransactionRecord[]>(() => getInitialData(STORAGE_KEYS.ATTENDANCE) as TransactionRecord[]);
  
  // Filter States
  const [filterView, setFilterView] = useState<"Day" | "Month" | "Year">("Month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedDate, setSelectedDate] = useState(getPhilippinesDate());
  const [filterPayment, setFilterPayment] = useState<"All" | "Cash" | "GCash">("All");
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  // Get unique years from data
  const availableYears = useMemo(() => {
    const years = new Set(attendance.map(a => new Date(a.date).getFullYear()));
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [attendance]);

  // Filter and aggregate revenue data
  const revenueData = useMemo(() => {
    let filtered = attendance;

    // Filter by payment type
    if (filterPayment !== "All") {
      filtered = filtered.filter(a => a.paymentMethod === filterPayment);
    }

    // Filter by view type
    if (filterView === "Day") {
      filtered = filtered.filter(a => a.date === selectedDate);
    } else if (filterView === "Month") {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth);
      filtered = filtered.filter(a => {
        const date = new Date(a.date);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      });
    } else if (filterView === "Year") {
      const year = parseInt(selectedYear);
      filtered = filtered.filter(a => {
        const date = new Date(a.date);
        return date.getFullYear() === year;
      });
    }

    return filtered;
  }, [attendance, filterView, selectedDate, selectedYear, selectedMonth, filterPayment]);

  // Calculate totals
  const totals: RevenueTotals = useMemo(() => {
    const total = revenueData.reduce((sum, a) => sum + a.price, 0);
    const cash = revenueData.filter(a => a.paymentMethod === 'Cash').reduce((sum, a) => sum + a.price, 0);
    const gcash = revenueData.filter(a => a.paymentMethod === 'GCash').reduce((sum, a) => sum + a.price, 0);
    const transactions = revenueData.length;

    return { total, cash, gcash, transactions };
  }, [revenueData]);

  // Get previous period data for comparison
  const previousPeriodData = useMemo(() => {
    let prevFiltered = attendance;

    if (filterPayment !== "All") {
      prevFiltered = prevFiltered.filter(a => a.paymentMethod === filterPayment);
    }

    if (filterView === "Day") {
      const prevDate = new Date(selectedDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = prevDate.toISOString().split('T')[0];
      prevFiltered = prevFiltered.filter(a => a.date === prevDateStr);
    } else if (filterView === "Month") {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth);
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      prevFiltered = prevFiltered.filter(a => {
        const date = new Date(a.date);
        return date.getFullYear() === prevYear && date.getMonth() + 1 === prevMonth;
      });
    } else if (filterView === "Year") {
      const prevYear = parseInt(selectedYear) - 1;
      prevFiltered = prevFiltered.filter(a => {
        const date = new Date(a.date);
        return date.getFullYear() === prevYear;
      });
    }

    return prevFiltered.reduce((sum, a) => sum + a.price, 0);
  }, [attendance, filterView, selectedDate, selectedYear, selectedMonth, filterPayment]);

  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (previousPeriodData === 0) return 0;
    return ((totals.total - previousPeriodData) / previousPeriodData) * 100;
  }, [totals.total, previousPeriodData]);

  // Chart data for Month view (daily)
  const dailyChartData: DailyChartData[] = useMemo(() => {
    if (filterView !== "Month") return [];
    
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const data: DailyChartData[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayRevenue = revenueData.filter(a => a.date === dateStr);
      const total = dayRevenue.reduce((sum, a) => sum + a.price, 0);
      data.push({ day, total, date: dateStr });
    }
    
    return data;
  }, [filterView, selectedYear, selectedMonth, revenueData]);

  // Chart data for Year view (monthly)
  const monthlyChartData: MonthlyChartData[] = useMemo(() => {
    if (filterView !== "Year") return [];
    
    const year = parseInt(selectedYear);
    const data: MonthlyChartData[] = [];
    
    for (let month = 1; month <= 12; month++) {
      const monthRevenue = revenueData.filter(a => {
        const date = new Date(a.date);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      });
      const total = monthRevenue.reduce((sum, a) => sum + a.price, 0);
      data.push({ month, total, name: getShortMonthName(month - 1) });
    }
    
    return data;
  }, [filterView, selectedYear, revenueData]);

  // Get label for current view
  const getViewLabel = () => {
    if (filterView === "Day") {
      return new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else if (filterView === "Month") {
      return `${getMonthName(parseInt(selectedMonth) - 1)} ${selectedYear}`;
    }
    return `Year ${selectedYear}`;
  };

  return (
    <div className="flex flex-col h-full w-full gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-950 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Revenue</h1>
            <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">Track gym income and financial reports.</p>
          </div>
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 text-xs font-mono">
            {getViewLabel()}
          </span>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* View Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowViewDropdown(!showViewDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-28 justify-between"
              >
                <span>{filterView}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showViewDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  <button onClick={() => { setFilterView('Day'); setShowViewDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Day</button>
                  <button onClick={() => { setFilterView('Month'); setShowViewDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Month</button>
                  <button onClick={() => { setFilterView('Year'); setShowViewDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Year</button>
                </div>
              )}
            </div>

            {/* Year Filter (for Month and Year views) */}
            {(filterView === "Month" || filterView === "Year") && (
              <div className="relative flex-1 sm:flex-initial">
                <button 
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-28 justify-between"
                >
                  <span>{selectedYear}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1 max-h-48 overflow-y-auto">
                    {availableYears.map(year => (
                      <button 
                        key={year} 
                        onClick={() => { setSelectedYear(year.toString()); setShowYearDropdown(false); }} 
                        className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Month Filter (for Month view) */}
            {filterView === "Month" && (
              <div className="relative flex-1 sm:flex-initial">
                <button 
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-32 justify-between"
                >
                  <span className="truncate">{getMonthName(parseInt(selectedMonth) - 1)}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </button>
                {showMonthDropdown && (
                  <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <button 
                        key={month} 
                        onClick={() => { setSelectedMonth(month.toString()); setShowMonthDropdown(false); }} 
                        className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                      >
                        {getMonthName(month - 1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Date Filter (for Day view) */}
            {filterView === "Day" && (
              <input
                type="date"
                className="flex-1 sm:flex-initial bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-red-600 w-full sm:w-40 [color-scheme:dark]"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}

            {/* Payment Type Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-28 justify-between"
              >
                <span>{filterPayment === 'All' ? 'All' : filterPayment}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showPaymentDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  <button onClick={() => { setFilterPayment('All'); setShowPaymentDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">All</button>
                  <button onClick={() => { setFilterPayment('Cash'); setShowPaymentDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Cash</button>
                  <button onClick={() => { setFilterPayment('GCash'); setShowPaymentDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">GCash</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <RevenueStats totals={totals} percentageChange={percentageChange} />

      {/* Chart & Revenue List */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 overflow-hidden">
        {/* Revenue Chart */}
        <RevenueChart 
          filterView={filterView}
          dailyChartData={dailyChartData}
          monthlyChartData={monthlyChartData}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />

        {/* Recent Transactions */}
        <RecentTransactions transactions={revenueData} />
      </div>
    </div>
  );
}