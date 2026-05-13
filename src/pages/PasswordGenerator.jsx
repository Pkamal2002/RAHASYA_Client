import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Shield, Zap, Lock } from 'lucide-react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let availableChars = '';
    if (options.uppercase) availableChars += charset.uppercase;
    if (options.lowercase) availableChars += charset.lowercase;
    if (options.numbers) availableChars += charset.numbers;
    if (options.symbols) availableChars += charset.symbols;

    if (!availableChars) return;

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
    }
    setPassword(generatedPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateStrength = () => {
    let score = 0;
    if (length > 12) score++;
    if (length > 16) score++;
    if (options.uppercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    return score;
  };

  const strength = calculateStrength();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="text-cyber-blue" />
          Quantum Password Generator
        </h1>
        <p className="text-gray-400 text-sm">Generate cryptographically strong passwords for your enterprise assets</p>
      </div>

      <div className="glass p-5 sm:p-8 space-y-6 sm:space-y-8">
        {/* Result Display */}
        <div className="relative group">
          <div className="cyber-input h-auto min-h-[4rem] flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-0 text-lg sm:text-xl font-mono text-cyber-blue overflow-hidden gap-4">
            <span className="truncate w-full sm:w-auto text-center sm:text-left">{password || 'Click Generate...'}</span>
            <div className="flex items-center gap-2 ml-auto sm:ml-4">
              <button 
                onClick={copyToClipboard}
                disabled={!password}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
              <button 
                onClick={generatePassword}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg text-gray-400 hover:text-cyber-blue transition-all"
              >
                <RefreshCw className={`w-5 h-5 ${!password ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
          {/* Strength Bar */}
          {password && (
            <div className="absolute -bottom-1 left-0 right-0 h-1 flex gap-1 px-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <div 
                  key={level}
                  className={`h-full flex-1 rounded-full transition-all duration-500 ${
                    level <= strength 
                      ? strength > 4 ? 'bg-green-500' : strength > 2 ? 'bg-yellow-500' : 'bg-red-500'
                      : 'bg-white bg-opacity-10'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Password Length</label>
                <span className="text-cyber-blue font-bold">{length}</span>
              </div>
              <input 
                type="range" 
                min="8" 
                max="64" 
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-blue"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <span>Weak (8)</span>
                <span>Insane (64)</span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(options).map((key) => (
              <label 
                key={key}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                  options[key] 
                    ? 'bg-cyber-blue bg-opacity-5 border-cyber-blue border-opacity-30 text-white' 
                    : 'bg-white bg-opacity-5 border-transparent text-gray-500 hover:border-white hover:border-opacity-10'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">{key}</span>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={options[key]}
                  onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key] }))}
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  options[key] ? 'bg-cyber-blue border-cyber-blue' : 'border-gray-600'
                }`}>
                  {options[key] && <Check className="w-3 h-3 text-black font-bold" />}
                </div>
              </label>
            ))}
          </div>
        </div>

        <button 
          onClick={generatePassword}
          className="w-full h-14 cyber-button !bg-cyber-blue !text-black font-bold text-lg flex items-center justify-center gap-2 group"
        >
          <Lock className="w-5 h-5" />
          GENERATE SECURE PASSWORD
        </button>
      </div>

      {/* Security Tip */}
      <div className="glass p-4 border-l-4 border-cyber-blue flex gap-4 items-start">
        <Shield className="text-cyber-blue w-6 h-6 shrink-0 mt-1" />
        <div>
          <h4 className="text-sm font-bold text-white">Pro Tip: Entropy Matters</h4>
          <p className="text-xs text-gray-500 mt-1">
            For critical infrastructure and master passwords, we recommend at least 24 characters with all symbol types enabled. 
            This generates roughly 150 bits of entropy, making it resistant to brute-force attacks for decades.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
