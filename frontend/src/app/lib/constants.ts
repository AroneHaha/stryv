// Attendance Pricing (per session)
export const PRICES = {
  walkIn: {
    regular: 400,
    student: 320, // 400 - 20%
  },
  member: {
    regular: 160,
    student: 128, // 160 - 20%
  },
} as const;

// Membership Pricing
export const MEMBERSHIP_PRICES = {
  '6 Months': {
    regular: 1000,
    student: 800, // 1000 - 20%
  },
  '1 Year': {
    regular: 2000,
    student: 1600, // 2000 - 20%
  },
} as const;

// Storage keys
export const STORAGE_KEYS = {
  MEMBERS: 'gym_members',
  ATTENDANCE: 'gym_attendance',
  EMPLOYEES: 'gym_employees',
  PAYROLL: 'gym_payroll',
} as const;

// Attendance types
export const ATTENDANCE_TYPES = ['Member', 'Walk-in', 'Expired'] as const;

// Customer types
export const CUSTOMER_TYPES = ['Regular', 'Student'] as const;

// Payment methods
export const PAYMENT_METHODS = ['Cash', 'GCash'] as const;

// Member plans
export const MEMBER_PLANS = ['6 Months', '1 Year'] as const;

// Employee roles
export const EMPLOYEE_ROLES = ['Trainer', 'Receptionist', 'Manager', 'Maintenance'] as const;