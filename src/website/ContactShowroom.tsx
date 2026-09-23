import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Zap,
  Send,
  CheckCircle2,
  Navigation,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const ContactShowroom: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiryType, setEnquiryType] = useState('Scooty Enquiry');
  const [message, setMessage] = useState('');
  const [receiveAlerts, setReceiveAlerts] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Visit Us In Person
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Showroom Location & Contact
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Stop by our authorized single showroom to inspect vehicle stock, test drive, or discuss commercial E-Rickshaw financing.
        </p>
      </div>

      {/* Showroom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Showroom Address</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Jamo Road, Baharia, Siwan, Bihar
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
              Near Central Metro Station
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Showroom Hours</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Open 7 days a week for walk-ins, test rides, and spot delivery processing.
          </p>
          <div className="pt-2 text-xs font-bold text-slate-900 space-y-1">
            <div>Monday – Saturday: 9:00 AM – 10:00 PM</div>
            <div className="text-emerald-600 text-[11px]">Service Bay: 9:30 AM – 7:00 PM</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Direct Phone Lines</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Reach our sales desk or commercial fleet manager directly during business hours.
          </p>
          <div className="pt-2 text-xs font-mono space-y-1">
            <div className="font-bold text-slate-900">Sales: 082941 73308</div>
            <div className="font-bold text-sky-700">Commercial: +91 98000 22222</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form & Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Enquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Send an Enquiry</h2>
              <p className="text-xs text-slate-500">We respond to phone & WhatsApp inquiries within 30 minutes</p>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-emerald-950">Enquiry Received</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you <strong className="font-bold">{fullName}</strong>. A showroom representative will reach you at <strong className="font-bold">{phone}</strong> regarding your <strong className="font-bold">{enquiryType}</strong> inquiry.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-bold text-emerald-800 underline"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enquiry Category
                </label>
                <select
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                >
                  <option value="Scooty Enquiry">Electric Scooty Purchase (Personal)</option>
                  <option value="Commercial E-Rickshaw">Commercial E-Rickshaw (Passenger 5-Seater)</option>
                  <option value="Financing & Subsidy">Loan Approval & State Subsidy Assistance</option>
                  <option value="Service & Battery">Service, Spares & Battery Warranty Check</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Details or Questions
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us any specific requirements or models you are interested in..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
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
                    Receive alerts, price updates, and state subsidy notifications via WhatsApp/SMS
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Showroom Enquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Interactive Map Placeholder & Showroom Visual */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between">
            {/* Visual map placeholder */}
            <div className="p-8 text-center space-y-4 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto shadow-lg">
                <Navigation className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Trisha Motors Showroom</h3>
                <p className="text-xs text-slate-400 mt-1">Trisha Motors EV Experience & Delivery Bay</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">Showroom is Currently Open</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Jamo Road, Baharia, Siwan, Bihar
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow"
              >
                <Navigation className="w-4 h-4 text-brand-600" />
                <span>Open in Google Maps Navigation</span>
              </a>
              <p className="text-[11px] text-slate-500 text-center">
                Spacious customer parking & EV fast-charger available on premise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
