import { useState } from 'react';
import Navbar from '../components/Navbar';
import './Vehicles.css';

const initialVehicles = [
  { id: 1, regNumber: 'UP16-AB-1234', name: 'Van-05', type: 'Van', capacity: 500, odometer: 12000, cost: 800000, status: 'Available' },
  { id: 2, regNumber: 'UP16-CD-5678', name: 'Truck-02', type: 'Truck', capacity: 2000, odometer: 34500, cost: 1500000, status: 'On Trip' },
  { id: 3, regNumber: 'UP16-EF-9012', name: 'Mini-Van-01', type: 'Van', capacity: 300, odometer: 8000, cost: 600000, status: 'In Shop' },
];

function Vehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    regNumber: '', name: '', type: 'Van', capacity: '', odometer: '', cost: '', status: 'Available',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isDuplicate = vehicles.some(
      (v) => v.regNumber.toLowerCase() === formData.regNumber.toLowerCase()
    );
    if (isDuplicate) {
      alert('Registration number must be unique!');
      return;
    }

    const newVehicle = {
      id: Date.now(),
      ...formData,
      capacity: Number(formData.capacity),
      odometer: Number(formData.odometer),
      cost: Number(formData.cost),
    };

    setVehicles([...vehicles, newVehicle]);
    setFormData({ regNumber: '', name: '', type: 'Van', capacity: '', odometer: '', cost: '', status: 'Available' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
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
                <tr key={v.id}>
                  <td>{v.regNumber}</td>
                  <td>{v.name}</td>
                  <td>{v.type}</td>
                  <td>{v.capacity}</td>
                  <td>{v.odometer} km</td>
                  <td>₹{v.cost.toLocaleString()}</td>
                  <td><span className={statusClass(v.status)}>{v.status}</span></td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(v.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Vehicle</h2>
              <form onSubmit={handleSubmit}>
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
                  <button type="submit" className="save-btn">Save Vehicle</button>
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