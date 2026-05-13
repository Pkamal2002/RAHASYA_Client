import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Shield, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL_BASE from '../utils/apiConfig';

const ShareModal = ({ isOpen, onClose, passwordId, passwordTitle }) => {
  const [users, setUsers] = useState([]);
  const [currentSharedWith, setCurrentSharedWith] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [permission, setPermission] = useState('view');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen && passwordId) {
      fetchUsers();
      fetchPasswordDetails();
    }
  }, [isOpen, passwordId]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data.filter(u => u.status === 'ACTIVE'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPasswordDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL_BASE}/passwords`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pwd = response.data.data.find(p => p._id === passwordId);
      if (pwd) {
        setCurrentSharedWith(pwd.sharedWith || []);
      }
    } catch (error) {
      console.error('Error fetching password details:', error);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL_BASE}/passwords/${passwordId}/share`, 
        { userId: selectedUser, permission },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Secret shared successfully!');
      setMessage({ type: 'success', text: 'Secret shared successfully!' });
      fetchPasswordDetails(); // Refresh list
      setSelectedUser('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to share secret' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnshare = async (userId) => {
    if (!window.confirm('Are you sure you want to revoke access for this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL_BASE}/passwords/${passwordId}/share/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Access revoked successfully');
      setMessage({ type: 'success', text: 'Access revoked successfully' });
      fetchPasswordDetails(); // Refresh list
    } catch (error) {
      toast.error('Failed to revoke access');
      setMessage({ type: 'error', text: 'Failed to revoke access' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-dark border border-cyber-border p-6 sm:p-8 relative z-10 my-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyber-purple bg-opacity-10 rounded-lg border border-cyber-purple border-opacity-20">
                  <Send className="text-cyber-purple w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Access Control</h2>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{passwordTitle}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-5 rounded-lg text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              {message.text && (
                <div className={`p-3 rounded-lg flex items-center gap-3 text-sm ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              {/* Current Shares */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Currently Shared With</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {currentSharedWith.length === 0 ? (
                    <p className="text-xs text-gray-600 italic py-2">This secret is not currently shared with anyone.</p>
                  ) : currentSharedWith.map((share) => (
                    <div key={share.user?._id} className="flex items-center justify-between p-3 rounded-xl bg-white bg-opacity-[0.03] border border-white border-opacity-5 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center text-[10px] font-bold text-cyber-purple">
                          {share.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{share.user?.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{share.permission} access</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUnshare(share.user?._id)}
                        className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Revoke Access"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-cyber-border opacity-50" />

              {/* New Share */}
              <form onSubmit={handleShare} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Grant New Access</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      required
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="cyber-input pl-10 appearance-none text-sm"
                    >
                      <option value="">Choose personnel...</option>
                      {users.filter(u => !currentSharedWith.some(s => s.user?._id === u._id)).map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.department})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Set Level</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPermission('view')}
                      className={`p-3 rounded-xl border text-[10px] font-bold transition-all uppercase tracking-widest ${
                        permission === 'view' ? 'bg-cyber-blue/10 border-cyber-blue text-cyber-blue' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      READ ONLY
                    </button>
                    <button
                      type="button"
                      onClick={() => setPermission('edit')}
                      className={`p-3 rounded-xl border text-[10px] font-bold transition-all uppercase tracking-widest ${
                        permission === 'edit' ? 'bg-cyber-purple/10 border-cyber-purple text-cyber-purple' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      WRITE ACCESS
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedUser}
                  className="w-full h-12 cyber-button !bg-cyber-blue !text-black font-bold flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? 'GRANTING ACCESS...' : (
                    <>
                      <Shield className="w-4 h-4" />
                      GRANT SECURE ACCESS
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
