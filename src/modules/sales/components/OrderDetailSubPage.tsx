import React, { useEffect, useState, useRef } from 'react';
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
  Printer,
  Receipt,
  FileText,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Clock,
  Send,
  Building2,
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Payment form
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('neft');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');

  // Delivery details form
  const [regNo, setRegNo] = useState('');
  const [policyNo, setPolicyNo] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('booked');

  const invoicePrintRef = useRef<HTMLDivElement>(null);
  const canManageFinance = role === 'admin' || role === 'accounts' || role === 'manager';

  async function loadOrder() {
    if (!id) return;
    try {
      const [orders, paymentList] = await Promise.all([
        api.getOrders(),
        api.getOrderPayments(id),
      ]);
      const o = orders.find((item) => item.id === id);
      if (o) {
        setOrder(o);
        setOrderStatus(o.status);
        setRegNo(o.registration_number || '');
        setPolicyNo(o.insurance_policy_no || '');
        setPayAmount(String(o.balance_due > 0 ? o.balance_due : ''));
      }
      setPayments(paymentList);
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
        reference_no: payRef.trim() || undefined,
        notes: payNotes.trim() || undefined,
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
      await api.updateOrder(order.id, {
        registration_number: regNo.toUpperCase().trim() || undefined,
        insurance_policy_no: policyNo.trim() || undefined,
        status: orderStatus,
        actual_delivery:
          orderStatus === 'delivered' ? new Date().toISOString().split('T')[0] : undefined,
      });
      setShowDeliveryModal(false);
      loadOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
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
        <p className="text-slate-600 font-bold text-lg">Sales order record not found</p>
        <button
          onClick={onBack || (() => navigate('/crm/sales/tracker'))}
          className="text-brand-600 font-semibold text-sm mt-2 inline-block cursor-pointer"
        >
          ← Back to Sales Tracker
        </button>
      </div>
    );
  }

  // Financial calculations
  const sold = Number(order.sold_price !== undefined ? order.sold_price : order.total_amount);
  const initialCost = Number(order.initial_price !== undefined ? order.initial_price : Math.round(sold * 0.88));
  const ins = Number(order.insurance_charges || 0);
  const rto = Number(order.rto_charges || 0);
  const misc = Number(order.miscellaneous_charges || 0);
  const subsidy = Number(order.subsidy_discount || 0);
  const profit = Number(order.net_profit !== undefined ? order.net_profit : ((sold - initialCost) + misc));
  const marginPct = sold > 0 ? ((profit / sold) * 100).toFixed(1) : '0';

  // Stepper stages
  const stages: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'booked', label: '1. VIN Booked', desc: 'Chassis allocation locked' },
    { key: 'payment_pending', label: '2. Payment Ledger', desc: 'Settlement in progress' },
    { key: 'ready_for_delivery', label: '3. Pre-Delivery & RTO', desc: 'PDI & insurance cleared' },
    { key: 'delivered', label: '4. Delivered', desc: 'Customer handed over' },
  ];

  const currentStageIndex =
    order.status === 'delivered'
      ? 3
      : order.status === 'ready_for_delivery'
      ? 2
      : order.status === 'payment_pending'
      ? 1
      : 0;

  return (
    <div className="space-y-6">
      {/* Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBack || (() => navigate('/crm/sales/tracker'))}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Sales Tracker</span>
        </button>

        <div className="flex items-center space-x-2.5">
          {/* View / Print Tax Invoice */}
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="inline-flex items-center px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
            <span>View / Print Invoice</span>
          </button>

          {/* Delivery & RTO Modal */}
          <button
            onClick={() => setShowDeliveryModal(true)}
            className="inline-flex items-center px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span>Fulfillment & RTO</span>
          </button>

          {/* Record Payment */}
          {canManageFinance && order.balance_due > 0 && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              <span>Record Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* Order Summary & Status Stepper Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                {order.order_number}
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  order.status === 'delivered'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : order.status === 'ready_for_delivery'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : order.status === 'payment_pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {order.status.replace('_', ' ')}
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  order.vehicle_type === 'rickshaw' || order.model_name?.toLowerCase().includes('rickshaw')
                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {order.vehicle_type === 'rickshaw' || order.model_name?.toLowerCase().includes('rickshaw')
                  ? '🛺 E-Rickshaw'
                  : '🛵 EV Scooty'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-2">
              Sales Agreement for {order.customer_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Booked on {order.booking_date} • Phone: {order.customer_phone} • Expected Delivery:{' '}
              {order.expected_delivery || 'Immediate'}
            </p>
          </div>

          <div className="flex items-center space-x-6 text-right">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Agreement Value</p>
              <p className="text-2xl font-black text-slate-900">
                ₹{order.total_amount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <p className="text-xs text-slate-500 font-medium">Balance Remaining</p>
              <p
                className={`text-2xl font-black ${
                  order.balance_due > 0 ? 'text-sky-700' : 'text-emerald-700'
                }`}
              >
                ₹{order.balance_due.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Lifecycle Stepper */}
        <div className="pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stages.map((st, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-brand-50/70 border-brand-300 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-slate-50/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={isCurrent ? 'text-brand-900' : isCompleted ? 'text-emerald-900' : 'text-slate-600'}>
                      {st.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 pl-5">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Financial Cost Breakdown, Vehicle Allocation & Verified Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Itemized Accounting Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center">
              <Receipt className="w-4 h-4 mr-2 text-brand-600" />
              <span>Itemized Billing Ledger</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Tax Compliant
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Initial Acquisition Cost:</span>
              <span className="font-mono text-slate-700">₹{initialCost.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-800 font-semibold">Agreed Ex-Showroom Sold Price:</span>
              <span className="font-mono font-bold text-slate-900">₹{sold.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Comprehensive Insurance:</span>
              <span className="font-mono text-slate-700">₹{ins.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">RTO Registration & HSRP:</span>
              <span className="font-mono text-slate-700">₹{rto.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Dealer Handling & Misc:</span>
              <span className="font-mono text-slate-700">₹{misc.toLocaleString('en-IN')}</span>
            </div>

            {subsidy > 0 && (
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-emerald-700">
                <span>Less: EV Subsidy Discount:</span>
                <span className="font-mono font-bold">-₹{subsidy.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between py-2 border-b-2 border-slate-200 bg-slate-50 px-2 rounded-lg font-bold text-slate-900">
              <span>Total On-Road Invoiced:</span>
              <span className="font-mono font-extrabold text-sky-800 text-sm">
                ₹{order.total_amount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Dealer Net Profit Calculation Box */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Net Dealer Profit:
                </span>
                <span className="font-mono text-emerald-700 text-sm font-black">
                  +₹{profit.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] text-emerald-700 flex justify-between">
                <span>Margin: {marginPct}%</span>
                <span>(Sold - Initial Cost) + Misc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Allocated Physical Vehicle */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center">
              <Car className="w-4 h-4 mr-2 text-brand-600" />
              <span>Allocated Physical Stock</span>
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
              <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                {order.brand} {order.model_name}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Exterior Colour</p>
              <p className="font-semibold text-slate-800 mt-0.5">{order.colour}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Chassis VIN Number</p>
              <p className="font-mono font-bold text-slate-900 bg-slate-100 p-2 rounded-lg mt-0.5 select-all">
                {order.vin}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">RTO Plate:</span>
                <span className="font-mono font-bold text-slate-800">
                  {order.registration_number || 'Not Assigned Yet'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Insurance Policy:</span>
                <span className="font-mono font-bold text-slate-800">
                  {order.insurance_policy_no || 'Pending Issuance'}
                </span>
              </div>
            </div>
          </div>

          {/* VIN Lock Guarantee */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2 mt-4">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Atomic Allocation Lock</p>
              <p className="text-[11px] text-emerald-700">
                This VIN is assigned uniquely to this order and cannot be booked to another customer.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Payment Receipts Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-brand-600" />
                <span>Payment Receipts</span>
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

          {/* Receipts Table */}
          {payments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No payments recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="font-mono text-slate-900">₹{p.amount.toLocaleString('en-IN')}</span>
                    <span className="px-2 py-0.5 rounded uppercase text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                      {p.method}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{p.payment_date}</span>
                    {p.reference_no && <span className="font-mono">Ref: {p.reference_no}</span>}
                  </div>
                  {p.notes && <p className="text-[10px] text-slate-400">{p.notes}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Balance Settlement Status */}
          <div className="pt-2 border-t border-slate-100">
            {order.balance_due === 0 ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-center font-bold flex items-center justify-center space-x-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fully Settled & Cleared for Gate Pass</span>
              </div>
            ) : (
              <div className="p-3 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-center font-semibold text-xs flex items-center justify-between">
                <span>Balance Due:</span>
                <span className="font-mono font-extrabold text-sm">
                  ₹{order.balance_due.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official Tax Invoice Modal with Print Engine */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">Official Tax Invoice & Bill of Supply</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintInvoice}
                  className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 mr-1.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Document Body */}
            <div ref={invoicePrintRef} className="mt-6 space-y-6 text-xs text-slate-800 font-sans">
              {/* Dealership Header */}
              <div className="flex justify-between items-start pb-4 border-b-2 border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    TRISHA MOTORS ELECTRIC VEHICLES
                  </h2>
                  <p className="text-slate-600 font-medium text-xs mt-0.5">
                    Authorized Two-Wheeler EV Dealership & Service Center
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Trisha Central Complex, Bangalore, Karnataka • GSTIN: 29AABCT1334M1Z2
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Phone: +91 98765 43210 • Email: billing@trishamotors.com
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-slate-900 text-white text-xs font-black rounded uppercase tracking-wider">
                    TAX INVOICE
                  </span>
                  <div className="font-mono font-extrabold text-sm text-slate-900 mt-2">
                    {order.order_number}
                  </div>
                  <div className="text-slate-500 text-[11px]">Date: {order.booking_date}</div>
                </div>
              </div>

              {/* Bill To & Dispatch Vehicle Specs */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Billed To</div>
                  <div className="font-bold text-sm text-slate-900 mt-1">{order.customer_name}</div>
                  <div className="text-slate-600 font-mono mt-0.5">{order.customer_phone}</div>
                  <div className="text-slate-500 text-[11px] mt-1">Delivery: {order.expected_delivery || 'Showroom Handover'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Dispatched Vehicle Unit</div>
                  <div className="font-bold text-sm text-slate-900 mt-1">
                    {order.brand} {order.model_name}
                  </div>
                  <div className="text-slate-600 text-[11px]">Colour: {order.colour}</div>
                  <div className="font-mono font-bold text-slate-800 text-[11px] mt-1">
                    VIN: {order.vin}
                  </div>
                  {order.registration_number && (
                    <div className="font-mono text-[11px] text-emerald-700 font-bold">
                      RTO Reg: {order.registration_number}
                    </div>
                  )}
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3 border-r border-slate-200">Item Description</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 text-center">HSN/SAC</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 text-right">Taxable Value</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                      {order.brand} {order.model_name} Electric Vehicle (Ex-Showroom)
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-[11px]">871160</td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                      ₹{Math.round(sold / 1.05).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      ₹{sold.toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {ins > 0 && (
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                        Comprehensive 5-Year Vehicle Insurance Policy
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-[11px]">997133</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                        ₹{ins.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        ₹{ins.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )}

                  {rto > 0 && (
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                        RTO Registration, Road Tax & High-Security Number Plate (HSRP)
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-[11px]">999119</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                        ₹{rto.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        ₹{rto.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )}

                  {misc > 0 && (
                    <tr>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                        Showroom Documentation, Pre-Delivery Inspection & Handling
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-[11px]">998599</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                        ₹{misc.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        ₹{misc.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )}

                  {subsidy > 0 && (
                    <tr className="text-emerald-700 bg-emerald-50/40">
                      <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                        Less: State/Central EV Direct Subsidy Benefit
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-[11px]">—</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">-₹{subsidy.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">-₹{subsidy.toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-slate-800 bg-slate-100 font-extrabold text-slate-900">
                  <tr>
                    <td colSpan={3} className="py-3 px-3 border-r border-slate-200 text-right">
                      GRAND TOTAL ON-ROAD INVOICED:
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-sky-800 font-black">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-2 px-3 border-r border-slate-200 text-right font-normal text-emerald-800">
                      Total Payment Received to Date:
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-700">
                      ₹{order.total_paid.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-2 px-3 border-r border-slate-200 text-right font-normal text-slate-600">
                      Balance Amount Due:
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{order.balance_due.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Signatures & Seal */}
              <div className="flex justify-between items-end pt-8 border-t border-slate-200">
                <div className="text-[10px] text-slate-400 max-w-sm">
                  <p className="font-bold text-slate-600 uppercase">Terms & Conditions</p>
                  <p className="mt-1">
                    Goods once sold will not be taken back or exchanged. Warranty as per manufacturer terms.
                    This is a computer generated tax invoice.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-slate-800 pb-8 font-serif italic text-slate-400 text-xs">
                    Trisha Motors
                  </div>
                  <div className="text-[10px] font-bold text-slate-700 mt-1 uppercase">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Record Customer Payment</h3>
                <p className="text-xs text-slate-500">Order: {order.order_number}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount (₹) *</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400">
                  Current Balance Due: ₹{order.balance_due.toLocaleString('en-IN')}
                </span>
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
                  <option value="finance_disbursal">Bank Finance Disbursal</option>
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Final payment before delivery"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Record Payment Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fulfillment & RTO Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Delivery & RTO Fulfillment</h3>
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
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Update Fulfillment
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
