import React from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Target, Gauge, FileText, ShoppingBag } from 'lucide-react';
import { LeadsSubPage } from './components/LeadsSubPage';
import { TestDrivesSubPage } from './components/TestDrivesSubPage';
import { QuotationsSubPage } from './components/QuotationsSubPage';
import { OrdersSubPage } from './components/OrdersSubPage';
import { OrderDetailSubPage } from './components/OrderDetailSubPage';

export type SalesSubTab = 'leads' | 'test-drives' | 'quotations' | 'orders';

export const SalesMain: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { subtab, id } = useParams<{ subtab?: string; id?: string }>();
  const navigate = useNavigate();

  // Determine active tab from URL param or search param, default to 'leads'
  const activeTab: SalesSubTab = (
    (subtab as SalesSubTab) ||
    (searchParams.get('tab') as SalesSubTab) ||
    'leads'
  );

  const orderId = id || searchParams.get('order_id');

  const handleTabChange = (tab: SalesSubTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      next.delete('order_id');
      return next;
    });
  };

  const tabs = [
    { id: 'leads' as const, label: 'Leads & Pipeline', icon: Target },
    { id: 'test-drives' as const, label: 'Test Drives', icon: Gauge },
    { id: 'quotations' as const, label: 'Quotations', icon: FileText },
    { id: 'orders' as const, label: 'Orders & Payments', icon: ShoppingBag },
  ];

  // If viewing a specific order's ledger detail
  if (orderId) {
    return (
      <OrderDetailSubPage
        orderId={orderId}
        onBack={() => {
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete('order_id');
            next.set('tab', 'orders');
            return next;
          });
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
            Complete showroom revenue cycle: enquiries, test drives, quotations, and booking ledger.
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
        {activeTab === 'leads' && <LeadsSubPage />}
        {activeTab === 'test-drives' && <TestDrivesSubPage />}
        {activeTab === 'quotations' && <QuotationsSubPage />}
        {activeTab === 'orders' && <OrdersSubPage />}
      </div>
    </div>
  );
};

export default SalesMain;
