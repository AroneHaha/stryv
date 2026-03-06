"use client";

import { X } from "lucide-react";
import { Member, MemberFormData } from '../../types/member';
import { CUSTOMER_TYPES, PAYMENT_METHODS, MEMBER_PLANS, MEMBERSHIP_PRICES } from '../../lib/constants';

interface MemberEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MemberFormData) => void;
  member: Member | null;
  formData: MemberFormData;
  onFormDataChange: (data: MemberFormData) => void;
}

export default function MemberEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  member,
  formData,
  onFormDataChange 
}: MemberEditModalProps) {
  if (!isOpen || !member) return null;

  const getPrice = () => {
    return MEMBERSHIP_PRICES[formData.plan][formData.customerType === 'Student' ? 'student' : 'regular'];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Edit Member</h3>
            <p className="text-zinc-500 text-xs sm:text-sm">Update member information below.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">First Name</label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                value={formData.firstName}
                onChange={(e) => onFormDataChange({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Last Name</label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                value={formData.lastName}
                onChange={(e) => onFormDataChange({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Email</label>
            <input
              type="email"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Birthdate</label>
            <input
              type="date"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm [color-scheme:dark]"
              value={formData.birthdate}
              onChange={(e) => onFormDataChange({ ...formData, birthdate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Customer Type</label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                value={formData.customerType}
                onChange={(e) => onFormDataChange({ ...formData, customerType: e.target.value as 'Regular' | 'Student' })}
              >
                {CUSTOMER_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Plan</label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                value={formData.plan}
                onChange={(e) => onFormDataChange({ ...formData, plan: e.target.value as '6 Months' | '1 Year' })}
              >
                {MEMBER_PLANS.map((plan) => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Mode of Payment</label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {PAYMENT_METHODS.map((method) => (
                <button 
                  key={method}
                  type="button"
                  onClick={() => onFormDataChange({ ...formData, paymentMethod: method as 'Cash' | 'GCash' })}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                    formData.paymentMethod === method 
                      ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-bold">{method}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-zinc-500">
              Total: ₱{getPrice().toLocaleString()}
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => onSave(formData)}
                className="flex-1 sm:flex-initial px-6 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}