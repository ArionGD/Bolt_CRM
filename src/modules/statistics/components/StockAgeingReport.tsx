import React from 'react';
import { StockAgeingBucket } from '../../../types';
import { Clock, ShieldCheck, AlertTriangle, Flame, ArrowUpRight } from 'lucide-react';

interface StockAgeingReportProps {
  ageing: StockAgeingBucket | null;
}

export const StockAgeingReport: React.FC<StockAgeingReportProps> = ({ ageing }) => {
  const u30 = ageing?.under_30_days || 0;
  const d3060 = ageing?.days_30_to_60 || 0;
  const d6090 = ageing?.days_60_to_90 || 0;
  const o90 = ageing?.over_90_days || 0;

  const totalStock = u30 + d3060 + d6090 + o90 || 1;
  const pctU30 = Math.round((u30 / totalStock) * 100);
  const pct3060 = Math.round((d3060 / totalStock) * 100);
  const pct6090 = Math.round((d6090 / totalStock) * 100);
  const pctO90 = Math.max(0, 100 - pctU30 - pct3060 - pct6090);

  // Health Score (% of stock under 60 days)
  const healthScore = Math.round(((u30 + d3060) / totalStock) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Clock className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-black text-slate-900">Inventory Ageing & Capital Velocity</h3>
            <p className="text-xs text-slate-500">Days on showroom floor and capital holding distribution</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{healthScore}% Healthy Stock</span>
        </div>
      </div>

      {/* Stacked Visual Velocity Bar */}
      <div className="space-y-2">
        <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${pctU30}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`<30d: ${pctU30}%`}
          />
          <div
            style={{ width: `${pct3060}%` }}
            className="bg-sky-500 h-full transition-all"
            title={`30-60d: ${pct3060}%`}
          />
          <div
            style={{ width: `${pct6090}%` }}
            className="bg-amber-400 h-full transition-all"
            title={`60-90d: ${pct6090}%`}
          />
          <div
            style={{ width: `${pctO90}%` }}
            className="bg-rose-500 h-full transition-all"
            title={`>90d: ${pctO90}%`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
          <span className="text-emerald-700">&lt;30d ({pctU30}%)</span>
          <span className="text-sky-700">30-60d ({pct3060}%)</span>
          <span className="text-amber-700">60-90d ({pct6090}%)</span>
          <span className="text-rose-700">&gt;90d ({pctO90}%)</span>
        </div>
      </div>

      {/* 2x2 Colorful Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Bucket 1: < 30 Days */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-50/50 to-white border border-emerald-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              <Flame className="w-3 h-3 text-emerald-600" />
              <span>Fast Moving</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 font-mono">{pctU30}% of stock</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-emerald-950">{u30} Units</span>
            <span className="text-xs font-semibold text-emerald-700">&lt; 30 Days</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Fresh factory consignments within optimum dealer turnaround cycle.
          </p>
        </div>

        {/* Bucket 2: 30–60 Days */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-sky-50/50 to-white border border-sky-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800">
              <Clock className="w-3 h-3 text-sky-600" />
              <span>Normal Shelf</span>
            </span>
            <span className="text-xs font-bold text-sky-600 font-mono">{pct3060}% of stock</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-sky-950">{d3060} Units</span>
            <span className="text-xs font-semibold text-sky-700">30–60 Days</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Active showroom display and customer test demonstration units.
          </p>
        </div>

        {/* Bucket 3: 60–90 Days */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-white border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Action Due</span>
            </span>
            <span className="text-xs font-bold text-amber-600 font-mono">{pct6090}% of stock</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-amber-950">{d6090} Units</span>
            <span className="text-xs font-semibold text-amber-700">60–90 Days</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Recommend customer incentive discount or helmet/accessory bundle.
          </p>
        </div>

        {/* Bucket 4: > 90 Days */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-50/50 to-white border border-rose-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>Capital Locked</span>
            </span>
            <span className="text-xs font-bold text-rose-600 font-mono">{pctO90}% of stock</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-rose-950">{o90} Units</span>
            <span className="text-xs font-semibold text-rose-700">&gt; 90 Days</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Prioritize for commercial fleet deal or spot clearance promotion.
          </p>
        </div>
      </div>
    </div>
  );
};
