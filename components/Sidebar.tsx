
import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'fa-house' },
    { to: '/chat', label: 'AI Assistant', icon: 'fa-robot' },
    { to: '/upload', label: 'Upload Data', icon: 'fa-cloud-arrow-up' },
    { to: '/analysis', label: 'Analysis', icon: 'fa-magnifying-glass-chart' },
    { to: '/budget', label: 'Budgeting', icon: 'fa-piggy-bank' },
    { to: '/bills', label: 'Bills & Subs', icon: 'fa-calendar-check' },
    { to: '/tax', label: 'Tax Hub', icon: 'fa-file-invoice-dollar' },
    { to: '/household', label: 'Household', icon: 'fa-users' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm relative z-20">
      <div className="p-8">
        <Link to="/" className="text-3xl font-black text-indigo-600 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <i className="fas fa-receipt"></i>
          <span>R2R</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 font-semibold'
              }`
            }
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 w-full text-left text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
        >
          <i className="fas fa-power-off w-5"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
