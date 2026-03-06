"use client";

import { X, AlertTriangle } from "lucide-react";
import { PayrollRecord } from '../../types/payroll';
import { formatCurrency, getMonthName } from '../../lib/utils';

interface PayrollConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  record: PayrollRecord | null;
}

export default function PayrollConfirmModal({ isOpen, onClose, onConfirm, record }: PayrollConfirmModalProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Confirm Payment</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Employee Info */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">
                {record.employeeName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{record.employeeName}</p>
                <p className="text-[10px] text-zinc-500">{getMonthName(record.month)} {record.year}</p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center py-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Amount to Pay</p>
            <p className="text-3xl font-black text-green-500">{formatCurrency(record.salary)}</p>
          </div>

          {/* Warning */}
          <div className="bg-orange-600/10 border border-orange-600/30 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-orange-500">Warning</p>
              <p className="text-[10px] text-orange-400/80">This action cannot be easily undone. Please confirm this payment is correct.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-500 rounded-lg transition-all"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}