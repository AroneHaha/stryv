"use client";

import { Eye, Edit, User, Mail, Phone } from "lucide-react";
import { Employee } from '../../types/employees';

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employeeId: string) => void;
}

export default function EmployeeTable({ employees, onView, onEdit, onToggleStatus }: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <p className="text-zinc-500 text-sm">No employees found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto h-full overflow-y-auto">
      <table className="w-full text-left min-w-[700px]">
        <thead className="bg-zinc-950 border-b border-zinc-800 sticky top-0">
          <tr>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Role</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Salary</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date Hired</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {employees.map((employee) => (
            <tr 
              key={employee.id} 
              className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
              onDoubleClick={() => onView(employee)}
            >
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-zinc-300 flex-shrink-0">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-white truncate leading-tight">{employee.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs text-zinc-400 truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs text-zinc-400">{employee.phone}</span>
                  </div>
                </div>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] sm:text-xs font-bold text-zinc-300">
                  {employee.role}
                </span>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <span className="text-xs sm:text-sm text-zinc-400 font-medium">₱{parseInt(employee.salary).toLocaleString()}</span>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs text-zinc-400 font-medium whitespace-nowrap">{employee.dateHired}</span>
                </div>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(employee.id);
                  }}
                  className={`px-2 py-1 rounded text-[10px] sm:text-xs font-bold transition-colors ${
                    employee.status === 'Active' 
                      ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30' 
                      : 'bg-red-600/20 text-red-500 hover:bg-red-600/30'
                  }`}
                >
                  {employee.status}
                </button>
              </td>
              <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(employee);
                    }}
                    className="p-1 sm:p-1.5 text-zinc-500 hover:text-white transition-colors rounded hover:bg-zinc-800"
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(employee);
                    }}
                    className="p-1 sm:p-1.5 text-zinc-500 hover:text-white transition-colors rounded hover:bg-zinc-800"
                  >
                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}