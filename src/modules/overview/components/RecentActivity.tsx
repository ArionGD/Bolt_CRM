import React from 'react';
import { Link } from 'react-router-dom';
import { Order, StockAgeingBucket, Vehicle } from '../../../types';
import { CheckCircle2, ShieldAlert, CalendarCheck, ShoppingBag } from 'lucide-react';

interface RecentActivityProps {
  orders: Order[];
  ageing: StockAgeingBucket | null;
  vehicles: Vehicle[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  orders,
  ageing,
  vehicles,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Orders & Delivery Status */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Bookings</h2>
            <p className="text-xs text-slate-500">Orders tied to unique physical vehicles</p>
          </div>
          <Link
            to="/crm/sales?tab=orders"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            View All Orders →
          </Link>
        </div>
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600 text-sm">No Customer Bookings Yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Orders will appear here as physical vehicles are booked.</p>
            </div>
          ) : (
            orders.slice(0, 4).map((o) => (
            <div
              key={o.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
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
                  {o.customer_name} •{' '}
                  <span className="font-medium text-slate-800">
                    {o.brand} {o.model_name}
                  </span>{' '}
                  ({o.colour})
                </p>
                <p className="text-[11px] font-mono text-slate-400">VIN: {o.vin}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-slate-900">
                  ₹{o.total_amount.toLocaleString('en-IN')}
                </p>
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
          ))
        )}
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
                style={{
                  width: `${Math.min(
                    100,
                    ((ageing?.under_30_days || 0) / (vehicles.length || 1)) * 100
                  )}%`,
                }}
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
                style={{
                  width: `${Math.min(
                    100,
                    ((ageing?.days_30_to_60 || 0) / (vehicles.length || 1)) * 100
                  )}%`,
                }}
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
                style={{
                  width: `${Math.min(
                    100,
                    ((ageing?.days_60_to_90 || 0) / (vehicles.length || 1)) * 100
                  )}%`,
                }}
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
                style={{
                  width: `${Math.min(
                    100,
                    ((ageing?.over_90_days || 0) / (vehicles.length || 1)) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-600 flex items-start space-x-2">
          <CalendarCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <p>Units older than 60 days should be prioritized for promotional customer test drives.</p>
        </div>
      </div>
    </div>
  );
};
