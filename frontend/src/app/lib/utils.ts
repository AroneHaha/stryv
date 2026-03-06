import { STORAGE_KEYS } from './constants';
import { MembershipStatus, TodayStats } from '../types/attendance';
import { MemberFormData } from '../types/member';
import { MEMBERSHIP_PRICES } from './constants';

// Get initial data from localStorage
export function getInitialData(key: string): unknown[] {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

// Get Philippines date/time
export function getPhilippinesDateTime(): { date: string; time: string } {
  const now = new Date();
  const phTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
  return {
    date: phTime.toISOString().split('T')[0],
    time: phTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

// Get Philippines date only
export function getPhilippinesDate(): string {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' })).toISOString().split('T')[0];
}

// Check if membership is expired
export function isExpired(expirationDate: string): boolean {
  const today = new Date(getPhilippinesDate());
  const expiration = new Date(expirationDate);
  return expiration < today;
}

// Check membership status
export function getMembershipStatus(expirationDate: string): MembershipStatus {
  const today = new Date(getPhilippinesDate());
  const expiration = new Date(expirationDate);
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'Expired', daysLeft: diffDays };
  } else if (diffDays <= 7) {
    return { status: 'Expiring Soon', daysLeft: diffDays };
  }
  return { status: 'Active', daysLeft: diffDays };
}

// Format date for display
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Get today's stats from attendance records
export function getTodayStats(attendance: Array<{ date: string; type: string; price: number }>): TodayStats {
  const today = getPhilippinesDateTime().date;
  const todayRecords = attendance.filter((a) => a.date === today);
  return {
    total: todayRecords.length,
    members: todayRecords.filter((a) => a.type === 'Member').length,
    walkIns: todayRecords.filter((a) => a.type === 'Walk-in').length,
    expired: todayRecords.filter((a) => a.type === 'Expired').length,
    revenue: todayRecords.reduce((sum, a) => sum + a.price, 0),
  };
}

// Check for duplicate attendance today
export function checkDuplicateToday(attendance: Array<{ memberId?: string; date: string }>, memberId: string): boolean {
  if (!memberId) return false;
  const today = getPhilippinesDateTime().date;
  return attendance.some((a) => a.memberId === memberId && a.date === today);
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString();
}

// Generate username from names
export function generateUsername(firstName: string, lastName: string, existingUsernames: string[]): string {
  let username = `${firstName.toLowerCase().replace(/\s/g, '')}.${lastName.toLowerCase().replace(/\s/g, '')}`;
  let finalUsername = username;
  let counter = 1;
  
  while (existingUsernames.includes(finalUsername)) {
    finalUsername = `${username}${counter + 1}`;
    counter++;
  }
  
  return finalUsername;
}

// Generate password from last name and birthdate
export function generatePassword(lastName: string, birthdate: string): string {
  const dateParts = birthdate.split('-');
  const dateSuffix = dateParts ? `${dateParts[1]}${dateParts[2]}` : '0101';
  return `${lastName.toLowerCase().replace(/\s/g, '')}.${dateSuffix}`;
}

// Calculate membership price
export function calculateMembershipPrice(plan: '6 Months' | '1 Year', customerType: 'Regular' | 'Student'): number {
  return MEMBERSHIP_PRICES[plan][customerType === 'Student' ? 'student' : 'regular'];
}

// Calculate expiration date from plan
export function calculateExpirationDate(startDate: Date, plan: '6 Months' | '1 Year'): Date {
  const expiration = new Date(startDate);
  if (plan === '6 Months') {
    expiration.setMonth(expiration.getMonth() + 6);
  } else {
    expiration.setFullYear(expiration.getFullYear() + 1);
  }
  return expiration;
}

// ==================== PAYROLL UTILITIES ====================

// Get current month and year
export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
}

// Get month name from number (expects 0-11, like JS getMonth())
export function getMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
}

// Get short month name from number (expects 0-11, like JS getMonth())
export function getShortMonthName(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month];
}

// Format currency
export function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString()}`;
}

// Generate payroll key for uniqueness check
export function getPayrollKey(employeeId: string, month: number, year: number): string {
  return `${employeeId}-${month}-${year}`;
}

// ==================== CALENDAR UTILITIES ====================

// Get days in month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// Get days until expiration
export function getDaysUntilExpiration(expirationDate: string): number {
  const today = new Date(getPhilippinesDate());
  const expiration = new Date(expirationDate);
  const diffTime = expiration.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}