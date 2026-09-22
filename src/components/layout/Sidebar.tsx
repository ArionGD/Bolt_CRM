import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  Target,
  Gauge,
  FileText,
  ShoppingBag,
  BarChart3,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { role, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', to: '/crm', icon: LayoutDashboard },
    { label: 'Vehicle Inventory', to: '/crm/inventory', icon: Car },
    { label: 'Customers', to: '/crm/customers', icon: Users },
    { label: 'Leads & Pipeline', to: '/crm/leads', icon: Target },
    { label: 'Test Drives', to: '/crm/test-drives', icon: Gauge },
    { label: 'Quotations', to: '/crm/quotations', icon: FileText },
    { label: 'Orders & Payments', to: '/crm/orders', icon: ShoppingBag },
    { label: 'Reports & Analytics', to: '/crm/reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-full overflow-hidden border-r border-slate-800 select-none">
      {/* Top Navigation Items */}
      <div className="p-4 space-y-3">
        <div>
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Showroom Operations
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/crm'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Pinned Bottom Section: Atomic Lock Info & Dedicated Logout Button */}
      <div className="p-3 space-y-2.5 border-t border-slate-800/80">
        {/* Showroom atomic locking status */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Double-Selling Lock</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Physical VIN allocation is enforced atomically at the database level.
          </p>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            Active Account: <span className="text-white font-bold uppercase">{role}</span>
          </div>
        </div>

        {/* Dedicated Logout Option at Bottom of Sidebar */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2.5 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-300 hover:text-red-300 bg-slate-800/50 hover:bg-red-500/15 border border-slate-700/40 hover:border-red-500/30 transition-all duration-150 group"
          title="Sign out of CRM"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
          <span className="font-semibold tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
