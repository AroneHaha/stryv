"use client";

import { DollarSign, TrendingUp, TrendingDown, Banknote, CreditCard } from "lucide-react";
import { RevenueTotals } from '../../types/revenue';
import { formatCurrency } from '../../lib/utils';

interface RevenueStatsProps {
  totals: RevenueTotals;
  percentageChange: number;
}

export default function RevenueStats({ totals, percentageChange }: RevenueStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 flex-shrink-0">
      {/* Total Revenue */}
      <div className="col-span-2 sm:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Revenue</p>
            <h3 className="text-xl sm:text-2xl font-black text-white">{formatCurrency(totals.total)}</h3>
          </div>
          <div className="p-1.5 sm:p-2 rounded-lg bg-red-600/10">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center gap-1.5">
          {percentageChange >= 0 ? (
            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500" />
          )}
          <span className={`text-[10px] sm:text-xs font-bold ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
          </span>
          <span className="text-[9px] sm:text-[10px] text-zinc-600">vs prev. period</span>
        </div>
      </div>

      {/* Cash */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Cash</p>
        <div className="flex items-center gap-2">
          <Banknote className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          <h3 className="text-base sm:text-xl font-black text-white">{formatCurrency(totals.cash)}</h3>
        </div>
        <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1">
          {totals.total > 0 ? ((totals.cash / totals.total) * 100).toFixed(0) : 0}% of total
        </p>
      </div>

      {/* GCash */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">GCash</p>
        <div className="flex items-center gap-2">
          <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
          <h3 className="text-base sm:text-xl font-black text-white">{formatCurrency(totals.gcash)}</h3>
        </div>
        <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1">
          {totals.total > 0 ? ((totals.gcash / totals.total) * 100).toFixed(0) : 0}% of total
        </p>
      </div>

      {/* Transactions */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Transactions</p>
        <h3 className="text-base sm:text-xl font-black text-white">{totals.transactions}</h3>
        <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1">
          Avg: {totals.transactions > 0 ? formatCurrency(Math.round(totals.total / totals.transactions)) : '₱0'}
        </p>
      </div>
    </div>
  );
}