export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  salary: number;
  month: number;
  year: number;
  status: 'Paid' | 'Unpaid';
  createdAt: string;
  paidAt: string | null;
  markedBy: string | null;
}

export interface PayrollTotals {
  total: number;
  paid: number;
  unpaid: number;
  paidCount: number;
  unpaidCount: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  role: 'Trainer' | 'Receptionist' | 'Manager' | 'Maintenance';
  salary: string;
  dateHired: string;
  status: 'Active' | 'Inactive';
}