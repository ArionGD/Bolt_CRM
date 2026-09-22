import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Battery,
  Gauge,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Filter,
  Check,
  HelpCircle,
} from 'lucide-react';
import { MOCK_MODELS } from '../lib/mockData';

export const ExploreModels: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scooty' | 'rickshaw'>('all');

  const filteredModels = MOCK_MODELS.filter((m) => {
    if (selectedFilter === 'scooty') return m.body_type === 'Scooty';
    if (selectedFilter === 'rickshaw') return m.body_type === 'E-Rickshaw';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Authorized Showroom Catalogue
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Explore Our Electric Models
        </h1>
        <p className="text-sm text-slate-600">
          Compare specifications, battery capacities, and prices across our personal Scooty range and commercial 5-seater E-Rickshaw.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center space-x-2 pt-4">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Vehicles ({MOCK_MODELS.length})
          </button>
          <button
            onClick={() => setSelectedFilter('scooty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'scooty'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Scooties (3 Models)
          </button>
          <button
            onClick={() => setSelectedFilter('rickshaw')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'rickshaw'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            E-Rickshaw (1 Model)
          </button>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredModels.map((m) => {
          const isRickshaw = m.body_type === 'E-Rickshaw';
          return (
            <div
              key={m.id}
              className={`rounded-3xl border transition-all flex flex-col justify-between p-6 ${
                isRickshaw
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white border-slate-800 shadow-xl'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isRickshaw ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {m.body_type}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      isRickshaw ? 'text-emerald-400' : 'text-emerald-600'
                    }`}
                  >
                    ✓ In Showroom Stock
                  </span>
                </div>

                <h3
                  className={`text-xl font-black mt-3 ${
                    isRickshaw ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {m.model_name}
                </h3>
                <p className={`text-xs ${isRickshaw ? 'text-slate-400' : 'text-slate-500'}`}>
                  {m.variant}
                </p>

                {/* Specs List */}
                <div className="mt-6 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100/10">
                    <span className={`flex items-center space-x-1.5 ${isRickshaw ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Gauge className="w-3.5 h-3.5" />
                      <span>Certified Range</span>
                    </span>
                    <span className={`font-black ${isRickshaw ? 'text-white' : 'text-slate-900'}`}>
                      {m.range_km} km
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100/10">
                    <span className={`flex items-center space-x-1.5 ${isRickshaw ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Battery className="w-3.5 h-3.5" />
                      <span>Battery Capacity</span>
                    </span>
                    <span className={`font-black ${isRickshaw ? 'text-white' : 'text-slate-900'}`}>
                      {m.battery_kwh} kWh
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100/10">
                    <span className={`flex items-center space-x-1.5 ${isRickshaw ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Motor Power</span>
                    </span>
                    <span className={`font-black ${isRickshaw ? 'text-white' : 'text-slate-900'}`}>
                      {m.motor_power_kw} kW
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100/10">
                    <span className={`flex items-center space-x-1.5 ${isRickshaw ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Charge Time (AC)</span>
                    </span>
                    <span className={`font-black ${isRickshaw ? 'text-white' : 'text-slate-900'}`}>
                      {isRickshaw ? '4.0 hrs' : '3.5 hrs'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className={`flex items-center space-x-1.5 ${isRickshaw ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Users className="w-3.5 h-3.5" />
                      <span>Seating Capacity</span>
                    </span>
                    <span className={`font-black ${isRickshaw ? 'text-white' : 'text-slate-900'}`}>
                      {m.seating_capacity} Persons
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & CTAs */}
              <div className="mt-6 pt-4 border-t border-slate-100/20 space-y-3">
                <div>
                  <div className={`text-[11px] ${isRickshaw ? 'text-slate-400' : 'text-slate-500'}`}>
                    Ex-Showroom Price
                  </div>
                  <div className={`text-2xl font-black ${isRickshaw ? 'text-white' : 'text-slate-900'}`}>
                    ₹{m.ex_showroom_price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-500 font-bold">
                    Govt. Subsidy: -₹{isRickshaw ? '10,000' : '5,000'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/contact?model=${encodeURIComponent(m.model_name)}`}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center space-x-1.5 transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                  >
                    <span>Showroom Inquiry & Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/calculator?model=${encodeURIComponent(m.model_name)}`}
                    className={`w-full py-2 rounded-xl font-bold text-xs text-center block transition-colors ${
                      isRickshaw
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    Calculate On-Road EMI
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Vehicle Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Side-by-Side Model Comparison</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare all four authorized electric vehicles available in our showroom.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 bg-slate-50">Feature / Specification</th>
                <th className="py-3 px-4">Scooty Model 1</th>
                <th className="py-3 px-4">Scooty Model 2</th>
                <th className="py-3 px-4">Scooty Model Pro</th>
                <th className="py-3 px-4 bg-sky-50/50 text-sky-900">E-Rickshaw Model 1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">Vehicle Category</td>
                <td className="py-3 px-4">Electric Scooty (2W)</td>
                <td className="py-3 px-4">Electric Scooty (2W)</td>
                <td className="py-3 px-4">Electric Scooty (2W)</td>
                <td className="py-3 px-4 bg-sky-50/30 font-bold text-sky-900">Electric Rickshaw (3W Commercial)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">Ex-Showroom Price</td>
                <td className="py-3 px-4 font-extrabold text-slate-900">₹65,000</td>
                <td className="py-3 px-4 font-extrabold text-slate-900">₹78,000</td>
                <td className="py-3 px-4 font-extrabold text-slate-900">₹92,000</td>
                <td className="py-3 px-4 bg-sky-50/30 font-extrabold text-slate-900">₹1,45,000</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">State EV Subsidy</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">-₹5,000</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">-₹5,000</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">-₹5,000</td>
                <td className="py-3 px-4 bg-sky-50/30 text-emerald-600 font-bold">-₹10,000</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">Certified True Range</td>
                <td className="py-3 px-4">85 km</td>
                <td className="py-3 px-4">105 km</td>
                <td className="py-3 px-4 font-bold text-emerald-600">130 km</td>
                <td className="py-3 px-4 bg-sky-50/30">110 km (Under Load)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">Battery Chemistry</td>
                <td className="py-3 px-4">2.0 kWh Li-ion</td>
                <td className="py-3 px-4">2.5 kWh Li-ion</td>
                <td className="py-3 px-4">3.2 kWh Li-ion</td>
                <td className="py-3 px-4 bg-sky-50/30">4.8 kWh Heavy-Duty Li-ion</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">Peak Motor Power</td>
                <td className="py-3 px-4">2.5 kW BLDC</td>
                <td className="py-3 px-4">3.2 kW Hub Motor</td>
                <td className="py-3 px-4">4.0 kW High Torque</td>
                <td className="py-3 px-4 bg-sky-50/30">4.5 kW Differential Drive</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">Seating Capacity</td>
                <td className="py-3 px-4">2 Persons</td>
                <td className="py-3 px-4">2 Persons</td>
                <td className="py-3 px-4">2 Persons</td>
                <td className="py-3 px-4 bg-sky-50/30 font-bold">5 Persons (Driver + 4)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">Recommended For</td>
                <td className="py-3 px-4">Daily short city errands</td>
                <td className="py-3 px-4">Daily office commute</td>
                <td className="py-3 px-4">Long distance & highway</td>
                <td className="py-3 px-4 bg-sky-50/30 font-bold text-sky-800">Commercial passenger auto route</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50">Warranty Cover</td>
                <td className="py-3 px-4">3 Years / 40,000 km</td>
                <td className="py-3 px-4">3 Years / 40,000 km</td>
                <td className="py-3 px-4">3 Years / 40,000 km</td>
                <td className="py-3 px-4 bg-sky-50/30 font-bold">3 Years / 50,000 km</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
