import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard/Dashboard';
import './styles/global.css';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import Attendance from './pages/Attendance/Attendance';

//import SignIn from "./pages/AuthPages/SignIn";
//import SignUp from "./pages/AuthPages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;