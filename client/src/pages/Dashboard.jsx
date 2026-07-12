import React, { useEffect, useState } from 'react';
import { api } from '../api';

const KPI_LABELS = [
  ['activeVehicles', 'Active Vehicles'],
  ['availableVehicles', 'Available Vehicles'],
  ['vehiclesInMaintenance', 'Vehicles in Maintenance'],
  ['activeTrips', 'Active Trips'],
  ['pendingTrips', 'Pending Trips'],
  ['driversOnDuty', 'Drivers On Duty'],
  ['fleetUtilizationPercent', 'Fleet Utilization (%)'],
];

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [filters, setFilters] = useState({ type: '', status: '', region: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
    api.getKpis(params.toString() ? `?${params}` : '')
      .then(setKpis)
      .catch((e) => setError(e.message));
  }, [filters]);

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="filter-bar">
        <input placeholder="Filter by type" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option>Available</option>
          <option>On Trip</option>
          <option>In Shop</option>
          <option>Retired</option>
        </select>
        <input placeholder="Filter by region" value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} />
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="kpi-grid">
        {KPI_LABELS.map(([key, label]) => (
          <div key={key} className="kpi-card">
            <div className="kpi-value">{kpis ? kpis[key] : '—'}{key === 'fleetUtilizationPercent' ? '%' : ''}</div>
            <div className="kpi-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
