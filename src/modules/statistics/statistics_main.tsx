import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Lead, Order, SalesSummaryReport, StockAgeingBucket, Vehicle } from '../../types';
import { StockAgeingReport } from './components/StockAgeingReport';
import { SalesSummaryChart } from './components/SalesSummaryChart';

export const StatisticsMain: React.FC = () => {
  const [summary, setSummary] = useState<SalesSummaryReport | null>(null);
  const [ageing, setAgeing] = useState<StockAgeingBucket | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, a, l, v, o] = await Promise.all([
          api.getSalesSummary(),
          api.getStockAgeing(),
          api.getLeads(),
          api.getVehicles(),
          api.getOrders(),
        ]);
        setSummary(s);
        setAgeing(a);
        setLeads(l);
        setVehicles(v);
        setOrders(o);
      } catch (err) {
        console.error('Failed to load statistics', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dealership Statistics & Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Executive view of sales conversions, stock holding duration, and cash collections.
        </p>
      </div>

      {/* High-Level KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Total Sales Booked
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{((summary?.total_sales_value || 0) / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-xs text-slate-400 mt-2">{summary?.total_orders || 0} vehicle contracts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Cash Collected
          </span>
          <div className="text-3xl font-extrabold text-emerald-700">
            ₹{((summary?.total_cash_collected || 0) / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            {(((summary?.total_cash_collected || 0) / (summary?.total_sales_value || 1)) * 100).toFixed(1)}% realization rate
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Receivables Due
          </span>
          <div className="text-3xl font-extrabold text-sky-700">
            ₹{((summary?.total_outstanding_balance || 0) / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-xs text-sky-700 font-medium mt-2">Pending RTO / loan disbursals</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Delivered to Customers
          </span>
          <div className="text-3xl font-extrabold text-emerald-600">
            {summary?.total_delivered || 0} EVs
          </div>
          <p className="text-xs text-slate-400 mt-2">Successful showroom handovers</p>
        </div>
      </div>

      {/* Analytics Breakdown Grid: Stock Ageing & Funnel Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockAgeingReport ageing={ageing} />
        <SalesSummaryChart summary={summary} leads={leads} />
      </div>
    </div>
  );
};

export default StatisticsMain;
