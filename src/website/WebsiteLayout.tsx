import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import {
  Zap,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  User,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Calculator,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WebsiteLayout: React.FC = () => {
  const { user, isCustomer } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Announcement Ribbon */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase">
              Limited Period
            </span>
            <span className="text-[11px] font-medium text-slate-200">
              ⚡ State EV Subsidy of up to ₹10,000 + Zero Road Tax on Scooty & E-Rickshaw registrations!
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Mon-Sun: 9:00 AM – 8:30 PM</span>
            </span>
            <span className="hidden md:flex items-center space-x-1">
              <Phone className="w-3 h-3 text-brand-400" />
              <span>+91 98000 11111</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Marketing Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Zap className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-950">
                Volt<span className="text-emerald-600">Dealership</span>
              </span>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
                Authorized EV Experience Centre
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Explore Models
            </NavLink>

            <NavLink
              to="/calculator"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Price Calculator
            </NavLink>

            <NavLink
              to="/test-drive"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Book Test Drive
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Showroom Location
            </NavLink>
          </nav>

          {/* Action CTAs: Customer Portal & Staff CRM */}
          <div className="flex items-center space-x-2.5">
            {isCustomer ? (
              <Link
                to="/my-account"
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold hover:bg-sky-100 transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>My Portal</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Customer Login</span>
              </Link>
            )}

            <Link
              to="/crm"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Staff CRM</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Modern Marketing Dealership Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-14 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Dealership Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-sky-400 flex items-center justify-center text-white">
                  <Zap className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Volt<span className="text-emerald-400">Dealership</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your authorized flagship showroom for zero-emission electric scooties and commercial passenger e-rickshaws. Low running cost, instant delivery, and verified state subsidies.
              </p>
              <div className="text-xs text-slate-400 font-mono">
                Dealership ID: <span className="text-white font-bold">DEALER-01-EV</span>
              </div>
            </div>

            {/* Col 2: Models Lineup */}
            <div className="space-y-3 text-xs">
              <div className="font-bold uppercase tracking-wider text-white text-sm">Vehicle Lineup</div>
              <ul className="space-y-2">
                <li><Link to="/explore" className="hover:text-white transition-colors">Scooty Model 1 (Standard 2.0 kWh)</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Scooty Model 2 (City 2.5 kWh)</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Scooty Model Pro (Long Range 3.2 kWh)</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">E-Rickshaw Model 1 (5-Seater Commercial)</Link></li>
              </ul>
            </div>

            {/* Col 3: Customer Tools */}
            <div className="space-y-3 text-xs">
              <div className="font-bold uppercase tracking-wider text-white text-sm">Customer Services</div>
              <ul className="space-y-2">
                <li><Link to="/calculator" className="hover:text-white transition-colors">On-Road Price Calculator</Link></li>
                <li><Link to="/test-drive" className="hover:text-white transition-colors">Book Free Test Drive</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Customer Portal / Order Status</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Showroom Timings & Directions</Link></li>
              </ul>
            </div>

            {/* Col 4: Showroom Address & Hours */}
            <div className="space-y-3 text-xs">
              <div className="font-bold uppercase tracking-wider text-white text-sm">Showroom & Service</div>
              <p className="flex items-start space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Plot 42, Green Energy Corridor, EV Highway Junction, Bengaluru, Karnataka 560001</span>
              </p>
              <p className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sales & Enquiries: +91 98000 11111</span>
              </p>
              <p className="flex items-center space-x-2 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mon – Sun: 9:00 AM – 8:30 PM</span>
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 VoltDealership. All rights reserved. 2-in-1 Marketing & Showroom CRM Platform.</p>
            <div className="flex items-center space-x-4 text-[11px]">
              <Link to="/crm" className="text-slate-400 hover:text-white font-medium">Internal CRM Login</Link>
              <span>•</span>
              <a href="http://localhost:8080/admin" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-medium">Superuser Backend (/admin)</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
