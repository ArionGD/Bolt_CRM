import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Order, SalesSummaryReport, StockAgeingBucket, Vehicle } from '../types';
import {
  Car,
  TrendingUp,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
  CalendarCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<SalesSummaryReport | null>(null);
  const [ageing, setAgeing] = useState<StockAgeingBucket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [v, o, s, a] = await Promise.all([
          api.getVehicles(),
          api.getOrders(),
          api.getSalesSummary(),
          api.getStockAgeing(),
        ]);
        setVehicles(v);
        setOrders(o);
        setSummary(s);
        setAgeing(a);
      } catch (err) {
        console.error(err);
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

  const inStockCount = vehicles.filter((v) => v.status === 'in_stock').length;
  const inTransitCount = vehicles.filter((v) => v.status === 'in_transit').length;
  const reservedCount = vehicles.filter((v) => v.status === 'reserved').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Showroom Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time status of EV inventory, customer bookings, and receivables.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to="/crm/inventory"
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 shadow-sm transition-all"
          >
            <Car className="w-4 h-4 mr-2" />
            <span>Manage Inventory</span>
          </Link>
          <Link
            to="/crm/quotations"
            className="inline-flex items-center px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all"
          >
            <span>Create Quote</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Stock */}
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

      {/* Two Columns: Recent Orders & Stock Ageing Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders & Delivery Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Customer Bookings</h2>
              <p className="text-xs text-slate-500">Orders tied to unique physical vehicles</p>
            </div>
            <Link to="/crm/orders" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View All Orders →
            </Link>
          </div>
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{o.order_number}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        o.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : o.status === 'payment_pending'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {o.customer_name} • <span className="font-medium text-slate-800">{o.brand} {o.model_name}</span> ({o.colour})
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">VIN: {o.vin}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-slate-900">₹{o.total_amount.toLocaleString('en-IN')}</p>
                  {o.balance_due > 0 ? (
                    <p className="text-xs text-sky-700 font-semibold">
                      ₹{o.balance_due.toLocaleString('en-IN')} pending
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Fully Paid
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Ageing Watch */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Stock Ageing Monitor</h2>
              <ShieldAlert className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500">Holding days for units in stock/transit</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700">&lt; 30 Days (Fresh Stock)</span>
                <span className="text-slate-900">{ageing?.under_30_days || 0} units</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((ageing?.under_30_days || 0) / (vehicles.length || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-sky-700">30–60 Days</span>
                <span className="text-slate-900">{ageing?.days_30_to_60 || 0} units</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-sky-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((ageing?.days_30_to_60 || 0) / (vehicles.length || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">60–90 Days</span>
                <span className="text-slate-900">{ageing?.days_60_to_90 || 0} units</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-slate-400 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((ageing?.days_60_to_90 || 0) / (vehicles.length || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-900 font-bold">&gt; 90 Days (Slow Moving)</span>
                <span className="text-slate-900 font-bold">{ageing?.over_90_days || 0} units</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-slate-800 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((ageing?.over_90_days || 0) / (vehicles.length || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-600 flex items-start space-x-2">
            <CalendarCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <p>Units older than 60 days should be prioritized for weekend promotional test drives.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
