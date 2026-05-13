import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-cyber-blue opacity-20 blur-3xl rounded-full" />
          <ShieldAlert className="w-32 h-32 text-cyber-blue relative z-10 mx-auto" />
          <motion.div
            animate={{ 
              textShadow: ["0 0 10px #00d2ff", "0 0 20px #00d2ff", "0 0 10px #00d2ff"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-9xl font-black text-white mt-4"
          >
            404
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">Access Denied</h1>
          <p className="text-gray-400">The sector you are trying to access does not exist or has been moved beyond the firewall.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-white bg-opacity-5 text-gray-300 hover:text-white border border-white border-opacity-10 hover:border-opacity-30 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-cyber-blue text-black font-bold hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Base</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
