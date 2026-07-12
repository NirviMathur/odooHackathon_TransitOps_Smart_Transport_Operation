const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'transitops_token';
const USER_KEY = 'transitops_user';

// ---------- Token/session helpers ----------
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function saveSession(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

// ---------- Core request helper ----------
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message = (data && data.message) || 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data;
}

// ---------- Auth ----------
export async function signup({ name, email, password }) {
  const data = await request('/auth/signup', {
    method: 'POST',
    body: { name, email, password },
  });
  saveSession(data);
  return data;
}

export async function login({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  saveSession(data);
  return data;
}

// ---------- Vehicles ----------
export function getVehicles() {
  return request('/vehicles', { auth: true });
}

export function createVehicle(vehicle) {
  return request('/vehicles', { method: 'POST', body: vehicle, auth: true });
}

export function deleteVehicle(id) {
  return request(`/vehicles/${id}`, { method: 'DELETE', auth: true });
}

// ---------- Drivers ----------
export function getDrivers() {
  return request('/drivers', { auth: true });
}

export function createDriver(driver) {
  return request('/drivers', { method: 'POST', body: driver, auth: true });
}

export function deleteDriver(id) {
  return request(`/drivers/${id}`, { method: 'DELETE', auth: true });
}