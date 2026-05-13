import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff, 
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Star,
  Globe,
  Server,
  Cpu,
  Send,
  Lock,
  SearchIcon,
  X,
  Tag,
  Shield
} from 'lucide-react';
import { getPasswords, reset, deletePassword } from '../store/slices/vaultSlice';
import toast from 'react-hot-toast';
import AddPasswordModal from '../components/AddPasswordModal';
import ShareModal from '../components/ShareModal';
import EditPasswordModal from '../components/EditPasswordModal';
import { useNavigate } from 'react-router-dom';

import CategoryManagerModal from '../components/CategoryManagerModal';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { passwords, isLoading, healthReport } = useSelector((state) => state.vault);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState(['All', 'Favorites', 'Shared', 'WiFi', 'Servers', 'Banking', 'Hosting', 'Social Media', 'Cloud', 'API Keys']);
  const [shareData, setShareData] = useState({ isOpen: false, id: '', title: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(getPasswords());
    const savedCats = localStorage.getItem('rahasya_categories');
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      setCategories(Array.from(new Set(['All', 'Favorites', 'Shared', ...parsed.filter(Boolean)])));
    }
  }, [isCategoryModalOpen]);

  const handleCategoryUpdate = (updatedCats) => {
    setCategories(Array.from(new Set(['All', 'Favorites', 'Shared', ...updatedCats.filter(Boolean)])));
  };

  const filteredPasswords = passwords.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === 'Favorites') {
      matchesCategory = p.isFavorite;
    } else if (selectedCategory === 'Shared') {
      matchesCategory = p.owner._id !== user?._id && p.owner !== user?._id;
    } else if (selectedCategory !== 'All') {
      matchesCategory = p.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  const [showPassword, setShowPassword] = useState({});

  const togglePassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this secret? This action cannot be undone.')) {
      toast.promise(
        dispatch(deletePassword(id)).unwrap(),
        {
          loading: 'Deleting secret...',
          success: 'Secret deleted successfully!',
          error: (err) => err.message || 'Failed to delete secret',
        }
      );
      setOpenMenuId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Secure Vault</h1>
          <p className="text-gray-400 mt-1">Manage and share your enterprise credentials securely.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search vault..." 
              className="cyber-input pl-10 w-64 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="p-3 hover:bg-cyber-purple hover:bg-opacity-10 rounded-xl text-gray-500 hover:text-cyber-purple transition-all border border-cyber-border hover:border-cyber-purple"
              title="Manage Categories"
            >
              <Tag className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="cyber-button flex items-center justify-center space-x-2 bg-cyber-blue !text-black font-bold h-12 px-6"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Secret</span>
          </button>
        </div>
      </div>

      {/* Stats/Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Secrets', value: passwords.length, icon: ShieldCheck, color: 'text-cyber-blue', onClick: () => setSelectedCategory('All') },
          { label: 'Shared with Me', value: passwords.filter(p => p.owner?._id !== user?._id && p.owner !== user?._id).length, icon: Globe, color: 'text-cyber-purple', onClick: () => setSelectedCategory('Shared') },
          { label: 'Health Score', value: healthReport ? `${healthReport.score}%` : 'Scan Now', icon: ShieldAlert, color: 'text-cyber-neon', onClick: () => navigate('/health') },
        ].map((stat, i) => (
          <div 
            key={i} 
            onClick={stat.onClick}
            className="glass p-6 flex items-center space-x-4 cursor-pointer hover:bg-white hover:bg-opacity-5 transition-all group"
          >
            <div className={`p-3 rounded-xl bg-opacity-10 ${stat.color.replace('text', 'bg')} border border-opacity-20 ${stat.color.replace('text', 'border')} group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vault Content */}
      <div className="glass overflow-hidden border border-cyber-border">
        <div className="p-4 sm:p-6 border-b border-cyber-border flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
            {categories.map((cat, i) => (
              <button
                key={`${cat}-${i}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-cyber-blue text-black' 
                    : 'bg-white bg-opacity-5 text-gray-400 hover:text-white hover:bg-opacity-10 border border-white border-opacity-5'
                }`}
              >
                {cat === 'Favorites' && <Star className={`w-3 h-3 ${selectedCategory === 'Favorites' ? 'fill-black' : 'fill-gray-500'}`} />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white bg-opacity-[0.02] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-8 py-4">Title</th>
                <th className="px-8 py-4">Username</th>
                <th className="px-8 py-4">Password</th>
                <th className="px-8 py-4 hidden lg:table-cell">Category</th>
                <th className="px-8 py-4 hidden xl:table-cell">Security</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-cyber-blue rounded-full animate-ping" />
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Decrypting Vault...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPasswords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-500 italic text-sm">
                    No secrets found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPasswords.map((p) => (
                  <tr key={p._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-cyber-gray flex items-center justify-center border border-cyber-border group-hover:border-cyber-blue transition-colors shrink-0">
                          {p.category === 'Servers' ? <Server className="w-5 h-5 text-cyber-blue" /> : <Globe className="w-5 h-5 text-cyber-purple" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-cyber-blue transition-colors truncate">{p.title}</p>
                          <p className="text-[10px] text-gray-600 font-medium truncate max-w-[150px]">{p.url || 'Internal Resource'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300 font-mono bg-white bg-opacity-5 px-2 py-1 rounded">{p.username}</span>
                        <button onClick={() => copyToClipboard(p.username)} className="p-1.5 hover:bg-white hover:bg-opacity-10 rounded text-gray-600 hover:text-cyber-blue transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300 font-mono bg-white bg-opacity-5 px-2 py-1 rounded">
                          {showPassword[p._id] ? p.password : '••••••••'}
                        </span>
                        <button onClick={() => togglePassword(p._id)} className="text-gray-600 hover:text-cyber-blue transition-colors">
                          {showPassword[p._id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-5 hidden lg:table-cell">
                      <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-white bg-opacity-5 border border-white border-opacity-5 text-gray-400 uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 hidden xl:table-cell">
                      <div className="flex items-center space-x-1.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-1 h-3 rounded-full ${i <= 3 ? 'bg-cyber-neon shadow-[0_0_8px_rgba(57,255,20,0.4)]' : 'bg-gray-800'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-cyber-neon font-bold ml-1 uppercase tracking-tighter">Secure</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right relative">
                      <div className="flex items-center justify-end space-x-1">
                        {(p.owner?._id === user?._id || p.owner === user?._id || user?.role === 'Admin' || user?.role === 'Super Admin') ? (
                          <button 
                            onClick={() => setShareData({ isOpen: true, id: p._id, title: p.title })}
                            className="p-2.5 hover:bg-cyber-purple hover:bg-opacity-10 rounded-xl text-gray-500 hover:text-cyber-purple transition-all"
                            title="Share Secret"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        ) : null}
                        <button 
                          onClick={() => copyToClipboard(p.password)} 
                          className="p-2.5 hover:bg-cyber-blue hover:bg-opacity-10 rounded-xl text-gray-500 hover:text-cyber-blue transition-all"
                          title="Copy Password"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === p._id ? null : p._id)}
                            className={`p-2.5 rounded-xl transition-all ${openMenuId === p._id ? 'bg-white bg-opacity-10 text-white' : 'text-gray-500 hover:bg-white hover:bg-opacity-10 hover:text-white'}`}
                            title="More Options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          <AnimatePresence>
                            {openMenuId === p._id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  className="absolute right-0 mt-2 w-48 glass-dark border border-cyber-border rounded-xl shadow-2xl z-20 py-2"
                                >
                                  <button 
                                    onClick={() => { setSelectedPassword(p); setIsEditModalOpen(true); setOpenMenuId(null); }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-[0.03] transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Edit Details</span>
                                  </button>
                                  <button 
                                    onClick={() => { copyToClipboard(p.username); setOpenMenuId(null); }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-[0.03] transition-colors"
                                  >
                                    <Copy className="w-4 h-4" />
                                    <span>Copy Username</span>
                                  </button>
                                  <button 
                                    onClick={() => { copyToClipboard(p.password); setOpenMenuId(null); }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-[0.03] transition-colors"
                                  >
                                    <Lock className="w-4 h-4" />
                                    <span>Copy Password</span>
                                  </button>
                                  {(p.owner?._id === user?._id || p.owner === user?._id || user?.role === 'Admin' || user?.role === 'Super Admin') && (
                                    <>
                                      <div className="my-1 border-t border-cyber-border border-opacity-50" />
                                      <button 
                                        onClick={() => handleDelete(p._id)}
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-[0.05] transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                        <span>Delete Secret</span>
                                      </button>
                                    </>
                                  )}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-cyber-border">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500 uppercase tracking-widest text-xs">Decrypting Vault...</div>
          ) : filteredPasswords.length === 0 ? (
            <div className="p-10 text-center text-gray-500 italic text-sm">No secrets found.</div>
          ) : (
            filteredPasswords.map((p) => (
              <div key={p._id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-cyber-gray flex items-center justify-center border border-cyber-border shrink-0">
                      {p.category === 'Servers' ? <Server className="w-5 h-5 text-cyber-blue" /> : <Globe className="w-5 h-5 text-cyber-purple" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.title}</p>
                      <p className="text-[10px] text-gray-600 font-medium truncate max-w-[200px]">{p.url || 'Internal Resource'}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === p._id ? null : p._id)}
                      className={`p-2 rounded-lg transition-colors ${openMenuId === p._id ? 'bg-white bg-opacity-10 text-white' : 'text-gray-500'}`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {openMenuId === p._id && (
                        <>
                          {/* Backdrop */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenMenuId(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
                          />
                          
                          {/* Bottom Sheet */}
                          <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 glass-dark border-t border-cyber-border rounded-t-[2.5rem] z-[101] p-6 pb-10 md:hidden"
                          >
                            <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-8" />
                            
                            <div className="flex items-center space-x-4 mb-8">
                              <div className="w-12 h-12 rounded-2xl bg-cyber-blue bg-opacity-10 flex items-center justify-center border border-cyber-blue border-opacity-20">
                                <Shield className="text-cyber-blue w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">{p.category}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              <button 
                                onClick={() => { setSelectedPassword(p); setIsEditModalOpen(true); setOpenMenuId(null); }} 
                                className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl bg-white bg-opacity-5 text-gray-300 hover:text-white transition-all"
                              >
                                <ExternalLink className="w-5 h-5 text-cyber-blue" />
                                <span className="font-semibold">Edit Details</span>
                              </button>
                              
                              {(p.owner?._id === user?._id || p.owner === user?._id || user?.role === 'Admin' || user?.role === 'Super Admin') && (
                                <button 
                                  onClick={() => { setShareData({ isOpen: true, id: p._id, title: p.title }); setOpenMenuId(null); }}
                                  className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl bg-white bg-opacity-5 text-gray-300 hover:text-white transition-all"
                                >
                                  <Send className="w-5 h-5 text-cyber-purple" />
                                  <span className="font-semibold">Share Secret</span>
                                </button>
                              )}

                              <button 
                                onClick={() => { copyToClipboard(p.password); setOpenMenuId(null); }}
                                className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl bg-white bg-opacity-5 text-gray-300 hover:text-white transition-all"
                              >
                                <Lock className="w-5 h-5 text-cyber-neon" />
                                <span className="font-semibold">Copy Password</span>
                              </button>

                              <div className="my-2" />
                              
                              <button 
                                onClick={() => { handleDelete(p._id); setOpenMenuId(null); }} 
                                className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl bg-red-500 bg-opacity-10 text-red-500 hover:bg-opacity-20 transition-all"
                              >
                                <X className="w-5 h-5" />
                                <span className="font-bold">Delete Secret</span>
                              </button>
                            </div>
                          </motion.div>

                          {/* Desktop Dropdown (keep same as before for md and up) */}
                          <div className="hidden md:block">
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-0 mt-2 w-48 glass-dark border border-cyber-border rounded-xl shadow-2xl z-20 py-2"
                            >
                              <button 
                                onClick={() => { setSelectedPassword(p); setIsEditModalOpen(true); setOpenMenuId(null); }} 
                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-[0.03] transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Edit Details</span>
                              </button>
                              
                              {(p.owner?._id === user?._id || p.owner === user?._id || user?.role === 'Admin' || user?.role === 'Super Admin') && (
                                <button 
                                  onClick={() => { setShareData({ isOpen: true, id: p._id, title: p.title }); setOpenMenuId(null); }}
                                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-[0.03] transition-colors"
                                >
                                  <Send className="w-4 h-4" />
                                  <span>Share Secret</span>
                                </button>
                              )}

                              <button 
                                onClick={() => { copyToClipboard(p.password); setOpenMenuId(null); }}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-[0.03] transition-colors"
                              >
                                <Lock className="w-4 h-4" />
                                <span>Copy Password</span>
                              </button>

                              {(p.owner?._id === user?._id || p.owner === user?._id || user?.role === 'Admin' || user?.role === 'Super Admin') && (
                                <>
                                  <div className="my-1 border-t border-cyber-border border-opacity-50" />
                                  <button 
                                    onClick={() => { handleDelete(p._id); setOpenMenuId(null); }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-[0.05] transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                    <span>Delete Secret</span>
                                  </button>
                                </>
                              )}
                            </motion.div>
                          </div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wider">Username</p>
                    <div className="flex items-center justify-between bg-white bg-opacity-5 p-2 rounded-lg">
                      <span className="text-xs text-gray-300 font-mono truncate mr-2">{p.username}</span>
                      <button onClick={() => copyToClipboard(p.username)} className="text-gray-600"><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wider">Password</p>
                    <div className="flex items-center justify-between bg-white bg-opacity-5 p-2 rounded-lg">
                      <span className="text-xs text-gray-300 font-mono">{showPassword[p._id] ? p.password : '••••••••'}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => togglePassword(p._id)} className="text-gray-600"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => copyToClipboard(p.password)} className="text-gray-600"><Lock className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AddPasswordModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      {/* Share Modal */}
      <ShareModal 
        isOpen={shareData.isOpen} 
        onClose={() => setShareData({ ...shareData, isOpen: false })} 
        passwordId={shareData.id}
        passwordTitle={shareData.title}
      />
      {/* Edit Modal */}
      <EditPasswordModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        passwordData={selectedPassword}
      />
      {/* Category Modal */}
      <CategoryManagerModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onUpdate={handleCategoryUpdate}
      />
    </div>
  );
};

export default Dashboard;
