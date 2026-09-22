import React from 'react';
import { Order, Vehicle, VehicleModel, ComponentItem } from '../../../types';
import { PieChart, Award, Car, BatteryCharging, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface CategorySplitChartProps {
  orders: Order[];
  vehicles: Vehicle[];
  models: VehicleModel[];
  components: ComponentItem[];
}

export const CategorySplitChart: React.FC<CategorySplitChartProps> = ({
  orders,
  vehicles,
  models,
  components,
}) => {
  const activeOrders = orders.filter((o) => o.status !== 'cancelled');

  // Breakdown by Scooter vs Rickshaw vs Spares
  const scooterOrders = activeOrders.filter(
    (o) => o.vehicle_type === 'scooter' || !o.model_name?.toLowerCase().includes('rickshaw')
  );
  const rickshawOrders = activeOrders.filter(
    (o) => o.vehicle_type === 'rickshaw' || o.model_name?.toLowerCase().includes('rickshaw')
  );

  const scooterRev = scooterOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const rickshawRev = rickshawOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);

  // Components value sold or in-stock
  const sparesVal = components.reduce((s, c) => s + c.unit_price * c.quantity, 0);

  const totalSegmentRev = scooterRev + rickshawRev + Math.round(sparesVal * 0.15) || 1;
  const scooterPct = Math.round((scooterRev / totalSegmentRev) * 100);
  const rickshawPct = Math.round((rickshawRev / totalSegmentRev) * 100);
  const sparesPct = Math.max(0, 100 - scooterPct - rickshawPct);

  // Top Selling Models calculation
  const modelStats = new Map<
    string,
    { name: string; brand: string; type: string; units: number; revenue: number; inStock: number }
  >();

  // Initialize with models
  models.forEach((m) => {
    const stockCount = vehicles.filter((v) => v.model_id === m.id && v.status === 'in_stock').length;
    modelStats.set(m.model_name, {
      name: m.model_name,
      brand: m.brand,
      type: m.body_type || 'Scooty',
      units: 0,
      revenue: 0,
      inStock: stockCount,
    });
  });

  // Tally orders
  activeOrders.forEach((o) => {
    const key = o.model_name || 'Scooty Model 2';
    const existing = modelStats.get(key) || {
      name: key,
      brand: o.brand || 'Trisha',
      type: o.vehicle_type === 'rickshaw' ? 'E-Rickshaw' : 'Scooty',
      units: 0,
      revenue: 0,
      inStock: 0,
    };
    existing.units += 1;
    existing.revenue += Number(o.total_amount || 0);
    modelStats.set(key, existing);
  });

  const sortedModels = Array.from(modelStats.values())
    .sort((a, b) => b.units - a.units || b.revenue - a.revenue)
    .slice(0, 4);

  const maxModelUnits = Math.max(...sortedModels.map((m) => m.units), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Category Revenue Share Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <PieChart className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-slate-900">Category Share</h3>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            {activeOrders.length} Contracts
          </span>
        </div>

        {/* Stacked Multi-Color Progress Segment Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${scooterPct}%` }}
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all"
              title={`Scooters: ${scooterPct}%`}
            />
            <div
              style={{ width: `${rickshawPct}%` }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full transition-all"
              title={`E-Rickshaws: ${rickshawPct}%`}
            />
            <div
              style={{ width: `${sparesPct}%` }}
              className="bg-gradient-to-r from-purple-500 to-fuchsia-600 h-full transition-all"
              title={`Spares & Batteries: ${sparesPct}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>EV Scooters ({scooterPct}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>E-Rickshaws ({rickshawPct}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Spares & Batteries ({sparesPct}%)</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1">
            <div className="flex items-center space-x-1 text-sky-800 text-xs font-bold">
              <Car className="w-3.5 h-3.5" />
              <span>Scooties</span>
            </div>
            <div className="text-base font-black text-sky-950">
              ₹{(scooterRev / 100000).toFixed(1)}L
            </div>
            <div className="text-[11px] text-sky-700 font-medium">
              {scooterOrders.length} Units Sold
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <div className="flex items-center space-x-1 text-emerald-800 text-xs font-bold">
              <Car className="w-3.5 h-3.5" />
              <span>Rickshaws</span>
            </div>
            <div className="text-base font-black text-emerald-950">
              ₹{(rickshawRev / 100000).toFixed(1)}L
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              {rickshawOrders.length} Units Sold
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1">
            <div className="flex items-center space-x-1 text-purple-800 text-xs font-bold">
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>Spares</span>
            </div>
            <div className="text-base font-black text-purple-950">
              ₹{(sparesVal / 100000).toFixed(1)}L
            </div>
            <div className="text-[11px] text-purple-700 font-medium">
              {components.length} SKUs Stock
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Performing Models Leaderboard */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-slate-900">Top Selling Models</h3>
            </div>
          </div>
          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            Leaderboard
          </span>
        </div>

        {/* Model Rows */}
        <div className="space-y-3.5">
          {sortedModels.map((m, idx) => {
            const fillPct = Math.round((m.units / maxModelUnits) * 100);
            return (
              <div
                key={m.name}
                className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        idx === 0
                          ? 'bg-amber-500 text-white shadow-sm'
                          : idx === 1
                          ? 'bg-slate-400 text-white'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-black text-slate-900">{m.name}</span>
                      <span className="text-[10px] text-slate-500 ml-1.5 font-medium">
                        ({m.type})
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900">
                      {m.units} units sold
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold ml-2">
                      ₹{(m.revenue / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>

                {/* Progress bar representing model popularity */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200/80 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        idx === 0
                          ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                          : 'bg-gradient-to-r from-blue-500 to-sky-500'
                      }`}
                      style={{ width: `${Math.max(10, fillPct)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 font-mono shrink-0">
                    {m.inStock} in stock
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
