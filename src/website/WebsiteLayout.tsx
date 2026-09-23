import React, { useEffect, useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Zap, Phone, MapPin, Clock, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BUSINESS } from './businessInfo';

const OFFER_DISMISSED_KEY = 'trisha_offer_dismissed';

const OfferPopup: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(OFFER_DISMISSED_KEY) === '1';
    } catch {
      // Storage unavailable (private mode) — just show the offer.
    }
    if (dismissed) return;
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(OFFER_DISMISSED_KEY, '1');
    } catch {
      // Ignore — dismissal just won't persist.
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 sm:right-auto sm:max-w-sm z-50 animate-fade-in">
      <div className="relative bg-ink-900 text-white rounded-2xl p-6 pr-12 shadow-2xl border border-ink-700">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close offer"
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-ink-400 hover:text-white hover:bg-ink-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="inline-block bg-orange-500 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded">
          Offer
        </span>
        <p className="font-display text-lg font-bold tracking-tight mt-3 leading-snug">
          Save up to ₹10,000 with the government EV subsidy
        </p>
        <p className="text-sm text-ink-400 mt-2 leading-relaxed">
          Zero road tax and free RTO registration on every scooty and e-rickshaw. We handle the paperwork.
        </p>
        <a
          href={BUSINESS.phoneTel}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call {BUSINESS.phoneDisplay}
        </a>
      </div>
    </div>
  );
};

export const WebsiteLayout: React.FC = () => {
  const { user, isCustomer } = useAuth();

  return (
    <div className="min-h-screen bg-white text-ink-800 flex flex-col font-body selection:bg-orange-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. MAIN MARKETING NAVIGATION HEADER (Corner-to-Corner Edge-to-Edge)      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-paper-300">
        <div className="w-full px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Brand Logo (Starts from Left Corner) */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white transition-colors group-hover:bg-orange-700">
              <Zap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-ink-900 block leading-none">
                Trisha Motors
              </span>
              <p className="text-[10px] font-medium text-ink-400 tracking-[0.15em] uppercase mt-1">
                Authorized EV Showroom
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-ink-900 font-semibold'
                    : 'text-ink-500 hover:text-ink-900 font-medium'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-ink-900 font-semibold'
                    : 'text-ink-500 hover:text-ink-900 font-medium'
                }`
              }
            >
              Our Vehicles
            </NavLink>

            <NavLink
              to="/calculator"
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-ink-900 font-semibold'
                    : 'text-ink-500 hover:text-ink-900 font-medium'
                }`
              }
            >
              Price & Subsidy
            </NavLink>

            <NavLink
              to="/spares"
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-ink-900 font-semibold'
                    : 'text-ink-500 hover:text-ink-900 font-medium'
                }`
              }
            >
              Batteries & Spares
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-ink-900 font-semibold'
                    : 'text-ink-500 hover:text-ink-900 font-medium'
                }`
              }
            >
              Showroom & Contact
            </NavLink>
          </nav>

          {/* Action CTAs: Customer Portal (Reaches Right Corner) */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {isCustomer ? (
              <Link
                to="/my-account"
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border border-paper-300 text-ink-700 text-xs font-semibold hover:border-ink-400 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Portal</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border border-paper-300 text-ink-700 text-xs font-semibold hover:border-ink-400 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            <a
              href={BUSINESS.phoneTel}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. DISMISSIBLE OFFER POPUP                                                */}
      {/* ========================================================================= */}
      <OfferPopup />

      {/* ========================================================================= */}
      {/* 3. MAIN PAGE CONTENT                                                      */}
      {/* ========================================================================= */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ========================================================================= */}
      {/* 4. MODIFIED DEALERSHIP FOOTER                                             */}
      {/* Structure: 1) Branding & Logo, 2) Sitemap Links, 3) Panels & CRM Links,    */}
      {/* 4) Showroom Contact & Certifications                                      */}
      {/* ========================================================================= */}
      <footer className="bg-ink-900 text-ink-400 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-ink-700">
            {/* Brand */}
            <div className="md:col-span-5 space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight text-white">
                  Trisha Motors
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Authorized electric vehicle showroom for scooties and commercial e-rickshaws.
                Honest pricing, government subsidy handled, and service you can walk into.
              </p>
            </div>

            {/* Vehicles */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                Vehicles
              </h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/explore" className="hover:text-white transition-colors">Electric Scooty Range</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Commercial E-Rickshaw</Link></li>
                <li><Link to="/calculator" className="hover:text-white transition-colors">Price &amp; Subsidy</Link></li>
                <li><Link to="/spares" className="hover:text-white transition-colors">Batteries &amp; Spares</Link></li>
              </ul>
            </div>

            {/* Visit */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                Visit the Showroom
              </h4>
              <div className="space-y-3 text-sm">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-orange-400" />
                  <span>{BUSINESS.addressOneLine}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-orange-400" />
                  <a href={BUSINESS.phoneTel} className="hover:text-white transition-colors">{BUSINESS.phoneDisplay}</a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 shrink-0 text-orange-400" />
                  <span>{BUSINESS.hoursShort}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>&copy; 2026 Trisha Motors. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a
                href="/images/CREDITS.json"
                className="text-ink-600 hover:text-ink-400 transition-colors"
              >
                Image credits
              </a>
              <Link to="/crm" className="text-ink-600 hover:text-ink-400 transition-colors">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
