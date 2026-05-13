import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Shield, UserCheck, UserX, UserPlus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL_BASE from '../utils/apiConfig';

const AdminDashboard = () => {
  const { user: currentUser, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (userId, newStatus) => {
    console.log(`[CLICK] Attempting to update status for ${userId} to ${newStatus}`);
    console.log(`[DEBUG] Current Token: ${token ? 'Present' : 'MISSING'}`);
    console.log(`[DEBUG] API_URL_BASE: ${API_URL_BASE}`);
    
    try {
      if (!token) {
        console.error('[AUTH ERROR] No token found in Redux state');
        toast.error('Session expired. Please login again.');
        return;
      }

      const targetUrl = `${API_URL_BASE}/management/users/${userId}`;
      console.log(`[NETWORK] Sending PUT to: ${targetUrl}`);

      toast.promise(
        axios.put(targetUrl, 
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        {
          loading: 'Updating status...',
          success: () => {
            fetchUsers();
            return 'User status updated!';
          },
          error: (err) => {
            console.error('[ADMIN UPDATE STATUS ERROR]:', err);
            const msg = err.response?.data?.message || 'Failed to update user status';
            return `Error: ${msg}`;
          }
        }
      );
    } catch (error) {
      console.error('[CRITICAL UI ERROR] updateUserStatus failed:', error);
      toast.error('Failed to update user status');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    console.log(`[CLICK] Attempting to update role for ${userId} to ${newRole}`);
    console.log(`[DEBUG] Current Token: ${token ? 'Present' : 'MISSING'}`);
    console.log(`[DEBUG] API_URL_BASE: ${API_URL_BASE}`);

    try {
      if (!token) {
        console.error('[AUTH ERROR] No token found in Redux state');
        toast.error('Session expired. Please login again.');
        return;
      }
      
      const targetUrl = `${API_URL_BASE}/management/users/${userId}`;
      console.log(`[NETWORK] Sending PUT to: ${targetUrl}`);

      toast.promise(
        axios.put(targetUrl, 
          { role: newRole },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        {
          loading: 'Updating role...',
          success: () => {
            fetchUsers();
            return 'User role updated!';
          },
          error: (err) => {
            console.error('[ADMIN UPDATE ROLE ERROR]:', err);
            const msg = err.response?.data?.message || 'Failed to update user role';
            return `Error: ${msg}`;
          }
        }
      );
    } catch (error) {
      console.error('[CRITICAL UI ERROR] updateUserRole failed:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-cyber-blue" />
            User Management
          </h1>
          <p className="text-gray-400 text-sm">Approve, manage and audit enterprise access</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="cyber-input pl-9 h-12 sm:h-10 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="cyber-input h-12 sm:h-10 w-full sm:w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="glass overflow-hidden border border-white border-opacity-5">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white border-opacity-10 bg-white bg-opacity-[0.02]">
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">User</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">Role</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">Department</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white divide-opacity-5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />
                      <span>Loading personnel data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                    No users found matching criteria
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-purple p-[1px]">
                        <div className="w-full h-full bg-cyber-black rounded-xl flex items-center justify-center text-white text-sm font-bold">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-cyber-blue transition-colors">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {currentUser?.role === 'Super Admin' && user.role !== 'Super Admin' ? (
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cyber-blue hover:bg-opacity-10 transition-all cursor-pointer"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Team Member">Team Member</option>
                        <option value="User">User</option>
                      </select>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-cyber-purple bg-opacity-10 text-cyber-purple border border-cyber-purple border-opacity-20 text-[10px] font-bold uppercase">
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                      user.status === 'ACTIVE' ? 'bg-green-500/5 text-green-500 border-green-500/20' :
                      user.status === 'PENDING' ? 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20' :
                      'bg-red-500/5 text-red-500 border-red-500/20'
                    }`}>
                      <span className={`w-1 h-1 rounded-full mr-2 ${
                        user.status === 'ACTIVE' ? 'bg-green-500' :
                        user.status === 'PENDING' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => updateUserStatus(user._id, 'ACTIVE')}
                            className="p-2 rounded-xl hover:bg-green-500 hover:bg-opacity-10 text-green-500 transition-all border border-transparent hover:border-green-500/20"
                            title="Approve"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateUserStatus(user._id, 'REJECTED')}
                            className="p-2 rounded-xl hover:bg-red-500 hover:bg-opacity-10 text-red-500 transition-all border border-transparent hover:border-red-500/20"
                            title="Reject"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {user.status === 'ACTIVE' && user.role !== 'Super Admin' && (
                        <button 
                          onClick={() => updateUserStatus(user._id, 'REJECTED')}
                          className="p-2 rounded-xl hover:bg-red-500 hover:bg-opacity-10 text-red-500 transition-all border border-transparent hover:border-red-500/20"
                          title="Deactivate"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-white divide-opacity-5">
          {loading ? (
            <div className="p-8 text-center text-gray-500 italic flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />
              <span>Loading personnel data...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">
              No users found matching criteria
            </div>
          ) : filteredUsers.map((user) => (
            <div key={user._id} className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-purple p-[1px]">
                    <div className="w-full h-full bg-cyber-black rounded-xl flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  user.status === 'ACTIVE' ? 'bg-green-500/5 text-green-500 border-green-500/20' :
                  user.status === 'PENDING' ? 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20' :
                  'bg-red-500/5 text-red-500 border-red-500/20'
                }`}>
                  {user.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-y border-white border-opacity-5">
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-1">Role</p>
                  {currentUser?.role === 'Super Admin' && user.role !== 'Super Admin' ? (
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-2 py-1 text-xs text-gray-300 w-full"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Team Member">Team Member</option>
                      <option value="User">User</option>
                    </select>
                  ) : (
                    <div className="text-xs text-cyber-purple font-bold flex items-center gap-1.5 uppercase">
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-1">Department</p>
                  <p className="text-xs text-gray-300">{user.department || 'General'}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {user.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => updateUserStatus(user._id, 'ACTIVE')}
                      className="flex-1 py-2.5 rounded-xl bg-green-500/10 text-green-500 font-bold text-xs flex items-center justify-center gap-2 border border-green-500/20"
                    >
                      <UserCheck className="w-4 h-4" /> APPROVE
                    </button>
                    <button 
                      onClick={() => updateUserStatus(user._id, 'REJECTED')}
                      className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs flex items-center justify-center gap-2 border border-red-500/20"
                    >
                      <UserX className="w-4 h-4" /> REJECT
                    </button>
                  </>
                )}
                {user.status === 'ACTIVE' && user.role !== 'Super Admin' && (
                  <button 
                    onClick={() => updateUserStatus(user._id, 'REJECTED')}
                    className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs flex items-center justify-center gap-2 border border-red-500/20"
                  >
                    <UserX className="w-4 h-4" /> DEACTIVATE ACCOUNT
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
