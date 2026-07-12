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

    // client-side mirror of backend rule: cargoWeight <= vehicle.maxLoadCapacity
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
      await loadOptions(); // selected vehicle/driver drop out of the Available pool only after dispatch, but refresh anyway
      onTripCreated && onTripCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Create Trip</h2>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Source</label>
          <input
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Delhi Warehouse"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Destination</label>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Meerut Hub"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle (Available only)</label>
          <select
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registrationNumber} — {v.name} (max {v.maxLoadCapacity}kg)
              </option>
            ))}
          </select>
          {vehicles.length === 0 && <p className="text-xs text-slate-400 mt-1">No vehicles currently available.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Driver (Available only)</label>
          <select
            name="driverId"
            value={form.driverId}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} — Lic# {d.licenseNumber}
              </option>
            ))}
          </select>
          {drivers.length === 0 && <p className="text-xs text-slate-400 mt-1">No drivers currently available.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Cargo Weight (kg)</label>
          <input
            type="number"
            name="cargoWeight"
            value={form.cargoWeight}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            min="0"
          />
          {selectedVehicle && (
            <p className="text-xs text-slate-400 mt-1">Max allowed: {selectedVehicle.maxLoadCapacity}kg</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Planned Distance (km)</label>
          <input
            type="number"
            name="plannedDistance"
            value={form.plannedDistance}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            min="0"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md"
      >
        {submitting ? "Creating..." : "Create Trip (Draft)"}
      </button>
    </form>
  );
}
