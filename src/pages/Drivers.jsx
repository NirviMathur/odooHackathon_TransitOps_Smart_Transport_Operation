import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

const EMPTY = { name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '', safetyScore: 100 };

export default function Drivers() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const canManage = ['FleetManager', 'SafetyOfficer'].includes(user.role);

  function load() {
    api.getDrivers().then(setDrivers).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createDriver({ ...form, safetyScore: Number(form.safetyScore) });
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSuspend(id) {
    try { await api.suspendDriver(id); load(); } catch (err) { setError(err.message); }
  }

  function isExpired(dateStr) {
    return new Date(dateStr).getTime() < Date.now();
  }

  return (
    <div>
      <h1>Driver Management</h1>
      {error && <div className="error-banner">{error}</div>}

      {canManage && (
        <form className="inline-form" onSubmit={handleCreate}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="License Number" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} required />
          <input placeholder="License Category" value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })} required />
          <input type="date" value={form.licenseExpiryDate} onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })} required />
          <input placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} required />
          <input placeholder="Safety Score" type="number" min="0" max="100" value={form.safetyScore} onChange={(e) => setForm({ ...form, safetyScore: e.target.value })} />
          <button type="submit">Add Driver</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th><th>License #</th><th>Category</th><th>Expiry</th><th>Contact</th><th>Safety Score</th><th>Status</th>{canManage && <th></th>}
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d._id}>
              <td>{d.name}</td>
              <td>{d.licenseNumber}</td>
              <td>{d.licenseCategory}</td>
              <td className={isExpired(d.licenseExpiryDate) ? 'text-danger' : ''}>{new Date(d.licenseExpiryDate).toLocaleDateString()}{isExpired(d.licenseExpiryDate) ? ' (Expired)' : ''}</td>
              <td>{d.contactNumber}</td>
              <td>{d.safetyScore}</td>
              <td><span className={`badge status-${d.status.replace(/\s/g, '')}`}>{d.status}</span></td>
              {canManage && <td>{d.status !== 'Suspended' && d.status !== 'On Trip' && <button className="danger" onClick={() => handleSuspend(d._id)}>Suspend</button>}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
