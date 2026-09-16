import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Customer, Order, OrderStatus, Vehicle } from '../types';
import {
  ShoppingBag,
  Plus,
  Car,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  AlertCircle,
  X,
  CreditCard,
  Lock,
} from 'lucide-react';

export const Orders: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showBookModal, setShowBookModal] = useState(false);

  // Form
  const [customerId, setCustomerId] = useState(searchParams.get('customer_id') || '');
  const [vehicleId, setVehicleId] = useState(searchParams.get('vehicle_id') || '');
  const [bookingAmount, setBookingAmount] = useState('10000');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'finance' | 'lease'>('finance');
  const [financePartner, setFinancePartner] = useState('Finance Partner 1');
  const [loanAmount, setLoanAmount] = useState('60000');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
  );

  async function loadData() {
    try {
      const [oList, cList, vList] = await Promise.all([
        api.getOrders(),
        api.getCustomers(),
        api.getVehicles(),
      ]);
      setOrders(oList);
      setCustomers(cList);
      setVehicles(vList);
      if (cList.length > 0 && !customerId) setCustomerId(cList[0].id);
      const available = vList.filter((v) => v.status === 'in_stock' || v.status === 'in_transit');
      if (available.length > 0 && !vehicleId) setVehicleId(available[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const availableVehicles = vehicles.filter(
    (v) => v.status === 'in_stock' || v.status === 'in_transit'
  );

  const handleBookVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) {
      alert('Please select an available physical vehicle.');
      return;
    }
    try {
      await api.createOrder({
        customer_id: customerId,
        vehicle_id: vehicleId,
        booking_amount: parseFloat(bookingAmount) || 0,
        payment_mode: paymentMode,
        finance_partner: paymentMode === 'finance' ? financePartner : undefined,
        loan_amount: paymentMode === 'finance' ? parseFloat(loanAmount) : undefined,
        expected_delivery: deliveryDate,
      });
      setShowBookModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Double-selling prevented or error booking vehicle');
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Orders & Bookings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {orders.length} orders
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Physical vehicle allocations with double-booking lock and payment ledger tracking.
          </p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Book Vehicle</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
        {['all', 'booked', 'payment_pending', 'ready_for_delivery', 'delivered', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              statusFilter === st ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading customer orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-700">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Allocated Physical Vehicle</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">Collected / Balance Due</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4 text-right">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {o.order_number}
                      <div className="text-[10px] font-sans text-slate-400 font-normal">
                        Booked: {o.booking_date}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{o.customer_name}</div>
                      <div className="text-slate-500 text-[11px]">{o.customer_phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{o.brand} {o.model_name}</div>
                      <div className="text-slate-500 text-[11px]">{o.colour}</div>
                      <div className="font-mono text-[10px] text-slate-400">VIN: {o.vin}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {o.payment_mode}
                      </span>
                      {o.finance_partner && (
                        <div className="text-[10px] text-slate-500 mt-0.5">{o.finance_partner}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{o.total_amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-emerald-700 font-semibold">
                        ₹{o.total_paid.toLocaleString('en-IN')} paid
                      </div>
                      {o.balance_due > 0 ? (
                        <div className="text-sky-700 font-bold text-[11px]">
                          ₹{o.balance_due.toLocaleString('en-IN')} due
                        </div>
                      ) : (
                        <div className="text-emerald-600 font-bold text-[10px] flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          <span>Cleared</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : o.status === 'ready_for_delivery'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : o.status === 'payment_pending'
                            ? 'bg-slate-200 text-slate-800 border border-slate-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {o.status.replace('_', ' ')}
                      </span>
                      {o.registration_number && (
                        <div className="text-[10px] font-mono font-bold text-slate-700 mt-0.5">
                          {o.registration_number}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/crm/orders/${o.id}`}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Ledger</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Vehicle Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-lg text-slate-900">Book Vehicle & Allocate Physical VIN</h3>
              </div>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3 p-3 bg-sky-50 border border-sky-200/80 rounded-xl text-xs text-sky-800 flex items-start space-x-2">
              <Lock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                Booking links a customer directly to a physical chassis number, instantly reserving it and preventing double-selling.
              </span>
            </div>

            <form onSubmit={handleBookVehicle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Physical In-Stock Vehicle *</label>
                {availableVehicles.length === 0 ? (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                    No physical vehicles currently available in stock or transit. Please add units in Inventory first.
                  </div>
                ) : (
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {availableVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model_name} ({v.colour}) — VIN: {v.vin} [₹{v.asking_price.toLocaleString('en-IN')}]
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Booking Deposit (₹)</label>
                  <input
                    type="number"
                    value={bookingAmount}
                    onChange={(e) => setBookingAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="cash">Full Cash / Self Funded</option>
                    <option value="finance">Bank Auto Loan (Finance)</option>
                    <option value="lease">Corporate Lease</option>
                  </select>
                </div>
              </div>

              {paymentMode === 'finance' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Finance Partner</label>
                    <input
                      type="text"
                      value={financePartner}
                      onChange={(e) => setFinancePartner(e.target.value)}
                      placeholder="e.g. Finance Partner 1 / Bank 1"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Loan Amount (₹)</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Committed Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={availableVehicles.length === 0}
                  className="px-5 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 shadow-sm disabled:opacity-50"
                >
                  Confirm Vehicle Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
