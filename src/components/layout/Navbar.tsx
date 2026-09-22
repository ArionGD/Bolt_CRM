import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  Zap,
  ShieldCheck,
  Globe,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm select-none">
      {/* Brand & Dynamic Route Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0"
          title="Back to Dealership Website"
        >
          <Zap className="w-6 h-6 stroke-[2.5]" />
        </Link>
        <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl shrink-0">
          Trisha Motors
        </span>

        {/* Dynamic Route Breadcrumbs (Replaces static operations tag) */}
        <div className="hidden sm:flex items-center pl-4 border-l border-slate-200">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right controls: Public Website Link, Axum Admin Link & User profile dropdown */}
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

        {/* Backend Admin Login Link (Only Shield Icon) */}
        <a
          href="http://localhost:8080/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-700 transition-all cursor-pointer"
          title="Open Backend Admin Login"
        >
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span className="hidden md:inline">Admin Login</span>
        </a>

        {/* Profile icon block with '>' icon and Dropdown menu */}
        <div className="relative pl-2 border-l border-slate-200" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`flex items-center space-x-2 sm:space-x-3 px-2.5 py-1.5 rounded-xl border transition-all duration-150 cursor-pointer ${
              isDropdownOpen
                ? 'bg-slate-100 border-slate-300 shadow-inner'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
            }`}
            aria-expanded={isDropdownOpen}
            aria-label="User profile menu"
          >
            {/* Profile Avatar Icon */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-sky-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Profile Name & Role Info */}
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                {user?.full_name || 'Staff User'}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">
                {role === 'manager' ? 'Showroom Manager' : role || 'Staff'}
              </p>
            </div>

            {/* '>' Icon indicating dropdown menu */}
            <ChevronRight
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-90 text-emerald-600' : ''
              }`}
            />
          </button>

          {/* Polished Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Details Header */}
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-sky-500 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.full_name || 'Staff User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || 'staff@trishamotors.com'}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    {role === 'manager' ? 'Showroom Manager' : role || 'Staff'}
                  </span>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="py-2 space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                >
                  <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dealership Public Website</span>
                </Link>
                <a
                  href="http://localhost:8080/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Backend Admin Login</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              {/* Session / System Info Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-[11px] text-slate-500 font-medium">
                <span>Trisha Motors CRM</span>
                <span className="flex items-center space-x-1.5 text-emerald-600">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Online</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
