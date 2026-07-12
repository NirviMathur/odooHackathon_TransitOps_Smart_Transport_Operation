import { useState } from 'react';
import Navbar from '../components/Navbar';
import './Drivers.css';

const initialDrivers = [
  { id: 1, name: 'Alex Kumar', licenseNumber: 'DL-0420110012345', licenseCategory: 'LMV', licenseExpiry: '2027-05-20', contact: '9876543210', safetyScore: 92, status: 'Available' },
  { id: 2, name: 'Priya Sharma', licenseNumber: 'DL-0420110067890', licenseCategory: 'HMV', licenseExpiry: '2025-01-15', contact: '9123456780', safetyScore: 78, status: 'On Trip' },
  { id: 3, name: 'Rohit Verma', licenseNumber: 'DL-0420110054321', licenseCategory: 'LMV', licenseExpiry: '2026-11-30', contact: '9988776655', safetyScore: 60, status: 'Suspended' },
];

function Drivers() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiry: '', contact: '', safetyScore: '', status: 'Available',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isDuplicate = drivers.some(
      (d) => d.licenseNumber.toLowerCase() === formData.licenseNumber.toLowerCase()
    );
    if (isDuplicate) {
      alert('License number must be unique!');
      return;
    }

    const newDriver = {
      id: Date.now(),
      ...formData,
      safetyScore: Number(formData.safetyScore),
    };

    setDrivers([...drivers, newDriver]);
    setFormData({ name: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiry: '', contact: '', safetyScore: '', status: 'Available' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setDrivers(drivers.filter((d) => d.id !== id));
  };

  const isLicenseExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const statusClass = (status) => {
    if (status === 'Available') return 'badge available';
    if (status === 'On Trip') return 'badge on-trip';
    if (status === 'Off Duty') return 'badge off-duty';
    return 'badge suspended';
  };

  return (
    <>
      <Navbar />
      <div className="drivers-page">
        <div className="page-header">
          <div>
            <h1>Driver Management</h1>
            <p>Manage driver profiles, licenses, and safety scores</p>
          </div>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Driver
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>License Number</th>
                <th>Category</th>
                <th>License Expiry</th>
                <th>Contact</th>
                <th>Safety Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.licenseNumber}</td>
                  <td>{d.licenseCategory}</td>
                  <td>
                    {d.licenseExpiry}
                    {isLicenseExpired(d.licenseExpiry) && (
                      <span className="expired-tag">Expired</span>
                    )}
                  </td>
                  <td>{d.contact}</td>
                  <td>
                    <span className={d.safetyScore >= 80 ? 'score good' : d.safetyScore >= 60 ? 'score medium' : 'score low'}>
                      {d.safetyScore}
                    </span>
                  </td>
                  <td><span className={statusClass(d.status)}>{d.status}</span></td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(d.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Driver</h2>
              <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} required />
                <select name="licenseCategory" value={formData.licenseCategory} onChange={handleChange}>
                  <option>LMV</option>
                  <option>HMV</option>
                  <option>MCWG</option>
                </select>
                <label className="date-label">
                  License Expiry Date
                  <input name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleChange} required />
                </label>
                <input name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
                <input name="safetyScore" type="number" min="0" max="100" placeholder="Safety Score (0-100)" value={formData.safetyScore} onChange={handleChange} required />
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option>Available</option>
                  <option>On Trip</option>
                  <option>Off Duty</option>
                  <option>Suspended</option>
                </select>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="save-btn">Save Driver</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Drivers;