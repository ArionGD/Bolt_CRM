import React from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Car, Cpu, Layers } from 'lucide-react';
import { OrdersSubPage } from './components/OrdersSubPage';
import { SalesReportsSubPage } from './components/SalesReportsSubPage';
import { OrderDetailSubPage } from './components/OrderDetailSubPage';
import { QuotationsSubPage } from './components/QuotationsSubPage';
import { TestDrivesSubPage } from './components/TestDrivesSubPage';
import { LeadsSubPage } from './components/LeadsSubPage';

export type SalesCategory = 'all' | 'vehicle' | 'component';

export const SalesMain: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { subtab, id } = useParams<{ subtab?: string; id?: string }>();
  const navigate = useNavigate();

  const orderId = id || searchParams.get('order_id');

  // If viewing a specific order's ledger detail
  if (orderId) {
    return (
      <OrderDetailSubPage
        orderId={orderId}
        onBack={() => {
          navigate('/crm/sales/tracker');
        }}
      />
    );
  }

  // Handle direct sidebar link to Reports
  if (subtab === 'reports' || searchParams.get('tab') === 'reports') {
    return <SalesReportsSubPage />;
  }

  // Handle direct links for Quotations / Test Drives / Leads if triggered from old bookmarks
  const tabParam = searchParams.get('tab');
  if (subtab === 'quotations' || tabParam === 'quotations') {
    return <QuotationsSubPage />;
  }
  if (subtab === 'test-drives' || tabParam === 'test-drives') {
    return <TestDrivesSubPage />;
  }
  if (subtab === 'leads' || tabParam === 'leads') {
    return <LeadsSubPage />;
  }

  // Determine active category for Sales Tracker: 'all' | 'vehicle' | 'component' (default: 'all')
  const typeParam = searchParams.get('type') || subtab;
  const activeCategory: SalesCategory =
    typeParam === 'vehicle' || typeParam === 'component' ? typeParam : 'all';

  const handleCategoryChange = (category: SalesCategory) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      nextParams.delete('type');
    } else {
      nextParams.set('type', category);
    }
    setSearchParams(nextParams);
  };

  const tabs = [
    {
      id: 'all' as const,
      label: 'All',
      icon: Layers,
    },
    {
      id: 'vehicle' as const,
      label: 'Vehicle',
      icon: Car,
    },
    {
      id: 'component' as const,
      label: 'Component',
      icon: Cpu,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sales Tracker Header with All, Vehicle & Component Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sales Tracker
          </h1>
        </div>

        {/* Right-Side Sub-Tab Toggle: All, Vehicle and Component */}
        <div className="flex items-center space-x-1.5 p-1.5 bg-gradient-to-r from-slate-100 via-indigo-50/60 to-emerald-50/60 rounded-2xl border border-slate-200/90 shadow-inner overflow-x-auto select-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeCategory === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleCategoryChange(t.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white shadow-md shadow-brand-500/25 border border-white/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Orders Sub-Page with active category filter */}
      <OrdersSubPage
        salesCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
};

export default SalesMain;
