import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getVehicles, createVehicle, deleteVehicle } from '../services/api';
import './Vehicles.css';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    regNumber: '', name: '', type: 'Van', capacity: '', odometer: '', cost: '', status: 'Available',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    setLoading(true);
    setError('');
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      const newVehicle = await createVehicle({
        ...formData,
        capacity: Number(formData.capacity),
        odometer: Number(formData.odometer),
        cost: Number(formData.cost),
      });

      setVehicles([newVehicle, ...vehicles]);
      setFormData({ regNumber: '', name: '', type: 'Van', capacity: '', odometer: '', cost: '', status: 'Available' });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = vehicles;
    setVehicles(vehicles.filter((v) => v._id !== id));

    try {
      await deleteVehicle(id);
    } catch (err) {
      setVehicles(previous);
      alert(`Could not delete vehicle: ${err.message}`);
    }
  };

  const statusClass = (status) => {
    if (status === 'Available') return 'badge available';
    if (status === 'On Trip') return 'badge on-trip';
    if (status === 'In Shop') return 'badge in-shop';
    return 'badge retired';
  };

  return (
    <>
      <Navbar />
      <div className="vehicles-page">
        <div className="page-header">
          <div>
            <h1>Vehicle Registry</h1>
            <p>Manage your fleet's vehicles and their status</p>
          </div>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Vehicle
          </button>
        </div>

        {error && <p className="page-error">{error}</p>}
        {loading ? (
          <p className="loading-text">Loading vehicles...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reg. Number</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Capacity (kg)</th>
                  <th>Odometer</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v._id}>
                    <td>{v.regNumber}</td>
                    <td>{v.name}</td>
                    <td>{v.type}</td>
                    <td>{v.capacity}</td>
                    <td>{v.odometer} km</td>
                    <td>₹{v.cost.toLocaleString()}</td>
                    <td><span className={statusClass(v.status)}>{v.status}</span></td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(v._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Vehicle</h2>
              <form onSubmit={handleSubmit}>
                {formError && <p className="form-error">{formError}</p>}
                <input name="regNumber" placeholder="Registration Number" value={formData.regNumber} onChange={handleChange} required />
                <input name="name" placeholder="Vehicle Name/Model" value={formData.name} onChange={handleChange} required />
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option>Van</option>
                  <option>Truck</option>
                  <option>Bike</option>
                </select>
                <input name="capacity" type="number" placeholder="Max Load Capacity (kg)" value={formData.capacity} onChange={handleChange} required />
                <input name="odometer" type="number" placeholder="Odometer (km)" value={formData.odometer} onChange={handleChange} required />
                <input name="cost" type="number" placeholder="Acquisition Cost" value={formData.cost} onChange={handleChange} required />
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option>Available</option>
                  <option>On Trip</option>
                  <option>In Shop</option>
                  <option>Retired</option>
                </select>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Vehicles;