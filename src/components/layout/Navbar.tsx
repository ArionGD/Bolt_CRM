import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Zap,
  ShieldCheck,
  User,
  LogOut,
  CheckCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, isCustomer, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Brand & Showroom title */}
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/20"
          title="Back to Dealership Website"
        >
          <Zap className="w-6 h-6 stroke-[2.5]" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">
              Volt<span className="text-emerald-600">CRM</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Showroom Operations</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Scooty & E-Rickshaw Single Showroom</p>
        </div>
      </div>

      {/* Right controls: Public Website Link, Axum Admin Link & User profile */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        {/* Dealership Public Website link */}
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Dealership Website</span>
          <span className="sm:hidden">Website</span>
        </Link>

        {/* Axum Backend Superuser Panel Link */}
        <a
          href="http://localhost:8080/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-700 transition-all"
          title="Opens the Superuser Admin Panel served directly from the Axum backend on Render"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden md:inline">Superuser Panel (Axum)</span>
          <span className="md:hidden">Superuser</span>
          <ExternalLink className="w-3 h-3 text-sky-500 ml-0.5" />
        </a>

        {/* Fixed User Badge (Strict 1-User 1-Account Type, NO switching) */}
        <div className="flex items-center space-x-2 sm:space-x-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{user?.full_name}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-700 capitalize">
              {role === 'manager' ? 'Showroom Manager' : role}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
