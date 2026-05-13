import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Building, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL_BASE from '../utils/apiConfig';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        // Reuse the admin users endpoint if permitted, or we can create a specific one for members
        // For now, let's assume there's a /api/admin/users that returns active users
        const response = await axios.get(`${API_URL_BASE}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter only active users for the directory
        setMembers(response.data.data.filter(u => u.status === 'ACTIVE'));
        setLoading(false);
      } catch (error) {
        toast.error('Access Denied: Failed to retrieve personnel directory');
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-cyber-blue" />
            Organization Directory
          </h1>
          <p className="text-gray-400 text-sm">Find and connect with authorized team members</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search colleagues..." 
            className="cyber-input pl-9 h-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="glass p-6 animate-pulse h-48 rounded-3xl" />
          ))
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full py-20 text-center glass rounded-3xl">
            <User className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
            <p className="text-gray-500 italic">No personnel found matching your search</p>
          </div>
        ) : filteredMembers.map((member) => (
          <motion.div 
            key={member._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="glass-dark p-6 group hover:border-cyber-blue hover:border-opacity-30 transition-all cursor-default rounded-3xl border border-white border-opacity-5 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-blue opacity-[0.02] rounded-bl-full -mr-12 -mt-12 group-hover:opacity-[0.05] transition-opacity" />

            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyber-blue/30 transition-all shadow-inner">
                <div className="text-xl font-bold text-cyber-blue/80 group-hover:text-cyber-blue transition-colors">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                member.role.includes('Admin') 
                  ? 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/20' 
                  : 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20'
              }`}>
                {member.role}
              </div>
            </div>
            
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-cyber-blue transition-colors truncate">{member.name}</h3>
            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] mb-4">Personnel ID: {member._id.slice(-6).toUpperCase()}</p>
            
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Building className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="truncate">{member.department || 'Operations'}</span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Active Connection</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Members;
