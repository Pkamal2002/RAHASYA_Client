import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const PendingApproval = () => {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 -left-10 w-72 h-72 bg-yellow-500 opacity-10 blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 z-10 text-center"
      >
        <div className="w-20 h-20 bg-yellow-500 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500 border-opacity-20 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <Clock className="text-yellow-500 w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Account Pending Approval</h1>
        <p className="text-gray-400 mb-8">
          Your account request has been received. A system administrator needs to approve your access before you can enter the vault.
        </p>

        <div className="bg-cyber-gray bg-opacity-50 rounded-xl p-4 mb-8 text-left border border-cyber-border">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="text-cyber-blue w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              For security reasons, all new enterprise accounts require manual verification by the IT or Security team.
            </p>
          </div>
        </div>

        <button
          onClick={() => dispatch(logout())}
          className="flex items-center justify-center mx-auto text-gray-400 hover:text-white transition-colors group"
        >
          <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Logout and check back later
        </button>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
