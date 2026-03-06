"use client";

import { X, Edit, Mail, Phone, User, Calendar, Briefcase, Banknote } from "lucide-react";
import { Employee } from '../../types/employees';

interface EmployeeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
}

export default function EmployeeViewModal({ isOpen, onClose, employee, onEdit }: EmployeeViewModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Employee Details</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Employee Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-800">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-xl sm:text-2xl font-black text-white">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white">{employee.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                employee.status === 'Active' 
                  ? 'bg-green-600/20 text-green-500' 
                  : 'bg-red-600/20 text-red-500'
              }`}>
                {employee.status}
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-300">
                {employee.role}
              </span>
            </div>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Email</p>
            <p className="text-sm font-medium text-white truncate">{employee.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Phone</p>
            <p className="text-sm font-medium text-white">{employee.phone}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Role</p>
            <p className="text-sm font-medium text-white">{employee.role}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Salary</p>
            <p className="text-sm font-medium text-white">₱{parseInt(employee.salary).toLocaleString()}/mo</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Date Hired</p>
            <p className="text-sm font-medium text-white">{employee.dateHired}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Employee ID</p>
            <p className="text-sm font-medium text-white font-mono">{employee.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

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
              onEdit(employee);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}