"use client";

import { X, RefreshCw } from "lucide-react";
import { Member } from '../../types/member';
import { MEMBER_PLANS, MEMBERSHIP_PRICES } from '../../lib/constants';

interface MemberRenewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenew: (plan: '6 Months' | '1 Year') => void;
  member: Member | null;
}

export default function MemberRenewModal({ isOpen, onClose, onRenew, member }: MemberRenewModalProps) {
  if (!isOpen || !member) return null;

  const getPrice = (plan: '6 Months' | '1 Year') => {
    return MEMBERSHIP_PRICES[plan][member.customerType === 'Student' ? 'student' : 'regular'];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Renew Membership</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <p className="text-zinc-400 text-xs sm:text-sm mb-4">
          Select new membership duration for <span className="text-white font-medium">{member.name}</span>
        </p>

        <div className="space-y-3">
          {MEMBER_PLANS.map((plan) => (
            <button 
              key={plan}
              onClick={() => onRenew(plan)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-white transition-all"
            >
              <div className="text-left">
                <p className="font-bold text-sm">{plan}</p>
                <p className="text-xs text-zinc-400">
                  ₱{getPrice(plan).toLocaleString()}
                </p>
              </div>
              <RefreshCw className="h-4 w-4 text-zinc-400" />
            </button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-4 px-4 py-2.5 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}