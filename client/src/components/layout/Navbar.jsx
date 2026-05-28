import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart3, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Dock from '../UI/Dock';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      icon: <LayoutDashboard size={22} color="#ffffff" />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      icon: <PlusCircle size={22} color="#ffffff" />,
      label: 'Add Habit',
      onClick: () => navigate('/add-habit'),
    },
    {
      icon: <BarChart3 size={22} color="#ffffff" />,
      label: 'Progress',
      onClick: () => navigate('/progress'),
    },
  ];

  const profileItems = [
    {
      icon: <User size={22} color="#ffffff" />,
      label: user?.name || 'Profile',
      onClick: () => { },
    },
    {
      icon: <LogOut size={22} color="#ffffff" />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 2rem',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Logo */}
      <div
        style={{ cursor: 'pointer', fontWeight: 800, fontSize: '1rem', color: '#fff', minWidth: '120px' }}
        onClick={() => navigate('/dashboard')}
      >
        HABIT<span style={{ color: '#00F59B' }}>PULSE</span>
      </div>

      {/* Center Nav Items */}
      <Dock
        items={navItems}
        panelHeight={52}
        baseItemSize={40}
        magnification={58}
        distance={120}
      />

      {/* Right — Profile and Logout */}
      <Dock
        items={profileItems}
        panelHeight={52}
        baseItemSize={36}
        magnification={50}
        distance={100}
      />
    </header>
  );
};

export default Navbar;