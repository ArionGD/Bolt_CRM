import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Order, Quotation, VehicleModel } from '../types';
import {
  User,
  Phone,
  Bell,
  ShoppingBag,
  FileText,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerPortal: React.FC = () => {
  const { user, loginAsCustomer } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(user?.receive_alerts ?? true);

  useEffect(() => {
    async function loadData() {
      try {
        const [oList, qList, mList] = await Promise.all([
          api.getOrders(),
          api.getQuotations(),
          api.getModels(),
        ]);

        // Filter for this customer if user is set
        const custName = user?.full_name?.toLowerCase() || '';
        const custPhone = user?.phone || '';

        const myOrders = oList.filter(
          (o) =>
            o.customer_id === user?.id ||
            (custName && o.customer_name.toLowerCase().includes(custName)) ||
            (custPhone && o.customer_phone === custPhone)
        );

        const myQuotes = qList.filter(
          (q) =>
            q.customer_id === user?.id ||
            (custName && q.customer_name?.toLowerCase().includes(custName)) ||
            (custPhone && q.customer_phone === custPhone)
        );

        setOrders(myOrders.length > 0 ? myOrders : oList.slice(0, 2)); // show sample orders if direct match is empty
        setQuotations(myQuotes.length > 0 ? myQuotes : qList.slice(0, 2));
        setModels(mList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleToggleAlerts = async () => {
    const next = !alertsEnabled;
    setAlertsEnabled(next);
    if (user?.full_name && user?.phone) {
      await loginAsCustomer(user.full_name, user.phone, next);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Customer Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-brand-800/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-0.5 shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <User className="w-8 h-8 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Welcome, {user?.full_name || 'Customer 1'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Customer Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{user?.phone || '+91 98000 00001'}</span>
                <span>•</span>
                <span>Verified Customer Account</span>
              </p>
            </div>
          </div>

          {/* Marketing Alerts Preference Toggle */}
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between sm:justify-start space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-xl ${alertsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Alerts & Offers</div>
                <div className="text-[11px] text-slate-400">
                  {alertsEnabled ? 'Subscribed to price drops' : 'Notifications paused'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleAlerts}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                alertsEnabled
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {alertsEnabled ? 'Active' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: My Active Bookings / Orders & Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: My Bookings & Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">My Vehicle Bookings</h3>
                <p className="text-xs text-slate-500">Track physical vehicle allocation and delivery</p>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No orders booked yet. Visit showroom inventory below to book your EV.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800">{ord.order_number}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'ready_for_delivery'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">
                        {ord.brand} {ord.model_name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">VIN: {ord.vin} ({ord.colour})</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Order Value</div>
                      <div className="font-extrabold text-sm text-slate-900">
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      Paid: <span className="font-bold text-emerald-700">₹{ord.total_paid.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      Due: <span className="font-bold text-sky-700">₹{ord.balance_due.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: My Quotations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">My Saved Quotations</h3>
                <p className="text-xs text-slate-500">Detailed on-road breakdowns and state subsidies</p>
              </div>
            </div>
          </div>

          {quotations.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No quotes created yet. Contact sales or request a quote below.
            </div>
          ) : (
            <div className="space-y-3">
              {quotations.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800">{q.quote_number}</span>
                    <span className="text-[11px] text-slate-500">Valid until {q.valid_until}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">
                        {q.brand} {q.model_name}
                      </div>
                      <div className="text-xs text-slate-500">Ex-Showroom: ₹{q.ex_showroom.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">On-Road Estimate</div>
                      <div className="font-extrabold text-sm text-emerald-700">
                        ₹{q.on_road_total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Includes RTO ₹{q.registration} + Insurance ₹{q.insurance}</span>
                    {q.subsidy_amount > 0 && (
                      <span className="text-emerald-700 font-semibold">-₹{q.subsidy_amount} Subsidy</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Showroom Vehicle Lineup: Scooty & E-Rickshaw Models */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Zap className="w-5 h-5 text-brand-600" />
            <span>Showroom Vehicle Lineup</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse our verified EV Scooty models and commercial 5-seater E-Rickshaw available for immediate delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-brand-500 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-slate-200 text-slate-700">
                  {m.body_type}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-2 group-hover:text-brand-600 transition-colors">
                  {m.model_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{m.variant}</p>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Range:</span>
                    <span className="font-bold text-slate-900">{m.range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Battery:</span>
                    <span className="font-bold text-slate-900">{m.battery_kwh} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Motor Power:</span>
                    <span className="font-bold text-slate-900">{m.motor_power_kw} kW</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="text-[11px] text-slate-500">Ex-Showroom Price</div>
                <div className="text-lg font-extrabold text-slate-900">
                  ₹{m.ex_showroom_price.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
