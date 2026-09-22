import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import { Customer, DailySalesAggregate, Order, OrderStatus, Vehicle } from '../../../types';
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
  Calendar,
  List,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const OrdersSubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [dailySales, setDailySales] = useState<DailySalesAggregate[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'daily_timeline' | 'table'>('daily_timeline');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);

  // Form State for Booking / Sales Recording
  const [customerId, setCustomerId] = useState(searchParams.get('customer_id') || '');
  const [vehicleId, setVehicleId] = useState(searchParams.get('vehicle_id') || '');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  
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
      const [oList, dailyList, cList, vList] = await Promise.all([
        api.getOrders(),
        api.getDailySalesReports(14),
        api.getCustomers(),
        api.getVehicles(),
      ]);
      setOrders(oList);
      setDailySales(dailyList);
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

  const selectedVehicleObj = vehicles.find((v) => v.id === vehicleId);
  const isRickshawSelected =
    selectedVehicleObj?.model_name?.toLowerCase().includes('rickshaw') ||
    (selectedVehicleObj as any)?.body_type?.toLowerCase().includes('rickshaw');

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
        sale_date: saleDate,
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

  // Calculate high-level summary metrics
  const totalScooters = orders.filter(
    (o) => o.vehicle_type === 'scooter' || !o.model_name?.toLowerCase().includes('rickshaw')
  ).length;
  const totalRickshaws = orders.filter(
    (o) => o.vehicle_type === 'rickshaw' || o.model_name?.toLowerCase().includes('rickshaw')
  ).length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalProfit = orders.reduce(
    (sum, o) =>
      sum +
      Number(
        o.net_profit !== undefined
          ? o.net_profit
          : (Number(o.sold_price || o.total_amount) - Number(o.initial_price || 0)) +
              Number(o.miscellaneous_charges || 0)
      ),
    0
  );

  // Timeline list (sorted descending to show latest days first)
  const timelineDays = [...dailySales].reverse();
  const visibleTimelineDays = showAllDays
    ? timelineDays
    : timelineDays.filter((d) => d.total_units > 0 || timelineDays.indexOf(d) < 7);

  return (
    <div className="space-y-6">
      {/* Subpage Header & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Day-Wise Sales & Booking Tracker
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {orders.length} total sales
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous daily sales mapping: track daily sales volume of Scooters and Rickshaws with revenue and profit.
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
          <span>Record Daily Sale / Booking</span>
        </button>
      </div>

      {/* Top 4 Real-Time Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Card 1: Scooties Sold */}
        <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>🛵 Scooties Sold (2W)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalScooters} Units</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Personal EV Two-Wheelers</div>
        </div>

        {/* Card 2: E-Rickshaws Sold */}
        <div className="p-3.5 bg-white rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-sky-800">
            <span>🛺 E-Rickshaws (3W)</span>
            <span className="w-2 h-2 rounded-full bg-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalRickshaws} Units</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Commercial 5-Seater L5M</div>
        </div>

        {/* Card 3: Total Sales Invoiced */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Total Sales Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-sky-800 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Cumulative customer invoices</div>
        </div>

        {/* Card 4: Net Dealer Profit */}
        <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>Net Dealer Profit</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            +₹{totalProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-800 mt-0.5 font-semibold">
            {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}% Overall Margin
          </div>
        </div>
      </div>

      {/* View Switcher: Day-by-Day Timeline vs All Transactions Table */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode('daily_timeline')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'daily_timeline'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Day-by-Day Daily Timeline</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>All Transactions Table</span>
          </button>
        </div>

        {/* Filter Tabs for Status */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {['all', 'booked', 'payment_pending', 'ready_for_delivery', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: DAY-BY-DAY DAILY TIMELINE */}
      {viewMode === 'daily_timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Continuous Daily Sales Ledger
            </span>
            <button
              onClick={() => setShowAllDays(!showAllDays)}
              className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>{showAllDays ? 'Show Active & Recent Days' : 'Show Full 14-Day Calendar Timeline'}</span>
              {showAllDays ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              Loading daily timeline...
            </div>
          ) : visibleTimelineDays.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-slate-700">No Sales Records Found</p>
              <p className="text-xs text-slate-500 mt-1">Record a sale to map the first calendar day.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleTimelineDays.map((day) => {
                const hasSales = day.total_units > 0;
                return (
                  <div
                    key={day.date}
                    className={`rounded-2xl border transition-all ${
                      hasSales
                        ? 'bg-white border-slate-200 shadow-sm p-4'
                        : 'bg-slate-50/60 border-slate-200/70 p-3 opacity-75'
                    }`}
                  >
                    {/* Day Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                            hasSales
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {day.day_of_week}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-sm text-slate-900">
                              {day.date_label}
                            </span>
                            {hasSales ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                {day.total_units} {day.total_units === 1 ? 'sale' : 'continuous sales'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                                0 sales (No transactions)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {hasSales ? (
                              <span>
                                🛵 {day.scooter_units} Scooties • 🛺 {day.rickshaw_units} E-Rickshaws
                              </span>
                            ) : (
                              <span>Showroom open • No vehicle dispatches on this date</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Day Financial Metrics */}
                      {hasSales && (
                        <div className="flex items-center space-x-6 text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Day Revenue</span>
                            <div className="font-mono font-black text-sky-800 text-sm">
                              ₹{day.total_revenue.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Net Profit</span>
                            <div className="font-mono font-black text-emerald-700 text-sm">
                              +₹{day.total_profit.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Margin</span>
                            <div className="font-bold text-xs text-slate-700">
                              {day.margin_pct}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expandable Cards for Continuous Sales on this Day */}
                    {hasSales && day.orders.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {day.orders.map((o) => {
                          const isRick =
                            o.vehicle_type === 'rickshaw' ||
                            o.model_name?.toLowerCase().includes('rickshaw');
                          const sold = Number(o.sold_price !== undefined ? o.sold_price : (o.total_amount || 0));
                          const init = Number(o.initial_price !== undefined ? o.initial_price : Math.round(sold * 0.88));
                          const misc = Number(o.miscellaneous_charges || 0);
                          const prof = Number(o.net_profit !== undefined ? o.net_profit : ((sold - init) + misc));

                          return (
                            <div
                              key={o.id}
                              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-1.5">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                                      isRick
                                        ? 'bg-sky-100 text-sky-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {isRick ? '🛺 E-Rickshaw' : '🛵 Scooty'}
                                  </span>
                                  <span className="font-bold text-slate-900">
                                    {o.brand} {o.model_name}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600">
                                  Buyer: <strong className="text-slate-800">{o.customer_name}</strong> • VIN: {o.vin}
                                </div>
                              </div>

                              <div className="text-right flex items-center space-x-3">
                                <div>
                                  <div className="font-mono font-black text-slate-900 text-xs">
                                    ₹{o.total_amount.toLocaleString('en-IN')}
                                  </div>
                                  <div className="font-mono text-[10px] font-bold text-emerald-700">
                                    +₹{prof.toLocaleString('en-IN')}
                                  </div>
                                </div>
                                <Link
                                  to={`/crm/sales?tab=orders&order_id=${o.id}`}
                                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-brand-600 hover:bg-brand-50 shadow-sm"
                                  title="View Invoice & Ledger"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ALL TRANSACTIONS TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading sales transactions...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-slate-700">No sales transactions found</p>
              <p className="text-xs text-slate-500 mt-1">
                Click "Record Daily Sale" to book a vehicle with complete cost accounting.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Sale Date / Order</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Allocated Vehicle</th>
                    <th className="py-3 px-4">Initial Cost</th>
                    <th className="py-3 px-4">Sold Price</th>
                    <th className="py-3 px-4 text-sky-800">Total Invoice</th>
                    <th className="py-3 px-4 text-emerald-800">Net Profit</th>
                    <th className="py-3 px-4">Paid / Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ledger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((o) => {
                    const isRick =
                      o.vehicle_type === 'rickshaw' ||
                      o.model_name?.toLowerCase().includes('rickshaw');
                    const sold = Number(o.sold_price !== undefined ? o.sold_price : (o.total_amount || 0));
                    const init = Number(o.initial_price !== undefined ? o.initial_price : Math.round(sold * 0.88));
                    const misc = Number(o.miscellaneous_charges || 0);
                    const profit = Number(o.net_profit !== undefined ? o.net_profit : ((sold - init) + misc));
                    const marginPct = sold > 0 ? ((profit / sold) * 100).toFixed(1) : '0';

                    return (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <div className="text-slate-900">{o.booking_date}</div>
                          <div className="text-[10px] font-sans text-slate-400 font-normal">
                            {o.order_number}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isRick
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isRick ? '🛺 Rickshaw' : '🛵 Scooty'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{o.customer_name}</div>
                          <div className="text-slate-500 text-[11px]">{o.customer_phone}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">
                            {o.brand} {o.model_name}
                          </div>
                          <div className="text-slate-500 text-[11px]">{o.colour}</div>
                          <div className="font-mono text-[10px] text-slate-400">VIN: {o.vin}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          ₹{init.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          ₹{sold.toLocaleString('en-IN')}
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
      )}

      {/* Book Vehicle Modal with Exact Sale Date & Scooter/Rickshaw Support */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Record Vehicle Sale by Date</h3>
                  <p className="text-xs text-slate-500">
                    Log Scooters or E-Rickshaws sold on specific calendar days with transparent profit accounting.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookVehicle} className="mt-4 space-y-4 text-xs">
              {/* Sale Date & Vehicle Category Indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-brand-50/50 rounded-xl border border-brand-200/60">
                <div>
                  <label className="block font-bold text-brand-900 mb-1">Sale / Booking Date *</label>
                  <input
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-300 rounded-xl font-mono font-bold bg-white text-brand-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-500">Maps to daily sales ledger</span>
                </div>

                <div className="sm:col-span-2 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Detected Vehicle Category</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black uppercase shadow-sm ${
                        isRickshawSelected
                          ? 'bg-sky-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isRickshawSelected ? '🛺 Commercial E-Rickshaw (3W)' : '🛵 Personal EV Scooty (2W)'}
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      {selectedVehicleObj?.brand} {selectedVehicleObj?.model_name}
                    </span>
                  </div>
                </div>
              </div>

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
                    <span className="text-[10px] text-slate-500">Capital invested by showroom to acquire unit</span>
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
                    <span className="text-[10px] text-slate-500">Doc & handling fee (Dealer Profit)</span>
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
                  Record Daily Sale & Lock VIN
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
