"use client";

import { X, Calendar, Clock, User, CreditCard, DollarSign } from "lucide-react";
import { AttendanceRecord } from '../../types/attendance';

interface AttendanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
}

export default function AttendanceDetailModal({ isOpen, onClose, record }: AttendanceDetailModalProps) {
  if (!isOpen || !record) return null;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'Member':
        return 'bg-green-600/20 text-green-500';
      case 'Walk-in':
        return 'bg-blue-600/20 text-blue-500';
      case 'Expired':
        return 'bg-orange-600/20 text-orange-500';
      default:
        return 'bg-zinc-600/20 text-zinc-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Attendance Details</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name Header */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-300">
              {record.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{record.name}</p>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getTypeStyles(record.type)}`}>
                {record.type}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-3 w-3 text-zinc-500" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Category</p>
              </div>
              <p className="text-sm font-bold text-white">{record.customerType}</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-3 w-3 text-zinc-500" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Payment</p>
              </div>
              <p className="text-sm font-bold text-white">{record.paymentMethod}</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-3 w-3 text-zinc-500" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Amount</p>
              </div>
              <p className="text-sm font-bold text-green-500">₱{record.price.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-950 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-3 w-3 text-zinc-500" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Recorded By</p>
              </div>
              <p className="text-sm font-bold text-white">{record.recordedBy}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-zinc-950 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">{record.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">{record.time}</span>
              </div>
            </div>
          </div>

          {/* Member ID if exists */}
          {record.memberId && (
            <div className="bg-zinc-950 rounded-xl p-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Member ID</p>
              <p className="text-xs text-zinc-400 font-mono">{record.memberId}</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2.5 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}