import { useEffect, useState, useCallback } from "react";
import TripForm from "../components/trips/TripForm";
import TripList from "../components/trips/TripList";
import { getTrips } from "../services/api";
import "./Trips.css";

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
    <div className="trips-page">
      <div className="page-header">
        <div>
          <h1>Trip Management</h1>
          <p>Create trips, dispatch, and track their lifecycle end-to-end.</p>
        </div>
      </div>

      <TripForm onTripCreated={loadTrips} />

      {loading ? <p>Loading trips...</p> : <TripList trips={trips} onChanged={loadTrips} />}
    </div>
  );
}
