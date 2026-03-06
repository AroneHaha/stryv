"use client";

import { Banknote, CreditCard } from "lucide-react";
import { TransactionRecord } from '../../types/revenue';
import { formatCurrency } from '../../lib/utils';

interface RecentTransactionsProps {
  transactions: TransactionRecord[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4 flex flex-col min-h-0">
      <h3 className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 flex-shrink-0">Recent Transactions</h3>
      
      <div className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 pr-0.5 sm:pr-1">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-zinc-500">No transactions found</p>
          </div>
        ) : (
          transactions.slice(0, 15).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                  record.paymentMethod === 'GCash' ? 'bg-blue-600/10' : 'bg-green-600/10'
                }`}>
                  {record.paymentMethod === 'GCash' ? (
                    <CreditCard className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" />
                  ) : (
                    <Banknote className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-white truncate leading-tight">{record.name}</p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 truncate leading-tight">{record.date} • {record.time}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-[10px] sm:text-xs font-bold text-green-500">{formatCurrency(record.price)}</p>
                <p className="text-[9px] text-zinc-600">{record.type}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}