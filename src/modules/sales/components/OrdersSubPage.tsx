import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import {
  Customer,
  DailySalesAggregate,
  Order,
  Vehicle,
  ComponentItem,
  OrderItem,
} from '../../../types';
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
  Trash2,
  Tag,
  Phone,
  User,
  Wrench,
  Search,
  Package,
  IndianRupee,
} from 'lucide-react';

interface OrdersSubPageProps {
  salesCategory?: 'vehicle' | 'component';
  onCategoryChange?: (category: 'vehicle' | 'component') => void;
}

export const OrdersSubPage: React.FC<OrdersSubPageProps> = ({
  salesCategory,
  onCategoryChange,
}) => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [dailySales, setDailySales] = useState<DailySalesAggregate[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'daily_timeline' | 'table'>('daily_timeline');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // ==========================================
  // POS Checkout Form State
  // ==========================================
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

  // Customer Mall Checkout Details
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

  // Cart / Invoiced Items
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  // Item Picker Mode & Selection
  const [pickerTab, setPickerTab] = useState<'vehicle' | 'component'>('vehicle');

  // Vehicle Picker Inputs
  const [pickedVehicleId, setPickedVehicleId] = useState('');
  const [vehCostPrice, setVehCostPrice] = useState<number>(0);
  const [vehMarkPrice, setVehMarkPrice] = useState<number>(0);
  const [vehSoldPrice, setVehSoldPrice] = useState<number>(0);

  // Component Picker Inputs
  const [pickedComponentId, setPickedComponentId] = useState('');
  const [compQty, setCompQty] = useState<number>(1);
  const [compCostPrice, setCompCostPrice] = useState<number>(0);
  const [compMarkPrice, setCompMarkPrice] = useState<number>(0);
  const [compSoldPrice, setCompSoldPrice] = useState<number>(0);

  // Showroom Direct Charges
  const [insuranceCharges, setInsuranceCharges] = useState('3500');
  const [rtoCharges, setRtoCharges] = useState('4500');
  const [miscCharges, setMiscCharges] = useState('1500');
  const [subsidyDiscount, setSubsidyDiscount] = useState('0');

  // Payment & Settlement
  const [bookingAmount, setBookingAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'finance' | 'lease'>('cash');
  const [financePartner, setFinancePartner] = useState('HDFC Auto Finance');
  const [loanAmount, setLoanAmount] = useState('0');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  async function loadData() {
    try {
      const [oList, dailyList, cList, vList, compList] = await Promise.all([
        api.getOrders(),
        api.getDailySalesReports(14),
        api.getCustomers(),
        api.getVehicles(),
        api.getComponents(),
      ]);
      setOrders(oList);
      setDailySales(dailyList);
      setCustomers(cList);
      setVehicles(vList);
      setComponents(compList);

      // Check if booking from an accepted quotation
      const qId = searchParams.get('quotation_id');
      if (qId) {
        const quotes = await api.getQuotations();
        const quote = quotes.find((q) => q.id === qId);
        if (quote) {
          const cust = cList.find((c) => c.id === quote.customer_id);
          if (cust) {
            setCustomerId(cust.id);
            setCustomerPhone(cust.phone);
            setCustomerName(cust.full_name);
            setCustomerEmail(cust.email || '');
            setIsExistingCustomer(true);
          }
          const v = vList.find((item) => item.id === quote.vehicle_id);
          if (v) {
            const ask = Number(quote.ex_showroom) || Number(v.asking_price) || 82000;
            const cost = Number(v.purchase_price) || Math.round(ask * 0.88);
            const isRick =
              v.model_name?.toLowerCase().includes('rickshaw') ||
              (v as any)?.body_type?.toLowerCase().includes('rickshaw');
            setCartItems([
              {
                id: 'item_' + Date.now(),
                item_type: 'vehicle',
                item_id: v.id,
                name: `${v.brand} ${v.model_name}`,
                sku_or_vin: v.vin,
                category: isRick ? 'E-Rickshaw' : 'E-Scooter',
                quantity: 1,
                initial_cost_price: cost,
                mark_price: ask,
                sold_price: ask,
                discount: 0,
                total_amount: ask,
                total_profit: ask - cost,
              },
            ]);
          }
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

  // Filter available stock strictly: vehicles must be in_stock or in_transit, not already in cart
  const availableVehicles = vehicles.filter((v) => {
    const isStatusOk = v.status === 'in_stock' || v.status === 'in_transit';
    const isNotInCart = !cartItems.some((it) => it.item_id === v.id);
    return isStatusOk && isNotInCart;
  });

  // Filter available components strictly: quantity > 0
  const availableComponents = components.filter((c) => {
    const alreadyQtyInCart =
      cartItems
        .filter((it) => it.item_id === c.id)
        .reduce((sum, it) => sum + it.quantity, 0);
    return c.quantity - alreadyQtyInCart > 0;
  });

  // When Vehicle Picker Selection Changes
  const handleSelectVehicleToPick = (vId: string) => {
    setPickedVehicleId(vId);
    const v = vehicles.find((item) => item.id === vId);
    if (v) {
      const ask = Number(v.asking_price) || 82000;
      const cost = Number(v.purchase_price) || Math.round(ask * 0.88);
      setVehCostPrice(cost);
      setVehMarkPrice(ask);
      setVehSoldPrice(ask);
    }
  };

  // When Component Picker Selection Changes
  const handleSelectComponentToPick = (cId: string) => {
    setPickedComponentId(cId);
    const c = components.find((item) => item.id === cId);
    if (c) {
      const cost = Number(c.unit_price) || 500;
      const mrp = Math.round(cost * 1.35); // standard 35% margin mark price
      setCompCostPrice(cost);
      setCompMarkPrice(mrp);
      setCompSoldPrice(mrp);
      setCompQty(1);
    }
  };

  // Customer Phone Lookup Handler
  const handlePhoneChange = (inputVal: string) => {
    setCustomerPhone(inputVal);
    const clean = inputVal.replace(/\D/g, '');
    if (clean.length >= 4) {
      const match = customers.find(
        (c) =>
          c.phone.replace(/\D/g, '') === clean ||
          c.phone.trim().toLowerCase() === inputVal.trim().toLowerCase()
      );
      if (match) {
        setCustomerId(match.id);
        setCustomerName(match.full_name);
        setCustomerEmail(match.email || '');
        setIsExistingCustomer(true);
        return;
      }
    }
    setIsExistingCustomer(false);
    setCustomerId('');
  };

  // Add Picked Vehicle to Cart
  const handleAddVehicleToCart = () => {
    if (!pickedVehicleId) return;
    const v = vehicles.find((item) => item.id === pickedVehicleId);
    if (!v) return;

    const isRick =
      v.model_name?.toLowerCase().includes('rickshaw') ||
      (v as any)?.body_type?.toLowerCase().includes('rickshaw');

    const discount = Math.max(0, vehMarkPrice - vehSoldPrice);
    const totalProfit = vehSoldPrice - vehCostPrice;

    const newItem: OrderItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      item_type: 'vehicle',
      item_id: v.id,
      name: `${v.brand} ${v.model_name}`,
      sku_or_vin: v.vin,
      category: isRick ? 'E-Rickshaw' : 'E-Scooter',
      quantity: 1,
      initial_cost_price: vehCostPrice,
      mark_price: vehMarkPrice,
      sold_price: vehSoldPrice,
      discount: discount,
      total_amount: vehSoldPrice,
      total_profit: totalProfit,
    };

    setCartItems((prev) => [...prev, newItem]);
    setPickedVehicleId('');
    setVehCostPrice(0);
    setVehMarkPrice(0);
    setVehSoldPrice(0);
  };

  // Add Picked Component to Cart
  const handleAddComponentToCart = () => {
    if (!pickedComponentId || compQty <= 0) return;
    const c = components.find((item) => item.id === pickedComponentId);
    if (!c) return;

    const discountPerUnit = Math.max(0, compMarkPrice - compSoldPrice);
    const totalProfit = (compSoldPrice - compCostPrice) * compQty;
    const totalAmount = compSoldPrice * compQty;

    const newItem: OrderItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      item_type: 'component',
      item_id: c.id,
      name: c.name,
      sku_or_vin: c.sku,
      category: c.category,
      quantity: compQty,
      initial_cost_price: compCostPrice,
      mark_price: compMarkPrice,
      sold_price: compSoldPrice,
      discount: discountPerUnit * compQty,
      total_amount: totalAmount,
      total_profit: totalProfit,
    };

    setCartItems((prev) => [...prev, newItem]);
    setPickedComponentId('');
    setCompQty(1);
    setCompCostPrice(0);
    setCompMarkPrice(0);
    setCompSoldPrice(0);
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  // Real-Time Aggregate Financial Calculations
  const hasVehicleInCart = cartItems.some((it) => it.item_type === 'vehicle');
  const cartSoldTotal = cartItems.reduce((sum, it) => sum + it.sold_price * it.quantity, 0);
  const cartCostTotal = cartItems.reduce((sum, it) => sum + it.initial_cost_price * it.quantity, 0);
  const cartDiscountTotal = cartItems.reduce((sum, it) => sum + it.discount, 0);

  const numIns = hasVehicleInCart ? parseFloat(insuranceCharges) || 0 : 0;
  const numRto = hasVehicleInCart ? parseFloat(rtoCharges) || 0 : 0;
  const numMisc = parseFloat(miscCharges) || 0;
  const numSub = hasVehicleInCart ? parseFloat(subsidyDiscount) || 0 : 0;

  // Invoiced Total = Items Sold + Insurance + RTO + Misc - Subsidy
  const computedTotalBill = Math.max(0, cartSoldTotal + numIns + numRto + numMisc - numSub);
  // Net Dealer Profit = (Items Sold - Dealer Cost) + Misc Charges
  const computedNetProfit = cartSoldTotal - cartCostTotal + numMisc;
  const computedMarginPct =
    cartSoldTotal > 0 ? ((computedNetProfit / cartSoldTotal) * 100).toFixed(1) : '0';

  const advanceVal = bookingAmount !== '' ? parseFloat(bookingAmount) || 0 : computedTotalBill;
  const computedBalanceDue = Math.max(0, computedTotalBill - advanceVal);

  // Reset Modal Form
  const resetFormState = () => {
    setCartItems([]);
    setCustomerPhone('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerId('');
    setIsExistingCustomer(false);
    setPickedVehicleId('');
    setPickedComponentId('');
    setBookingAmount('');
    setPaymentMode('cash');
    setInsuranceCharges('3500');
    setRtoCharges('4500');
    setMiscCharges('1500');
    setSubsidyDiscount('0');
  };

  // Open Modal with first available vehicle or component
  const handleOpenModal = () => {
    resetFormState();
    setPickerTab(activeCategory);
    setShowBookModal(true);
    if (activeCategory === 'vehicle' && availableVehicles.length > 0) {
      handleSelectVehicleToPick(availableVehicles[0].id);
    } else if (activeCategory === 'component' && availableComponents.length > 0) {
      handleSelectComponentToPick(availableComponents[0].id);
    }
  };

  // Submit Sale Handler
  const handleRecordSale = async (keepOpen = false) => {
    if (cartItems.length === 0) {
      alert('Cart is empty. Please select and add at least one vehicle or component from in-stock inventory.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Please enter customer mobile number.');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter customer full name.');
      return;
    }

    setSubmitting(true);
    try {
      const primaryVeh = cartItems.find((it) => it.item_type === 'vehicle');

      const created = await api.createOrder({
        customer_id: customerId || undefined,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || undefined,
        vehicle_id: primaryVeh?.item_id,
        items: cartItems,
        sale_date: saleDate,
        booking_amount: advanceVal,
        initial_price: cartCostTotal,
        sold_price: cartSoldTotal,
        insurance_charges: numIns,
        rto_charges: numRto,
        miscellaneous_charges: numMisc,
        subsidy_discount: numSub,
        payment_mode: paymentMode,
        finance_partner: paymentMode === 'finance' ? financePartner : undefined,
        loan_amount: paymentMode === 'finance' ? parseFloat(loanAmount) || 0 : undefined,
        expected_delivery: deliveryDate,
      });

      await loadData();

      if (keepOpen) {
        setSuccessToast(`✓ Sale ${created.order_number} recorded! Ready for next sale.`);
        setTimeout(() => setSuccessToast(null), 4000);
        resetFormState();
        if (availableVehicles.length > 0) {
          handleSelectVehicleToPick(availableVehicles[0].id);
        }
      } else {
        setShowBookModal(false);
        resetFormState();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to record sale. Please check inventory stock.');
    } finally {
      setSubmitting(false);
    }
  };

  const isVehicleOrder = (o: Order) => {
    if (o.items && o.items.length > 0) {
      return o.items.some((it) => it.item_type === 'vehicle');
    }
    return Boolean(o.vehicle_id || o.model_name || o.vehicle_type || !o.component_count);
  };

  const isComponentOrder = (o: Order) => {
    if (o.items && o.items.length > 0) {
      return o.items.some((it) => it.item_type === 'component');
    }
    return Boolean(o.component_count && o.component_count > 0);
  };

  const activeCategory =
    salesCategory ||
    (searchParams.get('type') === 'component' ? 'component' : 'vehicle');

  const categoryOrders = orders.filter((o) => {
    if (activeCategory === 'vehicle') return isVehicleOrder(o);
    if (activeCategory === 'component') return isComponentOrder(o);
    return true;
  });

  const filtered = categoryOrders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  // Summary Metrics
  const totalScooters = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return (
        sum +
        o.items
          .filter((it) => it.item_type === 'vehicle' && it.category === 'E-Scooter')
          .reduce((s, it) => s + it.quantity, 0)
      );
    }
    const isRick =
      o.vehicle_type === 'rickshaw' || o.model_name?.toLowerCase().includes('rickshaw');
    return sum + (isRick ? 0 : 1);
  }, 0);

  const totalRickshaws = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return (
        sum +
        o.items
          .filter((it) => it.item_type === 'vehicle' && it.category === 'E-Rickshaw')
          .reduce((s, it) => s + it.quantity, 0)
      );
    }
    const isRick =
      o.vehicle_type === 'rickshaw' || o.model_name?.toLowerCase().includes('rickshaw');
    return sum + (isRick ? 1 : 0);
  }, 0);

  const totalComponents = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return (
        sum +
        o.items
          .filter((it) => it.item_type === 'component')
          .reduce((s, it) => s + it.quantity, 0)
      );
    }
    return sum + (o.component_count || 0);
  }, 0);

  const totalBatteries = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return (
        sum +
        o.items
          .filter(
            (it) =>
              it.item_type === 'component' &&
              (it.category === 'batteries' || it.name.toLowerCase().includes('battery'))
          )
          .reduce((s, it) => s + it.quantity, 0)
      );
    }
    return sum;
  }, 0);

  const totalMotorsAndChargers = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return (
        sum +
        o.items
          .filter(
            (it) =>
              it.item_type === 'component' &&
              (it.category === 'motors' ||
                it.category === 'chargers' ||
                it.name.toLowerCase().includes('motor') ||
                it.name.toLowerCase().includes('charger'))
          )
          .reduce((s, it) => s + it.quantity, 0)
      );
    }
    return sum;
  }, 0);

  const vehicleRevenue = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      const vItems = o.items.filter((it) => it.item_type === 'vehicle');
      if (vItems.length > 0) {
        return sum + vItems.reduce((s, it) => s + it.total_amount, 0);
      }
      return sum;
    }
    if (isVehicleOrder(o)) return sum + Number(o.total_amount || 0);
    return sum;
  }, 0);

  const vehicleProfit = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      const vItems = o.items.filter((it) => it.item_type === 'vehicle');
      if (vItems.length > 0) {
        return sum + vItems.reduce((s, it) => s + it.total_profit, 0);
      }
      return sum;
    }
    if (isVehicleOrder(o)) {
      if (o.net_profit !== undefined) return sum + Number(o.net_profit);
      const sold = Number(o.sold_price || o.total_amount);
      const init = Number(o.initial_price || Math.round(sold * 0.88));
      const misc = Number(o.miscellaneous_charges || 0);
      return sum + (sold - init + misc);
    }
    return sum;
  }, 0);

  const compRevenue = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      const cItems = o.items.filter((it) => it.item_type === 'component');
      return sum + cItems.reduce((s, it) => s + it.total_amount, 0);
    }
    if (o.component_count && !o.vehicle_id) return sum + Number(o.total_amount || 0);
    return sum;
  }, 0);

  const compProfit = orders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      const cItems = o.items.filter((it) => it.item_type === 'component');
      return sum + cItems.reduce((s, it) => s + it.total_profit, 0);
    }
    if (o.component_count && !o.vehicle_id) {
      return sum + Number(o.net_profit || Math.round(Number(o.total_amount || 0) * 0.25));
    }
    return sum;
  }, 0);

  // Timeline list (sorted descending to show latest days first)
  const timelineDays = [...dailySales].reverse();
  const visibleTimelineDays = showAllDays
    ? timelineDays
    : timelineDays.filter((d) => d.total_units > 0 || timelineDays.indexOf(d) < 7);

  return (
    <div className="space-y-6">
      {/* Top Action Bar with View Toggle and New Retail Sale Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('daily_timeline')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'daily_timeline'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Timeline</span>
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
            <span>Transactions Table</span>
          </button>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm transition-all cursor-pointer ml-auto sm:ml-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Retail Sale</span>
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {activeCategory === 'vehicle' ? (
          <>
            {/* Card 1: Scooties */}
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>Scooties (2W)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalScooters} Units</div>
            </div>

            {/* Card 2: Rickshaws */}
            <div className="p-3.5 bg-white rounded-2xl border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-sky-800">
                <span>Rickshaws (3W)</span>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalRickshaws} Units</div>
            </div>

            {/* Card 3: Total Vehicles */}
            <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-800">
                <span>Total Vehicles</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalScooters + totalRickshaws} Units</div>
            </div>

            {/* Card 4: Revenue */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Revenue (₹)</span>
                <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-sky-800 mt-1">
                ₹{vehicleRevenue.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Card 5: Profit */}
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Profit (₹)</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                +₹{vehicleProfit.toLocaleString('en-IN')}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Card 1: Batteries */}
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>Batteries</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalBatteries} Units</div>
            </div>

            {/* Card 2: Motors & Chargers */}
            <div className="p-3.5 bg-white rounded-2xl border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-sky-800">
                <span>Motors & Chargers</span>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalMotorsAndChargers} Units</div>
            </div>

            {/* Card 3: Total Spares */}
            <div className="p-3.5 bg-white rounded-2xl border border-purple-100 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-purple-800">
                <span>Total Spares</span>
                <span className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalComponents} Pcs</div>
            </div>

            {/* Card 4: Revenue */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Revenue (₹)</span>
                <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-sky-800 mt-1">
                ₹{compRevenue.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Card 5: Profit */}
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Profit (₹)</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                +₹{compProfit.toLocaleString('en-IN')}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Tabs for Status */}
      <div className="flex items-center space-x-1.5 overflow-x-auto text-xs bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Status:</span>
        {['all', 'booked', 'payment_pending', 'ready_for_delivery', 'delivered'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === st ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
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
                const dayOrders = day.orders.filter((o) =>
                  activeCategory === 'vehicle' ? isVehicleOrder(o) : isComponentOrder(o)
                );
                const dayUnits = dayOrders.reduce((sum, o) => {
                  if (activeCategory === 'vehicle') {
                    if (o.items && o.items.length > 0) {
                      return (
                        sum +
                        o.items
                          .filter((it) => it.item_type === 'vehicle')
                          .reduce((s, it) => s + it.quantity, 0)
                      );
                    }
                    return sum + 1;
                  } else {
                    if (o.items && o.items.length > 0) {
                      return (
                        sum +
                        o.items
                          .filter((it) => it.item_type === 'component')
                          .reduce((s, it) => s + it.quantity, 0)
                      );
                    }
                    return sum + (o.component_count || 1);
                  }
                }, 0);
                const dayRevenue = dayOrders.reduce((sum, o) => {
                  if (activeCategory === 'vehicle') {
                    if (o.items && o.items.length > 0) {
                      const vItems = o.items.filter((it) => it.item_type === 'vehicle');
                      return sum + vItems.reduce((s, it) => s + it.total_amount, 0);
                    }
                    return sum + Number(o.total_amount || 0);
                  } else {
                    if (o.items && o.items.length > 0) {
                      const cItems = o.items.filter((it) => it.item_type === 'component');
                      return sum + cItems.reduce((s, it) => s + it.total_amount, 0);
                    }
                    return sum + Number(o.total_amount || 0);
                  }
                }, 0);
                const dayProfit = dayOrders.reduce((sum, o) => {
                  if (activeCategory === 'vehicle') {
                    if (o.items && o.items.length > 0) {
                      const vItems = o.items.filter((it) => it.item_type === 'vehicle');
                      return sum + vItems.reduce((s, it) => s + it.total_profit, 0);
                    }
                    if (o.net_profit !== undefined) return sum + Number(o.net_profit);
                    const sold = Number(o.sold_price || o.total_amount);
                    const init = Number(o.initial_price || Math.round(sold * 0.88));
                    return sum + (sold - init);
                  } else {
                    if (o.items && o.items.length > 0) {
                      const cItems = o.items.filter((it) => it.item_type === 'component');
                      return sum + cItems.reduce((s, it) => s + it.total_profit, 0);
                    }
                    return sum + Number(o.net_profit || 0);
                  }
                }, 0);
                const hasSales = dayUnits > 0;
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
                                {dayUnits} {dayUnits === 1 ? 'sale' : 'sales'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                                0 sales
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {hasSales ? (
                              <span>
                                {activeCategory === 'vehicle'
                                  ? `${day.scooter_units} Scooties • ${day.rickshaw_units} E-Rickshaws`
                                  : `${dayUnits} Components & Spares`}
                              </span>
                            ) : (
                              <span>No {activeCategory} sales on this date</span>
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
                              ₹{dayRevenue.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Net Profit</span>
                            <div className="font-mono font-black text-emerald-700 text-sm">
                              +₹{dayProfit.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Margin</span>
                            <div className="font-bold text-xs text-slate-700">
                              {dayRevenue > 0 ? ((dayProfit / dayRevenue) * 100).toFixed(1) : 0}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Customer Sales on this Day */}
                    {hasSales && dayOrders.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {dayOrders.map((o) => {
                          const isRick =
                            o.vehicle_type === 'rickshaw' ||
                            o.model_name?.toLowerCase().includes('rickshaw');
                          const sold = Number(o.sold_price !== undefined ? o.sold_price : (o.total_amount || 0));
                          const init = Number(o.initial_price !== undefined ? o.initial_price : Math.round(sold * 0.88));
                          const misc = Number(o.miscellaneous_charges || 0);
                          const prof = Number(o.net_profit !== undefined ? o.net_profit : (sold - init + misc));
                          const margin = sold > 0 ? ((prof / sold) * 100).toFixed(1) : '0';

                          return (
                            <div
                              key={o.id}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-brand-200 transition-all text-xs"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center space-x-1.5">
                                    <span className="font-bold text-slate-900">{o.customer_name}</span>
                                    <span className="text-[10px] text-slate-400">({o.customer_phone})</span>
                                  </div>
                                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                                    {o.order_number}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="font-mono font-black text-emerald-700 text-xs">
                                    +₹{prof.toLocaleString('en-IN')}
                                  </div>
                                  <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                    {margin}% profit
                                  </span>
                                </div>
                              </div>

                              {/* Multi-Item Breakdown Pills */}
                              <div className="mt-2 flex flex-wrap gap-1">
                                {o.items && o.items.length > 0 ? (
                                  o.items.map((it) => (
                                    <span
                                      key={it.id}
                                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                        it.item_type === 'vehicle'
                                          ? it.category === 'E-Rickshaw'
                                            ? 'bg-sky-100 text-sky-800'
                                            : 'bg-emerald-100 text-emerald-800'
                                          : 'bg-purple-100 text-purple-800'
                                      }`}
                                    >
                                      {it.quantity}x {it.name}
                                    </span>
                                  ))
                                ) : (
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                      isRick
                                        ? 'bg-sky-100 text-sky-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    1x {o.brand} {o.model_name}
                                  </span>
                                )}
                              </div>

                              {/* Card Footer Financial Summary */}
                              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                                <div>
                                  <span className="text-slate-400">Total Bill: </span>
                                  <span className="font-mono font-bold text-slate-800">
                                    ₹{o.total_amount.toLocaleString('en-IN')}
                                  </span>
                                  {o.balance_due > 0 ? (
                                    <span className="ml-2 font-bold text-sky-700">
                                      (₹{o.balance_due.toLocaleString('en-IN')} due)
                                    </span>
                                  ) : (
                                    <span className="ml-2 font-semibold text-emerald-600">✓ Settled</span>
                                  )}
                                </div>

                                <Link
                                  to={`/crm/sales?tab=orders&order_id=${o.id}`}
                                  className="text-brand-600 hover:text-brand-800 font-bold text-[10px] flex items-center"
                                >
                                  <span>View Ledger</span>
                                  <Eye className="w-3 h-3 ml-1" />
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
                Click "New Retail Sale" to record a sale with complete cost accounting.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Date / Order</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Purchased Items</th>
                    <th className="py-3 px-4">Dealer Cost</th>
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
                    const sold = Number(o.sold_price !== undefined ? o.sold_price : (o.total_amount || 0));
                    const init = Number(o.initial_price !== undefined ? o.initial_price : Math.round(sold * 0.88));
                    const misc = Number(o.miscellaneous_charges || 0);
                    const profit = Number(o.net_profit !== undefined ? o.net_profit : (sold - init + misc));
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
                          <div className="font-bold text-slate-900">{o.customer_name}</div>
                          <div className="text-slate-500 text-[11px]">{o.customer_phone}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 max-w-[200px]">
                            {o.items && o.items.length > 0 ? (
                              o.items.map((it) => (
                                <div key={it.id} className="text-[11px] text-slate-700 truncate">
                                  <span className="font-bold text-slate-900">{it.quantity}x</span> {it.name}
                                </div>
                              ))
                            ) : (
                              <div className="text-[11px] text-slate-800 font-medium">
                                {o.brand} {o.model_name}
                              </div>
                            )}
                          </div>
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

      {/* ========================================================================= */}
      {/* SHOWROOM POS RETAIL CHECKOUT MODAL (Mall Counter Customer Sale Experience) */}
      {/* ========================================================================= */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 my-6 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Showroom POS Retail Checkout
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Mall-style counter sale: lookup customer by mobile, pick available in-stock inventory, apply bargained price & auto-calculate dealer profit.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toast Notification if Logging Multiple Sales */}
            {successToast && (
              <div className="mt-3 p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successToast}</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">
              {/* SECTION 1: MALL CUSTOMER LOOKUP & REGISTRATION */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-slate-800">
                    <User className="w-4 h-4 text-brand-600" />
                    <span>Customer Details (Counter Lookup)</span>
                  </div>
                  {isExistingCustomer ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Existing Customer Found
                    </span>
                  ) : customerPhone.length >= 4 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                      + New Customer (Auto-registers)
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Customer Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">Type phone to instant auto-fill</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sale Date *</label>
                    <input
                      type="date"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      required
                    />
                    <span className="text-[10px] text-slate-400">Maps to day-wise sales timeline</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: INVENTORY ITEM PICKER (STRICTLY IN-STOCK ONLY) */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-brand-600" />
                    <span className="font-bold text-slate-900">Select Available Inventory</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-[11px]">
                    <button
                      type="button"
                      onClick={() => setPickerTab('vehicle')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        pickerTab === 'vehicle'
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Vehicles ({availableVehicles.length} in stock)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickerTab('component')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        pickerTab === 'component'
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Components & Spares ({availableComponents.length} in stock)
                    </button>
                  </div>
                </div>

                {/* TAB 1: VEHICLES IN STOCK */}
                {pickerTab === 'vehicle' && (
                  <div className="space-y-3">
                    {availableVehicles.length === 0 ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-center font-medium">
                        ⚠️ No vehicles available in physical inventory! Please procure vehicles in the Inventory tab first.
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-slate-700 mb-1">
                              Select Physical Vehicle by VIN *
                            </label>
                            <select
                              value={pickedVehicleId}
                              onChange={(e) => handleSelectVehicleToPick(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            >
                              <option value="">-- Choose in-stock vehicle to sell --</option>
                              {availableVehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.brand} {v.model_name} ({v.colour}) — VIN: {v.vin} [Cost: ₹{v.purchase_price} | MRP: ₹{v.asking_price}]
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {pickedVehicleId && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                            <div>
                              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                                Dealer Initial Cost
                              </span>
                              <div className="font-mono font-bold text-slate-700 text-sm mt-0.5">
                                ₹{vehCostPrice.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] text-slate-400">Capital invested</span>
                            </div>

                            <div>
                              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                                Showroom MRP
                              </span>
                              <div className="font-mono font-bold text-slate-700 text-sm mt-0.5">
                                ₹{vehMarkPrice.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] text-slate-400">Mark price</span>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-brand-900 uppercase mb-0.5">
                                Agreed Sold Price (₹) *
                              </label>
                              <input
                                type="number"
                                value={vehSoldPrice}
                                onChange={(e) => setVehSoldPrice(Number(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 border border-brand-300 rounded-lg font-mono font-bold text-slate-900 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-500">
                                {vehMarkPrice > vehSoldPrice
                                  ? `Bargained Discount: -₹${(vehMarkPrice - vehSoldPrice).toLocaleString('en-IN')}`
                                  : 'Full price'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddVehicleToCart}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-1 cursor-pointer transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Vehicle to Sale</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* TAB 2: COMPONENTS & SPARES IN STOCK */}
                {pickerTab === 'component' && (
                  <div className="space-y-3">
                    {availableComponents.length === 0 ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-center font-medium">
                        ⚠️ No components or spares with positive stock! Please procure components in the Inventory tab first.
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-slate-700 mb-1">
                              Select In-Stock Component / Spare *
                            </label>
                            <select
                              value={pickedComponentId}
                              onChange={(e) => handleSelectComponentToPick(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            >
                              <option value="">-- Choose in-stock spare/accessory to sell --</option>
                              {availableComponents.map((c) => {
                                const inCart = cartItems
                                  .filter((it) => it.item_id === c.id)
                                  .reduce((s, it) => s + it.quantity, 0);
                                const left = c.quantity - inCart;
                                return (
                                  <option key={c.id} value={c.id}>
                                    {c.name} ({c.category}) — SKU: {c.sku} [Available: {left} pcs | Unit Cost: ₹{c.unit_price}]
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Quantity to Sell *</label>
                            <input
                              type="number"
                              min="1"
                              max={
                                components.find((c) => c.id === pickedComponentId)?.quantity || 1
                              }
                              value={compQty}
                              onChange={(e) => setCompQty(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-400">Max capped at stock</span>
                          </div>
                        </div>

                        {pickedComponentId && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                            <div>
                              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                                Unit Initial Cost
                              </span>
                              <div className="font-mono font-bold text-slate-700 text-sm mt-0.5">
                                ₹{compCostPrice.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] text-slate-400">Total: ₹{(compCostPrice * compQty).toLocaleString('en-IN')}</span>
                            </div>

                            <div>
                              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                                Suggested MRP
                              </span>
                              <div className="font-mono font-bold text-slate-700 text-sm mt-0.5">
                                ₹{compMarkPrice.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] text-slate-400">Mark price</span>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-brand-900 uppercase mb-0.5">
                                Sold Price / Unit (₹) *
                              </label>
                              <input
                                type="number"
                                value={compSoldPrice}
                                onChange={(e) => setCompSoldPrice(Number(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 border border-brand-300 rounded-lg font-mono font-bold text-slate-900 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-500">
                                Profit: +₹{((compSoldPrice - compCostPrice) * compQty).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddComponentToCart}
                              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-1 cursor-pointer transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Spare to Sale</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 3: CURRENT CUSTOMER BILL ITEMS (CART) */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between font-bold text-slate-800">
                  <div className="flex items-center space-x-2">
                    <Receipt className="w-4 h-4 text-brand-600" />
                    <span>Customer Bill Items ({cartItems.length})</span>
                  </div>
                  {cartItems.length > 0 && (
                    <span className="text-[11px] font-extrabold text-brand-700">
                      Total Items: ₹{cartSoldTotal.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
                    <p className="font-semibold text-slate-600 text-xs">No items added to this sale yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Select in-stock vehicles or components above to build the customer's purchase.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                          <th className="py-2 px-3">Item Description</th>
                          <th className="py-2 px-3 text-center">Qty</th>
                          <th className="py-2 px-3 text-right">Dealer Cost</th>
                          <th className="py-2 px-3 text-right">MRP</th>
                          <th className="py-2 px-3 text-right">Sold Price</th>
                          <th className="py-2 px-3 text-right">Subtotal</th>
                          <th className="py-2 px-3 text-right text-emerald-700">Dealer Profit</th>
                          <th className="py-2 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cartItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900">{item.name}</div>
                              <div className="font-mono text-[10px] text-slate-400">
                                {item.item_type === 'vehicle' ? `VIN: ${item.sku_or_vin}` : `SKU: ${item.sku_or_vin}`}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                              ₹{(item.initial_cost_price * item.quantity).toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                              ₹{(item.mark_price * item.quantity).toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                              ₹{(item.sold_price * item.quantity).toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-sky-800">
                              ₹{item.total_amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-700">
                              +₹{item.total_profit.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveCartItem(item.id)}
                                className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION 4: SHOWROOM CHARGES & PASS-THROUGHS (INSURANCE, RTO, MISC) */}
              {hasVehicleInCart && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    <span>Vehicle Showroom Charges & Direct Fees</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Insurance Charges (₹)
                      </label>
                      <input
                        type="number"
                        value={insuranceCharges}
                        onChange={(e) => setInsuranceCharges(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">5-Yr comprehensive</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        RTO & Reg Charges (₹)
                      </label>
                      <input
                        type="number"
                        value={rtoCharges}
                        onChange={(e) => setRtoCharges(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Road tax & HSRP</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Misc / Doc Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={miscCharges}
                        onChange={(e) => setMiscCharges(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Dealer profit addition</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        EV Subsidy Discount (₹)
                      </label>
                      <input
                        type="number"
                        value={subsidyDiscount}
                        onChange={(e) => setSubsidyDiscount(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Direct incentive deduct</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: LIVE FINANCIAL SUMMARY CARD */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                  <span className="font-bold text-emerald-900 text-xs">Live Financial Breakdown</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-200 text-emerald-800 uppercase">
                    Auto-Calculated
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 text-center">
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Total Customer Bill</div>
                    <div className="text-base font-black text-sky-800 mt-0.5">
                      ₹{computedTotalBill.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Dealer Cost Outlay</div>
                    <div className="text-base font-black text-slate-700 mt-0.5">
                      ₹{cartCostTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Bargain Discount</div>
                    <div className="text-base font-black text-amber-700 mt-0.5">
                      -₹{cartDiscountTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Net Dealer Profit</div>
                    <div className="text-base font-black text-emerald-700 mt-0.5">
                      +₹{computedNetProfit.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Net Margin %</div>
                    <div className="text-base font-black text-emerald-700 mt-0.5">
                      {computedMarginPct}%
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: PAYMENT SETTLEMENT */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Received Today (₹) *</label>
                  <input
                    type="number"
                    value={bookingAmount !== '' ? bookingAmount : computedTotalBill}
                    onChange={(e) => setBookingAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">
                    Balance due: ₹{computedBalanceDue.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="cash">Direct Cash / Full NEFT / UPI</option>
                    <option value="finance">Bank EV Loan (EMI)</option>
                    <option value="lease">Corporate Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Delivery</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-500">
                <span>Inventory items will be deducted immediately upon recording.</span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={submitting || cartItems.length === 0}
                  onClick={() => handleRecordSale(true)}
                  className="px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Record & Log Another Sale
                </button>

                <button
                  type="button"
                  disabled={submitting || cartItems.length === 0}
                  onClick={() => handleRecordSale(false)}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Record Sale & Settle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSubPage;
