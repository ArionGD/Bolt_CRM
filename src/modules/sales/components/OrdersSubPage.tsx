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
  DollarSign,
  Receipt,
  ShieldCheck,
  Layers,
  TrendingUp,
  Calculator,
} from 'lucide-react';

export const OrdersSubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showBookModal, setShowBookModal] = useState(false);

  // Form State for Booking / Sales Recording
  const [customerId, setCustomerId] = useState(searchParams.get('customer_id') || '');
  const [vehicleId, setVehicleId] = useState(searchParams.get('vehicle_id') || '');
  
  // Cost, Pricing & Fees Inputs
  const [initialPrice, setInitialPrice] = useState('72000');
  const [soldPrice, setSoldPrice] = useState('85000');
  const [insuranceCharges, setInsuranceCharges] = useState('3500');
  const [rtoCharges, setRtoCharges] = useState('4500');
  const [miscCharges, setMiscCharges] = useState('1500');
  const [subsidyDiscount, setSubsidyDiscount] = useState('0');

  const [bookingAmount, setBookingAmount] = useState('15000');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'finance' | 'lease'>('finance');
  const [financePartner, setFinancePartner] = useState('HDFC Auto Finance');
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
      if (available.length > 0 && !vehicleId) {
        setVehicleId(available[0].id);
        const ask = Number(available[0].asking_price) || 82000;
        const cost = Number(available[0].purchase_price) || Math.round(ask * 0.88);
        setSoldPrice(String(ask));
        setInitialPrice(String(cost));
      }

      // Check if booking from an accepted quotation
      const qId = searchParams.get('quotation_id');
      if (qId) {
        const quotes = await api.getQuotations();
        const quote = quotes.find((q) => q.id === qId);
        if (quote) {
          if (quote.customer_id) setCustomerId(quote.customer_id);
          const ask = Number(quote.ex_showroom) || 82000;
          setSoldPrice(String(ask));
          setInitialPrice(String(Math.round(ask * 0.88)));
          setInsuranceCharges(String(quote.insurance || 0));
          setRtoCharges(String(quote.registration || 0));
          setMiscCharges(String((quote.accessories_total || 0) + (quote.handling_charges || 0)));
          setSubsidyDiscount(String((quote.subsidy_amount || 0) + (quote.discount || 0)));
          setShowBookModal(true);
        }
      }
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

  const handleSelectVehicle = (vId: string) => {
    setVehicleId(vId);
    const v = vehicles.find((item) => item.id === vId);
    if (v) {
      const ask = Number(v.asking_price) || 82000;
      const cost = Number(v.purchase_price) || Math.round(ask * 0.88);
      setSoldPrice(String(ask));
      setInitialPrice(String(cost));
    }
  };

  // Real-Time Financial Calculations
  const numSold = parseFloat(soldPrice) || 0;
  const numInitial = parseFloat(initialPrice) || 0;
  const numIns = parseFloat(insuranceCharges) || 0;
  const numRto = parseFloat(rtoCharges) || 0;
  const numMisc = parseFloat(miscCharges) || 0;
  const numSub = parseFloat(subsidyDiscount) || 0;
  const numAdvance = parseFloat(bookingAmount) || 0;

  // Invoiced Total = Sold Price + Insurance + RTO + Misc - Subsidy
  const computedTotalBill = Math.max(0, numSold + numIns + numRto + numMisc - numSub);
  // Net Dealer Profit = (Sold Price - Initial Cost) + Misc Charges
  const computedProfit = (numSold - numInitial) + numMisc;
  const computedMarginPct = numSold > 0 ? ((computedProfit / numSold) * 100).toFixed(1) : '0';
  const computedBalanceDue = Math.max(0, computedTotalBill - numAdvance);

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
        booking_amount: numAdvance,
        initial_price: numInitial,
        sold_price: numSold,
        insurance_charges: numIns,
        rto_charges: numRto,
        miscellaneous_charges: numMisc,
        subsidy_discount: numSub,
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
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Sales Tracker & Vehicle Booking</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {orders.length} orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Record vehicle sales, document initial dealer cost, sold price, insurance, RTO, and track net dealer profit.
          </p>
        </div>
        <button
          onClick={() => {
            setShowBookModal(true);
            const available = vehicles.filter((v) => v.status === 'in_stock' || v.status === 'in_transit');
            if (available.length > 0 && !vehicleId) {
              handleSelectVehicle(available[0].id);
            }
          }}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Record New Sale / Booking</span>
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
          <div className="p-8 text-center text-slate-500">Loading sales transactions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-700">No sales transactions found</p>
            <p className="text-xs text-slate-500 mt-1">Click "Record New Sale" to book a vehicle with complete cost accounting.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Order / Booking</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Allocated Vehicle</th>
                  <th className="py-3 px-4">Initial Cost</th>
                  <th className="py-3 px-4">Sold Price</th>
                  <th className="py-3 px-4">Ins & RTO</th>
                  <th className="py-3 px-4">Misc</th>
                  <th className="py-3 px-4 text-sky-800">Total Invoice</th>
                  <th className="py-3 px-4 text-emerald-800">Net Profit</th>
                  <th className="py-3 px-4">Paid / Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((o) => {
                  const sold = Number(o.sold_price !== undefined ? o.sold_price : (o.total_amount || 0));
                  const init = Number(o.initial_price !== undefined ? o.initial_price : Math.round(sold * 0.88));
                  const ins = Number(o.insurance_charges || 0);
                  const rto = Number(o.rto_charges || 0);
                  const misc = Number(o.miscellaneous_charges || 0);
                  const profit = Number(o.net_profit !== undefined ? o.net_profit : ((sold - init) + misc));
                  const marginPct = sold > 0 ? ((profit / sold) * 100).toFixed(1) : '0';

                  return (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {o.order_number}
                        <div className="text-[10px] font-sans text-slate-400 font-normal">
                          {o.booking_date}
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

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        ₹{init.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ₹{sold.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                        ₹{(ins + rto).toLocaleString('en-IN')}
                        <div className="text-[9px] text-slate-400">Ins: ₹{ins} | RTO: ₹{rto}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        ₹{misc.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-sky-700 text-sm">
                        ₹{o.total_amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-extrabold text-emerald-700 text-sm">
                          +₹{profit.toLocaleString('en-IN')}
                        </div>
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {marginPct}% margin
                        </span>
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
                          <div className="text-emerald-600 font-semibold flex items-center text-[10px]">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Settled
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Vehicle Modal with Complete Cost Accounting & Live Calculation */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Record Vehicle Sale & Cost Breakdown</h3>
                  <p className="text-xs text-slate-500">
                    Input initial purchase cost, agreed sold price, insurance, RTO, and miscellaneous charges.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookVehicle} className="mt-4 space-y-4 text-xs">
              {/* Customer & Vehicle Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    Allocate Physical Stock (VIN) *
                  </label>
                  <select
                    value={vehicleId}
                    onChange={(e) => handleSelectVehicle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  >
                    {availableVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model_name} ({v.colour}) — {v.vin}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Cost Structure Section */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <Calculator className="w-4 h-4 text-brand-600" />
                  <span>Cost Accounting & Pricing Inputs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Initial Purchase Price / Dealer Cost (₹) *
                    </label>
                    <input
                      type="number"
                      value={initialPrice}
                      onChange={(e) => setInitialPrice(e.target.value)}
                      placeholder="e.g. 72000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      required
                    />
                    <span className="text-[10px] text-slate-500">What dealership paid to acquire unit</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Agreed Sold Price to Customer (₹) *
                    </label>
                    <input
                      type="number"
                      value={soldPrice}
                      onChange={(e) => setSoldPrice(e.target.value)}
                      placeholder="e.g. 85000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      required
                    />
                    <span className="text-[10px] text-slate-500">Base ex-showroom agreed vehicle rate</span>
                  </div>
                </div>

                {/* Additional Direct Charges: Insurance, RTO, Misc */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Insurance Charges (₹)
                    </label>
                    <input
                      type="number"
                      value={insuranceCharges}
                      onChange={(e) => setInsuranceCharges(e.target.value)}
                      placeholder="e.g. 3500"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Pass-through policy premium</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      RTO & Registration Charges (₹)
                    </label>
                    <input
                      type="number"
                      value={rtoCharges}
                      onChange={(e) => setRtoCharges(e.target.value)}
                      placeholder="e.g. 4500"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">RTO number plate fee</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Miscellaneous Charges (₹)
                    </label>
                    <input
                      type="number"
                      value={miscCharges}
                      onChange={(e) => setMiscCharges(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Doc & accessories fee (Dealer Profit)</span>
                  </div>
                </div>

                {/* Subsidy / Discount */}
                <div className="pt-2 border-t border-slate-200/80">
                  <label className="block font-semibold text-slate-700 mb-1">
                    State / Central EV Subsidy Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={subsidyDiscount}
                    onChange={(e) => setSubsidyDiscount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Real-Time Calculation Card */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                  <span className="font-bold text-emerald-900 text-xs">Live Financial Calculation</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-200 text-emerald-800">
                    Real-Time
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-center">
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Total Customer Invoice</div>
                    <div className="text-base font-black text-sky-800 mt-0.5">
                      ₹{computedTotalBill.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Net Dealer Profit</div>
                    <div className="text-base font-black text-emerald-700 mt-0.5">
                      +₹{computedProfit.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Profit Margin</div>
                    <div className="text-base font-black text-emerald-700 mt-0.5">
                      {computedMarginPct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Est. Balance Due</div>
                    <div className="text-base font-black text-slate-800 mt-0.5">
                      ₹{computedBalanceDue.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              {paymentMode === 'finance' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bank / Finance Partner</label>
                    <input
                      type="text"
                      value={financePartner}
                      onChange={(e) => setFinancePartner(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sanctioned Loan Amount (₹)</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
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
                  Record Sale & Lock VIN Stock
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
