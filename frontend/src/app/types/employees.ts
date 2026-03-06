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

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Trainer' | 'Receptionist' | 'Manager' | 'Maintenance';
  salary: string;
}
