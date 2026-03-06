"use client";

import { CheckCircle, Clock } from "lucide-react";
import { PayrollTotals } from '../../types/payroll'; 
import { formatCurrency } from '../../lib/utils';

interface PayrollStatsProps {
  totals: PayrollTotals;
  recordCount: number;
  activeEmployeeCount: number;
}

export default function PayrollStats({ totals, recordCount, activeEmployeeCount }: PayrollStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Payroll</p>
        <h3 className="text-lg sm:text-xl font-black text-white">{formatCurrency(totals.total)}</h3>
        <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1">{recordCount} records</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Paid</p>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          <h3 className="text-lg sm:text-xl font-black text-green-500">{formatCurrency(totals.paid)}</h3>
        </div>
        <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1">{totals.paidCount} employees</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Unpaid</p>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
          <h3 className="text-lg sm:text-xl font-black text-orange-500">{formatCurrency(totals.unpaid)}</h3>
        </div>
        <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1">{totals.unpaidCount} employees</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Active Employees</p>
        <h3 className="text-lg sm:text-xl font-black text-white">{activeEmployeeCount}</h3>
        <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1">on payroll</p>
      </div>
    </div>
  );
}
