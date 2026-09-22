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

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-full overflow-hidden border-r border-slate-800 select-none">
      {/* 5-Pillar Navigation Menu with Inventory Heading & Sub-Options */}
      <div className="p-4 space-y-2">
        <nav className="space-y-1.5 pt-1">
          {/* 1. Overview */}
          <NavLink
            to="/crm/overview"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </NavLink>

          {/* 2. Inventory Section (Acts as Heading with Vehicle & Components Sub-Tabs) */}
          <div className="pt-2 pb-1">
            <div className="px-3.5 pb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <div className="flex items-center space-x-2">
                <Boxes className="w-3.5 h-3.5 text-slate-400" />
                <span>Inventory</span>
              </div>
              <GitBranch className="w-3 h-3 text-slate-500" />
            </div>

            {/* Visual Streamlined Tree Branch Connector Lines */}
            <div className="relative pl-3.5 ml-4 border-l-2 border-slate-800 space-y-1.5 mt-1">
              {/* Branch 1: Vehicle */}
              <div className="relative">
                <span
                  className={`absolute -left-3.5 top-1/2 w-3 h-[1.5px] -translate-y-1/2 transition-colors ${
                    isVehicleActive ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                />
                <NavLink
                  to="/crm/inventory/vehicle"
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all ${
                    isVehicleActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 shrink-0" />
                  <span>Vehicle</span>
                </NavLink>
              </div>

              {/* Branch 2: Components */}
              <div className="relative">
                <span
                  className={`absolute -left-3.5 top-1/2 w-3 h-[1.5px] -translate-y-1/2 transition-colors ${
                    isComponentsActive ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                />
                <NavLink
                  to="/crm/inventory/components"
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all ${
                    isComponentsActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
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
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Customer</span>
          </NavLink>

          {/* 4. Sales */}
          <NavLink
            to="/crm/sales"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Sales</span>
          </NavLink>

          {/* 5. Statistics */}
          <NavLink
            to="/crm/statistics"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Statistics</span>
          </NavLink>
        </nav>
      </div>

      {/* Pinned Bottom Section: Atomic Lock Info & Dedicated Logout Button */}
      <div className="p-3 space-y-2.5 border-t border-slate-800/80">
        {/* Showroom atomic locking status & Branch indicator */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Atomic VIN Lock</span>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/15 text-emerald-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              Main Branch
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Physical chassis allocation is enforced atomically at the database level.
          </p>
          <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Branch: <span className="text-slate-200">Trisha Central</span></span>
            <span className="text-white font-bold uppercase">{role}</span>
          </div>
        </div>

        {/* Dedicated Logout Option at Bottom of Sidebar */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2.5 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-300 hover:text-red-300 bg-slate-800/50 hover:bg-red-500/15 border border-slate-700/40 hover:border-red-500/30 transition-all duration-150 group cursor-pointer"
          title="Sign out of CRM"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
          <span className="font-semibold tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
