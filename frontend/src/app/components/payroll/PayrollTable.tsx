"use client";

import { Calendar, CheckCircle } from "lucide-react";
import { PayrollRecord } from '../../types/payroll';
import { formatCurrency, getMonthName } from '../../lib/utils';

interface PayrollTableProps {
  records: PayrollRecord[];
  onMarkAsPaid: (record: PayrollRecord) => void;
}

export default function PayrollTable({ records, onMarkAsPaid }: PayrollTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <p className="text-zinc-500 text-sm">No payroll records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto h-full overflow-y-auto">
      <table className="w-full text-left min-w-[650px]">
        <thead className="bg-zinc-950 border-b border-zinc-800 sticky top-0">
          <tr>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Employee</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Salary</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Period</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Paid On</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-zinc-300 flex-shrink-0">
                    {record.employeeName.charAt(0)}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white truncate leading-tight">{record.employeeName}</p>
                </div>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <span className="text-xs sm:text-sm text-zinc-400 font-medium">{formatCurrency(record.salary)}</span>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">
                    {getMonthName(record.month)} {record.year}
                  </span>
                </div>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-bold ${
                  record.status === 'Paid' 
                    ? 'bg-green-600/20 text-green-500' 
                    : 'bg-orange-600/20 text-orange-500'
                }`}>
                  {record.status}
                </span>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                {record.paidAt ? (
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-zinc-400">{record.paidAt}</span>
                    {record.markedBy && (
                      <span className="text-[9px] sm:text-[10px] text-zinc-600">by {record.markedBy}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] sm:text-xs text-zinc-600">—</span>
                )}
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
                {record.status === 'Unpaid' ? (
                  <button
                    onClick={() => onMarkAsPaid(record)}
                    className="px-3 py-1.5 bg-green-600/10 text-green-500 border border-green-600/30 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-green-600/20 transition-colors"
                  >
                    Mark as Paid
                  </button>
                ) : (
                  <span className="flex items-center justify-end gap-1.5 text-zinc-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="text-[10px] sm:text-xs">Completed</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}