import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Shield, 
  Users, 
  History, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  UserCheck,
  LayoutDashboard, 
  Search, 
  Bell,
  Database
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { fetchNotifications, markNotificationsAsRead } from '../store/slices/notificationSlice';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const { user } = useSelector((state) => state.auth);
  const { items: notifications, unreadCount, loading: notificationsLoading } = useSelector((state) => state.notifications);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

  const menuItems = [
    { title: 'Vault', icon: Lock, path: '/' },
    { title: 'Security Health', icon: Shield, path: '/health' },
    { title: 'Generator', icon: Settings, path: '/generator' },
    { title: 'Members', icon: Users, path: '/members' },
    { title: 'Profile', icon: User, path: '/profile' },
  ];

  if (user?.role === 'Admin' || user?.role === 'Super Admin') {
    menuItems.push({ title: 'User Management', icon: Users, path: '/admin' });
    menuItems.push({ title: 'Audit Logs', icon: LayoutDashboard, path: '/logs' });
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleNotifications = () => {
    const newState = !isNotificationsOpen;
    setIsNotificationsOpen(newState);
    if (newState && unreadCount > 0) {
      dispatch(markNotificationsAsRead());
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-black">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed md:relative w-72 md:w-64 glass-dark border-r border-cyber-border h-full z-50 md:z-30 flex flex-col`}
          >
            <div className="p-6 flex items-center justify-between border-b border-cyber-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyber-blue bg-opacity-10 rounded-xl flex items-center justify-center border border-cyber-blue border-opacity-20 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
                  <Shield className="text-cyber-blue w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-wider text-white uppercase tracking-[0.2em]">RAHASYA</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-2 hover:bg-white hover:bg-opacity-5 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 mt-4 space-y-2 overflow-y-auto custom-scrollbar">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-cyber-blue bg-opacity-10 text-cyber-blue border border-cyber-blue border-opacity-20 shadow-[0_0_15px_rgba(0,210,255,0.1)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-[0.03]'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-cyber-blue' : 'group-hover:text-white'}`} />
                    <span className="font-medium">{item.title}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 border-t border-cyber-border space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-cyber-gray flex items-center justify-center text-cyber-blue font-bold border border-cyber-border shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-[0.05] rounded-xl transition-all group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Lock Vault</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 glass-dark border-b border-cyber-border flex items-center justify-between px-4 md:px-8 z-20 shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-cyber-gray rounded-lg text-gray-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {!isSidebarOpen && (
              <span className="text-lg font-bold tracking-[0.2em] text-white md:hidden">RAHASYA</span>
            )}
          </div>

          <div className="hidden sm:flex flex-1 max-w-xl mx-4 md:mx-8 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyber-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search secure vault..."
              className="w-full bg-cyber-black bg-opacity-50 border border-cyber-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyber-blue transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 relative">
            <button className="sm:hidden p-2 text-gray-400 hover:text-cyber-blue">
              <Search className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className={`p-2 hover:bg-cyber-gray rounded-lg transition-colors relative ${isNotificationsOpen ? 'text-cyber-blue bg-cyber-gray' : 'text-gray-400'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-cyber-blue rounded-full shadow-[0_0_8px_rgba(0,210,255,0.6)]"></span>
                )}
              </button>
            </div>

            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-cyber-gray rounded-lg text-gray-400 hover:text-cyber-blue transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
          <Outlet />
        </div>

        <AnimatePresence>
          {isNotificationsOpen && (
            <>
              {/* Desktop Dropdown */}
              <div className="hidden sm:block">
                <div className="fixed inset-0 z-[1000]" onClick={() => setIsNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="fixed right-8 top-16 w-80 bg-[#0a0a0c] border border-cyber-border rounded-2xl shadow-2xl z-[1001] overflow-hidden backdrop-blur-xl"
                >
                  <div className="p-4 border-b border-cyber-border flex items-center justify-between bg-white bg-opacity-[0.02]">
                    <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-cyber-blue bg-opacity-10 text-cyber-blue px-2 py-0.5 rounded-full font-bold border border-cyber-blue border-opacity-20">{unreadCount} NEW</span>
                    )}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-xs italic">No notifications yet</div>
                    ) : notifications.map((n, i) => (
                      <div key={n._id || i} className="p-4 border-b border-cyber-border border-opacity-50 hover:bg-white hover:bg-opacity-[0.03] transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${n.type === 'alert' ? 'text-red-400' : 'text-cyber-blue'}`}>{n.title}</span>
                          <span className="text-[10px] text-gray-600 font-medium">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 text-center bg-white bg-opacity-[0.01]">
                    <button className="text-[10px] font-bold text-cyber-blue hover:text-white transition-all uppercase tracking-[0.2em]">View All Activity</button>
                  </div>
                </motion.div>
              </div>

              {/* Mobile Bottom Sheet */}
              <div className="sm:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsNotificationsOpen(false)}
                  className="fixed inset-0 bg-black/90 backdrop-blur-md z-[2000]"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 bg-[#0a0a0c] border-t border-cyber-border rounded-t-[2.5rem] z-[2001] p-6 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-8" />
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white uppercase tracking-[0.2em]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-cyber-blue bg-opacity-10 text-cyber-blue px-3 py-1 rounded-full font-bold border border-cyber-blue border-opacity-20">{unreadCount} NEW</span>
                    )}
                  </div>
                  
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm italic">No notifications yet</div>
                    ) : notifications.map((n, i) => (
                      <div key={n._id || i} className="p-5 rounded-2xl bg-white bg-opacity-[0.03] border border-white border-opacity-5">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${n.type === 'alert' ? 'text-red-400' : 'text-cyber-blue'}`}>{n.title}</span>
                          <span className="text-[10px] text-gray-500">{new Date(n.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsNotificationsOpen(false)}
                    className="w-full mt-8 py-4 rounded-2xl bg-cyber-blue text-black font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;
