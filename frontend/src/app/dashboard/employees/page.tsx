"use client";

import { useState, useMemo } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import { Employee, EmployeeFormData } from '../../types/employees';
import { PayrollRecord } from '../../types/payroll';
import { STORAGE_KEYS } from '../../lib/constants';
import { getInitialData } from '../../lib/utils';
import { 
  EmployeeTable, 
  EmployeeAddModal, 
  EmployeeViewModal, 
  EmployeeEditModal 
} from '../../components/employees';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(() => getInitialData(STORAGE_KEYS.EMPLOYEES) as Employee[]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter States
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Form State for Edit
  const [editFormData, setEditFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Trainer",
    salary: ""
  });

  // Handle Add Employee
  const handleAddEmployee = (newEmployee: Employee) => {
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updatedEmployees));
  };

  // Handle View Employee
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  // Handle Edit Employee
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      salary: employee.salary
    });
    setIsEditModalOpen(true);
  };

  // Handle Save Edit
  const handleSaveEdit = (data: EmployeeFormData) => {
    if (!selectedEmployee) return;

    const oldSalary = selectedEmployee.salary;
    const newSalary = data.salary;
    const salaryChanged = oldSalary !== newSalary;

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          role: data.role,
          salary: data.salary
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updatedEmployees));

    // Update unpaid payroll records if salary changed
    if (salaryChanged) {
      const existingPayroll = getInitialData(STORAGE_KEYS.PAYROLL) as PayrollRecord[];
      const updatedPayroll = existingPayroll.map(record => {
        if (record.employeeId === selectedEmployee.id && record.status === 'Unpaid') {
          return {
            ...record,
            salary: parseInt(newSalary)
          };
        }
        return record;
      });
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(updatedPayroll));
    }

    setIsEditModalOpen(false);
  };

  // Handle Toggle Status
  const handleToggleStatus = (employeeId: string) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, status: emp.status === 'Active' ? 'Inactive' as const : 'Active' as const };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updatedEmployees));
  };

  // Filter Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "All" ? true : employee.role === filterRole;
      const matchesStatus = filterStatus === "All" ? true : employee.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, searchTerm, filterRole, filterStatus]);

  return (
    <div className="flex flex-col h-full w-full gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-950 overflow-hidden">
      
      {/* Header & Search/Filter Actions */}
      <div className="flex flex-col gap-3 sm:gap-4 flex-shrink-0">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Employees</h1>
            <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">Manage gym staff and trainers.</p>
          </div>
          
          {/* Add Employee Button */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-all shadow-[0_4px_14px_0_rgba(200,0,0,0)] hover:shadow-[0_6px_20px_0_rgba(200,0,0,0.3)]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Search & Filters Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-600/20 focus:border-red-600 placeholder-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters Container */}
          <div className="flex items-center gap-2">
            {/* Role Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-32 justify-between"
              >
                <span className="truncate">{filterRole === 'All' ? 'Role' : filterRole}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showRoleDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  <button onClick={() => { setFilterRole('All'); setShowRoleDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">All Roles</button>
                  <button onClick={() => { setFilterRole('Trainer'); setShowRoleDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Trainer</button>
                  <button onClick={() => { setFilterRole('Receptionist'); setShowRoleDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Receptionist</button>
                  <button onClick={() => { setFilterRole('Manager'); setShowRoleDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Manager</button>
                  <button onClick={() => { setFilterRole('Maintenance'); setShowRoleDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Maintenance</button>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-32 justify-between"
              >
                <span className="truncate">{filterStatus === 'All' ? 'Status' : filterStatus}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  <button onClick={() => { setFilterStatus('All'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">All Status</button>
                  <button onClick={() => { setFilterStatus('Active'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Active</button>
                  <button onClick={() => { setFilterStatus('Inactive'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Inactive</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="flex-1 min-h-0 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <EmployeeTable 
          employees={filteredEmployees}
          onView={handleViewEmployee}
          onEdit={handleEditEmployee}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* Add Employee Modal */}
      <EmployeeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEmployee}
      />

      {/* View Employee Modal */}
      <EmployeeViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={selectedEmployee}
        onEdit={handleEditEmployee}
      />

      {/* Edit Employee Modal */}
      <EmployeeEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        employee={selectedEmployee}
        formData={editFormData}
        onFormDataChange={setEditFormData}
      />
    </div>
  );
}