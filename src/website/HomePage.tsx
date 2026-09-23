import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  MessageCircle,
  Gift,
  Wrench,
  BadgeCheck,
  BatteryCharging,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { MOCK_MODELS } from '../lib/mockData';
import { BUSINESS } from './businessInfo';

const PHONE_DISPLAY = BUSINESS.phoneDisplay;
const PHONE_TEL = BUSINESS.phoneTel;
const WHATSAPP_LINK = BUSINESS.whatsapp;

/** Demo photography — replace with Trisha Motors' own showroom photos. */
const MODEL_IMAGES: Record<string, string> = {
  'Scooty Model 1': '/images/hero-1.jpg',
  'Scooty Model 2': '/images/hero-2.jpg',
  'Scooty Model Pro': '/images/hero-3.jpg',
};
const FALLBACK_SCOOTY = '/images/hero-1.jpg';
const RICKSHAW_IMAGE = '/images/erickshaw.jpg';
const PRIZE_IMAGE = '/images/prize-phone.png';

/**
 * Hero slideshow frames. These are product shots on plain backgrounds and are
 * fairly low-resolution, so they're shown with object-contain rather than
 * cropped/upscaled.
 */
const HERO_SLIDES = [
  { src: '/images/hero-1.jpg', alt: 'Silver electric scooty' },
  { src: '/images/hero-2.jpg', alt: 'Grey electric scooty' },
  { src: '/images/hero-3.jpg', alt: 'Blue electric scooty on showroom display' },
] as const;

const SLIDE_MS = 3500;

const HeroSlideshow: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);

  const goTo = (next: number) =>
    setIndex((cur) => {
      if (next === cur) return cur;
      setPrev(cur);
      return next;
    });

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const t = setInterval(() => {
      setIndex((cur) => {
        setPrev(cur);
        return (cur + 1) % HERO_SLIDES.length;
      });
    }, SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-paper-300 aspect-[4/3] lg:aspect-[5/4]">
      {HERO_SLIDES.map((slide, i) => {
        // active sits centred; the outgoing slide exits left, the rest wait right
        const position =
          i === index
            ? 'opacity-100 translate-x-0 scale-100'
            : i === prev
              ? 'opacity-0 -translate-x-12 scale-[0.97]'
              : 'opacity-0 translate-x-12 scale-[0.97]';
        return (
          <div
            key={slide.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 flex items-center justify-center p-5 lg:p-8 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${position}`}
          >
            {/* sized to the image so the rounded corners hug the photo itself */}
            <img
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="max-w-full max-h-full w-auto h-auto rounded-xl"
            />
          </div>
        );
      })}

      {/* slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-ink-700' : 'w-1.5 bg-ink-400/50 hover:bg-ink-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/** Sun, rays and water — the visual language of Chhath Puja. */
const ChhathDecor: React.FC = () => (
  <svg
    viewBox="0 0 1440 420"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FB923C" stopOpacity="0.55" />
        <stop offset="60%" stopColor="#F97316" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* sun glow + disc */}
    <circle cx="1080" cy="215" r="240" fill="url(#sunGlow)" />
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i * 15 * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={1080 + Math.cos(a) * 118}
          y1={215 + Math.sin(a) * 118}
          x2={1080 + Math.cos(a) * (i % 2 ? 158 : 188)}
          y2={215 + Math.sin(a) * (i % 2 ? 158 : 188)}
          stroke="#FDBA74"
          strokeOpacity="0.35"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    })}
    <circle cx="1080" cy="215" r="104" fill="#F97316" fillOpacity="0.28" />

    {/* water ripples */}
    {[330, 356, 382, 408].map((y, i) => (
      <path
        key={y}
        d={`M-40,${y} q 90,-14 180,0 t 180,0 t 180,0 t 180,0 t 180,0 t 180,0 t 180,0 t 180,0`}
        fill="none"
        stroke="#FDBA74"
        strokeOpacity={0.22 - i * 0.04}
        strokeWidth="2.5"
      />
    ))}
  </svg>
);

/**
 * Decorative "ladi" — a string of festival bulbs hung across the top of a
 * section. Bulbs carry a soft glow and the whole string casts a drop shadow so
 * it reads as hanging in front of the content.
 */
/** Red, green, blue, yellow, orange — lit in sequence along the string. */
const BULB_COLORS = ['#EF4444', '#22C55E', '#3B82F6', '#FACC15', '#F97316'];
const BULB_COUNT = 60;
const BULB_SPACING = 24;

const Garland: React.FC<{ variant?: 'light' | 'dark'; id?: string }> = ({
  variant = 'dark',
  id = 'ladi',
}) => {
  const glowId = `${id}-glow`;
  const shadowId = `${id}-shadow`;

  return (
    <svg
      viewBox="0 0 1440 70"
      preserveAspectRatio="none"
      className="absolute top-0 left-0 w-full h-14 pointer-events-none z-20"
      aria-hidden="true"
    >
      <defs>
        {BULB_COLORS.map((c, ci) => (
          <radialGradient key={c} id={`${glowId}-${ci}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity={variant === 'dark' ? 0.9 : 0.6} />
            <stop offset="50%" stopColor={c} stopOpacity={variant === 'dark' ? 0.3 : 0.18} />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        ))}
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="200%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity={variant === 'dark' ? 0.55 : 0.3}
          />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        {/* the string */}
        <path
          d="M0,6 q 180,26 360,0 t 360,0 t 360,0 t 360,0"
          fill="none"
          stroke={variant === 'dark' ? '#14532D' : '#166534'}
          strokeWidth="2.5"
        />

        {Array.from({ length: BULB_COUNT }).map((_, i) => {
          const x = i * BULB_SPACING + 12;
          const phase = (x % 360) / 360;
          const y = 6 + Math.sin(phase * Math.PI) * 13;
          const color = BULB_COLORS[i % BULB_COLORS.length];
          const r = i % 3 === 1 ? 5.5 : 7;
          return (
            <g key={i}>
              {/* bulb cap */}
              <rect x={x - 2} y={y - r - 3} width="4" height="4" rx="1" fill="#14532D" />
              {/* bulb */}
              <circle cx={x} cy={y} r={r} fill={color} />
              {/* filament highlight */}
              <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.28} fill="#FFFFFF" fillOpacity="0.6" />
            </g>
          );
        })}
      </g>

      {/* glow sits above the shadowed group so it isn't darkened */}
      <g>
        {Array.from({ length: BULB_COUNT }).map((_, i) => {
          const x = i * BULB_SPACING + 12;
          const phase = (x % 360) / 360;
          const y = 6 + Math.sin(phase * Math.PI) * 13;
          const ci = i % BULB_COLORS.length;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={17}
              fill={`url(#${glowId}-${ci})`}
              className="animate-bulb-pulse motion-reduce:animate-none"
              style={{ animationDelay: `${(i % 12) * 0.15}s` }}
            />
          );
        })}
      </g>
    </svg>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode; tone?: 'light' | 'dark' }> = ({
  children,
  tone = 'dark',
}) => (
  <span
    className={`block text-[11px] font-semibold uppercase tracking-[0.22em] ${
      tone === 'light' ? 'text-orange-300' : 'text-ink-400'
    }`}
  >
    {children}
  </span>
);

export const HomePage: React.FC = () => {
  const scootyModels = MOCK_MODELS.filter((m) => m.body_type === 'Scooty');
  const rickshawModel = MOCK_MODELS.find((m) => m.body_type === 'E-Rickshaw');
  const featured = scootyModels[1] ?? scootyModels[0];
  const others = scootyModels.filter((m) => m.id !== featured?.id);
  const imageFor = (name?: string) => (name && MODEL_IMAGES[name]) || FALLBACK_SCOOTY;

  return (
    <div className="bg-white font-body text-ink-800">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-white border-b border-paper-300 lg:min-h-[calc(100vh-5rem)] flex flex-col">
        <Garland variant="light" id="ladi-hero" />
        {/* soft shadow cast by the hanging ladi */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/[0.07] to-transparent pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto px-6 lg:px-10 flex-1 flex items-center pt-16 pb-10 lg:pt-14 lg:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
            <div className="lg:col-span-6 space-y-7">
              <Eyebrow>Authorized EV Showroom</Eyebrow>

              <h1 className="font-display text-[3.25rem] leading-[0.95] sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-ink-900">
                Ride electric.
                <br />
                <span className="text-orange-600">Spend less.</span>
              </h1>

              <p className="text-base text-ink-500 max-w-md leading-relaxed">
                Electric scooties built for daily town riding — under ₹1 for every 6 km,
                three-year battery warranty, and yours to ride home the same day.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center gap-2.5 px-7 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-4 border border-paper-400 hover:border-ink-900 text-ink-900 font-semibold text-sm rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              <div className="hidden lg:flex items-center gap-2 pt-4 text-ink-400">
                <ChevronDown className="w-4 h-4 animate-bounce" />
                <span className="text-[11px] font-medium uppercase tracking-[0.15em]">
                  Scroll to explore
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <HeroSlideshow />
            </div>
          </div>
        </div>

        {/* Spec strip — closes the first viewport frame */}
        <div className="border-t border-paper-300 shrink-0">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-3 divide-x divide-paper-300">
            {[
              { value: `${featured?.range_km ?? 105} km`, label: 'Certified Range' },
              { value: '₹0.15', label: 'Cost Per Km' },
              { value: '3 Years', label: 'Battery Warranty' },
            ].map((s) => (
              <div key={s.label} className="py-5 lg:py-6 px-2 sm:px-6 first:pl-0">
                <div className="font-display text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums text-ink-900">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-ink-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CHHATH PUJA OFFER ================= */}
      <section className="relative overflow-hidden bg-navy-800 text-white">
        <ChhathDecor />
        <Garland variant="dark" id="ladi-offer" />
        {/* soft shadow cast by the hanging ladi */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 bg-orange-500 text-white text-[11px] font-bold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full">
                🪔 Chhath Puja Special
              </span>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.025em] leading-[1.03]">
                Win an <span className="text-orange-400">iPhone 18</span>
                <br />
                this Chhath Puja.
              </h2>

              <p className="text-orange-50/80 max-w-lg leading-relaxed">
                Every vehicle booked this festive season enters our lucky draw — one lucky
                customer rides home on a new scooty and takes home a brand-new iPhone 18.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center gap-2.5 px-7 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-orange-900/40"
                >
                  <Gift className="w-4 h-4" />
                  Book &amp; Enter the Draw
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-4 border border-white/25 hover:border-white/60 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask on WhatsApp
                </a>
              </div>

              <p className="text-[11px] text-orange-100/50 pt-1">
                Offer valid on bookings made during the festive period. Draw conducted at the showroom.
              </p>
            </div>

            {/* Prize */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-orange-400/20 blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden border-4 border-orange-400/70 shadow-2xl w-44 lg:w-60 aspect-[500/603] bg-[#F5F5F7]">
                  <img
                    src={PRIZE_IMAGE}
                    alt="iPhone 18 Pro in deep red — lucky draw prize"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-navy-900 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                  Lucky Draw Prize
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <div className="border-b border-paper-300 bg-paper-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[11px] font-medium uppercase tracking-[0.15em] text-ink-500">
          <span>Authorized Dealer</span>
          <span className="hidden sm:inline text-paper-400">/</span>
          <span>₹10,000 Govt. Subsidy</span>
          <span className="hidden sm:inline text-paper-400">/</span>
          <span>Same-Day Delivery</span>
          <span className="hidden sm:inline text-paper-400">/</span>
          <span>In-House Service</span>
        </div>
      </div>

      {/* ================= MODELS ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-4">
            <Eyebrow>The Range</Eyebrow>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-ink-900 max-w-lg leading-[1.05]">
              Three scooties. Every kind of rider.
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 border-b border-ink-900 pb-1 hover:gap-2.5 transition-all shrink-0"
          >
            Compare specifications
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-paper-300 border border-paper-300 rounded-t-2xl overflow-hidden">
            <div className="lg:col-span-7 bg-white min-h-[320px] flex items-center justify-center p-8 lg:p-12">
              <img
                src={imageFor(featured.model_name)}
                alt={featured.model_name}
                className="max-w-full max-h-[380px] w-auto h-auto rounded-xl"
                loading="lazy"
              />
            </div>

            <div className="lg:col-span-5 bg-white p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-orange-600 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded">
                  Most Popular
                </span>
                <h3 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-ink-900 mt-6">
                  {featured.model_name}
                </h3>
                <p className="text-sm text-ink-500 mt-2">{featured.variant} · 2-Seater</p>

                <dl className="mt-10 space-y-0">
                  {[
                    ['Range', `${featured.range_km} km`],
                    ['Battery', `${featured.battery_kwh} kWh`],
                    ['Motor', `${featured.motor_power_kw} kW`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between py-3.5 border-b border-paper-300"
                    >
                      <dt className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-400">
                        {label}
                      </dt>
                      <dd className="font-display text-xl font-semibold tabular-nums text-ink-900">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-10">
                <div className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-400">
                  Ex-Showroom
                </div>
                <div className="font-display text-4xl font-bold tabular-nums text-ink-900 mt-1">
                  ₹{featured.ex_showroom_price.toLocaleString('en-IN')}
                </div>
                <a
                  href={PHONE_TEL}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call to Book
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="border-x border-b border-paper-300 rounded-b-2xl overflow-hidden">
          {others.map((m) => (
            <div
              key={m.id}
              className="group bg-white hover:bg-paper-50 transition-colors border-b border-paper-300 last:border-b-0"
            >
              <div className="px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-full sm:w-36 h-28 sm:h-24 rounded-xl overflow-hidden bg-white border border-paper-200 shrink-0 flex items-center justify-center p-1.5">
                  <img
                    src={imageFor(m.model_name)}
                    alt={m.model_name}
                    className="max-w-full max-h-full w-auto h-auto rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-xl font-bold tracking-tight text-ink-900">
                    {m.model_name}
                  </h4>
                  <p className="text-sm text-ink-500 mt-1">
                    {m.range_km} km range · {m.battery_kwh} kWh · {m.motor_power_kw} kW
                  </p>
                </div>
                <div className="font-display text-2xl font-bold tabular-nums text-ink-900 sm:text-right">
                  ₹{m.ex_showroom_price.toLocaleString('en-IN')}
                </div>
                <Link
                  to="/calculator"
                  className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 group-hover:gap-2.5 transition-all"
                >
                  Details
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {rickshawModel && (
          <div className="mt-16 border border-paper-300 rounded-2xl bg-white overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-64 h-48 sm:h-auto bg-paper-100 shrink-0">
              <img
                src={RICKSHAW_IMAGE}
                alt={rickshawModel.model_name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-6 px-8 py-7">
              <div className="flex-1">
                <Eyebrow>Also Available · Commercial</Eyebrow>
                <h3 className="font-display text-xl font-bold tracking-tight text-ink-900 mt-2.5">
                  {rickshawModel.model_name}
                </h3>
                <p className="text-sm text-ink-500 mt-1">
                  5-seater passenger E-Rickshaw · {rickshawModel.range_km} km range · ₹
                  {rickshawModel.ex_showroom_price.toLocaleString('en-IN')}
                </p>
              </div>
              <a
                href={PHONE_TEL}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 border border-ink-900 hover:bg-ink-900 hover:text-white text-ink-900 font-semibold text-sm rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                Enquire
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ================= SERVICE & MAINTENANCE ================= */}
      <section className="bg-amber-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Eyebrow>Service &amp; Maintenance</Eyebrow>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-ink-900 leading-[1.05]">
                Expert service.
                <br />
                <span className="text-orange-600">Genuine parts.</span>
              </h2>
              <p className="text-ink-500 max-w-md leading-relaxed">
                Your scooty is looked after by trained EV technicians right here in Siwan —
                no sending it away to the city, no local-market duplicate parts.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={BUSINESS.phoneTel}
                  className="inline-flex items-center gap-2.5 px-7 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                  Book a Service
                </a>
                <Link
                  to="/spares"
                  className="inline-flex items-center gap-2 px-7 py-4 border border-amber-300 hover:border-orange-600 text-ink-900 font-semibold text-sm rounded-lg transition-colors"
                >
                  Batteries &amp; Spares
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-amber-200/70 border border-amber-200/70 rounded-2xl overflow-hidden">
              {[
                {
                  icon: Wrench,
                  title: 'Trained EV technicians',
                  body: 'Factory-trained for electric drivetrains, controllers and battery packs.',
                },
                {
                  icon: BadgeCheck,
                  title: '100% genuine parts',
                  body: 'Only manufacturer-supplied spares — every part billed and warranty-backed.',
                },
                {
                  icon: BatteryCharging,
                  title: 'Free battery health check',
                  body: 'Bring your scooty in any time for a range and battery health diagnosis.',
                },
                {
                  icon: Clock,
                  title: 'Same-day turnaround',
                  body: 'Most routine services are done and handed back the same day.',
                },
              ].map((f) => (
                <div key={f.title} className="bg-amber-50 p-7 space-y-3">
                  <f.icon className="w-6 h-6 text-orange-600" />
                  <h3 className="font-display text-base font-bold tracking-tight text-ink-900">
                    {f.title}
                  </h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="border-y border-paper-300 bg-paper-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="max-w-xl space-y-4 mb-16">
            <Eyebrow>Why Trisha Motors</Eyebrow>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-ink-900 leading-[1.05]">
              Straight answers, fair prices.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-paper-300 border border-paper-300">
            {[
              {
                n: '01',
                title: 'Your vehicle, reserved',
                body: 'Book it and that exact scooty is set aside in your name. No mix-ups, no waiting list surprises.',
              },
              {
                n: '02',
                title: 'Subsidy handled here',
                body: 'Up to ₹10,000 government subsidy applied straight to your bill. We file the paperwork.',
              },
              {
                n: '03',
                title: 'Service in town',
                body: 'Trained technicians and genuine battery parts on site. No travelling to the city for repairs.',
              },
              {
                n: '04',
                title: 'Ride home the same day',
                body: 'In-stock models leave with temporary registration and insurance sorted the same day.',
              },
            ].map((item) => (
              <div key={item.n} className="bg-white p-8 lg:p-10 space-y-5">
                <div className="font-display text-sm font-bold tabular-nums text-orange-600">
                  {item.n}
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Eyebrow>From Our Riders</Eyebrow>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-12">
          {[
            {
              quote:
                'My monthly fuel cost went from ₹3,000 to under ₹200. Charging at home takes three hours and the papers were done in two days.',
              name: 'Customer 1',
              role: 'Scooty Owner',
            },
            {
              quote:
                'Best buy for my passenger route. Seats five comfortably and the battery easily lasts 110 km a day. They helped with the loan too.',
              name: 'Customer 2',
              role: 'E-Rickshaw Owner',
            },
          ].map((t) => (
            <figure key={t.name} className="space-y-8">
              <blockquote className="font-display text-2xl lg:text-[1.75rem] font-medium leading-[1.35] tracking-[-0.015em] text-ink-900">
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-4 pt-6 border-t border-paper-300">
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                  {t.name.slice(-1)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{t.name}</div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-ink-400 mt-0.5">
                    {t.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="border-t border-paper-300 bg-paper-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7 space-y-5">
              <Eyebrow>Visit Us</Eyebrow>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-[-0.025em] leading-[1.05] text-ink-900">
                Come see them in person.
              </h2>
              <p className="text-ink-500 max-w-md leading-relaxed">
                Walk in Monday to Saturday between 9:00 AM and 10:00 PM, or call ahead and we'll keep one ready for you.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <a
                href={PHONE_TEL}
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-4 border border-paper-400 hover:border-ink-900 text-ink-900 font-semibold text-sm rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
