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
  Layers,
  ShoppingBag,
  FileText,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WebsiteLayout: React.FC = () => {
  const { user, isCustomer } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. MAIN MARKETING NAVIGATION HEADER (Corner-to-Corner Edge-to-Edge)      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo (Starts from Left Corner) */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Zap className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-950">
                Trisha <span className="text-emerald-600">Motors</span>
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
                  isActive
                    ? 'text-brand-600 bg-brand-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive
                    ? 'text-brand-600 bg-brand-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Explore Models
            </NavLink>

            <NavLink
              to="/calculator"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive
                    ? 'text-brand-600 bg-brand-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Price Calculator
            </NavLink>

            <NavLink
              to="/test-drive"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive
                    ? 'text-brand-600 bg-brand-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Book Test Drive
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl transition-colors ${
                  isActive
                    ? 'text-brand-600 bg-brand-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`
              }
            >
              Showroom Location
            </NavLink>
          </nav>

          {/* Action CTAs: Customer Portal & Staff CRM (Reaches Right Corner) */}
          <div className="flex items-center space-x-2.5 shrink-0">
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

      {/* ========================================================================= */}
      {/* 2. BLACK PROMO / ADS RIBBON (Positioned Below Header Navbar)              */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 sm:px-6 lg:px-8 text-xs border-b border-slate-800">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wide">
              Special Offer
            </span>
            <span className="text-[11px] font-medium text-slate-200">
              ⚡ State EV Direct Subsidy of up to ₹10,000 + Zero Road Tax & 100% Free RTO on Scooty & Commercial E-Rickshaws!
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mon-Sun: 9:00 AM – 8:30 PM</span>
            </span>
            <span className="hidden md:flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>Sales Hotline: +91 98000 11111</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN PAGE CONTENT                                                      */}
      {/* ========================================================================= */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ========================================================================= */}
      {/* 4. MODIFIED DEALERSHIP FOOTER                                             */}
      {/* Structure: 1) Branding & Logo, 2) Sitemap Links, 3) Panels & CRM Links,    */}
      {/* 4) Showroom Contact & Certifications                                      */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 pt-14 pb-8 border-t border-slate-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* COLUMN 1: NAME, LOGO & BRANDING */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <Zap className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-extrabold text-xl tracking-tight text-white block">
                    Trisha <span className="text-emerald-400">Motors</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    Authorized EV Experience Centre
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering sustainable electric mobility. Authorized showroom for high-efficiency electric two-wheelers and commercial 5-seater e-rickshaws. Low running cost, instant delivery, certified state subsidies, and complete lifecycle support.
              </p>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Dealership Code:</span>
                  <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    TRISHA-01-EV
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Govt EV Subsidy:</span>
                  <span className="font-semibold text-emerald-400">Authorized & Claimable</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: SITEMAP WITH SITE PANEL LINKS */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold uppercase tracking-wider text-white text-sm">
                  Website Sitemap
                </span>
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                    <span>Home Overview</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/explore"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                    <span>Explore EV Models & Specs</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/calculator"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                    <span>On-Road Price & EMI Calculator</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/test-drive"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                    <span>Book Free Showroom Test Drive</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                    <span>Showroom Timings & Directions</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                    <span>Customer Login / Track Order</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-account"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                    <span>Customer Self-Service Portal</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: PANELS LINKS (CRM, POS & MANAGEMENT) */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                <Layers className="w-4 h-4 text-sky-400" />
                <span className="font-extrabold uppercase tracking-wider text-white text-sm">
                  CRM & Management Panels
                </span>
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/crm"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-sky-400" />
                    <span className="font-semibold text-white">Staff CRM Main Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crm/sales?tab=orders"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-sky-400" />
                    <span>Showroom POS Retail Counter</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crm/sales?tab=reports"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-sky-400" />
                    <span>Daily Sales & Profit Trajectory</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crm/inventory"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-sky-400" />
                    <span>Vehicle & Spares Stock Inventory</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crm/customers"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-sky-400" />
                    <span>Customer Relationship Directory</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crm/sales?tab=quotations"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-sky-400" />
                    <span>Quotation & Financial Proposals</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="http://localhost:8080/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center space-x-1.5 text-sky-400 font-bold"
                  >
                    <ChevronRight className="w-3 h-3 text-sky-400" />
                    <span>Superuser Backend (/admin)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: SHOWROOM CONTACT & SUPPORT */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold uppercase tracking-wider text-white text-sm">
                  Showroom & Experience
                </span>
              </div>
              <div className="space-y-3 text-slate-300">
                <p className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Plot 42, Green Energy Corridor, EV Highway Junction, Bengaluru, Karnataka 560001</span>
                </p>
                <p className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sales & Enquiries: +91 98000 11111</span>
                </p>
                <p className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Showroom Hours: Mon – Sun: 9:00 AM – 8:30 PM</span>
                </p>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                    Dealer Certifications
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-semibold">
                      ✓ FAME II Certified
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 font-semibold">
                      ✓ Zero Carbon Hub
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER BOTTOM BAR */}
          <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 Trisha Motors. All rights reserved. 2-in-1 Marketing & Showroom CRM Platform.</p>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="inline-flex items-center text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                POS & CRM Engine Live (v2.4)
              </span>
              <span>•</span>
              <Link to="/crm" className="text-slate-400 hover:text-white font-medium">
                Staff CRM Login
              </Link>
              <span>•</span>
              <a
                href="http://localhost:8080/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 font-medium"
              >
                Superuser Admin
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
