"use client";

import { X } from "lucide-react";
import { Employee, EmployeeFormData } from '../../types/employees';
import { EMPLOYEE_ROLES } from '../../lib/constants';

interface EmployeeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmployeeFormData) => void;
  employee: Employee | null;
  formData: EmployeeFormData;
  onFormDataChange: (data: EmployeeFormData) => void;
}

export default function EmployeeEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  employee,
  formData,
  onFormDataChange 
}: EmployeeEditModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Edit Employee</h3>
            <p className="text-zinc-500 text-xs sm:text-sm">Update employee information below.</p>
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
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Phone</label>
            <input
              type="tel"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Role</label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                value={formData.role}
                onChange={(e) => onFormDataChange({ ...formData, role: e.target.value as EmployeeFormData['role'] })}
              >
                {EMPLOYEE_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Monthly Salary</label>
              <input
                type="number"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                value={formData.salary}
                onChange={(e) => onFormDataChange({ ...formData, salary: e.target.value })}
              />
              <p className="text-[10px] text-zinc-500 mt-1">Changing salary will also update all unpaid payroll records.</p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row justify-end items-center gap-3">
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