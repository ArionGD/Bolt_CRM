import React from 'react';
import { SalesSummaryReport, Lead } from '../../../types';
import { Target } from 'lucide-react';

interface SalesSummaryChartProps {
  summary: SalesSummaryReport | null;
  leads: Lead[];
}

export const SalesSummaryChart: React.FC<SalesSummaryChartProps> = ({ summary, leads }) => {
  const totalLeads = leads.length || 1;
  const contacted = leads.filter((l) => l.status !== 'new').length;
  const testDrive = leads.filter((l) =>
    ['test_drive_scheduled', 'test_drive_done', 'quoted', 'negotiating', 'won'].includes(l.status)
  ).length;
  const quoted = leads.filter((l) => ['quoted', 'negotiating', 'won'].includes(l.status)).length;
  const won = leads.filter((l) => l.status === 'won').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div>
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-sky-600" />
          <h2 className="text-base font-extrabold text-slate-900">Lead Conversion Funnel</h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">Stage drop-off from initial walk-in to won booking</p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Stage 1: Enquiries */}
        <div>
          <div className="flex justify-between font-bold text-slate-800 mb-1">
            <span>1. Showroom Enquiries Logged</span>
            <span>{totalLeads} leads (100%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div className="bg-sky-600 h-3 rounded-full w-full"></div>
          </div>
        </div>

        {/* Stage 2: Contacted */}
        <div>
          <div className="flex justify-between font-bold text-slate-800 mb-1">
            <span>2. Followed-Up & Qualified</span>
            <span>{contacted} leads ({Math.round((contacted / totalLeads) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-sky-500 h-3 rounded-full"
              style={{ width: `${(contacted / totalLeads) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stage 3: Test Drive Done */}
        <div>
          <div className="flex justify-between font-bold text-slate-800 mb-1">
            <span>3. Test Drive Experienced</span>
            <span>{testDrive} leads ({Math.round((testDrive / totalLeads) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-sky-400 h-3 rounded-full"
              style={{ width: `${(testDrive / totalLeads) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stage 4: Quoted */}
        <div>
          <div className="flex justify-between font-bold text-slate-800 mb-1">
            <span>4. On-Road Quotation Sent</span>
            <span>{quoted} leads ({Math.round((quoted / totalLeads) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-slate-400 h-3 rounded-full"
              style={{ width: `${(quoted / totalLeads) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stage 5: Won */}
        <div>
          <div className="flex justify-between font-bold text-emerald-800 mb-1">
            <span>5. Booking Won & Physical Car Allocated</span>
            <span>{won} won ({Math.round((won / totalLeads) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-emerald-600 h-3 rounded-full"
              style={{ width: `${(won / totalLeads) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
