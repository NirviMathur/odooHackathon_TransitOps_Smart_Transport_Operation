import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

const EMPTY = { registrationNumber: '', name: '', type: '', maxLoadCapacity: '', odometer: '', acquisitionCost: '', region: '' };

export default function Vehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const canManage = user.role === 'FleetManager';

  function load() {
    api.getVehicles().then(setVehicles).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createVehicle({
        ...form,
        maxLoadCapacity: Number(form.maxLoadCapacity),
        odometer: Number(form.odometer || 0),
        acquisitionCost: Number(form.acquisitionCost),
      });
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRetire(id) {
    try { await api.retireVehicle(id); load(); } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h1>Vehicle Registry</h1>
      {error && <div className="error-banner">{error}</div>}

      {canManage && (
        <form className="inline-form" onSubmit={handleCreate}>
          <input placeholder="Reg. Number" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} required />
          <input placeholder="Name/Model" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
          <input placeholder="Max Load (kg)" type="number" value={form.maxLoadCapacity} onChange={(e) => setForm({ ...form, maxLoadCapacity: e.target.value })} required />
          <input placeholder="Odometer" type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} />
          <input placeholder="Acquisition Cost" type="number" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} required />
          <input placeholder="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
          <button type="submit">Add Vehicle</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Reg. Number</th><th>Name</th><th>Type</th><th>Max Load (kg)</th><th>Odometer</th><th>Status</th><th>Region</th>{canManage && <th></th>}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v._id}>
              <td>{v.registrationNumber}</td>
              <td>{v.name}</td>
              <td>{v.type}</td>
              <td>{v.maxLoadCapacity}</td>
              <td>{v.odometer}</td>
              <td><span className={`badge status-${v.status.replace(/\s/g, '')}`}>{v.status}</span></td>
              <td>{v.region}</td>
              {canManage && <td>{v.status !== 'Retired' && <button className="danger" onClick={() => handleRetire(v._id)}>Retire</button>}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
