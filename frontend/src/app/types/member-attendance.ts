export interface MemberAttendanceStats {
  todayVisits: number;
  monthVisits: number;
  totalVisits: number;
  streak: number;
}

export interface CalendarDay {
  day: number | null;
  dateStr: string;
}

export interface MemberCheckInRecord {
  id: string;
  memberId: string;
  name: string;
  type: 'Member';
  date: string;
  time: string;
  price: 0;
  paymentMethod: 'N/A';
  createdAt: string;
}
