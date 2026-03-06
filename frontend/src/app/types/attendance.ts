export interface AttendanceRecord {
  id: string;
  name: string;
  memberId?: string;
  type: 'Member' | 'Walk-in' | 'Expired';
  customerType: 'Regular' | 'Student';
  paymentMethod: 'Cash' | 'GCash';
  price: number;
  date: string;
  time: string;
  recordedBy: string;
}

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

export interface MembershipStatus {
  status: 'Active' | 'Expiring Soon' | 'Expired';
  daysLeft: number;
}

export interface TodayStats {
  total: number;
  members: number;
  walkIns: number;
  expired: number;
  revenue: number;
}