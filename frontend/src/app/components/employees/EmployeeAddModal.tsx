"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Employee, EmployeeFormData } from '../../types/employees';
import { EMPLOYEE_ROLES } from '../../lib/constants';

interface EmployeeAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Employee) => void;
}

const initialFormData: EmployeeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "Trainer",
  salary: ""
};

export default function EmployeeAddModal({ isOpen, onClose, onSubmit }: EmployeeAddModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEmployee: Employee = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      salary: formData.salary,
      dateHired: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    onSubmit(newEmployee);
    setFormData(initialFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Add New Employee</h3>
            <p className="text-zinc-500 text-xs sm:text-sm">Fill in the details below.</p>
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
              placeholder="e.g. juan@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Phone</label>
            <input
              required
              type="tel"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
              placeholder="e.g. 09123456789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Role</label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as EmployeeFormData['role'] })}
              >
                {EMPLOYEE_ROLES.map((role: EmployeeFormData['role']) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Monthly Salary</label>
              <input
                required
                type="number"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 focus:border-red-600 text-sm"
                placeholder="e.g. 15000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
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
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-lg shadow-red-600/20 hover:scale-105"
              >
                Add Employee
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}