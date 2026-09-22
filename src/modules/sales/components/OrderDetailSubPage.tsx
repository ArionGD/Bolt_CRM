import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Order, OrderStatus, Payment, PaymentMethod } from '../../../types';
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  Truck,
  Car,
  FileCheck,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

interface OrderDetailSubPageProps {
  orderId?: string;
  onBack?: () => void;
}

export const OrderDetailSubPage: React.FC<OrderDetailSubPageProps> = ({ orderId: propOrderId, onBack }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const id = propOrderId || paramId || searchParams.get('order_id');

  const { role } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  // Payment form
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('neft');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');

  // Delivery details form
  const [regNo, setRegNo] = useState('');
  const [policyNo, setPolicyNo] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('booked');

  const canManageFinance = role === 'admin' || role === 'accounts' || role === 'manager';

  async function loadOrder() {
    if (!id) return;
    try {
      const orders = await api.getOrders();
      const o = orders.find((item) => item.id === id);
      if (o) {
        setOrder(o);
        setOrderStatus(o.status);
        setRegNo(o.registration_number || '');
        setPolicyNo(o.insurance_policy_no || '');
        setPayAmount(String(o.balance_due));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) {
      alert('Enter a valid payment amount.');
      return;
    }

    try {
      await api.addPayment(order.id, {
        amount,
        method: payMethod,
        notes: `${payRef ? `Ref: ${payRef}. ` : ''}${payNotes}`,
      });
      setShowPaymentModal(false);
      setPayRef('');
      setPayNotes('');
      loadOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to record payment');
    }
  };

  const handleUpdateDeliveryDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    try {
      const currentOrders = await api.getOrders();
      const idx = currentOrders.findIndex((o) => o.id === order.id);
      if (idx !== -1) {
        currentOrders[idx] = {
          ...currentOrders[idx],
          registration_number: regNo.toUpperCase().trim() || undefined,
          insurance_policy_no: policyNo.trim() || undefined,
          status: orderStatus,
          actual_delivery:
            orderStatus === 'delivered' ? new Date().toISOString().split('T')[0] : undefined,
        };
        localStorage.setItem('volt_orders', JSON.stringify(currentOrders));

        // If delivered, update vehicle status
        if (orderStatus === 'delivered') {
          await api.updateVehicle(order.vehicle_id, { status: 'delivered' });
        }
      }
      setShowDeliveryModal(false);
      loadOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600 font-bold text-lg">Order record not found</p>
        <button
          onClick={onBack || (() => navigate('/crm/sales?tab=orders'))}
          className="text-brand-600 font-semibold text-sm mt-2 inline-block cursor-pointer"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack || (() => navigate('/crm/sales?tab=orders'))}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Orders List</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDeliveryModal(true)}
            className="inline-flex items-center px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span>Delivery & RTO Details</span>
          </button>

          {canManageFinance && order.balance_due > 0 && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              <span>Record Part Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* Order Summary Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800">
              {order.order_number}
            </span>
            <span
              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                order.status === 'delivered'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : order.status === 'ready_for_delivery'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : order.status === 'payment_pending'
                  ? 'bg-slate-200 text-slate-800 border border-slate-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-2">
            Booking for {order.customer_name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Booked on {order.booking_date} • Expected delivery: {order.expected_delivery || 'TBD'}
          </p>
        </div>

        <div className="flex items-center space-x-6 text-right">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Agreement Value</p>
            <p className="text-xl font-extrabold text-slate-900">
              ₹{order.total_amount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <p className="text-xs text-slate-500 font-medium">Balance Remaining</p>
            <p
              className={`text-xl font-extrabold ${
                order.balance_due > 0 ? 'text-sky-700' : 'text-emerald-700'
              }`}
            >
              ₹{order.balance_due.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Vehicle Allocation & Payments Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Allocated Vehicle Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center">
              <Car className="w-4 h-4 mr-2 text-brand-600" />
              <span>Allocated Physical EV</span>
            </h2>
            <Link
              to={`/crm/inventory/${order.vehicle_id}`}
              className="text-xs text-brand-600 font-semibold hover:underline"
            >
              View Stock →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Model & Variant</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">
                {order.brand} {order.model_name}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Exterior Colour</p>
              <p className="font-semibold text-slate-800 mt-0.5">{order.colour}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Physical Chassis VIN</p>
              <p className="font-mono font-bold text-slate-900 bg-slate-100 p-2 rounded-lg mt-0.5">
                {order.vin}
              </p>
            </div>
          </div>

          {/* Atomic Locking Status */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Atomic VIN Lock</p>
              <p className="text-[11px] text-emerald-700">
                This vehicle cannot be double-booked or reassigned to another quotation.
              </p>
            </div>
          </div>
        </div>

        {/* Payments Ledger Card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-brand-600" />
                <span>Verified Payment Receipts</span>
              </h2>
              <p className="text-xs text-slate-500">
                ₹{order.total_paid.toLocaleString('en-IN')} received of ₹
                {order.total_amount.toLocaleString('en-IN')}
              </p>
            </div>

            {canManageFinance && order.balance_due > 0 && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                + Record Receipt
              </button>
            )}
          </div>

          {/* Payment breakdown and balance verification */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs border border-slate-100">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Booking Deposit:</span>
              <span className="font-bold text-slate-900">₹{order.booking_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Total Payments Recorded:</span>
              <span className="font-extrabold text-emerald-700">₹{order.total_paid.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Remaining Balance:</span>
              <span className="font-extrabold text-sky-700">₹{order.balance_due.toLocaleString('en-IN')}</span>
            </div>

            {order.balance_due === 0 ? (
              <div className="p-2.5 bg-emerald-100/80 text-emerald-800 rounded-lg text-center font-bold flex items-center justify-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vehicle is Fully Paid & Cleared for Gate Pass</span>
              </div>
            ) : (
              <div className="p-2.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-center font-semibold text-[11px]">
                Pending ₹{order.balance_due.toLocaleString('en-IN')} to clear before gate pass issue.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Record Customer Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt Amount (₹) *</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="neft">NEFT / RTGS / Bank Wire</option>
                  <option value="upi">UPI / QR Payment</option>
                  <option value="card">Debit / Credit Card (POS)</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash Receipt</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Reference / UTR Number</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-902381203"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 font-mono uppercase border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delivery Details Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Delivery & RTO Details</h3>
              <button onClick={() => setShowDeliveryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDeliveryDetails} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Order Fulfillment Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="booked">Booked (VIN Locked)</option>
                  <option value="payment_pending">Payment Pending</option>
                  <option value="ready_for_delivery">Ready for Delivery</option>
                  <option value="delivered">Delivered to Customer</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">RTO Vehicle Registration Number</label>
                <input
                  type="text"
                  placeholder="KA 01 EV 1234"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full px-3 py-2 font-mono uppercase border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Insurance Policy Number</label>
                <input
                  type="text"
                  placeholder="POL-8823910"
                  value={policyNo}
                  onChange={(e) => setPolicyNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeliveryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailSubPage;
