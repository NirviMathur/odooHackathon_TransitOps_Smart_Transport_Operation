import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Trip Engine calls ----
export const getTrips = (status) => api.get("/trips", { params: status ? { status } : {} });
export const getAvailableVehicles = () => api.get("/trips/available-vehicles");
export const getAvailableDrivers = () => api.get("/trips/available-drivers");
export const createTrip = (data) => api.post("/trips", data);
export const dispatchTrip = (id) => api.patch(`/trips/${id}/dispatch`);
export const completeTrip = (id, data) => api.patch(`/trips/${id}/complete`, data);
export const cancelTrip = (id) => api.patch(`/trips/${id}/cancel`);

export default api;
