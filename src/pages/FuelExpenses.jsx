import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

const FUEL_EMPTY = { vehicle: '', liters: '', cost: '', date: '' };
const EXPENSE_EMPTY = { vehicle: '', type: 'Toll', amount: '', description: '', date: '' };

export default function FuelExpenses() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [fuelForm, setFuelForm] = useState(FUEL_EMPTY);
  const [expenseForm, setExpenseForm] = useState(EXPENSE_EMPTY);
  const [error, setError] = useState('');

  const canLogFuel = ['FleetManager', 'Driver'].includes(user.role);
  const canLogExpense = ['FleetManager', 'FinancialAnalyst'].includes(user.role);

  function load() {
    api.getVehicles().then(setVehicles).catch(() => {});
    api.getFuelLogs().then(setFuelLogs).catch((e) => setError(e.message));
    api.getExpenses().then(setExpenses).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function handleFuelSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createFuelLog({ ...fuelForm, liters: Number(fuelForm.liters), cost: Number(fuelForm.cost) });
      setFuelForm(FUEL_EMPTY);
      load();
    } catch (err) { setError(err.message); }
  }

  async function handleExpenseSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createExpense({ ...expenseForm, amount: Number(expenseForm.amount) });
      setExpenseForm(EXPENSE_EMPTY);
      load();
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h1>Fuel & Expense Management</h1>
      {error && <div className="error-banner">{error}</div>}

      <div className="two-col">
        <section>
          <h2>Fuel Logs</h2>
          {canLogFuel && (
            <form className="inline-form" onSubmit={handleFuelSubmit}>
              <select value={fuelForm.vehicle} onChange={(e) => setFuelForm({ ...fuelForm, vehicle: e.target.value })} required>
                <option value="">Vehicle</option>
                {vehicles.map((v) => <option key={v._id} value={v._id}>{v.registrationNumber}</option>)}
              </select>
              <input placeholder="Liters" type="number" value={fuelForm.liters} onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })} required />
              <input placeholder="Cost" type="number" value={fuelForm.cost} onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })} required />
              <button type="submit">Log Fuel</button>
            </form>
          )}
          <table className="data-table">
            <thead><tr><th>Vehicle</th><th>Liters</th><th>Cost</th><th>Date</th></tr></thead>
            <tbody>
              {fuelLogs.map((f) => (
                <tr key={f._id}><td>{f.vehicle?.registrationNumber}</td><td>{f.liters}</td><td>{f.cost}</td><td>{new Date(f.date).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Other Expenses</h2>
          {canLogExpense && (
            <form className="inline-form" onSubmit={handleExpenseSubmit}>
              <select value={expenseForm.vehicle} onChange={(e) => setExpenseForm({ ...expenseForm, vehicle: e.target.value })} required>
                <option value="">Vehicle</option>
                {vehicles.map((v) => <option key={v._id} value={v._id}>{v.registrationNumber}</option>)}
              </select>
              <select value={expenseForm.type} onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}>
                <option>Toll</option><option>Maintenance</option><option>Parking</option><option>Fine</option><option>Other</option>
              </select>
              <input placeholder="Amount" type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} required />
              <input placeholder="Description" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} />
              <button type="submit">Log Expense</button>
            </form>
          )}
          <table className="data-table">
            <thead><tr><th>Vehicle</th><th>Type</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {expenses.map((ex) => (
                <tr key={ex._id}><td>{ex.vehicle?.registrationNumber}</td><td>{ex.type}</td><td>{ex.amount}</td><td>{new Date(ex.date).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
