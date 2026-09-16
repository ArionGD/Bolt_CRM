import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calculator,
  Zap,
  CheckCircle2,
  Percent,
  CreditCard,
  Printer,
  ArrowRight,
  ShieldAlert,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_MODELS } from '../lib/mockData';

export const PriceCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialModelName = searchParams.get('model') || 'Scooty Model 2';

  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    const found = MOCK_MODELS.find((m) => m.model_name.toLowerCase() === initialModelName.toLowerCase());
    return found ? found.id : MOCK_MODELS[1].id;
  });

  const [includeAccessories, setIncludeAccessories] = useState<boolean>(true);
  const [includeExtendedWarranty, setIncludeExtendedWarranty] = useState<boolean>(false);

  // EMI parameters
  const [downPayment, setDownPayment] = useState<number>(15000);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [interestRate, setInterestRate] = useState<number>(9.5);

  const currentModel = MOCK_MODELS.find((m) => m.id === selectedModelId) || MOCK_MODELS[0];
  const isRickshaw = currentModel.body_type === 'E-Rickshaw';

  // Calculations
  const exShowroom = currentModel.ex_showroom_price;
  const insurance = isRickshaw ? 7000 : exShowroom > 80000 ? 4200 : 3500;
  const registration = isRickshaw ? 3500 : 2000; // Zero road tax for EVs, nominal RTO/smart card fee
  const accessories = includeAccessories ? (isRickshaw ? 3000 : 2200) : 0;
  const extendedWarranty = includeExtendedWarranty ? 2500 : 0;
  const subsidy = isRickshaw ? 10000 : 5000;

  const onRoadPrice = Math.max(0, exShowroom + insurance + registration + accessories + extendedWarranty - subsidy);

  // Auto-adjust down payment if higher than on-road price
  useEffect(() => {
    if (downPayment > onRoadPrice) {
      setDownPayment(Math.round(onRoadPrice * 0.2));
    }
  }, [selectedModelId, onRoadPrice]);

  // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const principal = Math.max(0, onRoadPrice - downPayment);
  const monthlyRate = interestRate / 12 / 100;
  const emi =
    principal > 0 && monthlyRate > 0
      ? Math.round(
          (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1)
        )
      : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Transparent Price Transparency
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          On-Road Price & EMI Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Calculate the exact drive-away price including government EV subsidies, zero road tax savings, and monthly financing options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Model Selection & Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Model Selector Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Zap className="w-5 h-5 text-brand-600" />
              <span>1. Select Electric Vehicle</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_MODELS.map((m) => {
                const selected = m.id === selectedModelId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModelId(m.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selected
                        ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-200 text-slate-700">
                        {m.body_type}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        ₹{m.ex_showroom_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="font-black text-sm text-slate-900 mt-2">{m.model_name}</div>
                    <div className="text-[11px] text-slate-500">{m.range_km} km range • {m.battery_kwh} kWh</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-ons & Accessories Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>2. Protection & Accessories</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeAccessories}
                    onChange={(e) => setIncludeAccessories(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Showroom Essential Accessories Pack</div>
                    <div className="text-[11px] text-slate-500">
                      {isRickshaw
                        ? 'Heavy duty all-weather floor mats, passenger grab covers & first-aid kit'
                        : 'ISI certified safety helmet, floor mat, charger wall hook & side mirrors'}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  +₹{isRickshaw ? '3,000' : '2,200'}
                </div>
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeExtendedWarranty}
                    onChange={(e) => setIncludeExtendedWarranty(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Extended Battery Warranty (+2 Years)</div>
                    <div className="text-[11px] text-slate-500">
                      Extends comprehensive electrical & cell pack coverage to 5 Years total
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900">+₹2,500</div>
              </label>
            </div>
          </div>

          {/* Finance & EMI Estimator Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <span>3. Monthly EMI Estimator</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600">Tie-up with Top EV Financiers</span>
            </div>

            <div className="space-y-4">
              {/* Down Payment Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Down Payment</span>
                  <span className="text-brand-600">₹{downPayment.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={Math.min(onRoadPrice, 80000)}
                  step={1000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Min: ₹5,000</span>
                  <span>Max: ₹80,000</span>
                </div>
              </div>

              {/* Tenure Selection */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Loan Tenure (Months)</div>
                <div className="grid grid-cols-4 gap-2">
                  {[12, 24, 36, 48].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        tenureMonths === m
                          ? 'bg-slate-900 text-white shadow'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated EMI Display */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-800 font-semibold">Estimated Monthly EMI</div>
                  <div className="text-xs text-emerald-600">
                    Loan Amount: ₹{principal.toLocaleString('en-IN')} @ 9.5% p.a.
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-900">
                  ₹{emi.toLocaleString('en-IN')}<span className="text-xs font-normal text-emerald-700">/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Quotation Breakdown Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Estimate Breakdown
                </span>
                <h2 className="text-xl font-black text-slate-900">{currentModel.model_name}</h2>
                <p className="text-xs text-slate-500">{currentModel.variant}</p>
              </div>
              <span className="p-2.5 rounded-2xl bg-brand-50 text-brand-600">
                <Calculator className="w-5 h-5" />
              </span>
            </div>

            {/* Price Line Items */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-600 font-medium">Ex-Showroom Price</span>
                <span className="font-bold text-slate-900">₹{exShowroom.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-600 font-medium">EV GST (5% Included)</span>
                <span className="font-bold text-slate-700">Included</span>
              </div>

              <div className="flex justify-between py-1">
                <div>
                  <span className="text-slate-600 font-medium">Comprehensive Insurance</span>
                  <p className="text-[10px] text-slate-400">1 Yr Comprehensive + 5 Yrs TP</p>
                </div>
                <span className="font-bold text-slate-900">₹{insurance.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-1">
                <div>
                  <span className="text-slate-600 font-medium">RTO Registration & Smart Card</span>
                  <p className="text-[10px] text-emerald-600 font-semibold">100% Road Tax Waived for EVs</p>
                </div>
                <span className="font-bold text-slate-900">₹{registration.toLocaleString('en-IN')}</span>
              </div>

              {includeAccessories && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 font-medium">Accessories Pack</span>
                  <span className="font-bold text-slate-900">₹{accessories.toLocaleString('en-IN')}</span>
                </div>
              )}

              {includeExtendedWarranty && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 font-medium">Extended Battery Warranty</span>
                  <span className="font-bold text-slate-900">₹{extendedWarranty.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* State Subsidy Deduction */}
              <div className="flex justify-between py-2 border-t border-dashed border-emerald-200 text-emerald-700 bg-emerald-50/60 -mx-4 px-4 rounded-xl">
                <div>
                  <span className="font-bold">Govt. State EV Subsidy</span>
                  <p className="text-[10px] text-emerald-600">Directly deducted from invoice</p>
                </div>
                <span className="font-black text-sm">-₹{subsidy.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Total Drive-Away On-Road Price */}
            <div className="pt-4 border-t border-slate-200 space-y-1">
              <div className="text-xs text-slate-500 font-semibold">Total On-Road Drive-Away Price</div>
              <div className="text-3xl font-black text-slate-950 tracking-tight">
                ₹{onRoadPrice.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500">
                Includes all taxes, RTO documentation, and insurance. No hidden fees.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2 print:hidden">
              <Link
                to={`/test-drive?model=${encodeURIComponent(currentModel.model_name)}`}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs text-center flex items-center justify-center space-x-1.5 shadow-md shadow-brand-500/20 transition-all"
              >
                <span>Book Test Ride for {currentModel.model_name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Official Quotation Slip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
