import { useState } from "react";
import { dispatchTrip, completeTrip, cancelTrip } from "../../services/api";

const statusClass = {
  Draft: "draft",
  Dispatched: "dispatched",
  Completed: "completed",
  Cancelled: "cancelled",
};

function CompleteModal({ trip, onClose, onDone }) {
  const [actualDistance, setActualDistance] = useState(trip.plannedDistance || "");
  const [fuelConsumed, setFuelConsumed] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
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
    <div className="modal-overlay">
      <div className="modal">
        <h2>Complete Trip</h2>
        <form onSubmit={submit}>
          {error && <span className="modal-error">{error}</span>}
          <div className="form-field">
            <label>Actual Distance (km)</label>
            <input type="number" value={actualDistance} onChange={(e) => setActualDistance(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Fuel Consumed (liters)</label>
            <input type="number" value={fuelConsumed} onChange={(e) => setFuelConsumed(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" disabled={busy} className="save-btn">
              {busy ? "Saving..." : "Mark Completed"}
            </button>
          </div>
        </form>
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
    <div className="table-wrapper">
      <h2>Trips</h2>
      {error && <div className="error-banner" style={{ margin: "0 20px" }}>{error}</div>}

      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Cargo</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip._id}>
              <td>{trip.source} → {trip.destination}</td>
              <td>{trip.vehicleId?.registrationNumber || "—"}</td>
              <td>{trip.driverId?.name || "—"}</td>
              <td>{trip.cargoWeight}kg</td>
              <td>
                <span className={`badge ${statusClass[trip.status]}`}>{trip.status}</span>
              </td>
              <td>
                <div className="trip-actions">
                  {trip.status === "Draft" && (
                    <>
                      <button onClick={() => handleDispatch(trip._id)} disabled={busyId === trip._id} className="btn-dispatch">
                        Dispatch
                      </button>
                      <button onClick={() => handleCancel(trip._id)} disabled={busyId === trip._id} className="btn-cancel-trip">
                        Cancel
                      </button>
                    </>
                  )}
                  {trip.status === "Dispatched" && (
                    <>
                      <button onClick={() => setCompletingTrip(trip)} className="btn-complete">
                        Complete
                      </button>
                      <button onClick={() => handleCancel(trip._id)} disabled={busyId === trip._id} className="btn-cancel-trip">
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {trips.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-row">No trips yet. Create one above.</td>
            </tr>
          )}
        </tbody>
      </table>

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
