import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Cpu,
  Boxes,
  Users,
  ShoppingBag,
  BarChart3,
  Sparkles,
  LogOut,
  GitBranch,
  TrendingUp,
  LineChart,
  Wrench,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { role, logout } = useAuth();
  const location = useLocation();

  const isVehicleActive =
    location.pathname === '/crm/inventory' ||
    location.pathname === '/crm/inventory/vehicle' ||
    (location.pathname.startsWith('/crm/inventory') && !location.pathname.includes('/components'));

  const isComponentsActive =
    location.pathname === '/crm/inventory/components' ||
    (location.pathname.startsWith('/crm/inventory') && location.pathname.includes('/components'));

  const isTrackerActive =
    location.pathname === '/crm/sales' ||
    location.pathname === '/crm/sales/tracker' ||
    location.pathname.startsWith('/crm/sales/orders') ||
    location.pathname.startsWith('/crm/orders');

  const isReportsActive =
    location.pathname === '/crm/sales/reports';

  const isServiceManageActive =
    location.pathname === '/crm/service' ||
    location.pathname === '/crm/service/manage';

  const isServiceReportActive =
    location.pathname === '/crm/service/report' ||
    location.pathname === '/crm/service/reports';

  return (
    <aside className="relative w-64 bg-gradient-to-b from-[#0a0f1d] via-[#0f172a] to-[#070b14] text-slate-300 flex flex-col justify-between shrink-0 h-full overflow-hidden border-r border-slate-800/90 select-none shadow-2xl backdrop-blur-2xl">
      {/* Ambient Luminous Glowing Glass Orbs */}
      <div className="absolute -top-24 -left-20 w-56 h-56 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Glass Specular Top Highlight & Edge Lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-white/10 via-transparent to-white/5 pointer-events-none z-10" />

      {/* Navigation Menu with Inventory & Sales Headings & Tree Sub-Branches */}
      <div className="p-4 space-y-2 overflow-y-auto custom-scrollbar flex-1 relative z-10">
        <nav className="space-y-1 pt-1">
          {/* 1. Overview */}
          <NavLink
            to="/crm/overview"
            className={({ isActive }) =>
              `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-lg shadow-brand-500/30 border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </NavLink>

          {/* 2. Inventory Section (Acts as Heading with Vehicle & Components Sub-Tabs) */}
          <div className="pt-2 pb-1">
            <div className="px-3.5 pb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
              <div className="flex items-center space-x-2">
                <Boxes className="w-3.5 h-3.5 text-brand-400" />
                <span>Inventory</span>
              </div>
              <GitBranch className="w-3 h-3 text-slate-500" />
            </div>

            {/* Visual Streamlined Tree Branch Connector Lines for Inventory */}
            <div className="relative pl-3.5 ml-4 border-l-2 border-slate-700/60 space-y-1 mt-1">
              {/* Branch 1: Vehicle */}
              <div className="relative">
                <span
                  className={`absolute -left-3.5 top-1/2 w-3 h-[1.5px] -translate-y-1/2 transition-all ${
                    isVehicleActive
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-emerald-400/50'
                      : 'bg-slate-700'
                  }`}
                />
                <NavLink
                  to="/crm/inventory/vehicle"
                  className={`relative flex items-center space-x-2.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 overflow-hidden ${
                    isVehicleActive
                      ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-md shadow-brand-500/30 border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 shrink-0" />
                  <span>Vehicle</span>
                </NavLink>
              </div>

              {/* Branch 2: Components */}
              <div className="relative">
                <span
                  className={`absolute -left-3.5 top-1/2 w-3 h-[1.5px] -translate-y-1/2 transition-all ${
                    isComponentsActive
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-emerald-400/50'
                      : 'bg-slate-700'
                  }`}
                />
                <NavLink
                  to="/crm/inventory/components"
                  className={`relative flex items-center space-x-2.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 overflow-hidden ${
                    isComponentsActive
                      ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-md shadow-brand-500/30 border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <span>Components</span>
                </NavLink>
              </div>
            </div>
          </div>

          {/* 3. Customer */}
          <NavLink
            to="/crm/customer"
            className={({ isActive }) =>
              `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-lg shadow-brand-500/30 border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
              }`
            }
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Customer</span>
          </NavLink>

          {/* 4. Sales Section (Acts as Heading with Sales Tracker & Reports Sub-Branches) */}
          <div className="pt-2 pb-1">
            <div className="px-3.5 pb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sales</span>
              </div>
              <GitBranch className="w-3 h-3 text-slate-500" />
            </div>

            {/* Visual Streamlined Tree Branch Connector Lines for Sales */}
            <div className="relative pl-3.5 ml-4 border-l-2 border-slate-700/60 space-y-1 mt-1">
              {/* Branch 1: Sales Tracker */}
              <div className="relative">
                <span
                  className={`absolute -left-3.5 top-1/2 w-3 h-[1.5px] -translate-y-1/2 transition-all ${
                    isTrackerActive
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-emerald-400/50'
                      : 'bg-slate-700'
                  }`}
                />
                <NavLink
                  to="/crm/sales/tracker"
                  className={`relative flex items-center space-x-2.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 overflow-hidden ${
                    isTrackerActive
                      ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-md shadow-brand-500/30 border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>Sales Tracker</span>
                </NavLink>
              </div>

              {/* Branch 2: Reports */}
              <div className="relative">
                <span
                  className={`absolute -left-3.5 top-1/2 w-3 h-[1.5px] -translate-y-1/2 transition-all ${
                    isReportsActive
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-emerald-400/50'
                      : 'bg-slate-700'
                  }`}
                />
                <NavLink
                  to="/crm/sales/reports"
                  className={`relative flex items-center space-x-2.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 overflow-hidden ${
                    isReportsActive
                      ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-md shadow-brand-500/30 border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5 shrink-0" />
                  <span>Reports</span>
                </NavLink>
              </div>
            </div>
          </div>

          {/* 5. Service Section (Acts as Heading with Manage & Report Sub-Branches) */}
          <div className="pt-2 pb-1">
            <div className="px-3.5 pb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
              <div className="flex items-center space-x-2">
                <Wrench className="w-3.5 h-3.5 text-sky-400" />
                <span>Service</span>
              </div>
              <GitBranch className="w-3 h-3 text-slate-500" />
            </div>

            {/* Visual Streamlined Tree Branch Connector Lines for Service */}
            <div className="relative pl-3.5 ml-4 border-l-2 border-slate-700/60 space-y-1 mt-1">
              {/* Branch 1: Manage */}
              <div className="relative">
                <span
                  className={`absolute -left-3.5 top-1/2 w-3 h-[1.5px] -translate-y-1/2 transition-all ${
                    isServiceManageActive
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-emerald-400/50'
                      : 'bg-slate-700'
                  }`}
                />
                <NavLink
                  to="/crm/service/manage"
                  className={`relative flex items-center space-x-2.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 overflow-hidden ${
                    isServiceManageActive
                      ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-md shadow-brand-500/30 border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 shrink-0" />
                  <span>Manage</span>
                </NavLink>
              </div>

              {/* Branch 2: Report */}
              <div className="relative">
                <span
                  className={`absolute -left-3.5 top-1/2 w-3 h-[1.5px] -translate-y-1/2 transition-all ${
                    isServiceReportActive
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-emerald-400/50'
                      : 'bg-slate-700'
                  }`}
                />
                <NavLink
                  to="/crm/service/report"
                  className={`relative flex items-center space-x-2.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 overflow-hidden ${
                    isServiceReportActive
                      ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-md shadow-brand-500/30 border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                  <span>Report</span>
                </NavLink>
              </div>
            </div>
          </div>

          {/* 6. Statistics */}
          <NavLink
            to="/crm/statistics"
            className={({ isActive }) =>
              `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-semibold shadow-lg shadow-brand-500/30 border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent'
              }`
            }
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Statistics</span>
          </NavLink>
        </nav>
      </div>

      {/* Pinned Bottom Section: Showroom Branch & Dedicated Logout Button */}
      <div className="p-3 space-y-2.5 border-t border-white/[0.08] shrink-0 bg-slate-950/50 backdrop-blur-xl relative z-10">
        <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
        <div className="px-1 py-0.5 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
            <span className="font-semibold text-slate-200">Trisha Central Showroom</span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs">
            {role}
          </span>
        </div>

        {/* Dedicated Logout Option at Bottom of Sidebar */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2.5 px-3.5 py-2 rounded-xl font-semibold text-xs text-slate-300 hover:text-red-200 bg-white/[0.04] hover:bg-gradient-to-r hover:from-red-500/20 hover:to-rose-500/20 border border-white/[0.08] hover:border-red-500/40 shadow-sm transition-all duration-200 group cursor-pointer backdrop-blur-sm"
          title="Sign out of CRM"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
          <span className="tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
