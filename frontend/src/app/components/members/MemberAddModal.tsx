"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Member, MemberFormData } from '../../types/member';
import { CUSTOMER_TYPES, PAYMENT_METHODS, MEMBER_PLANS, MEMBERSHIP_PRICES } from '../../lib/constants';
import { generateUsername, generatePassword, calculateMembershipPrice, calculateExpirationDate } from '../../lib/utils';

interface MemberAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Member) => void;
  existingUsernames: string[];
}

const initialFormData: MemberFormData = {
  firstName: "",
  lastName: "",
  email: "",
  birthdate: "",
  plan: "6 Months",
  customerType: "Regular",
  paymentMethod: "Cash"
};

export default function MemberAddModal({ isOpen, onClose, onSubmit, existingUsernames }: MemberAddModalProps) {
  const [formData, setFormData] = useState<MemberFormData>(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const username = generateUsername(formData.firstName, formData.lastName, existingUsernames);
    const password = generatePassword(formData.lastName, formData.birthdate);
    const price = calculateMembershipPrice(formData.plan, formData.customerType);
    
    const startDate = new Date();
    const expirationDate = calculateExpirationDate(startDate, formData.plan);

    const newMember: Member = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      birthdate: formData.birthdate,
      customerType: formData.customerType,
      plan: formData.plan,
      paymentMethod: formData.paymentMethod,
      price,
      startDate: startDate.toISOString().split('T')[0],
      expirationDate: expirationDate.toISOString().split('T')[0],
      username,
      password,
      status: 'Active'
    };

    onSubmit(newMember);
    setFormData(initialFormData);
    onClose();
  };

  const getPrice = () => {
    return MEMBERSHIP_PRICES[formData.plan][formData.customerType === 'Student' ? 'student' : 'regular'];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Add New Member</h3>
            <p className="text-zinc-500 text-xs sm:text-sm">Fill in the details below to generate account.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">First Name</label>
              <input
                required
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                placeholder="e.g. Juan"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Last Name</label>
              <input
                required
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                placeholder="e.g. Dela Cruz"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Email</label>
            <input
              required
              type="email"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
              placeholder="e.g. juan@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Birthdate</label>
            <input
              required
              type="date"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm [color-scheme:dark]"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Customer Type</label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value as 'Regular' | 'Student' })}
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
                onChange={(e) => setFormData({ ...formData, plan: e.target.value as '6 Months' | '1 Year' })}
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
                  onClick={() => setFormData({ ...formData, paymentMethod: method as 'Cash' | 'GCash' })}
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
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:scale-105"
              >
                Add Member
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}