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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
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

      {/* Showroom atomic locking status */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/60 text-xs">
        <div className="flex items-center space-x-2 text-brand-400 font-semibold mb-1">
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
    </aside>
  );
};
