import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../api';

export default function Reports() {
  const [report, setReport] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getVehicleReport().then(setReport).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1>Reports & Analytics</h1>
      {error && <div className="error-banner">{error}</div>}

      <a href={api.exportCsvUrl()} target="_blank" rel="noreferrer">
        <button>Export CSV</button>
      </a>

      <div className="chart-card">
        <h2>Operational Cost by Vehicle</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="registrationNumber" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalFuelCost" stackId="a" fill="#4f8ef7" name="Fuel Cost" />
            <Bar dataKey="totalMaintenanceCost" stackId="a" fill="#f7924f" name="Maintenance Cost" />
            <Bar dataKey="totalExpenseCost" stackId="a" fill="#8e4ff7" name="Other Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Vehicle</th><th>Status</th><th>Total Distance</th><th>Fuel Efficiency (km/L)</th>
            <th>Fuel Cost</th><th>Maintenance Cost</th><th>Other Expenses</th><th>Operational Cost</th><th>ROI</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r) => (
            <tr key={r.vehicleId}>
              <td>{r.registrationNumber}</td>
              <td>{r.status}</td>
              <td>{r.totalDistance}</td>
              <td>{r.fuelEfficiency}</td>
              <td>{r.totalFuelCost}</td>
              <td>{r.totalMaintenanceCost}</td>
              <td>{r.totalExpenseCost}</td>
              <td>{r.operationalCost}</td>
              <td>{r.roi}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint">ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost. Revenue tracking isn't part of the spec's data model, so it defaults to 0 — wire up a Revenue/Invoice source if you need real ROI figures.</p>
    </div>
  );
}
