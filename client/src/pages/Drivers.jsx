import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getDrivers, createDriver, deleteDriver } from '../services/api';
import './Drivers.css';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiry: '', contact: '', safetyScore: '', status: 'Available',
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    setLoading(true);
    setError('');
    try {
      const data = await getDrivers();
      setDrivers(data);
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
      const newDriver = await createDriver({
        ...formData,
        safetyScore: Number(formData.safetyScore),
      });

      setDrivers([newDriver, ...drivers]);
      setFormData({ name: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiry: '', contact: '', safetyScore: '', status: 'Available' });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = drivers;
    setDrivers(drivers.filter((d) => d._id !== id));

    try {
      await deleteDriver(id);
    } catch (err) {
      setDrivers(previous);
      alert(`Could not delete driver: ${err.message}`);
    }
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

        {error && <p className="page-error">{error}</p>}
        {loading ? (
          <p className="loading-text">Loading drivers...</p>
        ) : (
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
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td>{d.licenseNumber}</td>
                    <td>{d.licenseCategory}</td>
                    <td>
                      {new Date(d.licenseExpiry).toLocaleDateString()}
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
                      <button className="delete-btn" onClick={() => handleDelete(d._id)}>Delete</button>
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
              <h2>Add New Driver</h2>
              <form onSubmit={handleSubmit}>
                {formError && <p className="form-error">{formError}</p>}
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
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Driver'}
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

export default Drivers;