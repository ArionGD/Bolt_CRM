import React from 'react';
import { StockAgeingBucket } from '../../../types';
import { Car } from 'lucide-react';

interface StockAgeingReportProps {
  ageing: StockAgeingBucket | null;
}

export const StockAgeingReport: React.FC<StockAgeingReportProps> = ({ ageing }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div>
        <div className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-extrabold text-slate-900">Inventory Timeline Breakdown</h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">Holding cost and days on showroom floor</p>
      </div>

      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-emerald-900 text-sm block">&lt; 30 Days (Fast Moving)</span>
            <span className="text-xs text-emerald-700">Fresh consignments within target turn cycle</span>
          </div>
          <span className="text-xl font-extrabold text-emerald-900">{ageing?.under_30_days || 0}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-sky-900 text-sm block">30–60 Days (Normal Shelf)</span>
            <span className="text-xs text-sky-700">Standard showroom display & trial units</span>
          </div>
          <span className="text-xl font-extrabold text-sky-900">{ageing?.days_30_to_60 || 0}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 text-sm block">60–90 Days (Attention Needed)</span>
            <span className="text-xs text-slate-600">Recommend offering corporate discount incentives</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900">{ageing?.days_60_to_90 || 0}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-950 text-sm block">&gt; 90 Days (Capital Locked)</span>
            <span className="text-xs text-slate-700">High priority: clearance drive / fleet allocation</span>
          </div>
          <span className="text-xl font-extrabold text-slate-950">{ageing?.over_90_days || 0}</span>
        </div>
      </div>
    </div>
  );
};
