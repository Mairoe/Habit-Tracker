import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { CheckSquare, PlusCircle, BarChart2, LogOut } from 'lucide-react';

export const BottomNav = () => {
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

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-bg/85 backdrop-blur-md border-t border-brand-border/60 pb-safe">
      <div className="flex justify-around items-center h-16 px-4">
        {/* Dashboard Link */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors focus:outline-none ${
            isActive('/dashboard') ? 'text-brand-accent' : 'text-brand-textSecondary hover:text-brand-textPrimary'
          }`}
        >
          <CheckSquare size={20} />
          <span className="text-[10px] font-medium mt-1">Dashboard</span>
        </Link>

        {/* Add Habit Link */}
        <Link
          to="/add-habit"
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors focus:outline-none ${
            isActive('/add-habit') ? 'text-brand-accent' : 'text-brand-textSecondary hover:text-brand-textPrimary'
          }`}
        >
          <PlusCircle size={20} />
          <span className="text-[10px] font-medium mt-1">Add Habit</span>
        </Link>

        {/* Progress Link */}
        <Link
          to="/progress"
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors focus:outline-none ${
            isActive('/progress') ? 'text-brand-accent' : 'text-brand-textSecondary hover:text-brand-textPrimary'
          }`}
        >
          <BarChart2 size={20} />
          <span className="text-[10px] font-medium mt-1">Progress</span>
        </Link>

        {/* Logout Link */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center w-16 h-full text-brand-textSecondary hover:text-brand-textPrimary transition-colors focus:outline-none"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
