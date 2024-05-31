import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import CreatePackageModal from './CreatePackageModal';
import CreateDeliveryModal from './CreateDeliveryModal';
import './AdminHome.css';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [packages, setPackages] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: `${api}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packagesResponse = await axiosInstance.get(`${api}/package`);
        console.log('Packages Response:', packagesResponse.data);
        setPackages(packagesResponse.data);

        const deliveriesResponse = await axiosInstance.get(`${api}/delivery`);
        console.log('Deliveries Response:', deliveriesResponse.data);
        setDeliveries(deliveriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    const user = await authService.logout();
    navigate('/login');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="admin-container"> {/* Apply class name */}
    <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2>Admin Home</h2>
      <button className="admin-button" onClick={() => setShowPackageModal(true)}>Create Package</button> {/* Apply class name */}
      {showPackageModal && <CreatePackageModal onClose={() => setShowPackageModal(false)} />}
      {showDeliveryModal && <CreateDeliveryModal onClose={() => setShowDeliveryModal(false)} />}
      <h3>Package List</h3>
      <table className="admin-table"> {/* Apply class name */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Active Delivery ID</th>
            <th>Weight</th>
            <th>Width</th> {/* Fix typo */}
            <th>Height</th>
            <th>Depth</th>
            <th>From name</th>
            <th>From Address</th> {/* Fix typo */}
            <th>From Location</th>
            <th>To name</th>
            <th>To address</th>
            <th>To Location</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(pkg => (
            <tr key={pkg._id}>
              <td>{pkg._id}</td>
              <td>{pkg.description}</td>
              <td>{pkg.active_delivery_id}</td>
              <td>{pkg.weight}</td>
              <td>{pkg.width}</td>
              <td>{pkg.height}</td>
              <td>{pkg.depth}</td>
              <td>{pkg.from_name}</td>
              <td>{pkg.from_address}</td>
              <td>{JSON.stringify(pkg.from_location)}</td>
              <td>{pkg.to_name}</td>
              <td>{pkg.to_address}</td>
              <td>{JSON.stringify(pkg.to_location)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/><br/>

      <button className="admin-button" onClick={() => setShowDeliveryModal(true)}>Create Delivery</button> {/* Apply class name */}
      <h3>Delivery List</h3>
      <table className="admin-table"> {/* Apply class name */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Package ID</th>
            <th>PickUp Time</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map(delivery => (
            <tr key={delivery._id}>
              <td>{delivery._id}</td>
              <td>{delivery.status}</td>
              <td>{delivery.package_id}</td>
              <td>{formatDateTime(delivery.pickup_time)}</td>
              <td>{formatDateTime(delivery.start_time)}</td>
              <td>{formatDateTime(delivery.end_time)}</td>
              <td>{JSON.stringify(delivery.location)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
  );
};
export default AdminHome;
