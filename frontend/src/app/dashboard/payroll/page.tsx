"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, AlertTriangle, RefreshCw } from "lucide-react";
import { PayrollRecord, PayrollTotals, Employee } from '../../types/payroll';
import { STORAGE_KEYS } from '../../lib/constants';
import { 
  getInitialData, 
  getPhilippinesDate, 
  getCurrentMonthYear, 
  getMonthName, 
  getPayrollKey 
} from '../../lib/utils';
import { PayrollStats, PayrollTable, PayrollConfirmModal } from '../../components/payroll';

// Generate initial payroll with auto-entries for active employees
function generateInitialPayroll(existingPayroll: PayrollRecord[], employees: Employee[]): PayrollRecord[] {
  const activeEmployees = employees.filter(e => e.status === 'Active');
  const current = getCurrentMonthYear();
  const existingKeys = new Set(existingPayroll.map(p => getPayrollKey(p.employeeId, p.month, p.year)));
  
  const newPayrollEntries: PayrollRecord[] = [];
  
  // Generate payroll for current month and next 2 months for all active employees
  for (let i = 0; i < 3; i++) {
    let targetMonth = current.month + i;
    let targetYear = current.year;
    
    // Handle year overflow
    while (targetMonth > 12) {
      targetMonth -= 12;
      targetYear += 1;
    }
    
    activeEmployees.forEach(emp => {
      const key = getPayrollKey(emp.id, targetMonth, targetYear);
      if (!existingKeys.has(key)) {
        // Check if employee was hired before this month
        const hireDate = new Date(emp.dateHired);
        const targetDate = new Date(targetYear, targetMonth - 1, 1);
        
        if (hireDate <= targetDate) {
          newPayrollEntries.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            employeeId: emp.id,
            employeeName: emp.name,
            salary: parseInt(emp.salary),
            month: targetMonth,
            year: targetYear,
            status: 'Unpaid',
            createdAt: getPhilippinesDate(),
            paidAt: null,
            markedBy: null
          });
        }
      }
    });
  }
  
  if (newPayrollEntries.length > 0) {
    const updated = [...existingPayroll, ...newPayrollEntries];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(updated));
    }
    return updated;
  }
  
  return existingPayroll;
}

export default function PayrollPage() {
  const [employees] = useState<Employee[]>(() => getInitialData(STORAGE_KEYS.EMPLOYEES) as Employee[]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(() => {
    const existingPayroll = getInitialData(STORAGE_KEYS.PAYROLL) as PayrollRecord[];
    const existingEmployees = getInitialData(STORAGE_KEYS.EMPLOYEES) as Employee[];
    return generateInitialPayroll(existingPayroll, existingEmployees);
  });
  
  // Filter States
  const [filterMonth, setFilterMonth] = useState(getCurrentMonthYear().month.toString());
  const [filterYear, setFilterYear] = useState(getCurrentMonthYear().year.toString());
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Modal States
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);

  // Get unique years from payroll data
  const availableYears = useMemo(() => {
    const years = new Set(payroll.map(p => p.year));
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    years.add(currentYear + 1);
    return Array.from(years).sort((a, b) => b - a);
  }, [payroll]);

  // Get active employees
  const activeEmployees = useMemo(() => {
    return employees.filter(e => e.status === 'Active');
  }, [employees]);

  // Filter payroll records
  const filteredPayroll = useMemo(() => {
    let filtered = payroll;

    // Filter by month
    if (filterMonth !== "All") {
      filtered = filtered.filter(p => p.month === parseInt(filterMonth));
    }

    // Filter by year
    if (filterYear !== "All") {
      filtered = filtered.filter(p => p.year === parseInt(filterYear));
    }

    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by employee name, then by year and month descending
    return filtered.sort((a, b) => {
      if (a.employeeName !== b.employeeName) {
        return a.employeeName.localeCompare(b.employeeName);
      }
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return b.month - a.month;
    });
  }, [payroll, filterMonth, filterYear, filterStatus, searchTerm]);

  // Calculate totals
  const totals: PayrollTotals = useMemo(() => {
    const total = filteredPayroll.reduce((sum, p) => sum + p.salary, 0);
    const paid = filteredPayroll.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.salary, 0);
    const unpaid = filteredPayroll.filter(p => p.status === 'Unpaid').reduce((sum, p) => sum + p.salary, 0);
    const paidCount = filteredPayroll.filter(p => p.status === 'Paid').length;
    const unpaidCount = filteredPayroll.filter(p => p.status === 'Unpaid').length;

    return { total, paid, unpaid, paidCount, unpaidCount };
  }, [filteredPayroll]);

  // Handle mark as paid
  const handleMarkAsPaid = () => {
    if (!selectedPayroll) return;

    const updatedPayroll = payroll.map(p => {
      if (p.id === selectedPayroll.id) {
        return {
          ...p,
          status: 'Paid' as const,
          paidAt: getPhilippinesDate(),
          markedBy: 'Admin'
        };
      }
      return p;
    });

    setPayroll(updatedPayroll);
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(updatedPayroll));
    
    setIsConfirmModalOpen(false);
    setSelectedPayroll(null);
  };

  // Open confirm modal
  const openConfirmModal = (record: PayrollRecord) => {
    setSelectedPayroll(record);
    setIsConfirmModalOpen(true);
  };

  // Refresh payroll (regenerate for all active employees)
  const handleRefresh = () => {
    const activeEmployees = employees.filter(e => e.status === 'Active');
    const current = getCurrentMonthYear();
    const existingKeys = new Set(payroll.map(p => getPayrollKey(p.employeeId, p.month, p.year)));
    
    const newPayrollEntries: PayrollRecord[] = [];
    
    // Generate payroll for current month and next 2 months
    for (let i = 0; i < 3; i++) {
      let targetMonth = current.month + i;
      let targetYear = current.year;
      
      while (targetMonth > 12) {
        targetMonth -= 12;
        targetYear += 1;
      }
      
      activeEmployees.forEach(emp => {
        const key = getPayrollKey(emp.id, targetMonth, targetYear);
        if (!existingKeys.has(key)) {
          const hireDate = new Date(emp.dateHired);
          const targetDate = new Date(targetYear, targetMonth - 1, 1);
          
          if (hireDate <= targetDate) {
            newPayrollEntries.push({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              employeeId: emp.id,
              employeeName: emp.name,
              salary: parseInt(emp.salary),
              month: targetMonth,
              year: targetYear,
              status: 'Unpaid',
              createdAt: getPhilippinesDate(),
              paidAt: null,
              markedBy: null
            });
          }
        }
      });
    }
    
    if (newPayrollEntries.length > 0) {
      const updatedPayroll = [...payroll, ...newPayrollEntries];
      setPayroll(updatedPayroll);
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(updatedPayroll));
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-950 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Payroll</h1>
            <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">Manage employee salaries and payments.</p>
          </div>
          
          <button 
            onClick={handleRefresh}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Payroll</span>
          </button>
        </div>

        {/* Stats Cards */}
        <PayrollStats 
          totals={totals}
          recordCount={filteredPayroll.length}
          activeEmployeeCount={activeEmployees.length}
        />

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search employee..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-600/20 focus:border-red-600 placeholder-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Month Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-36 justify-between"
              >
                <span className="truncate whitespace-nowrap">{filterMonth === 'All' ? 'All Months' : getMonthName(parseInt(filterMonth))}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showMonthDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1 max-h-48 overflow-y-auto">
                  <button onClick={() => { setFilterMonth('All'); setShowMonthDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">All Months</button>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <button 
                      key={month} 
                      onClick={() => { setFilterMonth(month.toString()); setShowMonthDropdown(false); }} 
                      className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    >
                      {getMonthName(month)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-24 justify-between"
              >
                <span className="whitespace-nowrap">{filterYear}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showYearDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1 max-h-48 overflow-y-auto">
                  {availableYears.map(year => (
                    <button 
                      key={year} 
                      onClick={() => { setFilterYear(year.toString()); setShowYearDropdown(false); }} 
                      className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-32 justify-between"
              >
                <span className="whitespace-nowrap">{filterStatus === 'All' ? 'All Status' : filterStatus}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  <button onClick={() => { setFilterStatus('All'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">All Status</button>
                  <button onClick={() => { setFilterStatus('Paid'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Paid</button>
                  <button onClick={() => { setFilterStatus('Unpaid'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Unpaid</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex items-start gap-2 flex-shrink-0">
        <AlertTriangle className="h-4 w-4 text-zinc-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-zinc-400">
            <span className="font-bold text-zinc-300">Auto-generated:</span> Payroll is automatically created for all active employees. 
            When you pay an employee, the next month&apos;s payroll will be generated automatically.
          </p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="flex-1 min-h-0 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        {filteredPayroll.length === 0 ? (
          <div className="flex items-center justify-center h-full py-12">
            <p className="text-zinc-500 text-sm">
              {activeEmployees.length === 0 
                ? 'No active employees found. Add employees first.'
                : 'No payroll records found for the selected filters.'}
            </p>
          </div>
        ) : (
          <PayrollTable records={filteredPayroll} onMarkAsPaid={openConfirmModal} />
        )}
      </div>

      {/* Confirm Payment Modal */}
      <PayrollConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleMarkAsPaid}
        record={selectedPayroll}
      />
    </div>
  );
}