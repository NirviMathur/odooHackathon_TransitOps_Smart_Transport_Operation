import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

const EMPTY = { source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' };

export default function Trips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [vehiclePool, setVehiclePool] = useState([]);
  const [driverPool, setDriverPool] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [completingId, setCompletingId] = useState(null);
  const [completeForm, setCompleteForm] = useState({ finalOdometer: '', fuelConsumed: '', fuelCost: '' });
  const canManage = ['Driver', 'FleetManager'].includes(user.role);

  function load() {
    api.getTrips().then(setTrips).catch((e) => setError(e.message));
    if (canManage) {
      api.getDispatchVehicles().then(setVehiclePool).catch(() => {});
      api.getDispatchDrivers().then(setDriverPool).catch(() => {});
    }
  }
  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createTrip({ ...form, cargoWeight: Number(form.cargoWeight), plannedDistance: Number(form.plannedDistance) });
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDispatch(id) {
    setError('');
    try { await api.dispatchTrip(id); load(); } catch (err) { setError(err.message); }
  }

  async function handleCancel(id) {
    setError('');
    try { await api.cancelTrip(id); load(); } catch (err) { setError(err.message); }
  }

  async function handleComplete(id) {
    setError('');
    try {
      await api.completeTrip(id, {
        finalOdometer: completeForm.finalOdometer ? Number(completeForm.finalOdometer) : undefined,
        fuelConsumed: completeForm.fuelConsumed ? Number(completeForm.fuelConsumed) : undefined,
        fuelCost: completeForm.fuelCost ? Number(completeForm.fuelCost) : undefined,
      });
      setCompletingId(null);
      setCompleteForm({ finalOdometer: '', fuelConsumed: '', fuelCost: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Trip Management</h1>
      {error && <div className="error-banner">{error}</div>}

      {canManage && (
        <form className="inline-form" onSubmit={handleCreate}>
          <input placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} required />
          <input placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
          <select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} required>
            <option value="">Select vehicle</option>
            {vehiclePool.map((v) => <option key={v._id} value={v._id}>{v.registrationNumber} ({v.maxLoadCapacity}kg max)</option>)}
          </select>
          <select value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} required>
            <option value="">Select driver</option>
            {driverPool.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <input placeholder="Cargo Weight (kg)" type="number" value={form.cargoWeight} onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })} required />
          <input placeholder="Planned Distance (km)" type="number" value={form.plannedDistance} onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })} required />
          <button type="submit">Create Trip (Draft)</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Route</th><th>Vehicle</th><th>Driver</th><th>Cargo (kg)</th><th>Distance</th><th>Status</th>{canManage && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {trips.map((t) => (
            <React.Fragment key={t._id}>
              <tr>
                <td>{t.source} → {t.destination}</td>
                <td>{t.vehicle?.registrationNumber}</td>
                <td>{t.driver?.name}</td>
                <td>{t.cargoWeight}</td>
                <td>{t.plannedDistance}{t.actualDistance != null ? ` (actual: ${t.actualDistance})` : ''}</td>
                <td><span className={`badge status-${t.status}`}>{t.status}</span></td>
                {canManage && (
                  <td className="actions-cell">
                    {t.status === 'Draft' && <button onClick={() => handleDispatch(t._id)}>Dispatch</button>}
                    {t.status === 'Dispatched' && <button onClick={() => setCompletingId(completingId === t._id ? null : t._id)}>Complete</button>}
                    {['Draft', 'Dispatched'].includes(t.status) && <button className="danger" onClick={() => handleCancel(t._id)}>Cancel</button>}
                  </td>
                )}
              </tr>
              {completingId === t._id && (
                <tr>
                  <td colSpan={7}>
                    <div className="inline-form">
                      <input placeholder="Final Odometer" type="number" value={completeForm.finalOdometer} onChange={(e) => setCompleteForm({ ...completeForm, finalOdometer: e.target.value })} />
                      <input placeholder="Fuel Consumed (L)" type="number" value={completeForm.fuelConsumed} onChange={(e) => setCompleteForm({ ...completeForm, fuelConsumed: e.target.value })} />
                      <input placeholder="Fuel Cost" type="number" value={completeForm.fuelCost} onChange={(e) => setCompleteForm({ ...completeForm, fuelCost: e.target.value })} />
                      <button onClick={() => handleComplete(t._id)}>Confirm Completion</button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
