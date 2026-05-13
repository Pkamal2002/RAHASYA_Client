import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Building, Shield, Key, Save, AlertCircle, History } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate update
    toast.success('Profile update request sent to administrator.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="text-cyber-blue" />
          User Profile
        </h1>
        <p className="text-gray-400 text-sm">Manage your account settings and security preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-6 text-center">
            <div className="w-24 h-24 bg-cyber-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-cyber-blue border-opacity-20 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
              <span className="text-4xl font-bold text-cyber-blue">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-cyber-blue text-sm font-medium">{user?.role}</p>
            
            <div className="mt-6 pt-6 border-t border-white border-opacity-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Member Since</span>
                <span className="text-gray-300">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Dec 2023'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Status</span>
                <span className="px-2 py-0.5 bg-green-500 bg-opacity-10 text-green-500 rounded-full font-bold">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="glass p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyber-neon" />
              Security Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-500 bg-opacity-10 rounded">
                  <Key className="w-3.5 h-3.5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">2FA Enabled</p>
                  <p className="text-[10px] text-gray-500">Authenticator app linked</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className="glass p-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="cyber-input pl-10" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="email" 
                      value={formData.email}
                      readOnly
                      className="cyber-input pl-10 opacity-50 cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Department</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={formData.department}
                      readOnly
                      className="cyber-input pl-10 opacity-50 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white border-opacity-5">
                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Update Master Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••"
                      className="cyber-input" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        className="cyber-input" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        className="cyber-input" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="cyber-button flex items-center gap-2 bg-cyber-blue !text-black font-bold h-12 px-10">
                  <Save className="w-4 h-4" />
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="glass p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-cyber-blue" />
          Recent Security Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: 'PASSWORD_ACCESSED', target: 'AWS Console', time: '2 hours ago', icon: Key },
            { action: 'LOGIN_SUCCESS', target: 'Web Vault', time: '5 hours ago', icon: Shield },
            { action: 'PASSWORD_UPDATED', target: 'GitHub Account', time: '1 day ago', icon: Save },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-cyber-blue bg-opacity-10 rounded-lg">
                  <log.icon className="w-4 h-4 text-cyber-blue" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tighter">{log.action.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-500">{log.target}</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-600 font-bold uppercase">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
