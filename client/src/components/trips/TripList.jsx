import { useState } from "react";
import { dispatchTrip, completeTrip, cancelTrip } from "../../services/api";

const statusColors = {
  Draft: "bg-slate-100 text-slate-700",
  Dispatched: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function CompleteModal({ trip, onClose, onDone }) {
  const [actualDistance, setActualDistance] = useState(trip.plannedDistance || "");
  const [fuelConsumed, setFuelConsumed] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!actualDistance || !fuelConsumed) {
      setError("Both fields are required.");
      return;
    }
    setBusy(true);
    try {
      await completeTrip(trip._id, { actualDistance: Number(actualDistance), fuelConsumed: Number(fuelConsumed) });
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete trip");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-sm space-y-3 shadow-xl">
        <h3 className="font-semibold text-slate-800">Complete Trip</h3>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <label className="block text-sm text-slate-600 mb-1">Actual Distance (km)</label>
          <input
            type="number"
            value={actualDistance}
            onChange={(e) => setActualDistance(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Fuel Consumed (liters)</label>
          <input
            type="number"
            value={fuelConsumed}
            onChange={(e) => setFuelConsumed(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-slate-300">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white disabled:opacity-50"
          >
            {busy ? "Saving..." : "Mark Completed"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TripList({ trips, onChanged }) {
  const [completingTrip, setCompletingTrip] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const handleDispatch = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await dispatchTrip(id);
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dispatch trip");
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await cancelTrip(id);
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel trip");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Trips</h2>
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Route</th>
              <th className="py-2 pr-3">Vehicle</th>
              <th className="py-2 pr-3">Driver</th>
              <th className="py-2 pr-3">Cargo</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id} className="border-b border-slate-100">
                <td className="py-2 pr-3">
                  {trip.source} → {trip.destination}
                </td>
                <td className="py-2 pr-3">{trip.vehicleId?.registrationNumber || "—"}</td>
                <td className="py-2 pr-3">{trip.driverId?.name || "—"}</td>
                <td className="py-2 pr-3">{trip.cargoWeight}kg</td>
                <td className="py-2 pr-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[trip.status]}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="py-2 pr-3 space-x-2">
                  {trip.status === "Draft" && (
                    <>
                      <button
                        onClick={() => handleDispatch(trip._id)}
                        disabled={busyId === trip._id}
                        className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-md disabled:opacity-50"
                      >
                        Dispatch
                      </button>
                      <button
                        onClick={() => handleCancel(trip._id)}
                        disabled={busyId === trip._id}
                        className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-md disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {trip.status === "Dispatched" && (
                    <>
                      <button
                        onClick={() => setCompletingTrip(trip)}
                        className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-md"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleCancel(trip._id)}
                        disabled={busyId === trip._id}
                        className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-md disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">
                  No trips yet. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {completingTrip && (
        <CompleteModal
          trip={completingTrip}
          onClose={() => setCompletingTrip(null)}
          onDone={() => {
            setCompletingTrip(null);
            onChanged();
          }}
        />
      )}
    </div>
  );
}
