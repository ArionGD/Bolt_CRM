import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  BatteryCharging,
  Coins,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  Clock,
  Phone,
  Check,
  Star,
  Users,
} from 'lucide-react';
import { MOCK_MODELS } from '../lib/mockData';

export const HomePage: React.FC = () => {
  // Quick test drive booking state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedModel, setSelectedModel] = useState('Scooty Model 2');
  const [receiveAlerts, setReceiveAlerts] = useState(true);
  const [booked, setBooked] = useState(false);

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setBooked(true);
  };

  const scootyModels = MOCK_MODELS.filter((m) => m.body_type === 'Scooty');
  const rickshawModel = MOCK_MODELS.find((m) => m.body_type === 'E-Rickshaw');

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-12 pb-20 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.12] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trisha Motors Authorized EV Experience</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                Switch to Clean <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-500">
                  Electric Mobility.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-medium leading-relaxed">
                Discover our authorized range of stylish personal <strong className="text-slate-900">EV Scooties</strong> and heavy-duty commercial <strong className="text-slate-900">E-Rickshaws</strong>. Enjoy instant delivery, state subsidies up to ₹10,000, and verified zero-cost RTO registrations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/explore"
                  className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <span>Explore All Models</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/calculator"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-sm transition-all hover:border-slate-400"
                >
                  <span>On-Road Price Calculator</span>
                </Link>
              </div>

              {/* Key Benefit Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">₹0.15<span className="text-xs font-normal text-slate-500">/km</span></div>
                  <div className="text-xs text-slate-500 font-medium">Running Cost</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">₹10,000</div>
                  <div className="text-xs text-slate-500 font-medium">State Subsidy</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">3 Years</div>
                  <div className="text-xs text-slate-500 font-medium">Battery Warranty</div>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Test Drive Booking Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 relative">
                <div className="absolute -top-3 right-6 bg-brand-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                  Free Test Ride
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Book Test Drive Today</h3>
                    <p className="text-xs text-slate-500">Instant showroom confirmation & slot reserved</p>
                  </div>
                </div>

                {booked ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fade-in">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-extrabold text-emerald-900 text-base">Test Drive Reserved!</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Thank you <strong className="font-bold">{name}</strong>. Our showroom manager has scheduled your test ride for <strong className="font-bold">{selectedModel}</strong>. Please bring your driving license.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBooked(false)}
                      className="mt-2 text-xs font-bold text-emerald-800 underline"
                    >
                      Book another ride
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuickBook} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Customer 1"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98000 00001"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Choose Vehicle Model
                      </label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      >
                        <optgroup label="Electric Scooty Models">
                          <option value="Scooty Model 1">Scooty Model 1 (Standard 2.0 kWh - 85km)</option>
                          <option value="Scooty Model 2">Scooty Model 2 (City 2.5 kWh - 105km)</option>
                          <option value="Scooty Model Pro">Scooty Model Pro (Long Range 3.2 kWh - 130km)</option>
                        </optgroup>
                        <optgroup label="Electric Commercial Rickshaw">
                          <option value="E-Rickshaw Model 1">E-Rickshaw Model 1 (5-Seater L5M - 110km)</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="pt-1">
                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={receiveAlerts}
                          onChange={(e) => setReceiveAlerts(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                        />
                        <span className="text-xs text-slate-600 leading-tight">
                          Receive alerts, price drop updates, and latest government subsidy notifications via SMS/WhatsApp
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Confirm Test Drive</span>
                    </button>

                    <p className="text-[11px] text-slate-400 text-center">
                      No commitment required. Showroom open Mon-Sun, 9 AM – 8:30 PM.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models Lineup Section: Scooty & E-Rickshaw */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
              Showroom Inventory
            </div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight mt-1">
              Explore Our Electric Lineup
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Choose from high-performance personal Scooties or our heavy-duty commercial E-Rickshaw, all backed by comprehensive manufacturer warranty and local service.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <span>Compare full specifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scooty Lineup (Separate Models) */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-black uppercase">
              Electric Scooty Series
            </span>
            <span className="text-xs text-slate-500 font-medium">3 Separate Models for Every Commute</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scootyModels.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl hover:border-emerald-400 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {m.variant}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">In Stock</span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mt-3 group-hover:text-emerald-600 transition-colors">
                    {m.model_name}
                  </h3>
                  <p className="text-xs text-slate-500">{m.brand} • 2-Seater</p>

                  <div className="mt-5 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 text-center text-xs">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Range</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{m.range_km} km</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Battery</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{m.battery_kwh} kWh</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Motor</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{m.motor_power_kw} kW</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Ex-Showroom Price</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{m.ex_showroom_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/test-drive"
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
                    >
                      Book Ride
                    </Link>
                    <Link
                      to="/calculator"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-colors shadow-sm"
                    >
                      Price Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E-Rickshaw Lineup (Single Model) */}
        {rickshawModel && (
          <div className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-black uppercase">
                Commercial Electric Rickshaw
              </span>
              <span className="text-xs text-slate-500 font-medium">Passenger 5-Seater L5M Commercial Vehicle</span>
            </div>

            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-extrabold uppercase">
                    High Earning Commercial Vehicle
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {rickshawModel.model_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                    Designed for heavy daily passenger duty. Low maintenance, regenerative braking, heavy-duty suspension, and 110 km certified true range per full charge.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Capacity</div>
                      <div className="text-base font-extrabold text-white mt-0.5">5 Seater (D+4)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Battery</div>
                      <div className="text-base font-extrabold text-white mt-0.5">{rickshawModel.battery_kwh} kWh Lithium</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Certified Range</div>
                      <div className="text-base font-extrabold text-white mt-0.5">{rickshawModel.range_km} km</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Peak Motor</div>
                      <div className="text-base font-extrabold text-white mt-0.5">{rickshawModel.motor_power_kw} kW Heavy</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10 space-y-4">
                  <div>
                    <div className="text-xs text-slate-300 font-semibold">Ex-Showroom Price</div>
                    <div className="text-3xl font-black text-white">
                      ₹{rickshawModel.ex_showroom_price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-emerald-400 font-bold mt-1">
                      Eligible for ₹10,000 State Commercial Subsidy
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero road tax for commercial permits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Save up to ₹1,200/day over LPG / Diesel auto</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Fast financing partner tie-ups with low down payment</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center space-x-3">
                    <Link
                      to="/test-drive"
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition-all shadow-md"
                    >
                      Book Commercial Test Drive
                    </Link>
                    <Link
                      to="/calculator"
                      className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs text-center transition-all"
                    >
                      Calculate EMI
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Why Choose Trisha Motors Section */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
              Authorized Quality & Trust
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Why Customers Choose Trisha Motors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We eliminate intermediaries and make electric vehicle adoption smooth, transparent, and legally protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Physical VIN Allocation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every booking locks a specific physical chassis number in real-time. Zero risk of duplicate allocation or delayed handover.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Direct State Subsidies</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct deduction of state subsidies (up to ₹10,000) at billing with seamless documentation and official portal upload.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Certified Service Bay</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Equipped with EV diagnostic scanners, trained electrical technicians, and 100% genuine replacement battery packs.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Instant Spot Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ready in-stock models can be driven home the very same day with temporary registration and comprehensive insurance cover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials with Simple Names */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
            Showroom Reviews
          </span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            Hear From Our EV Owners
          </h2>
          <p className="text-xs text-slate-500">
            Real feedback from daily city commuters and commercial e-rickshaw operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-1 text-emerald-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-emerald-500" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "I purchased Scooty Model 2 for my daily 25km office commute. Charging it at home takes just 3 hours and my monthly travel expense dropped from ₹3,000 petrol to less than ₹200 electricity. The dealership completed registration in 2 days."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                C1
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Customer 1</div>
                <div className="text-[11px] text-slate-500">Owner, Scooty Model 2 (City Variant)</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-1 text-emerald-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-emerald-500" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "Buying the E-Rickshaw Model 1 was the best decision for my commercial passenger route. Seating is spacious for 5 passengers and the lithium battery easily lasts 110km daily. The showroom manager assisted with fast loan approval."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                C2
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Customer 2</div>
                <div className="text-[11px] text-slate-500">Commercial Operator, E-Rickshaw Model 1</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom Visit CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-sky-600 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-emerald-600/20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to experience electric driving?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
              Visit our showroom today for a personalized demonstration, instant loan appraisal, and free test ride.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/test-drive"
              className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-50 transition-all shadow-md"
            >
              Book Test Drive
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-2xl bg-brand-700/80 hover:bg-brand-700 text-white font-bold text-xs transition-all border border-white/20"
            >
              Showroom Directions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
