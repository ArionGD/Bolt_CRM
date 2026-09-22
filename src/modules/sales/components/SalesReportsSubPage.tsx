import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { DailySalesAggregate, MonthlySalesAggregate, Order } from '../../../types';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Clock,
  Car,
} from 'lucide-react';

export const SalesReportsSubPage: React.FC = () => {
  const [monthlyReports, setMonthlyReports] = useState<MonthlySalesAggregate[]>([]);
  const [dailyReports, setDailyReports] = useState<DailySalesAggregate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodMode, setPeriodMode] = useState<'daily' | 'monthly'>('daily');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [mData, dData, orderList] = await Promise.all([
        api.getMonthlySalesReports(),
        api.getDailySalesReports(14),
        api.getOrders(),
      ]);
      setMonthlyReports(mData);
      setDailyReports(dData);
      setOrders(orderList);
    } catch (err) {
      console.error('Failed to load sales reports', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Compute Overall Totals
  const totalRevenue = monthlyReports.reduce((sum, r) => sum + r.total_revenue, 0);
  const totalProfit = monthlyReports.reduce((sum, r) => sum + r.total_profit, 0);
  const totalInitialCost = monthlyReports.reduce((sum, r) => sum + r.total_initial_cost, 0);
  const totalInsurance = monthlyReports.reduce((sum, r) => sum + r.total_insurance, 0);
  const totalRto = monthlyReports.reduce((sum, r) => sum + r.total_rto, 0);
  const totalMisc = monthlyReports.reduce((sum, r) => sum + r.total_misc, 0);
  const totalUnits = monthlyReports.reduce((sum, r) => sum + r.units_sold, 0);
  const overallMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Compute Category Specific (Scooters vs Rickshaws)
  const activeOrders = orders.filter((o) => o.status !== 'cancelled');
  const scooterOrders = activeOrders.filter(
    (o) => o.vehicle_type === 'scooter' || !o.model_name?.toLowerCase().includes('rickshaw')
  );
  const rickshawOrders = activeOrders.filter(
    (o) => o.vehicle_type === 'rickshaw' || o.model_name?.toLowerCase().includes('rickshaw')
  );

  const scooterRevenue = scooterOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const scooterInitial = scooterOrders.reduce(
    (s, o) => s + Number(o.initial_price || Math.round((o.sold_price || o.total_amount) * 0.88)),
    0
  );
  const scooterProfit = scooterOrders.reduce(
    (s, o) =>
      s +
      Number(
        o.net_profit !== undefined
          ? o.net_profit
          : (Number(o.sold_price || o.total_amount) - Number(o.initial_price || 0)) +
              Number(o.miscellaneous_charges || 0)
      ),
    0
  );
  const scooterMargin = scooterRevenue > 0 ? ((scooterProfit / scooterRevenue) * 100).toFixed(1) : '0';

  const rickshawRevenue = rickshawOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const rickshawInitial = rickshawOrders.reduce(
    (s, o) => s + Number(o.initial_price || Math.round((o.sold_price || o.total_amount) * 0.88)),
    0
  );
  const rickshawProfit = rickshawOrders.reduce(
    (s, o) =>
      s +
      Number(
        o.net_profit !== undefined
          ? o.net_profit
          : (Number(o.sold_price || o.total_amount) - Number(o.initial_price || 0)) +
              Number(o.miscellaneous_charges || 0)
      ),
    0
  );
  const rickshawMargin = rickshawRevenue > 0 ? ((rickshawProfit / rickshawRevenue) * 100).toFixed(1) : '0';

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Chart data configuration (Daily vs Monthly)
  interface ChartPoint {
    label: string;
    subLabel: string;
    total_revenue: number;
    total_profit: number;
    units_sold: number;
    scooter_units: number;
    rickshaw_units: number;
    margin_pct: number;
    rawDate: string;
  }

  const chartData: ChartPoint[] =
    periodMode === 'daily'
      ? dailyReports.map((d) => ({
          label: d.day_of_week,
          subLabel: d.date.slice(5), // MM-DD
          total_revenue: d.total_revenue,
          total_profit: d.total_profit,
          units_sold: d.total_units,
          scooter_units: d.scooter_units,
          rickshaw_units: d.rickshaw_units,
          margin_pct: d.margin_pct,
          rawDate: d.date_label,
        }))
      : monthlyReports.map((m) => ({
          label: m.month_label,
          subLabel: '',
          total_revenue: m.total_revenue,
          total_profit: m.total_profit,
          units_sold: m.units_sold,
          scooter_units: m.scooter_units || 0,
          rickshaw_units: m.rickshaw_units || 0,
          margin_pct: m.margin_pct,
          rawDate: m.month_label,
        }));

  const svgWidth = 840;
  const svgHeight = 280;
  const paddingLeft = 65;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.total_revenue, d.total_profit)),
    50000 // default minimum scale
  );

  const getX = (idx: number) => {
    if (chartData.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (idx / (chartData.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / (maxVal || 1)) * chartHeight;
  };

  const revenuePoints = chartData.map((d, i) => ({ x: getX(i), y: getY(d.total_revenue), data: d }));
  const profitPoints = chartData.map((d, i) => ({ x: getX(i), y: getY(d.total_profit), data: d }));

  const revenuePath = revenuePoints.length > 0
    ? revenuePoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '')
    : '';

  const profitPath = profitPoints.length > 0
    ? profitPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '')
    : '';

  const revenueArea = revenuePoints.length > 0
    ? `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x},${paddingTop + chartHeight} L ${revenuePoints[0].x},${paddingTop + chartHeight} Z`
    : '';

  const profitArea = profitPoints.length > 0
    ? `${profitPath} L ${profitPoints[profitPoints.length - 1].x},${paddingTop + chartHeight} L ${profitPoints[0].x},${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Sales Analytics & Performance Reports
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              Revenue & Profit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track day-by-day continuous sales velocity, zero-sale days, and vehicle category profitability.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Period Mode Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setPeriodMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodMode === 'daily'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day-by-Day (14 Days)
            </button>
            <button
              onClick={() => setPeriodMode('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodMode === 'monthly'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Aggregates
            </button>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin text-brand-600' : 'text-slate-400'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue (Blue) */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-sky-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>{totalUnits} Units Sold Across Orders</span>
            </div>
          </div>
        </div>

        {/* Card 2: Net Profit Made (Green) */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Net Dealer Profit</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700">₹{totalProfit.toLocaleString('en-IN')}</div>
            <div className="flex items-center space-x-1.5 mt-1 text-xs text-emerald-800 font-semibold">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                {overallMargin}% margin
              </span>
              <span>(Sold - Initial Cost) + Misc</span>
            </div>
          </div>
        </div>

        {/* Card 3: Initial Invested Outlay */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Invested Acquisition Cost</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">₹{totalInitialCost.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Dealer purchase outlay for sold inventory
            </div>
          </div>
        </div>

        {/* Card 4: Pass-Through Fees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Insurance, RTO & Misc</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              ₹{(totalInsurance + totalRto + totalMisc).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Ins: ₹{totalInsurance.toLocaleString('en-IN')}</span>
              <span>RTO: ₹{totalRto.toLocaleString('en-IN')}</span>
              <span>Misc: ₹{totalMisc.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Category Performance Split: Scooters vs Rickshaws */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scooters (2W) Card */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🛵</span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Personal EV Scooties (2W)</h3>
                <p className="text-[11px] text-slate-500">Scooty Model 1, Model 2, Model Pro</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {scooterOrders.length} Units Sold
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Invested Cost</div>
              <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                ₹{scooterInitial.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2 bg-sky-50 rounded-xl">
              <div className="text-[10px] text-sky-800 font-bold uppercase">Revenue</div>
              <div className="font-mono font-black text-sky-900 text-xs mt-0.5">
                ₹{scooterRevenue.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <div className="text-[10px] text-emerald-800 font-bold uppercase">Net Profit</div>
              <div className="font-mono font-black text-emerald-800 text-xs mt-0.5">
                +₹{scooterProfit.toLocaleString('en-IN')} ({scooterMargin}%)
              </div>
            </div>
          </div>
        </div>

        {/* E-Rickshaws (3W) Card */}
        <div className="bg-white p-5 rounded-2xl border border-sky-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🛺</span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Commercial E-Rickshaws (3W)</h3>
                <p className="text-[11px] text-slate-500">5-Seater Passenger L5M</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              {rickshawOrders.length} Units Sold
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Invested Cost</div>
              <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                ₹{rickshawInitial.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2 bg-sky-50 rounded-xl">
              <div className="text-[10px] text-sky-800 font-bold uppercase">Revenue</div>
              <div className="font-mono font-black text-sky-900 text-xs mt-0.5">
                ₹{rickshawRevenue.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <div className="text-[10px] text-emerald-800 font-bold uppercase">Net Profit</div>
              <div className="font-mono font-black text-emerald-800 text-xs mt-0.5">
                +₹{rickshawProfit.toLocaleString('en-IN')} ({rickshawMargin}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 2-Line Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">
                {periodMode === 'daily' ? 'Day-by-Day Daily Sales Trajectory' : 'Month-Wise Performance Trend'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {periodMode === 'daily' ? '14-Day Continuous Mapping' : 'Monthly Performance'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {periodMode === 'daily'
                ? 'Maps daily spikes, continuous sales sequences, and zero-sale dry days.'
                : 'Aggregated monthly performance across billing cycles.'}
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center space-x-5 text-xs font-bold select-none">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-sky-500 shadow-sm shadow-sky-500/30" />
              <span className="text-slate-700">Total Revenue (Blue Line)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-sm shadow-emerald-500/30" />
              <span className="text-slate-700">Net Profit (Green Line)</span>
            </div>
          </div>
        </div>

        {/* SVG Responsive Line Chart */}
        {chartData.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-brand-600" />
            <p className="text-sm font-semibold text-slate-700">No Sales Records Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Record sales in the Sales Tracker tab to populate this day-by-day revenue and profit trajectory.
            </p>
          </div>
        ) : (
          <div className="relative mt-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y-Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingTop + chartHeight - ratio * chartHeight;
                const val = ratio * maxVal;
                return (
                  <g key={i}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray={ratio === 0 ? '0' : '4 4'}
                    />
                    <text
                      x={paddingLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 font-mono font-medium"
                    >
                      {formatCurrency(val)}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area Fills */}
              {revenueArea && <path d={revenueArea} fill="url(#revenueGrad)" />}
              {profitArea && <path d={profitArea} fill="url(#profitGrad)" />}

              {/* 1. BLUE LINE: Total Revenue */}
              {revenuePath && (
                <path
                  d={revenuePath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="filter drop-shadow-sm"
                />
              )}

              {/* 2. GREEN LINE: Net Profit */}
              {profitPath && (
                <path
                  d={profitPath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="filter drop-shadow-sm"
                />
              )}

              {/* Data Points on Revenue Line */}
              {revenuePoints.map((p, i) => (
                <g key={`rev-dot-${i}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.data.units_sold > 0 ? 5.5 : 3.5}
                    fill={p.data.units_sold > 0 ? '#0284c7' : '#94a3b8'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={() => setHoveredPoint(p.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}

              {/* Data Points on Profit Line */}
              {profitPoints.map((p, i) => (
                <g key={`profit-dot-${i}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.data.units_sold > 0 ? 5.5 : 3.5}
                    fill={p.data.units_sold > 0 ? '#10b981' : '#94a3b8'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={() => setHoveredPoint(p.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}

              {/* X-Axis Labels */}
              {chartData.map((d, i) => {
                const x = getX(i);
                return (
                  <g key={`label-${i}`}>
                    <text
                      x={x}
                      y={paddingTop + chartHeight + 18}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-600 font-bold"
                    >
                      {d.label}
                    </text>
                    {d.subLabel && (
                      <text
                        x={x}
                        y={paddingTop + chartHeight + 30}
                        textAnchor="middle"
                        className="text-[9px] fill-slate-400 font-mono"
                      >
                        {d.subLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-sm z-20 pointer-events-none animate-fadeIn">
                <div className="font-extrabold text-sm border-b border-slate-700 pb-1.5 mb-2 flex items-center justify-between">
                  <span>{hoveredPoint.rawDate}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      hoveredPoint.units_sold > 0
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {hoveredPoint.units_sold > 0
                      ? `${hoveredPoint.units_sold} units sold`
                      : '0 sales'}
                  </span>
                </div>
                <div className="space-y-1.5 font-sans">
                  {hoveredPoint.units_sold > 0 && (
                    <div className="text-[11px] text-slate-300 pb-1 border-b border-slate-800 flex justify-between">
                      <span>Breakdown:</span>
                      <span className="font-bold">
                        🛵 {hoveredPoint.scooter_units} Scooties • 🛺 {hoveredPoint.rickshaw_units} Rickshaws
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center text-sky-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-sky-400 mr-1.5" />
                      Revenue:
                    </span>
                    <span className="font-mono font-bold text-white">
                      ₹{hoveredPoint.total_revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
                      Net Profit:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{hoveredPoint.total_profit.toLocaleString('en-IN')} ({hoveredPoint.margin_pct}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accounting Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              {periodMode === 'daily' ? 'Day-Wise Performance Ledger' : 'Monthly Financial Ledger'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous accounting mapping of sold inventory, revenue, and net margin.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {periodMode === 'daily' ? `${dailyReports.length} Days Tracked` : `${monthlyReports.length} Months Tracked`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">{periodMode === 'daily' ? 'Sale Date' : 'Billing Month'}</th>
                <th className="py-3 px-4 text-center">Units Sold</th>
                <th className="py-3 px-4 text-center">🛵 Scooties</th>
                <th className="py-3 px-4 text-center">🛺 Rickshaws</th>
                <th className="py-3 px-4">Invested Cost</th>
                <th className="py-3 px-4 text-sky-800">Total Revenue (Blue)</th>
                <th className="py-3 px-4 text-emerald-800">Net Profit (Green)</th>
                <th className="py-3 px-4 text-right">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periodMode === 'daily'
                ? dailyReports.map((d) => (
                    <tr
                      key={d.date}
                      className={`transition-colors ${
                        d.total_units > 0 ? 'hover:bg-slate-50/80' : 'bg-slate-50/40 text-slate-400'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {d.date_label} <span className="text-[11px] text-slate-400 font-normal">({d.day_of_week})</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            d.total_units > 0
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-slate-100 text-slate-400 font-normal'
                          }`}
                        >
                          {d.total_units}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {d.scooter_units}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {d.rickshaw_units}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        ₹{d.total_initial_cost.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-sky-700 text-sm">
                        ₹{d.total_revenue.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700 text-sm">
                        +₹{d.total_profit.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold ${
                            d.total_units > 0
                              ? d.margin_pct >= 10
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {d.margin_pct}%
                        </span>
                      </td>
                    </tr>
                  ))
                : monthlyReports.map((r) => (
                    <tr key={r.month_key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{r.month_label}</td>
                      <td className="py-3.5 px-4 text-center font-bold">{r.units_sold}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">{r.scooter_units || 0}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">{r.rickshaw_units || 0}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        ₹{r.total_initial_cost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-sky-700 text-sm">
                        ₹{r.total_revenue.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700 text-sm">
                        +₹{r.total_profit.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {r.margin_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReportsSubPage;
