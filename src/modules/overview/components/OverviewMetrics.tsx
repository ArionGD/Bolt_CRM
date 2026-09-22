import React from 'react';
import { SalesSummaryReport } from '../../../types';
import {
  Car,
  TrendingUp,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  Clock,
} from 'lucide-react';

interface OverviewMetricsProps {
  inStockCount: number;
  inTransitCount: number;
  reservedCount: number;
  summary: SalesSummaryReport | null;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  inStockCount,
  inTransitCount,
  reservedCount,
  summary,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Available Physical Stock */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Physical EV Stock</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Car className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">{inStockCount}</span>
          <span className="text-xs text-slate-500 font-medium">on floor</span>
        </div>
        <div className="mt-3 flex items-center space-x-3 text-xs text-slate-500 border-t border-slate-100 pt-2">
          <span>+{inTransitCount} in transit</span>
          <span>•</span>
          <span className="text-sky-600 font-semibold">{reservedCount} booked</span>
        </div>
      </div>

      {/* Card 2: Total Sales Booked */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Total Sales Volume</span>
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">
            ₹{((summary?.total_sales_value || 0) / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
          <span>{summary?.total_orders || 0} customer orders</span>
          <span className="text-emerald-600 font-medium flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            {summary?.total_delivered || 0} delivered
          </span>
        </div>
      </div>

      {/* Card 3: Payments Collected */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Cash Collected</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-emerald-700">
            ₹{((summary?.total_cash_collected || 0) / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2">
          <span>Verified in bank receipts</span>
        </div>
      </div>

      {/* Card 4: Outstanding Balance */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Pending Receivables</span>
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-sky-700">
            ₹{((summary?.total_outstanding_balance || 0) / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="mt-3 text-xs text-sky-700 font-medium border-t border-slate-100 pt-2 flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1" />
          <span>Balance due upon delivery</span>
        </div>
      </div>
    </div>
  );
};
