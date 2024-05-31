import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import './Modal.css';

const CreateDeliveryModal = ({ onClose }) => {
  const [package_id, setPackageId] = useState('');
  const [status, setStatus] = useState('open');
  const [packages, setPackages] = useState([]);
  const [pickup_time, setPickupTime] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [location, setLocation] = useState({});


  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: `${api}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchPackages = async () => {
      const response = await axiosInstance.get(`${api}/package`);
      setPackages(response.data);
    };
    fetchPackages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if package_id is not null or empty
      if (!package_id) {
        throw new Error("Please select a package.");
      }

      // Check if the selected package_id exists in the packages array
      const selectedPackage = packages.find(pkg => pkg._id === package_id);
      if (!selectedPackage) {
        throw new Error("Selected package not found.");
      }

      // Proceed with delivery creation
      await axiosInstance.post(`${api}/delivery`, { package_id, status, pickup_time, start_time, end_time, location });
      alert('Delivery created successfully');
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create Delivery</h2>
        <form onSubmit={handleSubmit}>

          <label htmlFor="package">Package:</label>
          <select value={package_id} onChange={(e) => setPackageId(e.target.value)}>
            <option value="" disabled>Select Package</option>
            {packages.map(pkg => (
              <option key={pkg._id} value={pkg._id}>{pkg._id} - {pkg.description}</option>
            ))}
          </select>

          <label htmlFor="pickup_time">Pickup Time:</label>
          <input type="datetime-local" value={pickup_time} onChange={(e) => setPickupTime(e.target.value)} /><br/>

          <label htmlFor="start_time">Start Time:</label>
          <input type="datetime-local" value={start_time} onChange={(e) => setStartTime(e.target.value)} /><br/>

          <label htmlFor="end_time">End Time:</label>
          <input type="datetime-local" value={end_time} onChange={(e) => setEndTime(e.target.value)} /><br/>

          <label htmlFor="location">Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} /><br/>
          <label htmlFor="status">Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="picked-up">Picked Up</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select><br/>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateDeliveryModal;
