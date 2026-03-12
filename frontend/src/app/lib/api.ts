const API_BASE_URL = 'http://localhost:8000/api';

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = (): string | null => {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
};

// API fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiFetch<{ user: any; token: string }>('/v1/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiFetch('/v1/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },

  me: () => apiFetch<any>('/v1/me'),
};

// Members API
export const membersApi = {
  getAll: (params?: { search?: string; status?: string; per_page?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/v1/members?${query}`);
  },

  get: (id: string) => apiFetch<any>(`/v1/members/${id}`),

  create: (data: any) =>
    apiFetch<any>('/v1/members', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/v1/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<any>(`/v1/members/${id}`, { method: 'DELETE' }),

  renew: (id: string, data: any) =>
    apiFetch<any>(`/v1/members/${id}/renew`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Employees API
export const employeesApi = {
  getAll: (params?: { search?: string; status?: string; per_page?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/v1/employees?${query}`);
  },

  getActive: () => apiFetch<any>('/v1/employees/active'),

  get: (id: string) => apiFetch<any>(`/v1/employees/${id}`),

  create: (data: any) =>
    apiFetch<any>('/v1/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/v1/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<any>(`/v1/employees/${id}`, { method: 'DELETE' }),
};

// Attendance API
export const attendanceApi = {
  getAll: (params?: { search?: string; date?: string; type?: string; per_page?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/v1/attendance?${query}`);
  },

  getToday: () => apiFetch<any>('/v1/attendance/today'),

  getStats: (date?: string) => {
    const query = date ? `?date=${date}` : '';
    return apiFetch<any>(`/v1/attendance/stats${query}`);
  },

  create: (data: any) =>
    apiFetch<any>('/v1/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<any>(`/v1/attendance/${id}`, { method: 'DELETE' }),
};

// Payroll API
export const payrollApi = {
  getAll: (params?: { month?: number; year?: number; status?: string; per_page?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/v1/payroll?${query}`);
  },

  getStats: (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    return apiFetch<any>(`/v1/payroll/stats?${params}`);
  },

  generate: (month: number, year: number) =>
    apiFetch<any>('/v1/payroll/generate', {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    }),

  markPaid: (id: string) =>
    apiFetch<any>(`/v1/payroll/${id}/mark-paid`, { method: 'POST' }),

  delete: (id: string) =>
    apiFetch<any>(`/v1/payroll/${id}`, { method: 'DELETE' }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiFetch<any>('/v1/dashboard'),

  getRecentActivity: (perPage?: number) => {
    const query = perPage ? `?per_page=${perPage}` : '';
    return apiFetch<any>(`/v1/dashboard/recent-activity${query}`);
  },

  getRevenueChart: (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    return apiFetch<any>(`/v1/dashboard/revenue-chart?${params}`);
  },
};

// Member Portal API
export const memberPortalApi = {
  getProfile: () => apiFetch<any>('/v1/member/profile'),

  getAttendance: (params?: { month?: number; year?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/v1/member/attendance?${query}`);
  },

  getStats: (year?: number) => {
    const query = year ? `?year=${year}` : '';
    return apiFetch<any>(`/v1/member/stats${query}`);
  },

  checkIn: () =>
    apiFetch<any>('/v1/member/check-in', { method: 'POST' }),
};