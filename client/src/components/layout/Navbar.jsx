import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { CheckSquare, PlusCircle, BarChart2, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // If not logged in, Navbar is not rendered (handled in App.jsx or here)
  if (!user) return null;

  return (
    <nav className="hidden md:block sticky top-0 z-40 bg-brand-bg/85 backdrop-blur-md border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2.5 focus:outline-none">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-accent to-brand-accentCyan flex items-center justify-center shadow-glow">
            <CheckSquare size={16} className="text-brand-bg stroke-[2.5]" />
          </div>
          <span className="font-sans font-extrabold text-base tracking-wide text-brand-textPrimary bg-clip-text">
            HABIT<span className="text-brand-accent font-light">PULSE</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link
            to="/dashboard"
            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors focus:outline-none ${
              isActive('/dashboard') ? 'text-brand-accent' : 'text-brand-textSecondary hover:text-brand-textPrimary'
            }`}
          >
            <CheckSquare size={16} />
            <span>Dashboard</span>
          </Link>
          
          <Link
            to="/add-habit"
            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors focus:outline-none ${
              isActive('/add-habit') ? 'text-brand-accent' : 'text-brand-textSecondary hover:text-brand-textPrimary'
            }`}
          >
            <PlusCircle size={16} />
            <span>Add Habit</span>
          </Link>

          <Link
            to="/progress"
            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors focus:outline-none ${
              isActive('/progress') ? 'text-brand-accent' : 'text-brand-textSecondary hover:text-brand-textPrimary'
            }`}
          >
            <BarChart2 size={16} />
            <span>Progress</span>
          </Link>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-brand-card border border-brand-border rounded-lg">
            <User size={14} className="text-brand-accent" />
            <span className="text-xs font-medium text-brand-textPrimary">{user.name}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-border/30 hover:bg-brand-border text-brand-textSecondary hover:text-brand-textPrimary rounded-lg text-xs font-semibold transition-colors border border-brand-border/40 focus:outline-none"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
