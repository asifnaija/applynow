import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, LayoutDashboard, LogOut, User as UserIcon, LogIn, FileText, Settings } from 'lucide-react';
import { ChatBot } from './ChatBot';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path 
    ? 'text-brand-700 bg-brand-50 font-semibold' 
    : 'text-slate-600 hover:text-brand-600 hover:bg-white/50 font-medium';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
              <div className="bg-brand-600 rounded-lg p-1.5 shadow-glow group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">ApplyNow</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!currentUser ? (
                <>
                  <Link to="/" className="text-slate-600 hover:text-brand-600 font-medium text-sm px-3 py-2 rounded-md transition-colors">Home</Link>
                  <Link to="/login" className="bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/20 transition-all flex items-center gap-2">
                    <LogIn size={16} /> Login
                  </Link>
                </>
              ) : (
                <>
                   {currentUser.role === 'admin' ? (
                     <Link to="/admin" className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${isActive('/admin')}`}>
                       <LayoutDashboard size={18} /> Admin Panel
                     </Link>
                   ) : (
                     <>
                        <Link to="/apply" className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${isActive('/apply')}`}>
                            <FileText size={18} /> Apply
                        </Link>
                        <Link to="/dashboard" className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${isActive('/dashboard')}`}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                     </>
                   )}
                   
                   <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                   
                   <div className="flex items-center gap-3 pl-2">
                      <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{currentUser.role}</span>
                      </div>
                      <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                        <LogOut size={20} />
                      </button>
                   </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Conditionally apply max-width constraints so Home can use full-width sections */}
      <main className={`flex-grow w-full ${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'} animate-slideUp`}>
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ApplyNow University Systems.
          </p>
          <div className="flex space-x-6 text-sm text-slate-400">
            <a href="#" className="hover:text-brand-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
      
      {/* Global Chat Bot */}
      <ChatBot />
    </div>
  );
};