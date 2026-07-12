import { useEffect, useState, useCallback } from "react";
import TripForm from "../components/trips/TripForm";
import TripList from "../components/trips/TripList";
import { getTrips } from "../services/api";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    try {
      const res = await getTrips();
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to load trips", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Trip Management</h1>
      <TripForm onTripCreated={loadTrips} />
      {loading ? (
        <p className="text-slate-400 text-sm">Loading trips...</p>
      ) : (
        <TripList trips={trips} onChanged={loadTrips} />
      )}
    </div>
  );
}
