import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import { Customer, Order, OrderStatus, Vehicle } from '../../../types';
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

export const OrdersSubPage: React.FC = () => {
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
    <div className="space-y-4">
      {/* Subpage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Orders & Bookings</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {orders.length} orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical vehicle allocations with double-booking lock and payment ledger tracking.
          </p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Book Vehicle</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
        {['all', 'booked', 'payment_pending', 'ready_for_delivery', 'delivered', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
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
                        <div className="text-emerald-600 font-semibold flex items-center text-[11px]">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Fully Settled
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : o.status === 'payment_pending'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/crm/sales?tab=orders&order_id=${o.id}`}
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
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-lg">Book Physical EV to Order</h3>
              </div>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookVehicle} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Allocate Physical VIN Stock *
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                >
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model_name} ({v.colour}) — VIN: {v.vin} [₹{v.asking_price.toLocaleString('en-IN')}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Advance Booking Amount (₹) *</label>
                  <input
                    type="number"
                    value={bookingAmount}
                    onChange={(e) => setBookingAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment / Finance Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="cash">Direct Cash / Full NEFT</option>
                    <option value="finance">Bank EV Loan (EMI)</option>
                    <option value="lease">Corporate Lease</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Booking will atomically update vehicle status to Reserved with unique VIN locking.</span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Confirm Booking & Lock VIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSubPage;
