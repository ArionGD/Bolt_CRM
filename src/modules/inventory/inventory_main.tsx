import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Car, Cpu } from 'lucide-react';
import { VehicleSubPage } from './components/VehicleSubPage';
import { ComponentsSubPage } from './components/ComponentsSubPage';
import { VehicleDetailSubPage } from './components/VehicleDetailSubPage';

export type InventorySubTab = 'vehicle' | 'components';

export const InventoryMain: React.FC = () => {
  const { tabOrId, id } = useParams<{ tabOrId?: string; id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // If viewing a single vehicle detail by ID (not sub-tab name)
  const isDetailView =
    (id && id !== 'vehicle' && id !== 'components') ||
    (tabOrId && tabOrId !== 'vehicle' && tabOrId !== 'components');

  if (isDetailView) {
    return <VehicleDetailSubPage />;
  }

  // Determine active tab: defaults to 'vehicle'
  const activeTab: InventorySubTab =
    tabOrId === 'components' || searchParams.get('tab') === 'components'
      ? 'components'
      : 'vehicle';

  const handleTabChange = (tab: InventorySubTab) => {
    navigate(`/crm/inventory/${tab}`);
  };

  const tabs = [
    {
      id: 'vehicle' as const,
      label: 'Vehicle',
      description: 'Physical vehicle stock & VIN allocation',
      icon: Car,
    },
    {
      id: 'components' as const,
      label: 'Component',
      description: 'Batteries, motors, chargers & spares',
      icon: Cpu,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Inventory Command Header with 2 Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vehicle Inventory
          </h1>
        </div>

        {/* 2 Sub-Tabs Bar: Vehicle and Components */}
        <div className="flex items-center space-x-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto select-none">
          {tabs.map((t, idx) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <React.Fragment key={t.id}>
                {idx > 0 && <div className="h-4 w-[1px] bg-slate-300/80 shrink-0" />}
                <button
                  type="button"
                  onClick={() => handleTabChange(t.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-brand-700 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{t.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-Page Component */}
      <div>
        {activeTab === 'vehicle' && <VehicleSubPage />}
        {activeTab === 'components' && <ComponentsSubPage />}
      </div>
    </div>
  );
};

export default InventoryMain;
