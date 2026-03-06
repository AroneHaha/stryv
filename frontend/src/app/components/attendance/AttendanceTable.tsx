"use client";

import { Eye } from "lucide-react";
import { AttendanceRecord } from '../../types/attendance';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onViewDetail: (record: AttendanceRecord) => void;
}

export default function AttendanceTable({ records, onViewDetail }: AttendanceTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm">No attendance records found.</p>
        </div>
      </div>
    );
  }

  return (
    <table className="w-full text-left min-w-[650px]">
      <thead className="bg-zinc-950 border-b border-zinc-800 sticky top-0">
        <tr>
          <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Category
          </th>
          <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Payment
          </th>
          <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Amount
          </th>
          <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Date/Time
          </th>
          <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800">
        {records.map((record) => (
          <tr
            key={record.id}
            className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
            onClick={() => onViewDetail(record)}
          >
            <td className="px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-zinc-300 flex-shrink-0">
                  {record.name.charAt(0)}
                </div>
                <p className="text-xs sm:text-sm font-bold text-white truncate leading-tight">
                  {record.name}
                </p>
              </div>
            </td>
            <td className="px-3 sm:px-4 py-3 sm:py-4">
              <span
                className={`px-2 py-1 rounded text-[10px] sm:text-xs font-bold ${
                  record.type === 'Member'
                    ? 'bg-green-600/20 text-green-500'
                    : record.type === 'Walk-in'
                      ? 'bg-blue-600/20 text-blue-500'
                      : 'bg-orange-600/20 text-orange-500'
                }`}
              >
                {record.type}
              </span>
            </td>
            <td className="px-3 sm:px-4 py-3 sm:py-4">
              <span className="text-[10px] sm:text-xs text-zinc-400">{record.customerType}</span>
            </td>
            <td className="px-3 sm:px-4 py-3 sm:py-4">
              <span
                className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${
                  record.paymentMethod === 'GCash'
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {record.paymentMethod}
              </span>
            </td>
            <td className="px-3 sm:px-4 py-3 sm:py-4">
              <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                ₱{record.price.toLocaleString()}
              </span>
            </td>
            <td className="px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">{record.date}</span>
                <span className="text-[9px] sm:text-[10px] text-zinc-600">{record.time}</span>
              </div>
            </td>
            <td className="px-3 sm:px-4 py-3 sm:py-4 text-right" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onViewDetail(record)}
                className="p-1 sm:p-1.5 text-zinc-500 hover:text-white transition-colors rounded hover:bg-zinc-800"
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
