import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Zap,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Phone,
  AlertCircle,
  FileCheck,
  Check,
} from 'lucide-react';
import { MOCK_MODELS } from '../lib/mockData';

export const BookTestDrive: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedModel = searchParams.get('model') || 'Scooty Model 2';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [modelName, setModelName] = useState(preselectedModel);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('11:00 AM – 12:30 PM');
  const [receiveAlerts, setReceiveAlerts] = useState(true);
  const [hasLicense, setHasLicense] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    const ref = 'TD-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(ref);
    setIsSuccess(true);
  };

  const selectedVehicle = MOCK_MODELS.find((m) => m.model_name === modelName) || MOCK_MODELS[0];
  const isRickshaw = selectedVehicle.body_type === 'E-Rickshaw';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Complimentary Experience
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Book Your Free Test Ride
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Experience the silent performance, quick acceleration, and passenger comfort firsthand at our authorized showroom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            {isSuccess ? (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Booking Confirmed
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Test Drive Reserved!</h2>
                  <p className="text-xs font-mono text-slate-500 mt-1">Reference: {bookingRef}</p>
                </div>

                <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer:</span>
                    <span className="font-bold">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-bold">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model:</span>
                    <span className="font-bold text-brand-600">{modelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Date:</span>
                    <span className="font-bold">{date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time Slot:</span>
                    <span className="font-bold">{timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alerts & Offers:</span>
                    <span className="font-bold text-emerald-600">
                      {receiveAlerts ? 'Subscribed' : 'Not Subscribed'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  An SMS confirmation has been simulated to {phone}. Our showroom sales executive has reserved the demo vehicle for you.
                </p>

                <div className="pt-4 flex justify-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Book Another Slot
                  </button>
                  <Link
                    to="/contact"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                  >
                    View Showroom Directions
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-black text-slate-900 text-base">1. Personal Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Customer 1"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number *
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
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-base">2. Vehicle & Slot</h3>
                  <div className="space-y-4 mt-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Select Electric Vehicle
                      </label>
                      <select
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      >
                        <optgroup label="Electric Scooty Models">
                          <option value="Scooty Model 1">Scooty Model 1 (Standard 2.0 kWh - 85km)</option>
                          <option value="Scooty Model 2">Scooty Model 2 (City 2.5 kWh - 105km)</option>
                          <option value="Scooty Model Pro">Scooty Model Pro (Long Range 3.2 kWh - 130km)</option>
                        </optgroup>
                        <optgroup label="Commercial Electric Rickshaw">
                          <option value="E-Rickshaw Model 1">E-Rickshaw Model 1 (5-Seater L5M Commercial)</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Preferred Time Slot
                        </label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                        >
                          <option value="09:30 AM – 11:00 AM">Morning (09:30 AM – 11:00 AM)</option>
                          <option value="11:00 AM – 12:30 PM">Late Morning (11:00 AM – 12:30 PM)</option>
                          <option value="02:00 PM – 03:30 PM">Afternoon (02:00 PM – 03:30 PM)</option>
                          <option value="04:00 PM – 05:30 PM">Evening (04:00 PM – 05:30 PM)</option>
                          <option value="06:00 PM – 07:30 PM">Late Evening (06:00 PM – 07:30 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasLicense}
                      onChange={(e) => setHasLicense(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                    />
                    <span className="text-xs text-slate-700">
                      I hold a valid Driving License and will bring it to the showroom
                    </span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={receiveAlerts}
                      onChange={(e) => setReceiveAlerts(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                    />
                    <span className="text-xs text-slate-600 leading-tight">
                      Receive alerts, price drops, and state subsidy notifications via WhatsApp/SMS
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Confirm Test Ride Booking</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400">
                Experience Information
              </span>
              <h3 className="text-xl font-black">What to Expect</h3>
              <p className="text-xs text-slate-400">
                Our test ride process is completely free, zero-obligation, and guided by certified EV technical staff.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white/10 text-brand-400 shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">What to Bring</div>
                  <div className="text-slate-400 mt-0.5">
                    Original Driving License (2-wheeler for Scooty, Commercial/Auto permit or DL for E-Rickshaw).
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white/10 text-brand-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Safety Gear Included</div>
                  <div className="text-slate-400 mt-0.5">
                    Sanitized ISI-certified helmet provided for all Scooty test rides. Dedicated open test circuit available for E-Rickshaw trials.
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white/10 text-brand-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Duration</div>
                  <div className="text-slate-400 mt-0.5">
                    15–20 minutes road test covering city gradient, regenerative braking, and suspension response.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="font-bold text-slate-300">Showroom Address:</div>
              <p className="text-slate-400">
                Jamo Road, Baharia, Siwan, Bihar
              </p>
              <div className="flex items-center space-x-2 text-brand-400 font-bold pt-1">
                <Phone className="w-3.5 h-3.5" />
                <span>082941 73308</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
