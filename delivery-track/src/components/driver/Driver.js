import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import io from 'socket.io-client';
import './Driver.css';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Driver = () => {
  const [deliveryId, setDeliveryId] = useState('');
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [packageDetails, setPackageDetails] = useState(null);
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation && deliveryDetails) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { lat, lng } = position.coords;
          const socket = io(api);
          socket.emit('delivery_location_update', {
            deliveryId: deliveryDetails._id,
            location: { lat, lng }
          });
        });
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [deliveryDetails]);

  const handleSubmit = async () => {
    try {
      const deliveryResponse = await axiosInstance.get(`${api}/delivery/${deliveryId}`);
      setDeliveryDetails(deliveryResponse.data);

      const packageResponse = await axiosInstance.get(`${api}/package/${deliveryResponse.data.package_id._id}`);
      setPackageDetails(packageResponse.data);

      const socket = io(api);
      socket.on('delivery_updated', (data) => {
        if (data._id === deliveryResponse.data._id) {
          setDeliveryDetails(data);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    const user = await authService.logout();
    navigate('/login');
  };

  const handleChangeStatus = (status) => {
    const socket = io(url);
    socket.emit('delivery_status_change', {
      deliveryId: deliveryDetails._id,
      status
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="container">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2 className="header">Driver Dashboard</h2>
      <input
        type="text"
        value={deliveryId}
        onChange={(e) => setDeliveryId(e.target.value)}
        placeholder="Enter Delivery ID"
        className="input"
      />
      <button onClick={handleSubmit} className="button">Submit</button>
      {deliveryDetails && (
        <div className="details-container">
          <div className="details">
            <h3 className="section-header">Delivery Details</h3>
            <p className="info">ID: {deliveryDetails._id}</p>
            <p className="info">Status: {deliveryDetails.status}</p>
            <p className="info">PickUp Time: {formatDateTime(deliveryDetails.pickup_time)}</p>
            <p className="info">Start Time: {formatDateTime(deliveryDetails.start_time)}</p>
            <p className="info">End Time: {formatDateTime(deliveryDetails.end_time)}</p>
            {packageDetails && (
              <>
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
              </>
            )}
          </div>
          <div className="map-container" id="map"></div>
          <div className="button-group">
            <button onClick={() => handleChangeStatus('picked-up')} disabled={deliveryDetails.status !== 'open'} className="button">Picked Up</button>
            <button onClick={() => handleChangeStatus('in-transit')} disabled={deliveryDetails.status !== 'picked-up'} className="button">In Transit</button>
            <button onClick={() => handleChangeStatus('delivered')} disabled={deliveryDetails.status !== 'in-transit'} className="button">Delivered</button>
            <button onClick={() => handleChangeStatus('failed')} disabled={deliveryDetails.status !== 'in-transit'} className="button">Failed</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Driver;
