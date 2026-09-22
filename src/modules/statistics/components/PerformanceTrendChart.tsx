import React, { useState } from 'react';
import { DailySalesAggregate, MonthlySalesAggregate } from '../../../types';
import { TrendingUp, Sparkles, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';

interface PerformanceTrendChartProps {
  monthlyReports: MonthlySalesAggregate[];
  dailyReports: DailySalesAggregate[];
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({
  monthlyReports,
  dailyReports,
}) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'daily'>('monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Normalize data points
  const points =
    viewMode === 'monthly'
      ? monthlyReports.map((m) => ({
          label: m.month_label,
          subLabel: m.month_key,
          revenue: m.total_revenue,
          profit: m.total_profit,
          cost: m.total_initial_cost,
          units: m.units_sold,
          margin: m.margin_pct,
          scooters: m.scooter_units || 0,
          rickshaws: m.rickshaw_units || 0,
        }))
      : dailyReports.map((d) => ({
          label: d.date_label,
          subLabel: d.day_of_week,
          revenue: d.total_revenue,
          profit: d.total_profit,
          cost: d.total_initial_cost,
          units: d.total_units,
          margin: d.margin_pct,
          scooters: d.scooter_units || 0,
          rickshaws: d.rickshaw_units || 0,
        }));

  const svgWidth = 840;
  const svgHeight = 260;
  const padL = 70;
  const padR = 30;
  const padT = 30;
  const padB = 40;

  const chartW = svgWidth - padL - padR;
  const chartH = svgHeight - padT - padB;

  const maxVal = Math.max(
    ...points.map((p) => Math.max(p.revenue, p.profit)),
    50000
  );

  const getX = (i: number) => {
    if (points.length <= 1) return padL + chartW / 2;
    return padL + (i / (points.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    return padT + chartH - (val / (maxVal || 1)) * chartH;
  };

  const revenuePoints = points.map((p, i) => ({ x: getX(i), y: getY(p.revenue) }));
  const profitPoints = points.map((p, i) => ({ x: getX(i), y: getY(p.profit) }));

  const revenuePath =
    revenuePoints.length > 0
      ? revenuePoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '')
      : '';

  const profitPath =
    profitPoints.length > 0
      ? profitPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '')
      : '';

  const revenueArea =
    revenuePoints.length > 0
      ? `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x},${padT + chartH} L ${revenuePoints[0].x},${padT + chartH} Z`
      : '';

  const profitArea =
    profitPoints.length > 0
      ? `${profitPath} L ${profitPoints[profitPoints.length - 1].x},${padT + chartH} L ${profitPoints[0].x},${padT + chartH} Z`
      : '';

  // Peak period
  const peakPoint = [...points].sort((a, b) => b.revenue - a.revenue)[0];
  const totalRev = points.reduce((s, p) => s + p.revenue, 0);
  const totalProf = points.reduce((s, p) => s + p.profit, 0);
  const totalUnits = points.reduce((s, p) => s + p.units, 0);
  const avgMargin = totalRev > 0 ? ((totalProf / totalRev) * 100).toFixed(1) : '0';

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Sales Revenue & Profit Trajectory
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Dual Trendlines
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Comparing Gross Dealership Inflow (Blue Area) against Net Dealer Profit Margin (Green Area)
          </p>
        </div>

        {/* View Toggle & Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Legend */}
          <div className="flex items-center space-x-4 text-xs font-bold px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-100" />
              <span className="text-slate-700">Gross Revenue</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              <span className="text-slate-700">Net Profit</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => {
                setViewMode('monthly');
                setHoveredIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'monthly'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => {
                setViewMode('daily');
                setHoveredIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day-by-Day (14D)
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Area */}
      <div className="relative overflow-x-auto bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 rounded-2xl border border-slate-100 p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          <defs>
            <linearGradient id="statRevenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="statProfitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines (4 horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padT + chartH * (1 - ratio);
            const val = Math.round(maxVal * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padL}
                  y1={y}
                  x2={svgWidth - padR}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={ratio === 0 ? undefined : '4 4'}
                  strokeWidth={ratio === 0 ? '1.5' : '1'}
                />
                <text
                  x={padL - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="600"
                  fill="#94a3b8"
                >
                  ₹{(val / 100000).toFixed(val >= 100000 ? 1 : 2)}L
                </text>
              </g>
            );
          })}

          {/* Shaded Areas */}
          {revenueArea && <path d={revenueArea} fill="url(#statRevenueGrad)" />}
          {profitArea && <path d={profitArea} fill="url(#statProfitGrad)" />}

          {/* Trend Lines */}
          {revenuePath && (
            <path
              d={revenuePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {profitPath && (
            <path
              d={profitPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Nodes & Vertical Crosshair */}
          {points.map((pt, i) => {
            const x = getX(i);
            const yRev = getY(pt.revenue);
            const yProf = getY(pt.profit);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i} className="cursor-pointer">
                {/* Vertical hover track */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padT}
                    x2={x}
                    y2={padT + chartH}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Revenue Node */}
                <circle
                  cx={x}
                  cy={yRev}
                  r={isHovered ? 7 : 4.5}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-all"
                />

                {/* Profit Node */}
                <circle
                  cx={x}
                  cy={yProf}
                  r={isHovered ? 6 : 4}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* X-axis date label */}
                <text
                  x={x}
                  y={padT + chartH + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? '800' : '600'}
                  fill={isHovered ? '#1e293b' : '#64748b'}
                >
                  {pt.label}
                </text>

                {/* Invisible hover capture column */}
                <rect
                  x={x - chartW / (points.length * 2 || 1)}
                  y={padT}
                  width={chartW / (points.length || 1)}
                  height={chartH + padB}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip if Hovered */}
        {activePoint && (
          <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/60 text-xs space-y-2 min-w-[230px] pointer-events-none animate-fade-in z-20">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
              <span className="font-extrabold text-sm text-slate-100">{activePoint.label}</span>
              <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {activePoint.subLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Revenue</span>
                <span className="text-base font-black text-blue-400">
                  ₹{activePoint.revenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Profit</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{activePoint.profit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400">Margin Efficiency:</span>
              <span className="font-bold text-emerald-300">{activePoint.margin}%</span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Vehicles Sold:</span>
              <span className="font-bold text-white">
                {activePoint.units} units ({activePoint.scooters}S / {activePoint.rickshaws}R)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Trajectory Highlights & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-blue-700 block">
              Cumulative Turnover
            </span>
            <span className="text-lg font-black text-blue-950">
              ₹{(totalRev / 100000).toFixed(2)} Lakhs
            </span>
          </div>
          <span className="text-xs font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-lg shadow-xs border border-blue-200">
            {totalUnits} Units Sold
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-emerald-700 block">
              Cumulative Net Margin
            </span>
            <span className="text-lg font-black text-emerald-950">
              ₹{(totalProf / 100000).toFixed(2)} Lakhs
            </span>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-lg shadow-xs border border-emerald-200">
            {avgMargin}% Average
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-purple-700 block">
              Best Performing Period
            </span>
            <span className="text-lg font-black text-purple-950">
              {peakPoint?.label || 'N/A'}
            </span>
          </div>
          <span className="text-xs font-extrabold text-purple-700 bg-white px-2.5 py-1 rounded-lg shadow-xs border border-purple-200">
            ₹{((peakPoint?.revenue || 0) / 100000).toFixed(1)}L Peak
          </span>
        </div>
      </div>
    </div>
  );
};
