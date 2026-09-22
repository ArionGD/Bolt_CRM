import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Lock,
  Mail,
  ArrowRight,
  Phone,
  User,
  Bell,
  Globe,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsCustomer } = useAuth();
  const navigate = useNavigate();

  // Tab: 'manager' (Showroom Manager) or 'customer'
  const [activeTab, setActiveTab] = useState<'manager' | 'customer'>('manager');

  // Manager form state
  const [email, setEmail] = useState('manager1@trishamotors.com');
  const [password, setPassword] = useState('manager123');

  // Customer Form
  const [customerName, setCustomerName] = useState('Customer 1');
  const [customerPhone, setCustomerPhone] = useState('+91 98000 00001');
  const [receiveAlerts, setReceiveAlerts] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await login(email, password);
      navigate('/crm');
    } catch (err: any) {
      setErrorMsg(err.message || 'Manager login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Full Name and Phone Number are required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await loginAsCustomer(customerName.trim(), customerPhone.trim(), receiveAlerts);
      navigate('/my-account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Customer authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-block">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-sky-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-600/25 mb-3 hover:scale-105 transition-transform">
            <Zap className="w-8 h-8 stroke-[2.5]" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Trisha <span className="text-emerald-400">Motors</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Account Login — Manager CRM & Customer Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/85 backdrop-blur-2xl py-7 px-6 sm:px-8 shadow-2xl rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
          {/* Specular top border line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('manager');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeTab === 'manager'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Showroom Manager
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeTab === 'customer'
                  ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer Access
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: Showroom Manager Login */}
          {activeTab === 'manager' ? (
            <form onSubmit={handleManagerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Manager Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="manager1@trishamotors.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Enter Showroom CRM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* TAB 2: Customer Access (Name + Phone + Alerts Checkbox) */
            <form onSubmit={handleCustomerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Customer 1"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98000 00001"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Checkbox: Receive alerts and latest offers */}
              <label className="flex items-start space-x-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] cursor-pointer hover:bg-white/[0.04] transition-colors">
                <input
                  type="checkbox"
                  checked={receiveAlerts}
                  onChange={(e) => setReceiveAlerts(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-sky-400 focus:ring-offset-slate-900 w-4 h-4"
                />
                <div className="text-slate-300 text-xs leading-tight">
                  <div className="font-semibold text-white flex items-center space-x-1">
                    <Bell className="w-3.5 h-3.5 text-sky-400" />
                    <span>Receive alerts and latest offers</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Stay informed on new EV models, state subsidies, and your booking status.
                  </p>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Enter Customer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Links & Superuser Axum notice */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <Link to="/" className="hover:text-white flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Back to Website</span>
            </Link>

            <a
              href="http://localhost:8080/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Superuser (/admin)</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
