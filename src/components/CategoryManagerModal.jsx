import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Tag, Shield } from 'lucide-react';

const CategoryManagerModal = ({ isOpen, onClose, onUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const savedCategories = localStorage.getItem('rahasya_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      const defaultCats = ['WiFi', 'Servers', 'Banking', 'Hosting', 'Social Media', 'Cloud', 'API Keys'];
      setCategories(defaultCats);
      localStorage.setItem('rahasya_categories', JSON.stringify(defaultCats));
    }
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem('rahasya_categories', JSON.stringify(updated));
      setNewCategory('');
      onUpdate(updated);
    }
  };

  const handleRemove = (cat) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem('rahasya_categories', JSON.stringify(updated));
    onUpdate(updated);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="w-full max-w-md glass-dark border border-cyber-border p-5 sm:p-8 relative z-10 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyber-purple bg-opacity-10 rounded-lg border border-cyber-purple border-opacity-20">
                  <Tag className="text-cyber-purple w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Manage Categories</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-5 rounded-lg text-gray-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name..."
                  className="cyber-input flex-1 h-11"
                />
                <button
                  type="submit"
                  className="cyber-button bg-cyber-blue !text-black px-4 h-11 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {categories.map((cat, i) => (
                <div 
                  key={`${cat}-${i}`} 
                  className="flex items-center justify-between p-3 rounded-xl bg-white bg-opacity-[0.03] border border-white border-opacity-5 hover:border-cyber-purple hover:bg-opacity-[0.05] transition-all group"
                >
                  <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">{cat}</span>
                  <button 
                    onClick={() => handleRemove(cat)}
                    className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-cyber-border">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white bg-opacity-5 text-white font-bold hover:bg-opacity-10 transition-all border border-white border-opacity-10"
              >
                Close Manager
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CategoryManagerModal;
