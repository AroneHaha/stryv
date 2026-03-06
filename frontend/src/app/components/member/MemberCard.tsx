"use client";

import { CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { Member } from '../../types/member';
import { formatDisplayDate } from '../../lib/utils';

interface MemberCardProps {
  member: Member;
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiration: number;
  isCheckingIn: boolean;
  checkInSuccess: boolean;
  onCheckIn: () => void;
}

export default function MemberCard({
  member,
  isExpired,
  isExpiringSoon,
  daysUntilExpiration,
  isCheckingIn,
  checkInSuccess,
  onCheckIn
}: MemberCardProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-lg">
            {member.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{member.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isExpired 
                  ? 'bg-red-600/20 text-red-500' 
                  : isExpiringSoon 
                    ? 'bg-orange-600/20 text-orange-500'
                    : 'bg-green-600/20 text-green-500'
              }`}>
                {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
              </span>
              <span className="text-zinc-500 text-xs">{member.plan} Plan</span>
            </div>
          </div>
        </div>

        {/* Check-in Button */}
        <button
          onClick={onCheckIn}
          disabled={isCheckingIn || isExpired}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            isExpired 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : checkInSuccess
                ? 'bg-green-600 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:-translate-y-0.5'
          } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {isCheckingIn ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking in...
            </span>
          ) : checkInSuccess ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Checked In!
            </span>
          ) : isExpired ? (
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Expired
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Check In
            </span>
          )}
        </button>
      </div>

      {/* Membership Info */}
      <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Expiration</p>
          <p className="text-sm font-bold text-white">{formatDisplayDate(member.expirationDate)}</p>
          <p className={`text-[10px] mt-0.5 ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-orange-500' : 'text-zinc-500'}`}>
            {isExpired ? `${Math.abs(daysUntilExpiration)} days ago` : `${daysUntilExpiration} days left`}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Joined</p>
          <p className="text-sm font-bold text-white">{formatDisplayDate(member.startDate)}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Email</p>
          <p className="text-sm font-bold text-white truncate">{member.email || '—'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Member ID</p>
          <p className="text-sm font-bold text-white font-mono">{member.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
