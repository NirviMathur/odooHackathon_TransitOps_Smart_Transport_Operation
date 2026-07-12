import { useState } from 'react';
import { vehicles } from '../../data/dummyData.js';

const maintenanceTypes = [
  'General Service',
  'Engine Repair',
  'Tyre Replacement',
  'Brake Inspection',
  'AC Repair',
  'Body Work',
  'Electrical',
  'Other',
];

const initialState = {
  vehicleId: '',
  maintenanceType: '',
  garage: '',
  cost: '',
  description: '',
  startDate: '',
  expectedCompletion: '',
};

export default function MaintenanceForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.vehicleId) errs.vehicleId = 'Select a vehicle';
    if (!form.maintenanceType) errs.maintenanceType = 'Select maintenance type';
    if (!form.garage.trim()) errs.garage = 'Garage name is required';
    if (!form.cost || Number(form.cost) <= 0) errs.cost = 'Enter a valid cost';
    if (!form.startDate) errs.startDate = 'Start date required';
    if (!form.expectedCompletion) errs.expectedCompletion = 'Expected completion required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const vehicle = vehicles.find((v) => v.id === form.vehicleId);
    onSubmit({ ...form, cost: Number(form.cost), vehicle });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-field">Vehicle</label>
        <select name="vehicleId" value={form.vehicleId} onChange={handleChange} className="input-field">
          <option value="">Select vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.number} — {v.type}
            </option>
          ))}
        </select>
        {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId}</p>}
      </div>

      <div>
        <label className="label-field">Maintenance Type</label>
        <select name="maintenanceType" value={form.maintenanceType} onChange={handleChange} className="input-field">
          <option value="">Select type</option>
          {maintenanceTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.maintenanceType && <p className="text-xs text-red-500 mt-1">{errors.maintenanceType}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">Garage Name</label>
          <input
            type="text"
            name="garage"
            value={form.garage}
            onChange={handleChange}
            placeholder="e.g. Speedway Auto Works"
            className="input-field"
          />
          {errors.garage && <p className="text-xs text-red-500 mt-1">{errors.garage}</p>}
        </div>
        <div>
          <label className="label-field">Cost (₹)</label>
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder="0"
            className="input-field"
          />
          {errors.cost && <p className="text-xs text-red-500 mt-1">{errors.cost}</p>}
        </div>
      </div>

      <div>
        <label className="label-field">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the issue or work to be done"
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="input-field"
          />
          {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
        </div>
        <div>
          <label className="label-field">Expected Completion</label>
          <input
            type="date"
            name="expectedCompletion"
            value={form.expectedCompletion}
            onChange={handleChange}
            className="input-field"
          />
          {errors.expectedCompletion && (
            <p className="text-xs text-red-500 mt-1">{errors.expectedCompletion}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2.5 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Maintenance
        </button>
      </div>
    </form>
  );
}
