import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

const EMPTY = { vehicle: '', type: '', description: '', cost: '', date: '' };

export default function Maintenance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const canManage = user.role === 'FleetManager';

  function load() {
    api.getMaintenance().then(setRecords).catch((e) => setError(e.message));
    api.getVehicles().then((vs) => setVehicles(vs.filter((v) => v.status !== 'Retired'))).catch(() => {});
  }
  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createMaintenance({ ...form, cost: Number(form.cost || 0) });
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleClose(id) {
    try { await api.closeMaintenance(id); load(); } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h1>Maintenance</h1>
      <p className="hint">Creating a record automatically sets the vehicle to "In Shop", removing it from dispatch. Closing restores it to "Available".</p>
      {error && <div className="error-banner">{error}</div>}

      {canManage && (
        <form className="inline-form" onSubmit={handleCreate}>
          <select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} required>
            <option value="">Select vehicle</option>
            {vehicles.map((v) => <option key={v._id} value={v._id}>{v.registrationNumber}</option>)}
          </select>
          <input placeholder="Type (e.g. Oil Change)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Cost" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          <button type="submit">Log Maintenance</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr><th>Vehicle</th><th>Type</th><th>Description</th><th>Cost</th><th>Date</th><th>Status</th>{canManage && <th></th>}</tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.vehicle?.registrationNumber}</td>
              <td>{r.type}</td>
              <td>{r.description}</td>
              <td>{r.cost}</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td><span className={`badge status-${r.status}`}>{r.status}</span></td>
              {canManage && <td>{r.status === 'Open' && <button onClick={() => handleClose(r._id)}>Close</button>}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
