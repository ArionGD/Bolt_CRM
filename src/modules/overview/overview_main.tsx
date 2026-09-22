import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Order, SalesSummaryReport, StockAgeingBucket, Vehicle } from '../../types';
import { Car, ShoppingBag } from 'lucide-react';
import { OverviewMetrics } from './components/OverviewMetrics';
import { RecentActivity } from './components/RecentActivity';

export const OverviewMain: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<SalesSummaryReport | null>(null);
  const [ageing, setAgeing] = useState<StockAgeingBucket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [v, o, s, a] = await Promise.all([
          api.getVehicles(),
          api.getOrders(),
          api.getSalesSummary(),
          api.getStockAgeing(),
        ]);
        setVehicles(v);
        setOrders(o);
        setSummary(s);
        setAgeing(a);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const inStockCount = vehicles.filter((v) => v.status === 'in_stock').length;
  const inTransitCount = vehicles.filter((v) => v.status === 'in_transit').length;
  const reservedCount = vehicles.filter((v) => v.status === 'reserved').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to="/crm/inventory"
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-500 shadow-sm transition-all"
          >
            <Car className="w-3.5 h-3.5 mr-2" />
            <span>Manage Inventory</span>
          </Link>
          <Link
            to="/crm/sales"
            className="inline-flex items-center px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-2 text-slate-500" />
            <span>Manage Sales</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid Component */}
      <OverviewMetrics
        inStockCount={inStockCount}
        inTransitCount={inTransitCount}
        reservedCount={reservedCount}
        summary={summary}
      />

      {/* Recent Activity & Inventory Timeline Component */}
      <RecentActivity
        orders={orders}
        ageing={ageing}
        vehicles={vehicles}
      />
    </div>
  );
};

export default OverviewMain;
