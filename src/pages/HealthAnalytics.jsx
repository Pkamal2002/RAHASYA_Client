import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, Activity, Lock, RefreshCw, ChevronRight } from 'lucide-react';
import { scanHealth } from '../store/slices/vaultSlice';

const HealthAnalytics = () => {
  const dispatch = useDispatch();
  const { passwords, healthReport } = useSelector((state) => state.vault);
  const [scanning, setScanning] = useState(false);

  const performScan = async () => {
    setScanning(true);
    await dispatch(scanHealth());
    setScanning(false);
  };

  useEffect(() => {
    if (passwords.length > 0) performScan();
  }, [passwords.length]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="text-cyber-blue" />
          Security Health Analytics
        </h1>
        <p className="text-gray-400 text-sm">Deep-scan vault integrity and credential strength</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Security Score */}
        <div className="md:col-span-1 glass p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <RefreshCw 
              className={`w-5 h-5 text-gray-500 cursor-pointer hover:text-cyber-blue transition-colors ${scanning ? 'animate-spin' : ''}`} 
              onClick={performScan}
            />
          </div>
          
          <div className="relative mb-6">
            <svg className="w-32 h-32 sm:w-40 sm:h-40 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white text-opacity-5"
                style={{ cx: '50%', cy: '50%', r: '40%' }}
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (healthReport?.score || 0)) / 100}
                className={`${
                  (healthReport?.score || 0) > 80 ? 'text-green-500' :
                  (healthReport?.score || 0) > 50 ? 'text-yellow-500' : 'text-red-500'
                } transition-all duration-1000 ease-out`}
                style={{ cx: '50%', cy: '50%', r: '40%' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-4xl font-bold text-white">{healthReport?.score || 0}%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Health</span>
            </div>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm mb-2">
            {(healthReport?.score || 0) > 80 ? 'Your vault security is excellent.' :
             (healthReport?.score || 0) > 50 ? 'Minor security improvements recommended.' : 
             'Critical security risks detected!'}
          </p>
        </div>

        {/* Scan Details */}
        <div className="md:col-span-1 lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="glass p-5 sm:p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <ShieldAlert className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xl sm:text-2xl font-bold text-white">{healthReport?.breached || 0}</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-300 uppercase">Breached</div>
              <div className="text-[10px] sm:text-xs text-gray-500">Found in breaches</div>
            </div>

            <div className="glass p-5 sm:p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xl sm:text-2xl font-bold text-white">{healthReport?.weak || 0}</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-300 uppercase">Weak</div>
              <div className="text-[10px] sm:text-xs text-gray-500">Under 10 chars</div>
            </div>

            <div className="glass p-5 sm:p-6 border-l-4 border-cyber-blue">
              <div className="flex items-center justify-between mb-2">
                <Lock className="text-cyber-blue w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xl sm:text-2xl font-bold text-white">{healthReport?.reused || 0}</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-300 uppercase">Reused</div>
              <div className="text-[10px] sm:text-xs text-gray-500">Used multiple times</div>
            </div>
          </div>

          <div className="glass p-6">
            <h3 className="text-lg font-bold text-white mb-4">Security Recommendations</h3>
            <div className="space-y-3">
              {[
                { title: 'Enable Two-Factor Authentication', detail: 'Add an extra layer of protection to your account.', icon: ShieldCheck, color: 'text-green-500' },
                { title: 'Update Breached Credentials', detail: 'Immediate action required for leaked passwords.', icon: ShieldAlert, color: 'text-red-400' },
                { title: 'Increase Password Entropy', detail: 'Use the password generator for random, complex strings.', icon: Lock, color: 'text-cyber-blue' }
              ].map((rec, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-colors cursor-pointer group">
                  <div className={`p-2 rounded-lg bg-white bg-opacity-5 ${rec.color}`}>
                    <rec.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white group-hover:text-cyber-blue transition-colors">{rec.title}</div>
                    <div className="text-xs text-gray-500">{rec.detail}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-700 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalytics;
