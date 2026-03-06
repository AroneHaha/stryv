"use client";

import { useState, useRef, useMemo } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Member, AttendanceRecord } from '../../types/attendance';
import { PRICES, ATTENDANCE_TYPES, CUSTOMER_TYPES, PAYMENT_METHODS } from '../../lib/constants';
import { getPhilippinesDateTime, getMembershipStatus, generateId } from '../../lib/utils';

interface AttendanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: AttendanceRecord) => void;
  members: Member[];
  existingAttendance: AttendanceRecord[];
}

const initialFormData = {
  name: "",
  type: "Member" as 'Member' | 'Walk-in' | 'Expired',
  customerType: "Regular" as 'Regular' | 'Student',
  paymentMethod: "Cash" as 'Cash' | 'GCash',
  price: 0,
  memberId: "",
};

export default function AttendanceForm({ isOpen, onClose, onSubmit, members, existingAttendance }: AttendanceFormProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute suggestions based on current input
  const suggestions = useMemo(() => {
    if (formData.name.length > 0 && showSuggestions) {
      return members.filter(
        (m) =>
          m.name.toLowerCase().includes(formData.name.toLowerCase()) ||
          m.username.toLowerCase().includes(formData.name.toLowerCase())
      );
    }
    return [];
  }, [formData.name, members, showSuggestions]);

  // Calculate price based on type and customer type
  const calculatePrice = (type: string, customerType: string): number => {
    if (type === 'Walk-in' || type === 'Expired') {
      return customerType === 'Student' ? PRICES.walkIn.student : PRICES.walkIn.regular;
    }
    return customerType === 'Student' ? PRICES.member.student : PRICES.member.regular;
  };

  // Handle member selection from suggestions
  const handleSelectMember = (member: Member) => {
    const membershipStatus = getMembershipStatus(member.expirationDate);

    setFormData({
      name: member.name,
      type: membershipStatus.status === 'Expired' ? 'Expired' : 'Member',
      customerType: member.customerType,
      paymentMethod: "Cash",
      price:
        membershipStatus.status === 'Expired'
          ? calculatePrice('Expired', member.customerType)
          : calculatePrice('Member', member.customerType),
      memberId: member.id,
    });

    setShowSuggestions(false);
    setShowExpiredWarning(membershipStatus.status === 'Expired');
  };

  // Handle name input change
  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value, memberId: "" });
    setShowSuggestions(true);
    setShowExpiredWarning(false);

    // Reset to walk-in defaults if typing manually
    if (!suggestions.find((s) => s.name.toLowerCase() === value.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        name: value,
        type: 'Walk-in',
        customerType: 'Regular',
        price: calculatePrice('Walk-in', 'Regular'),
        memberId: "",
      }));
    }
  };

  // Handle type change
  const handleTypeChange = (type: string) => {
    const newPrice = calculatePrice(type, formData.customerType);
    setFormData({ ...formData, type: type as typeof formData.type, price: newPrice });
  };

  // Handle customer type change
  const handleCustomerTypeChange = (customerType: string) => {
    const newPrice = calculatePrice(formData.type, customerType);
    setFormData({ ...formData, customerType: customerType as typeof formData.customerType, price: newPrice });
  };

  // Submit attendance
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { date, time } = getPhilippinesDateTime();

    // Check for duplicate
    if (formData.memberId) {
      const today = date;
      const hasDuplicate = existingAttendance.some(
        (a) => a.memberId === formData.memberId && a.date === today
      );
      if (hasDuplicate) {
        alert('This member already has an attendance record for today!');
        return;
      }
    }

    const newAttendance: AttendanceRecord = {
      id: generateId(),
      name: formData.name,
      memberId: formData.memberId || undefined,
      type: formData.type,
      customerType: formData.customerType,
      paymentMethod: formData.paymentMethod,
      price: formData.price,
      date,
      time,
      recordedBy: 'Admin',
    };

    onSubmit(newAttendance);

    // Reset form
    setFormData(initialFormData);
    setShowExpiredWarning(false);
    onClose();
  };

  // Reset form when modal opens/closes
  const handleClose = () => {
    setFormData(initialFormData);
    setShowExpiredWarning(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Record Attendance</h3>
            <p className="text-zinc-500 text-xs sm:text-sm">Log member or walk-in attendance.</p>
          </div>
          <button onClick={handleClose} className="text-zinc-400 hover:text-white p-1">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name Input with Auto-suggest */}
          <div className="space-y-1.5 sm:space-y-2 relative">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Name</label>
            <input
              required
              ref={inputRef}
              type="text"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
              placeholder="Type name to search members..."
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {suggestions.map((member) => {
                  const status = getMembershipStatus(member.expirationDate);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleSelectMember(member)}
                      className="w-full px-4 py-2.5 text-left hover:bg-zinc-800 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                          {member.firstName?.charAt(0) || member.name.charAt(0)}
                          {member.lastName?.charAt(0) || ''}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{member.name}</p>
                          <p className="text-[10px] text-zinc-500">
                            {member.customerType} • {member.username}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          status.status === 'Active'
                            ? 'bg-green-600/20 text-green-500'
                            : status.status === 'Expiring Soon'
                              ? 'bg-orange-600/20 text-orange-500'
                              : 'bg-red-600/20 text-red-500'
                        }`}
                      >
                        {status.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Expired Warning */}
          {showExpiredWarning && (
            <div className="bg-orange-600/10 border border-orange-600/30 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-orange-500">Membership Expired</p>
                <p className="text-[10px] text-orange-400/80">Walk-in rate will be applied for this attendance.</p>
              </div>
            </div>
          )}

          {/* Type Selection */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {ATTENDANCE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  disabled={!!(formData.memberId && type === 'Walk-in')}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    formData.type === type
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  } ${formData.memberId && type === 'Walk-in' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Type */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Customer Type</label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {CUSTOMER_TYPES.map((type: string) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleCustomerTypeChange(type)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                    formData.customerType === type
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-bold">
                    {type}
                    {type === 'Student' ? ' (20% off)' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Payment Method</label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {PAYMENT_METHODS.map((method: string) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method as 'Cash' | 'GCash' })}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                    formData.paymentMethod === method
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-bold">{method}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Amount to Pay</p>
                <p className="text-xl sm:text-2xl font-black text-white">
                  ₱{formData.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500">
                  {formData.type === 'Member' ? 'Member Rate' : 'Walk-in Rate'}
                </p>
                <p className="text-xs text-zinc-400">
                  {formData.customerType === 'Student' ? '(Student Discount Applied)' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row justify-end items-center gap-3">
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:scale-105"
              >
                Record Attendance
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
