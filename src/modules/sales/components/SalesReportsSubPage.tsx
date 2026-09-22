import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { MonthlySalesAggregate, Order } from '../../../types';
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
} from 'lucide-react';

export const SalesReportsSubPage: React.FC = () => {
  const [reports, setReports] = useState<MonthlySalesAggregate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMonth, setHoveredMonth] = useState<MonthlySalesAggregate | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [data, orderList] = await Promise.all([
        api.getMonthlySalesReports(),
        api.getOrders(),
      ]);
      setReports(data);
      setOrders(orderList);
    } catch (err) {
      console.error('Failed to load monthly sales reports', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Compute Overall Totals
  const totalRevenue = reports.reduce((sum, r) => sum + r.total_revenue, 0);
  const totalProfit = reports.reduce((sum, r) => sum + r.total_profit, 0);
  const totalInitialCost = reports.reduce((sum, r) => sum + r.total_initial_cost, 0);
  const totalInsurance = reports.reduce((sum, r) => sum + r.total_insurance, 0);
  const totalRto = reports.reduce((sum, r) => sum + r.total_rto, 0);
  const totalMisc = reports.reduce((sum, r) => sum + r.total_misc, 0);
  const totalUnits = reports.reduce((sum, r) => sum + r.units_sold, 0);
  const overallMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // 2-Line Chart SVG Generation (Blue for Revenue, Green for Profit)
  // Ensure we have at least month data points or an empty month placeholder
  const chartData: MonthlySalesAggregate[] = reports.length > 0 ? reports : [];

  const svgWidth = 800;
  const svgHeight = 280;
  const paddingLeft = 65;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.total_revenue, d.total_profit)),
    100000 // default minimum scale
  );

  const getX = (idx: number) => {
    if (chartData.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (idx / (chartData.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / (maxVal || 1)) * chartHeight;
  };

  // Build SVG Path strings
  const revenuePoints = chartData.map((d, i) => ({ x: getX(i), y: getY(d.total_revenue), data: d }));
  const profitPoints = chartData.map((d, i) => ({ x: getX(i), y: getY(d.total_profit), data: d }));

  const revenuePath = revenuePoints.length > 0
    ? revenuePoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '')
    : '';

  const profitPath = profitPoints.length > 0
    ? profitPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '')
    : '';

  // Area under Revenue
  const revenueArea = revenuePoints.length > 0
    ? `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x},${paddingTop + chartHeight} L ${revenuePoints[0].x},${paddingTop + chartHeight} Z`
    : '';

  // Area under Profit
  const profitArea = profitPoints.length > 0
    ? `${profitPath} L ${profitPoints[profitPoints.length - 1].x},${paddingTop + chartHeight} L ${profitPoints[0].x},${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Sales Reports & Financials</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              Month-Wise Tracker
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monthly revenue vs dealer net profit tracking with transparent Insurance, RTO, and cost calculations.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin text-brand-600' : 'text-slate-400'}`} />
          <span>Refresh Reports</span>
        </button>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue (Blue) */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-full -mr-8 -mt-8 opacity-60 group-hover:scale-110 transition-transform" />
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
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 opacity-60 group-hover:scale-110 transition-transform" />
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

        {/* Card 3: Total Initial Dealer Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Initial Purchase Cost</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">₹{totalInitialCost.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Dealer acquisition outlay for sold inventory
            </div>
          </div>
        </div>

        {/* Card 4: Pass-Through Fees (Insurance + RTO) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pass-Through & Misc</span>
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

      {/* Interactive 2-Line Chart: Month-Wise Total Revenue & Profit */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">Month-Wise Performance Trend</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                2-Line Visual Tracker
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative timeline of total vehicle sales revenue vs net profit generated each month.
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
            <p className="text-sm font-semibold text-slate-700">No Sales Transactions Recorded Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Book vehicles from the Sales Tracker tab to automatically populate this month-wise revenue and profit line chart.
            </p>
          </div>
        ) : (
          <div className="relative mt-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                {/* Revenue Gradient */}
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
                {/* Profit Gradient */}
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
                    r="5"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredMonth(p.data);
                      setHoverPos({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
                    }}
                    onMouseLeave={() => setHoveredMonth(null)}
                  />
                </g>
              ))}

              {/* Data Points on Profit Line */}
              {profitPoints.map((p, i) => (
                <g key={`profit-dot-${i}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredMonth(p.data);
                      setHoverPos({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
                    }}
                    onMouseLeave={() => setHoveredMonth(null)}
                  />
                </g>
              ))}

              {/* X-Axis Month Labels */}
              {chartData.map((d, i) => {
                const x = getX(i);
                return (
                  <text
                    key={`label-${i}`}
                    x={x}
                    y={paddingTop + chartHeight + 22}
                    textAnchor="middle"
                    className="text-[11px] fill-slate-600 font-bold"
                  >
                    {d.month_label}
                  </text>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredMonth && (
              <div className="absolute top-2 right-4 bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-sm z-20 pointer-events-none animate-fadeIn">
                <div className="font-extrabold text-sm border-b border-slate-700 pb-1.5 mb-2 flex items-center justify-between">
                  <span>{hoveredMonth.month_label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                    {hoveredMonth.units_sold} {hoveredMonth.units_sold === 1 ? 'sale' : 'sales'}
                  </span>
                </div>
                <div className="space-y-1.5 font-sans">
                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center text-sky-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-sky-400 mr-1.5" />
                      Total Revenue:
                    </span>
                    <span className="font-mono font-bold text-white">
                      ₹{hoveredMonth.total_revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between space-x-4">
                    <span className="flex items-center text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
                      Net Profit:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{hoveredMonth.total_profit.toLocaleString('en-IN')} ({hoveredMonth.margin_pct}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between space-x-4 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Initial Cost:</span>
                    <span className="font-mono">₹{hoveredMonth.total_initial_cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between space-x-4 text-[11px] text-slate-400">
                    <span>Insurance & RTO:</span>
                    <span className="font-mono">
                      ₹{(hoveredMonth.total_insurance + hoveredMonth.total_rto).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between space-x-4 text-[11px] text-slate-400">
                    <span>Misc Charges:</span>
                    <span className="font-mono">₹{hoveredMonth.total_misc.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Month-Wise Transaction Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Monthly Transaction & Profit Summary</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregated accounting breakdown of all vehicle sales transactions.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {reports.length} {reports.length === 1 ? 'Month Recorded' : 'Months Recorded'}
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No sales records available to generate monthly breakdown.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4">Initial Cost</th>
                  <th className="py-3 px-4 text-sky-800">Total Revenue (Blue)</th>
                  <th className="py-3 px-4">Insurance & RTO</th>
                  <th className="py-3 px-4">Misc Charges</th>
                  <th className="py-3 px-4 text-emerald-800">Net Profit (Green)</th>
                  <th className="py-3 px-4 text-right">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <tr key={r.month_key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {r.month_label}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {r.units_sold} {r.units_sold === 1 ? 'unit' : 'units'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      ₹{r.total_initial_cost.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-extrabold text-sky-700 text-sm">
                      ₹{r.total_revenue.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      ₹{(r.total_insurance + r.total_rto).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      ₹{r.total_misc.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700 text-sm">
                      +₹{r.total_profit.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold ${
                          r.margin_pct >= 10
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {r.margin_pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold text-xs">
                <tr>
                  <td className="py-3 px-4 text-slate-900">Total Across All Periods</td>
                  <td className="py-3 px-4 text-center text-slate-900">{totalUnits} units</td>
                  <td className="py-3 px-4 font-mono text-slate-700">₹{totalInitialCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono text-sky-800 font-extrabold">₹{totalRevenue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">₹{(totalInsurance + totalRto).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">₹{totalMisc.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono text-emerald-800 font-extrabold">+₹{totalProfit.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-emerald-700">{overallMargin}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReportsSubPage;
