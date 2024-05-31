import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api';
import io from 'socket.io-client';
import './Tracker.css';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Tracker = () => {
  const [packageId, setPackageId] = useState('');
  const [packageDetails, setPackageDetails] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const url = "http://localhost:8080";
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  const axiosInstance = axios.create({
    baseURL: `${api}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const handleLogout = async () => {
    const user = await authService.logout();
    navigate('/login');
  };

  const handleTrack = async () => {
    try {
      const packageResponse = await axiosInstance.get(`${api}/package/${packageId}`);
      setPackageDetails(packageResponse.data);

      if (packageResponse.data.active_delivery_id) {
        const deliveryResponse = await axiosInstance.get(`${api}/delivery/${packageResponse.data.active_delivery_id}`);
        setDeliveryDetails(deliveryResponse.data);

        const socket = io(url);
        socket.on('delivery_updated', (data) => {
          if (data._id === deliveryResponse.data._id) {
            setDeliveryDetails(data);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2 className="header">Package Tracker</h2>
      <input
        type="text"
        value={packageId}
        onChange={(e) => setPackageId(e.target.value)}
        placeholder="Enter Package ID"
        className="input"
      />
      <button onClick={handleTrack} className="button">Track</button>
      {packageDetails && (
        <div className="details-container">
          <div className="details">
            <h3 className="section-header">Package Details</h3>
            <p className="info">ID: {packageDetails._id}</p>
            <p className="info">Description: {packageDetails.description}</p>
            <p className="info">Weight: {packageDetails.weight}</p>
            <p className="info">Width: {packageDetails.width}</p>
            <p className="info">Height: {packageDetails.height}</p>
            <p className="info">Depth: {packageDetails.depth}</p>
            <p className="info">From Name: {packageDetails.from_name}</p>
            <p className="info">From Address: {packageDetails.from_address}</p>
            <p className="info">From Location: {JSON.stringify(packageDetails.from_location)}</p>
            <p className="info">To Name: {packageDetails.to_name}</p>
            <p className="info">To Address: {packageDetails.to_address}</p>
            <p className="info">To Location: {JSON.stringify(packageDetails.to_location)}</p>
          </div>
          {deliveryDetails && (
            <div className="details">
              <h3 className="section-header">Delivery Details</h3>
              <p className="info">ID: {deliveryDetails._id}</p>
              <p className="info">Status: {deliveryDetails.status}</p>
              <p className="info">PickUp Time: {new Date(deliveryDetails.pickup_time).toLocaleString()}</p>
              <p className="info">Start Time: {new Date(deliveryDetails.start_time).toLocaleString()}</p>
              <p className="info">End Time: {new Date(deliveryDetails.end_time).toLocaleString()}</p>
            </div>
          )}
          <div className="map-container" id="map"></div>
        </div>
      )}
    </div>
  );
};

export default Tracker;
