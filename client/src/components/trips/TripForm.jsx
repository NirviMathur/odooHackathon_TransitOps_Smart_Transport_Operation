import { useEffect, useState } from "react";
import { getAvailableVehicles, getAvailableDrivers, createTrip } from "../../services/api";

export default function TripForm({ onTripCreated }) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    source: "",
    destination: "",
    vehicleId: "",
    driverId: "",
    cargoWeight: "",
    plannedDistance: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadOptions = async () => {
    try {
      const [vRes, dRes] = await Promise.all([getAvailableVehicles(), getAvailableDrivers()]);
      setVehicles(vRes.data);
      setDrivers(dRes.data);
    } catch (err) {
      setError("Could not load available vehicles/drivers");
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const selectedVehicle = vehicles.find((v) => v._id === form.vehicleId);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.source || !form.destination || !form.vehicleId || !form.driverId || !form.cargoWeight || !form.plannedDistance) {
      setError("Please fill in all fields.");
      return;
    }

    if (selectedVehicle && Number(form.cargoWeight) > selectedVehicle.maxLoadCapacity) {
      setError(`Cargo weight exceeds this vehicle's max load capacity (${selectedVehicle.maxLoadCapacity}kg).`);
      return;
    }

    setSubmitting(true);
    try {
      await createTrip({
        ...form,
        cargoWeight: Number(form.cargoWeight),
        plannedDistance: Number(form.plannedDistance),
      });
      setForm({ source: "", destination: "", vehicleId: "", driverId: "", cargoWeight: "", plannedDistance: "" });
      await loadOptions();
      onTripCreated && onTripCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-card-title">
        <span className="badge new">New</span>
        <h2>Create Trip</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="form-grid">
        <div className="form-field">
          <label>Source</label>
          <input name="source" value={form.source} onChange={handleChange} placeholder="e.g. Delhi Warehouse" />
        </div>

        <div className="form-field">
          <label>Destination</label>
          <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Meerut Hub" />
        </div>

        <div className="form-field">
          <label>Vehicle (Available only)</label>
          <select name="vehicleId" value={form.vehicleId} onChange={handleChange}>
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registrationNumber} — {v.name} (max {v.maxLoadCapacity}kg)
              </option>
            ))}
          </select>
          {vehicles.length === 0 && <p className="hint">No vehicles currently available.</p>}
        </div>

        <div className="form-field">
          <label>Driver (Available only)</label>
          <select name="driverId" value={form.driverId} onChange={handleChange}>
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} — Lic# {d.licenseNumber}
              </option>
            ))}
          </select>
          {drivers.length === 0 && <p className="hint">No drivers currently available.</p>}
        </div>

        <div className="form-field">
          <label>Cargo Weight (kg)</label>
          <input type="number" name="cargoWeight" value={form.cargoWeight} onChange={handleChange} min="0" />
          {selectedVehicle && <p className="hint">Max allowed: {selectedVehicle.maxLoadCapacity}kg</p>}
        </div>

        <div className="form-field">
          <label>Planned Distance (km)</label>
          <input type="number" name="plannedDistance" value={form.plannedDistance} onChange={handleChange} min="0" />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="submit-btn">
        {submitting ? "Creating..." : "Create Trip (Draft)"}
      </button>
    </form>
  );
}
