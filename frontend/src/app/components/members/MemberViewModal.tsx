"use client";

import { X, Edit, RefreshCw, AlertTriangle } from "lucide-react";
import { Member } from '../../types/member';
import { isExpired, formatDisplayDate } from '../../lib/utils';

interface MemberViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onEdit: (member: Member) => void;
  onRenew: () => void;
}

export default function MemberViewModal({ isOpen, onClose, member, onEdit, onRenew }: MemberViewModalProps) {
  if (!isOpen || !member) return null;

  const memberExpired = isExpired(member.expirationDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Member Details</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Member Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-800">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-xl sm:text-2xl font-black text-white">
            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white">{member.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                memberExpired 
                  ? 'bg-red-600/20 text-red-500' 
                  : 'bg-green-600/20 text-green-500'
              }`}>
                {memberExpired ? 'Expired' : 'Active'}
              </span>
              <span className="text-zinc-500 text-xs">{member.customerType}</span>
            </div>
          </div>
        </div>

        {/* Member Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Email</p>
            <p className="text-sm font-medium text-white truncate">{member.email || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Birthdate</p>
            <p className="text-sm font-medium text-white">{member.birthdate ? formatDisplayDate(member.birthdate) : '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Plan</p>
            <p className="text-sm font-medium text-white">{member.plan}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Price</p>
            <p className="text-sm font-medium text-white">₱{member.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Joined/Renewed</p>
            <p className="text-sm font-medium text-white">{formatDisplayDate(member.startDate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Expiration</p>
            <p className="text-sm font-medium text-white">{formatDisplayDate(member.expirationDate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Payment Method</p>
            <p className="text-sm font-medium text-white">{member.paymentMethod}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Member ID</p>
            <p className="text-sm font-medium text-white font-mono">{member.id.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Username</p>
            <p className="text-sm font-medium text-white font-mono">{member.username}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Password</p>
            <p className="text-sm font-medium text-white font-mono">{member.password}</p>
          </div>
        </div>

        {/* Expired Warning */}
        {memberExpired && (
          <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-500">Membership Expired</p>
                <p className="text-xs text-red-400/80 mt-1">This member's membership has expired. Renew to restore access.</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => {
              onClose();
              onEdit(member);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          {memberExpired && (
            <button 
              onClick={() => {
                onClose();
                onRenew();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Renew
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
