import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api';
import './Modal.css';

const CreatePackageModal = ({ onClose }) => {
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [from_name, setFromName] = useState('');
  const [from_address, setFromAddress] = useState('');
  const [from_location, setFromLocation] = useState('');
  const [to_name, setToName] = useState('');
  const [to_address, setToAddress] = useState('');
  const [to_location, setToLocation] = useState('');

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: `${api}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${api}/package`, {
        description,
        weight,
        height,
        width,
        depth,
        from_name,
        from_address,
        from_location,
        to_name,
        to_address,
        to_location,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create Package</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <div className="number-fields">
            <div className="field-group">
              <label htmlFor="weight">Weight:</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
              />
            </div>
            <div className="field-group">
              <label htmlFor="height">Height:</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
              />
            </div>
            <div className="field-group">
              <label htmlFor="width">Width:</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
              />
            </div>
            <div className="field-group">
              <label htmlFor="depth">Depth:</label>
              <input
                type="number"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder="Depth"
              />
            </div>
          </div>

          <label htmlFor="from_name">From Name:</label>
          <input
            type='text'
            value={from_name}
            onChange={(e) => setFromName(e.target.value)}
            placeholder="From Name"
          />

          <label htmlFor="from_address">From Address:</label>
          <input
            type='text'
            value={from_address}
            onChange={(e) => setFromAddress(e.target.value)}
            placeholder="From Address"
          />

          <label htmlFor="from_location">From Location:</label>
          <input
            type='text'
            value={from_location}
            onChange={(e) => setFromLocation(e.target.value)}
            placeholder="From Location"
          />

          <label htmlFor="to_name">To Name:</label>
          <input
            type='text'
            value={to_name}
            onChange={(e) => setToName(e.target.value)}
            placeholder="To Name"
          />

          <label htmlFor="to_address">To Address:</label>
          <input
            type='text'
            value={to_address}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="To Address"
          />

          <label htmlFor="to_location">To Location:</label>
          <input
            type='text'
            value={to_location}
            onChange={(e) => setToLocation(e.target.value)}
            placeholder="To Location"
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePackageModal;
