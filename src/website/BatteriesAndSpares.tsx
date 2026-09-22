import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Battery,
  Zap,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
  Package,
  Sparkles,
  HelpCircle,
  Truck,
  Check,
} from 'lucide-react';

interface SpareItem {
  id: string;
  name: string;
  category: 'battery' | 'charger' | 'motor_controller' | 'body_spares';
  compatibility: string;
  price: string;
  warranty: string;
  badge?: string;
  features: string[];
}

export const BatteriesAndSpares: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryPart, setInquiryPart] = useState('E-Rickshaw Battery Pack (48V)');
  const [inquirySent, setInquirySent] = useState(false);

  const sparesList: SpareItem[] = [
    {
      id: 'bat-1',
      name: '48V 100Ah Heavy Duty E-Rickshaw Battery (Set of 4)',
      category: 'battery',
      compatibility: 'E-Rickshaw Model 1, Mayuri, Yatri & all standard commercial e-rickshaws',
      price: '₹28,500',
      warranty: '18 Months Replacement Warranty',
      badge: 'Bestseller for Rickshaws',
      features: [
        'High torque output for full 5-passenger load',
        'Specially tuned for rough town roads & slopes',
        'Instant on-spot replacement warranty at our showroom',
      ],
    },
    {
      id: 'bat-2',
      name: '60V 30Ah Lithium-Ion Smart Battery Pack (Scooty)',
      category: 'battery',
      compatibility: 'Scooty Model 1, Model 2, Model Pro & compatible EV 2-Wheelers',
      price: '₹24,000',
      warranty: '3 Years Comprehensive Warranty',
      badge: 'Lithium Smart Pack',
      features: [
        'Lightweight portable battery with handle for home charging',
        'Advanced BMS with fire-safe temperature cut-off',
        '85 km to 105 km range on single charge',
      ],
    },
    {
      id: 'chg-1',
      name: 'Smart Auto-Cut Microprocessor Fast Charger (48V / 60V)',
      category: 'charger',
      compatibility: 'Universal for both Scooty & E-Rickshaws',
      price: '₹3,200',
      warranty: '1 Year Warranty',
      badge: 'Safety Certified',
      features: [
        'Automatic power cut-off prevents battery overcharging',
        'Built-in surge protection against voltage fluctuations',
        'Heavy-duty copper transformer with cooling fan',
      ],
    },
    {
      id: 'mot-1',
      name: '1200W Waterproof High-Torque BLDC Motor & Differential',
      category: 'motor_controller',
      compatibility: 'E-Rickshaw (Commercial L5M/Passenger)',
      price: '₹8,500',
      warranty: '1 Year Showroom Warranty',
      badge: 'Heavy Hauling',
      features: [
        'Waterproof IP67 rated against monsoon waterlogging',
        'Extra climb power on flyovers and steep gradients',
        'High energy efficiency reduces daily charging cost',
      ],
    },
    {
      id: 'ctrl-1',
      name: '24-Tube Intelligent Sine-Wave Controller Unit',
      category: 'motor_controller',
      compatibility: 'E-Rickshaw & High-Speed EV Scooters',
      price: '₹2,800',
      warranty: '1 Year Warranty',
      features: [
        'Smooth noiseless acceleration without jerks',
        'Regenerative braking returns energy back to battery',
        'Reverse gear support with beep sound alarm',
      ],
    },
    {
      id: 'bdy-1',
      name: 'Heavy Duty Front Hydraulic Suspension & Shock Absorbers',
      category: 'body_spares',
      compatibility: 'E-Rickshaw & EV Scooters',
      price: '₹1,950',
      warranty: '6 Months Warranty',
      features: [
        'Absorbs town potholes for passenger comfort',
        'Reinforced steel coils with anti-rust coating',
        'Fitted by experienced technicians in our workshop',
      ],
    },
    {
      id: 'acc-1',
      name: 'All-Weather Waterproof Rexine Curtains & Rain Cover',
      category: 'body_spares',
      compatibility: 'E-Rickshaw Passenger Cabin',
      price: '₹1,400',
      warranty: 'Quality Assured',
      features: [
        'Protects passengers and driver from rain and dust',
        'Heavy gauge transparent plastic windows with zip',
        'Easy snap-on fittings',
      ],
    },
  ];

  const filtered = sparesList.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;
    setInquirySent(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Wrench className="w-3.5 h-3.5 mr-1.5" />
            100% Genuine Showroom Spare Parts & Workshop
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Batteries, Chargers & Genuine Spares
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We keep all essential batteries, motors, chargers, and body parts in stock at our showroom. E-rickshaw drivers and scooter owners get genuine parts at direct wholesale prices with on-spot warranty replacement.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-200">
            <span className="flex items-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
              On-Spot Battery Warranty
            </span>
            <span className="flex items-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
              Trained In-House Mechanics
            </span>
            <span className="flex items-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
              Same-Day Fitment
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Spares Catalog */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {[
              { id: 'all', label: 'All Spares & Batteries' },
              { id: 'battery', label: '🔋 Batteries (Lithium & Lead-Acid)' },
              { id: 'charger', label: '⚡ Smart Chargers' },
              { id: 'motor_controller', label: '⚙️ Motors & Controllers' },
              { id: 'body_spares', label: '🛠️ Body Parts & Accessories' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Spares Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-brand-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.category.replace('_', ' ')}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    <strong className="text-slate-700">Fits: </strong>
                    {item.compatibility}
                  </p>

                  <div className="mt-3 space-y-1">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start text-[11px] text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Showroom Price</span>
                    <span className="text-base font-black text-slate-900 font-mono">{item.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-700 block">
                      {item.warranty}
                    </span>
                    <a
                      href={`https://wa.me/919800011111?text=Hello%20Trisha%20Motors,%20I%20want%20to%20inquire%20about%20${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[11px] font-bold text-brand-600 hover:text-brand-800 mt-0.5"
                    >
                      <span>Inquire / Buy</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Local Workshop Guarantee Box */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Our Small-Town Showroom Promise
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  No waiting weeks for courier parts. We keep ready stock in our local warehouse so your daily e-rickshaw earnings never stop.
                </p>
              </div>
            </div>
            <a
              href="tel:+919800011111"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-sm shrink-0"
            >
              📞 Call Showroom Workshop
            </a>
          </div>
        </div>

        {/* Right Column: Quick Parts Inquiry Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Phone className="w-4 h-4 text-brand-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Quick Parts & Battery Inquiry
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Tell us which spare part or battery you need. Our showroom staff will call you with availability and exact discount price.
          </p>

          {inquirySent ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Inquiry Received!</h4>
              <p className="text-xs text-emerald-700">
                Thank you, <strong>{inquiryName}</strong>. Our showroom manager will call your mobile ({inquiryPhone}) shortly with best price.
              </p>
              <button
                onClick={() => setInquirySent(false)}
                className="text-xs font-bold text-emerald-800 underline mt-2 cursor-pointer"
              >
                Inquire about another part
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Required Item *</label>
                <select
                  value={inquiryPart}
                  onChange={(e) => setInquiryPart(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="E-Rickshaw Battery Pack (48V)">E-Rickshaw Battery Pack (48V Lead-Acid)</option>
                  <option value="Scooty Lithium Battery (60V)">Scooty Lithium-Ion Battery (60V)</option>
                  <option value="Smart Auto-Cut Charger">Smart Fast Charger (Auto-Cut)</option>
                  <option value="BLDC Motor & Differential">1200W BLDC Motor & Differential</option>
                  <option value="Controller Unit">Sine-Wave Motor Controller</option>
                  <option value="Suspension / Shocker">Front / Rear Shock Absorbers</option>
                  <option value="Tyres & Tubes">E-Rickshaw Heavy Duty Tyres</option>
                  <option value="Other Spares">Other Spare Part (Will tell on call)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-sm cursor-pointer transition-all"
              >
                Send Inquiry to Showroom
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-400">
                Or WhatsApp us directly at <span className="font-bold text-slate-700">+91 98000 11111</span>
              </div>
            </form>
          )}

          {/* Showroom Timing & Workshop Badge */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Workshop Open: Mon – Sun 9 AM to 8:30 PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              <span>Local Home Delivery available for batteries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
