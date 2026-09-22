import React from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Target, Gauge, FileText, ShoppingBag, BarChart3, TrendingUp } from 'lucide-react';
import { LeadsSubPage } from './components/LeadsSubPage';
import { TestDrivesSubPage } from './components/TestDrivesSubPage';
import { QuotationsSubPage } from './components/QuotationsSubPage';
import { OrdersSubPage } from './components/OrdersSubPage';
import { SalesReportsSubPage } from './components/SalesReportsSubPage';
import { OrderDetailSubPage } from './components/OrderDetailSubPage';

export type SalesSubTab = 'tracker' | 'reports' | 'leads' | 'test-drives' | 'quotations' | 'orders';

export const SalesMain: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { subtab, id } = useParams<{ subtab?: string; id?: string }>();
  const navigate = useNavigate();

  // Determine active tab from URL param or search param, default to 'tracker'
  let rawTab = (subtab || searchParams.get('tab') || 'tracker') as SalesSubTab;
  if (rawTab === 'orders') rawTab = 'tracker';

  const activeTab: SalesSubTab = rawTab;
  const orderId = id || searchParams.get('order_id');

  const handleTabChange = (tab: SalesSubTab) => {
    navigate(`/crm/sales/${tab}`);
  };

  const tabs = [
    { id: 'tracker' as const, label: 'Sales Tracker', icon: TrendingUp },
    { id: 'reports' as const, label: 'Sales Reports & Analytics', icon: BarChart3 },
    { id: 'quotations' as const, label: 'Quotations', icon: FileText },
    { id: 'test-drives' as const, label: 'Test Drives', icon: Gauge },
    { id: 'leads' as const, label: 'Leads & Pipeline', icon: Target },
  ];

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

  return (
    <div className="space-y-6">
      {/* Sales Command Header & Sub-Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sales Operations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete showroom revenue cycle: vehicle sales tracking, cost accounting, and month-wise profit reports.
          </p>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center space-x-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto select-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-brand-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-Page Component */}
      <div>
        {activeTab === 'tracker' && <OrdersSubPage />}
        {activeTab === 'reports' && <SalesReportsSubPage />}
        {activeTab === 'quotations' && <QuotationsSubPage />}
        {activeTab === 'test-drives' && <TestDrivesSubPage />}
        {activeTab === 'leads' && <LeadsSubPage />}
      </div>
    </div>
  );
};

export default SalesMain;
