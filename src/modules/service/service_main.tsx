import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wrench, ClipboardList } from 'lucide-react';
import { ServiceManageSubPage } from './components/ServiceManageSubPage';
import { ServiceReportsSubPage } from './components/ServiceReportsSubPage';

export const ServiceMain: React.FC = () => {
  const { subtab } = useParams<{ subtab?: string }>();
  const navigate = useNavigate();

  // Active subtab: default to 'manage', or 'report'
  const activeSubtab = subtab === 'report' || subtab === 'reports' ? 'report' : 'manage';

  const handleTabChange = (tab: 'manage' | 'report') => {
    navigate(`/crm/service/${tab}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Manage and Report Sub-Tab Pill Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Service Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Workshop vehicle intake, manual job cards, parts billing, and service revenue
          </p>
        </div>

        {/* Right-Side Sub-Tab Toggle: Manage vs Report */}
        <div className="flex items-center space-x-1.5 p-1.5 bg-gradient-to-r from-slate-100 via-indigo-50/60 to-emerald-50/60 rounded-2xl border border-slate-200/90 shadow-inner overflow-x-auto select-none">
          <button
            type="button"
            onClick={() => handleTabChange('manage')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
              activeSubtab === 'manage'
                ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white shadow-md shadow-brand-500/25 border border-white/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Manage</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('report')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
              activeSubtab === 'report'
                ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white shadow-md shadow-brand-500/25 border border-white/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Render Active Sub-Page */}
      {activeSubtab === 'manage' ? <ServiceManageSubPage /> : <ServiceReportsSubPage />}
    </div>
  );
};

export default ServiceMain;
