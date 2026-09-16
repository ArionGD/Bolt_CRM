import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isManager: boolean;
  isCustomer: boolean;
  isSuperuser: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsCustomer: (name: string, phone: string, receiveAlerts: boolean) => Promise<void>;
  logout: () => void;
}

export const DEMO_PROFILES: Record<string, UserProfile> = {
  manager: {
    id: 'usr_manager_1',
    email: 'manager1@voltdealership.com',
    full_name: 'Manager 1',
    phone: '+91 98000 11111',
    role: 'manager',
    receive_alerts: false,
  },
  customer: {
    id: 'c1',
    email: 'customer1@example.com',
    full_name: 'Customer 1',
    phone: '+91 98000 00001',
    role: 'customer',
    receive_alerts: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('volt_user_profile_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    // Default to Showroom Manager 1 for CRM operations
    return DEMO_PROFILES.manager;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsDemoMode(false);
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'Manager 1',
          role: (session.user.user_metadata?.role as UserRole) || 'manager',
        });
        localStorage.setItem('volt_token', session.access_token);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsDemoMode(false);
        const u: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'Manager 1',
          role: (session.user.user_metadata?.role as UserRole) || 'manager',
        };
        setUser(u);
        localStorage.setItem('volt_user_profile_v2', JSON.stringify(u));
        localStorage.setItem('volt_token', session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          phone: data.user.phone,
          role: data.user.role as UserRole,
          receive_alerts: data.user.receive_alerts,
        };
        setUser(profile);
        localStorage.setItem('volt_user_profile_v2', JSON.stringify(profile));
        localStorage.setItem('volt_token', data.token);
        return;
      }
    } catch {
      // Offline fallback
    }

    // Default fallback based on single account credentials entered
    const mgrProfile: UserProfile = {
      id: 'usr_manager_1',
      email: trimmedEmail || 'manager1@voltdealership.com',
      full_name: 'Manager 1',
      phone: '+91 98000 11111',
      role: 'manager',
      receive_alerts: false,
    };
    setUser(mgrProfile);
    localStorage.setItem('volt_user_profile_v2', JSON.stringify(mgrProfile));
    localStorage.setItem('volt_token', 'demo-manager-token');
  };

  const loginAsCustomer = async (name: string, phone: string, receiveAlerts: boolean) => {
    const res = await api.customerAuth(name.trim(), phone.trim(), receiveAlerts);
    const profile: UserProfile = {
      id: res.user.id,
      phone: res.user.phone,
      full_name: res.user.full_name,
      role: 'customer',
      receive_alerts: res.user.receive_alerts,
    };
    setUser(profile);
    localStorage.setItem('volt_user_profile_v2', JSON.stringify(profile));
    localStorage.setItem('volt_token', res.token);
  };

  const logout = () => {
    supabase.auth.signOut().catch(() => {});
    setUser(null);
    localStorage.removeItem('volt_user_profile_v2');
    localStorage.removeItem('volt_token');
  };

  const currentRole = user?.role || 'manager';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        isManager: currentRole === 'manager' || currentRole === 'sales' || currentRole === 'accounts' || currentRole === 'admin',
        isCustomer: currentRole === 'customer',
        isSuperuser: currentRole === 'superuser',
        isDemoMode,
        login,
        loginAsCustomer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
