import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Tracker from './components/tracker/Tracker';
import Driver from './components/driver/Driver';
import AdminHome from './components/admin/AdminHome';
import PrivateRoute from './PrivateRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />

            <Route path="/customer" element={<Tracker />} />


            <Route path="/driver" element={<Driver />} />


            <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
