import React from 'react';
import { SalesSummaryReport, Lead } from '../../../types';
import { Target, Users, CheckCircle2, ArrowDown, Award, Sparkles } from 'lucide-react';

interface SalesSummaryChartProps {
  summary: SalesSummaryReport | null;
  leads: Lead[];
}

export const SalesSummaryChart: React.FC<SalesSummaryChartProps> = ({ summary, leads }) => {
  const totalLeads = leads.length;
  const contacted = leads.filter((l) => l.status !== 'new').length;
  const testDrive = leads.filter((l) =>
    ['test_drive_scheduled', 'test_drive_done', 'quoted', 'negotiating', 'won'].includes(l.status)
  ).length;
  const quoted = leads.filter((l) => ['quoted', 'negotiating', 'won'].includes(l.status)).length;
  const won = leads.filter((l) => l.status === 'won').length;

  const getPct = (cnt: number) => (totalLeads > 0 ? Math.round((cnt / totalLeads) * 100) : 0);
  const winRate = getPct(won);

  const stages = [
    {
      id: 1,
      name: 'Showroom Inquiries Logged',
      count: totalLeads,
      pct: totalLeads > 0 ? 100 : 0,
      color: 'from-indigo-500 to-blue-600',
      bgLight: 'bg-indigo-50/70 border-indigo-200/80',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      iconColor: 'text-indigo-600',
    },
    {
      id: 2,
      name: 'Followed-Up & Qualified',
      count: contacted,
      pct: getPct(contacted),
      color: 'from-blue-500 to-sky-600',
      bgLight: 'bg-blue-50/70 border-blue-200/80',
      badgeColor: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600',
    },
    {
      id: 3,
      name: 'Demonstration & Trial',
      count: testDrive,
      pct: getPct(testDrive),
      color: 'from-sky-500 to-cyan-600',
      bgLight: 'bg-sky-50/70 border-sky-200/80',
      badgeColor: 'bg-sky-100 text-sky-800',
      iconColor: 'text-sky-600',
    },
    {
      id: 4,
      name: 'On-Road Quotation Sent',
      count: quoted,
      pct: getPct(quoted),
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50/70 border-amber-200/80',
      badgeColor: 'bg-amber-100 text-amber-800',
      iconColor: 'text-amber-600',
    },
    {
      id: 5,
      name: 'Booking Won & Delivered',
      count: won,
      pct: winRate,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50/70 border-emerald-200/80',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Target className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-black text-slate-900">Lead Conversion Funnel</h3>
            <p className="text-xs text-slate-500">Walk-in pipeline progression from initial inquiry to final handover</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-extrabold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{winRate}% Deal Win Rate</span>
        </div>
      </div>

      {/* Stepped Funnel Rows */}
      <div className="space-y-3">
        {stages.map((st, i) => {
          return (
            <div
              key={st.id}
              className={`p-3 rounded-2xl border transition-all ${st.bgLight} space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shadow-xs">
                    {st.id}
                  </span>
                  <span className="text-xs font-black text-slate-900">{st.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-900">
                    {st.count} leads
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${st.badgeColor}`}>
                    {st.pct}%
                  </span>
                </div>
              </div>

              {/* Colorful gradient progress bar */}
              <div className="w-full bg-white/80 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-200/50">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${st.color} transition-all duration-500`}
                  style={{ width: `${Math.max(4, st.pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Funnel Efficiency Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">Total Inflow</span>
          <span className="text-sm font-black text-slate-900">{totalLeads} Inquiries</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
          <span className="text-xs text-emerald-800 font-semibold">Deals Closed</span>
          <span className="text-sm font-black text-emerald-950">{won} Won Bookings</span>
        </div>
      </div>
    </div>
  );
};
