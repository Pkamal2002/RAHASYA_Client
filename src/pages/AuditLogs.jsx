import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { History, Search, Filter, Clock, User, Globe, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import API_URL_BASE from '../utils/apiConfig';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL_BASE}/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const searchStr = `${log.action} ${log.target} ${log.user?.name || ''} ${log.details || ''}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="text-cyber-blue" />
            Audit Logs
          </h1>
          <p className="text-gray-400 text-sm">Real-time enterprise activity monitoring</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search activity..." 
            className="cyber-input pl-9 h-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white bg-opacity-[0.02] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Action</th>
                <th className="px-8 py-4 hidden lg:table-cell">User</th>
                <th className="px-8 py-4 hidden xl:table-cell">Target</th>
                <th className="px-8 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-gray-500 italic">Retrieving secure log stream...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-gray-500 italic">No activity logs found</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                    <td className="px-8 py-4 whitespace-nowrap text-gray-400 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(log.createdAt), 'MMM dd, HH:mm:ss')}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.action.includes('REGISTER') || log.action.includes('CREATED') ? 'bg-green-500/10 text-green-500' :
                        log.action.includes('DELETE') ? 'bg-red-500/10 text-red-500' :
                        'bg-cyber-blue/10 text-cyber-blue'
                      }`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-gray-200">
                        <User className="w-3.5 h-3.5 text-gray-500" />
                        {log.user?.name || 'System'}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-gray-300 hidden xl:table-cell">{log.target}</td>
                    <td className="px-8 py-4 text-gray-400 italic text-xs max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-cyber-border">
          {loading ? (
            <div className="p-10 text-center text-gray-500 text-xs uppercase tracking-widest">Retrieving Logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-10 text-center text-gray-500 italic text-sm">No logs found.</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <Clock className="w-3 h-3" />
                    {format(new Date(log.createdAt), 'MMM dd, HH:mm:ss')}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    log.action.includes('REGISTER') || log.action.includes('CREATED') ? 'bg-green-500/10 text-green-500' :
                    log.action.includes('DELETE') ? 'bg-red-500/10 text-red-500' :
                    'bg-cyber-blue/10 text-cyber-blue'
                  }`}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                    <User className="w-3.5 h-3.5 text-cyber-blue" />
                    {log.user?.name || 'System'}
                  </div>
                  <p className="text-xs text-gray-400 font-medium italic">{log.target}</p>
                </div>
                {log.details && (
                  <div className="bg-white bg-opacity-5 p-2 rounded-lg text-[10px] text-gray-500 border border-white border-opacity-5">
                    {log.details}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
