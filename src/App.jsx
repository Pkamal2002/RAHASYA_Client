import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuditLogs from './pages/AuditLogs';
import HealthAnalytics from './pages/HealthAnalytics';
import PasswordGenerator from './pages/PasswordGenerator';
import Profile from './pages/Profile';
import Members from './pages/Members';
import PendingApproval from './pages/PendingApproval';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';
import useSocket from './hooks/useSocket';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Initialize socket connection
  useSocket(user);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass-dark border border-cyber-border text-white text-sm font-medium',
          style: {
            background: '#0a0a0c',
            border: '1px solid rgba(0, 210, 255, 0.1)',
            color: '#fff',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#00d2ff',
              secondary: '#0a0a0c',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4b2b',
              secondary: '#0a0a0c',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        {/* Pending Approval */}
        <Route path="/pending" element={user && user.status === 'PENDING' ? <PendingApproval /> : <Navigate to="/" />} />

        {/* Private Routes */}
        <Route path="/" element={user && user.status === 'ACTIVE' ? <MainLayout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="vault" element={<Dashboard />} />
          <Route path="health" element={<HealthAnalytics />} />
          <Route path="generator" element={<PasswordGenerator />} />
          <Route path="profile" element={<Profile />} />
          <Route path="members" element={<Members />} />
          
          {/* Admin Protected Routes */}
          <Route path="admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="logs" element={isAdmin ? <AuditLogs /> : <Navigate to="/" />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
