export interface RevenueTotals {
  total: number;
  cash: number;
  gcash: number;
  transactions: number;
}

export interface DailyChartData {
  day: number;
  total: number;
  date: string;
}

export interface MonthlyChartData {
  month: number;
  total: number;
  name: string;
}

export interface TransactionRecord {
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
