export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email?: string;
  birthdate?: string;
  customerType: 'Regular' | 'Student';
  plan: '6 Months' | '1 Year';
  paymentMethod: 'Cash' | 'GCash';
  price: number;
  startDate: string;
  expirationDate: string;
  username: string;
  password: string;
  status: 'Active' | 'Expired';
}

export interface MemberFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string;
  plan: '6 Months' | '1 Year';
  customerType: 'Regular' | 'Student';
  paymentMethod: 'Cash' | 'GCash';
}

export interface MembershipStatus {
  status: 'Active' | 'Expiring Soon' | 'Expired';
  daysLeft: number;
}