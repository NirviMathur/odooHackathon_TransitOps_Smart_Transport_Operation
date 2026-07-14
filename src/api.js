const BASE_URL = '/api';

function getToken() {
  return sessionStorage.getItem('transitops_token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    throw new Error((data && data.message) || 'Request failed');
  }
  return data;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),

  getVehicles: (params = '') => request(`/vehicles${params}`),
  getDispatchVehicles: () => request('/vehicles/dispatch-pool'),
  createVehicle: (payload) => request('/vehicles', { method: 'POST', body: payload }),
  updateVehicle: (id, payload) => request(`/vehicles/${id}`, { method: 'PUT', body: payload }),
  retireVehicle: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),

  getDrivers: (params = '') => request(`/drivers${params}`),
  getDispatchDrivers: () => request('/drivers/dispatch-pool'),
  createDriver: (payload) => request('/drivers', { method: 'POST', body: payload }),
  updateDriver: (id, payload) => request(`/drivers/${id}`, { method: 'PUT', body: payload }),
  suspendDriver: (id) => request(`/drivers/${id}/suspend`, { method: 'POST' }),

  getTrips: (params = '') => request(`/trips${params}`),
  createTrip: (payload) => request('/trips', { method: 'POST', body: payload }),
  dispatchTrip: (id) => request(`/trips/${id}/dispatch`, { method: 'POST' }),
  completeTrip: (id, payload) => request(`/trips/${id}/complete`, { method: 'POST', body: payload }),
  cancelTrip: (id) => request(`/trips/${id}/cancel`, { method: 'POST' }),

  getMaintenance: (params = '') => request(`/maintenance${params}`),
  createMaintenance: (payload) => request('/maintenance', { method: 'POST', body: payload }),
  closeMaintenance: (id) => request(`/maintenance/${id}/close`, { method: 'POST' }),

  getFuelLogs: (params = '') => request(`/fuel${params}`),
  createFuelLog: (payload) => request('/fuel', { method: 'POST', body: payload }),

  getExpenses: (params = '') => request(`/expenses${params}`),
  createExpense: (payload) => request('/expenses', { method: 'POST', body: payload }),

  getKpis: (params = '') => request(`/dashboard/kpis${params}`),
  getVehicleReport: () => request('/reports/vehicles'),
  getUtilization: () => request('/reports/utilization'),
  exportCsvUrl: () => `${BASE_URL}/reports/vehicles.csv`,
};

export { getToken };
