import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { X, Shield, Globe, Lock, User, Link as LinkIcon, RefreshCw, Save, Tag, Building } from 'lucide-react';
import { createPassword } from '../store/slices/vaultSlice';
import CategoryManagerModal from './CategoryManagerModal';
import toast from 'react-hot-toast';

const AddPasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    category: 'Cloud',
    department: 'IT',
    notes: ''
  });

  const [categories, setCategories] = useState(['WiFi', 'Servers', 'Banking', 'Hosting', 'Social Media', 'Cloud', 'API Keys']);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    const savedCats = localStorage.getItem('rahasya_categories');
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      setCategories(Array.from(new Set(parsed.filter(Boolean))));
    }
  }, [isCategoryModalOpen]);

  const handleCategoryUpdate = (updatedCats) => {
    setCategories(Array.from(new Set(updatedCats.filter(Boolean))));
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(
      dispatch(createPassword(formData)).unwrap(),
      {
        loading: 'Saving secret...',
        success: 'Secret saved successfully!',
        error: (err) => err.message || 'Failed to save secret',
      }
    );
    onClose();
    setFormData({
      title: '',
      username: '',
      password: '',
      url: '',
      category: 'Cloud',
      department: 'IT',
      notes: ''
    });
  };

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl glass-dark border border-cyber-border p-5 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyber-blue bg-opacity-10 rounded-lg border border-cyber-blue border-opacity-20">
                  <Shield className="text-cyber-blue w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Add New Secret</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-5 rounded-lg text-gray-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Title</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="cyber-input pl-10"
                      placeholder="e.g. AWS Production Console"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Category</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="cyber-input flex-1"
                    >
                      {categories.map((c, i) => <option key={`${c}-${i}`} value={c}>{c}</option>)}
                    </select>
                    {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
                      <button 
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="p-2.5 bg-cyber-purple bg-opacity-10 rounded-lg border border-cyber-purple border-opacity-20 text-cyber-purple hover:bg-opacity-20 transition-all"
                        title="Manage Categories"
                      >
                        <Tag className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Username / Email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="cyber-input pl-10"
                      placeholder="admin@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="cyber-input pl-10 pr-10"
                      placeholder="••••••••••••"
                    />
                    <button 
                      type="button"
                      onClick={generatePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-blue hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Department</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="cyber-input pl-10"
                      placeholder="e.g. IT, HR, Finance"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">URL (Optional)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="cyber-input pl-10"
                      placeholder="https://console.aws.amazon.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Secure Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="cyber-input min-h-[100px] py-3 resize-none"
                    placeholder="Add any additional details or recovery codes..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5 transition-all border border-transparent hover:border-white hover:border-opacity-10 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cyber-button flex items-center justify-center space-x-2 bg-cyber-blue !text-black font-bold h-12 px-8 order-1 sm:order-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Secret</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    <CategoryManagerModal 
      isOpen={isCategoryModalOpen}
      onClose={() => setIsCategoryModalOpen(false)}
      onUpdate={handleCategoryUpdate}
    />
  </>
);
};

export default AddPasswordModal;
