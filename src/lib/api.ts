import {
  AccountRecord,
  Customer,
  Lead,
  Order,
  Payment,
  Quotation,
  SalesSummaryReport,
  StockAgeingBucket,
  TestDrive,
  Vehicle,
  VehicleModel,
} from '../types';
import {
  MOCK_ACCOUNTS,
  MOCK_CUSTOMERS,
  MOCK_LEADS,
  MOCK_MODELS,
  MOCK_ORDERS,
  MOCK_QUOTATIONS,
  MOCK_TEST_DRIVES,
  MOCK_VEHICLES,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Local storage keys for persistent demo mode
const STORAGE_KEYS = {
  ACCOUNTS: 'volt_v2_accounts',
  VEHICLES: 'volt_v2_vehicles',
  CUSTOMERS: 'volt_v2_customers',
  LEADS: 'volt_v2_leads',
  QUOTATIONS: 'volt_v2_quotations',
  ORDERS: 'volt_v2_orders',
  TEST_DRIVES: 'volt_v2_test_drives',
  PAYMENTS: 'volt_v2_payments',
  MODELS: 'volt_v2_models',
};

function getStored<T>(key: string, defaultVal: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T[]): void {
  localStorage.setItem(key, JSON.stringify(val));
}

export const api = {
  // --- Catalogue ---
  async getModels(): Promise<VehicleModel[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/models`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEYS.MODELS, MOCK_MODELS);
  },

  // --- Vehicles ---
  async getVehicles(filter?: { status?: string; colour?: string }): Promise<Vehicle[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const params = new URLSearchParams();
      if (filter?.status) params.set('status', filter.status);
      if (filter?.colour) params.set('colour', filter.colour);
      const res = await fetch(`${API_BASE_URL}/vehicles?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    let list = getStored(STORAGE_KEYS.VEHICLES, MOCK_VEHICLES);
    if (filter?.status) {
      list = list.filter((v) => v.status === filter.status);
    }
    return list;
  },

  async addVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const models = await this.getModels();
    const model = models.find((m) => m.id === vehicle.model_id);
    const newV: Vehicle = {
      id: 'v_' + Date.now(),
      model_id: vehicle.model_id || 'm1',
      vin: vehicle.vin || 'VIN' + Date.now(),
      motor_no: vehicle.motor_no,
      battery_serial: vehicle.battery_serial,
      colour: vehicle.colour || 'Pearl White',
      manufacture_year: vehicle.manufacture_year || 2026,
      condition: vehicle.condition || 'new',
      status: vehicle.status || 'in_stock',
      purchase_price: vehicle.purchase_price,
      asking_price: vehicle.asking_price || (model?.ex_showroom_price ? model.ex_showroom_price + 5000 : 75000),
      odometer_km: vehicle.odometer_km || 0,
      location: vehicle.location || 'Showroom Floor',
      arrival_date: vehicle.arrival_date || new Date().toISOString().split('T')[0],
      notes: vehicle.notes,
      brand: model?.brand,
      model_name: model?.model_name,
      variant: model?.variant,
      created_at: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicle),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const current = getStored(STORAGE_KEYS.VEHICLES, MOCK_VEHICLES);
    current.unshift(newV);
    setStored(STORAGE_KEYS.VEHICLES, current);
    return newV;
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const current = getStored<Vehicle>(STORAGE_KEYS.VEHICLES, MOCK_VEHICLES);
    const idx = current.findIndex((v) => v.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates };
      setStored(STORAGE_KEYS.VEHICLES, current);
      return current[idx];
    }
    throw new Error('Vehicle not found');
  },

  // --- Customers ---
  async getCustomers(search?: string): Promise<Customer[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API_BASE_URL}/customers${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    let list = getStored(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async addCustomer(customer: Partial<Customer>): Promise<Customer> {
    const newC: Customer = {
      id: 'c_' + Date.now(),
      full_name: customer.full_name || 'Anonymous Customer',
      phone: customer.phone || '',
      email: customer.email,
      type: customer.type || 'individual',
      gst_number: customer.gst_number,
      address_line: customer.address_line,
      city: customer.city || 'Bengaluru',
      state: customer.state || 'Karnataka',
      pincode: customer.pincode,
      source: customer.source || 'walk-in',
      notes: customer.notes,
      created_at: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(customer),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const current = getStored(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS);
    current.unshift(newC);
    setStored(STORAGE_KEYS.CUSTOMERS, current);
    return newC;
  },

  // --- Leads ---
  async getLeads(): Promise<Lead[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEYS.LEADS, MOCK_LEADS);
  },

  async addLead(lead: Partial<Lead>): Promise<Lead> {
    const newL: Lead = {
      id: 'l_' + Date.now(),
      customer_id: lead.customer_id || '',
      model_id: lead.model_id,
      status: lead.status || 'new',
      expected_close_date: lead.expected_close_date,
      customer_name: lead.customer_name,
      customer_phone: lead.customer_phone,
      brand: lead.brand,
      model_name: lead.model_name,
      created_at: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lead),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const current = getStored(STORAGE_KEYS.LEADS, MOCK_LEADS);
    current.unshift(newL);
    setStored(STORAGE_KEYS.LEADS, current);
    return newL;
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Fallback
    }
    const current = getStored<Lead>(STORAGE_KEYS.LEADS, MOCK_LEADS);
    const idx = current.findIndex((l) => l.id === id);
    if (idx !== -1) {
      current[idx].status = status;
      setStored(STORAGE_KEYS.LEADS, current);
    }
  },

  // --- Quotations ---
  async getQuotations(): Promise<Quotation[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/quotations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEYS.QUOTATIONS, MOCK_QUOTATIONS);
  },

  async createQuotation(data: {
    customer_id: string;
    model_id: string;
    vehicle_id?: string;
    insurance?: number;
    registration?: number;
    accessories_total?: number;
    handling_charges?: number;
    discount?: number;
    subsidy_amount?: number;
    valid_until?: string;
  }): Promise<Quotation> {
    const models = await this.getModels();
    const customers = await this.getCustomers();
    const model = models.find((m) => m.id === data.model_id);
    const customer = customers.find((c) => c.id === data.customer_id);

    const ex = model?.ex_showroom_price || 78000;
    const ins = data.insurance || 3500;
    const reg = data.registration || 2000;
    const acc = data.accessories_total || 0;
    const hnd = data.handling_charges || 1000;
    const disc = data.discount || 0;
    const sub = data.subsidy_amount || 0;
    const onRoad = ex + ins + reg + acc + hnd - disc - sub;

    const newQ: Quotation = {
      id: 'q_' + Date.now(),
      quote_number: `QT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      customer_id: data.customer_id,
      model_id: data.model_id,
      vehicle_id: data.vehicle_id,
      ex_showroom: ex,
      insurance: ins,
      registration: reg,
      accessories_total: acc,
      handling_charges: hnd,
      discount: disc,
      subsidy_amount: sub,
      on_road_total: onRoad,
      valid_until: data.valid_until || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'draft',
      customer_name: customer?.full_name || 'Customer',
      customer_phone: customer?.phone || '',
      brand: model?.brand,
      model_name: model?.model_name,
      variant: model?.variant,
      created_at: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/quotations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const current = getStored(STORAGE_KEYS.QUOTATIONS, MOCK_QUOTATIONS);
    current.unshift(newQ);
    setStored(STORAGE_KEYS.QUOTATIONS, current);
    return newQ;
  },

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
  },

  async createOrder(data: {
    customer_id: string;
    vehicle_id: string;
    quotation_id?: string;
    booking_amount?: number;
    payment_mode?: 'cash' | 'finance' | 'lease';
    finance_partner?: string;
    loan_amount?: number;
    expected_delivery?: string;
  }): Promise<Order> {
    const customers = await this.getCustomers();
    const vehicles = await this.getVehicles();
    const customer = customers.find((c) => c.id === data.customer_id);
    const vehicle = vehicles.find((v) => v.id === data.vehicle_id);

    if (vehicle && vehicle.status !== 'in_stock' && vehicle.status !== 'in_transit') {
      throw new Error(`Vehicle ${vehicle.vin} is already reserved or sold! Double-selling prevented.`);
    }

    const totalAmount = vehicle?.asking_price || 82000;
    const bookingAmt = data.booking_amount || 10000;

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      order_number: `ORD-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      customer_id: data.customer_id,
      customer_name: customer?.full_name || 'Customer 1',
      customer_phone: customer?.phone || '',
      vehicle_id: data.vehicle_id,
      vin: vehicle?.vin || 'VIN' + Date.now(),
      brand: vehicle?.brand || 'Dealer 1 EV',
      model_name: vehicle?.model_name || 'Scooty Model 1',
      colour: vehicle?.colour || 'White',
      quotation_id: data.quotation_id,
      booking_date: new Date().toISOString().split('T')[0],
      total_amount: totalAmount,
      booking_amount: bookingAmt,
      total_paid: bookingAmt,
      balance_due: totalAmount - bookingAmt,
      status: 'booked',
      payment_mode: data.payment_mode || 'cash',
      finance_partner: data.finance_partner,
      loan_amount: data.loan_amount,
      expected_delivery: data.expected_delivery,
      created_at: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    // Reserve vehicle in local mock store
    if (vehicle) {
      await this.updateVehicle(vehicle.id, { status: 'reserved' });
    }

    const current = getStored(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
    current.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, current);
    return newOrder;
  },

  async addPayment(orderId: string, payment: { amount: number; method: Payment['method']; notes?: string }): Promise<void> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      await fetch(`${API_BASE_URL}/orders/${orderId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payment),
      });
    } catch {
      // Fallback
    }

    const orders = getStored<Order>(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
    const ordIdx = orders.findIndex((o) => o.id === orderId);
    if (ordIdx !== -1) {
      const order = orders[ordIdx];
      const newPaid = Number(order.total_paid) + Number(payment.amount);
      const newBalance = Math.max(0, Number(order.total_amount) - newPaid);
      orders[ordIdx] = {
        ...order,
        total_paid: newPaid,
        balance_due: newBalance,
        status: newBalance === 0 ? 'ready_for_delivery' : 'payment_pending',
      };
      setStored(STORAGE_KEYS.ORDERS, orders);
    }
  },

  // --- Test Drives ---
  async getTestDrives(): Promise<TestDrive[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/test-drives`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return getStored(STORAGE_KEYS.TEST_DRIVES, MOCK_TEST_DRIVES);
  },

  async scheduleTestDrive(data: Partial<TestDrive>): Promise<TestDrive> {
    const customers = await this.getCustomers();
    const customer = customers.find((c) => c.id === data.customer_id);

    const newTd: TestDrive = {
      id: 'td_' + Date.now(),
      customer_id: data.customer_id || '',
      vehicle_id: data.vehicle_id,
      model_id: data.model_id,
      scheduled_at: data.scheduled_at || new Date().toISOString(),
      status: 'scheduled',
      customer_name: customer?.full_name || 'Customer',
      customer_phone: customer?.phone || '',
      brand: data.brand || 'Dealer 1 EV',
      model_name: data.model_name || 'Scooty Model 1',
      created_at: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/test-drives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const current = getStored(STORAGE_KEYS.TEST_DRIVES, MOCK_TEST_DRIVES);
    current.unshift(newTd);
    setStored(STORAGE_KEYS.TEST_DRIVES, current);
    return newTd;
  },

  // --- Reports ---
  async getSalesSummary(): Promise<SalesSummaryReport> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/reports/sales-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const orders = await this.getOrders();
    const total_orders = orders.length;
    const total_delivered = orders.filter((o) => o.status === 'delivered').length;
    const total_booked = orders.filter((o) => o.status === 'booked' || o.status === 'payment_pending').length;
    const total_sales_value = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const total_cash_collected = orders.reduce((sum, o) => sum + Number(o.total_paid), 0);
    const total_outstanding_balance = Math.max(0, total_sales_value - total_cash_collected);

    return {
      total_orders,
      total_delivered,
      total_booked,
      total_sales_value,
      total_cash_collected,
      total_outstanding_balance,
    };
  },

  async getStockAgeing(): Promise<StockAgeingBucket> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/reports/stock-ageing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const vehicles = await this.getVehicles();
    const now = Date.now();
    let under_30_days = 0;
    let days_30_to_60 = 0;
    let days_60_to_90 = 0;
    let over_90_days = 0;

    vehicles.forEach((v) => {
      const date = v.arrival_date ? new Date(v.arrival_date).getTime() : new Date(v.created_at).getTime();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (diffDays < 30) under_30_days++;
      else if (diffDays < 60) days_30_to_60++;
      else if (diffDays < 90) days_60_to_90++;
      else over_90_days++;
    });

    return {
      under_30_days,
      days_30_to_60,
      days_60_to_90,
      over_90_days,
    };
  },

  // ==========================================
  // Superuser Admin Panel & Account Operations
  // ==========================================
  async getAccounts(): Promise<AccountRecord[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-superuser-token';
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const accounts = getStored<AccountRecord>(STORAGE_KEYS.ACCOUNTS, MOCK_ACCOUNTS);
    // Ensure Superuser from .env is always present
    const superEmail = import.meta.env.VITE_SUPERUSER_EMAIL || 'superuser@voltdealership.com';
    const superName = import.meta.env.VITE_SUPERUSER_NAME || 'Developer Superuser';
    if (!accounts.some((a) => a.role === 'superuser')) {
      accounts.unshift({
        id: 'usr_superuser_0',
        email: superEmail,
        full_name: superName,
        role: 'superuser',
        receive_alerts: false,
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
      });
      setStored(STORAGE_KEYS.ACCOUNTS, accounts);
    }
    return accounts;
  },

  async createManager(data: {
    full_name: string;
    email: string;
    phone?: string;
    password?: string;
  }): Promise<AccountRecord> {
    const newAcc: AccountRecord = {
      id: 'usr_mgr_' + Date.now(),
      email: data.email,
      phone: data.phone,
      full_name: data.full_name,
      role: 'manager',
      receive_alerts: false,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('volt_token') || 'demo-superuser-token';
      const res = await fetch(`${API_BASE_URL}/admin/managers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const accounts = getStored<AccountRecord>(STORAGE_KEYS.ACCOUNTS, MOCK_ACCOUNTS);
    accounts.unshift(newAcc);
    setStored(STORAGE_KEYS.ACCOUNTS, accounts);
    return newAcc;
  },

  async toggleUserStatus(id: string, is_active: boolean): Promise<void> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-superuser-token';
      await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active }),
      });
    } catch {
      // Fallback
    }

    const accounts = getStored<AccountRecord>(STORAGE_KEYS.ACCOUNTS, MOCK_ACCOUNTS);
    const updated = accounts.map((a) => (a.id === id ? { ...a, is_active } : a));
    setStored(STORAGE_KEYS.ACCOUNTS, updated);
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-superuser-token';
      await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Fallback
    }

    const accounts = getStored<AccountRecord>(STORAGE_KEYS.ACCOUNTS, MOCK_ACCOUNTS);
    const filtered = accounts.filter((a) => a.id !== id);
    setStored(STORAGE_KEYS.ACCOUNTS, filtered);
  },

  async customerAuth(
    full_name: string,
    phone: string,
    receive_alerts: boolean
  ): Promise<{ token: string; user: AccountRecord }> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, phone, receive_alerts }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    // Upsert customer in local store
    const customers = getStored<Customer>(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS);
    let existing = customers.find((c) => c.phone === phone);
    if (!existing) {
      existing = {
        id: 'c_' + Date.now(),
        full_name,
        phone,
        type: 'individual',
        receive_alerts,
        created_at: new Date().toISOString(),
      };
      customers.unshift(existing);
      setStored(STORAGE_KEYS.CUSTOMERS, customers);
    } else {
      existing.full_name = full_name;
      existing.receive_alerts = receive_alerts;
      setStored(STORAGE_KEYS.CUSTOMERS, [...customers]);
    }

    // Also track in accounts store
    const accounts = getStored<AccountRecord>(STORAGE_KEYS.ACCOUNTS, MOCK_ACCOUNTS);
    let acc = accounts.find((a) => a.phone === phone);
    if (!acc) {
      acc = {
        id: existing.id,
        phone,
        full_name,
        role: 'customer',
        receive_alerts,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      accounts.unshift(acc);
      setStored(STORAGE_KEYS.ACCOUNTS, accounts);
    } else {
      acc.full_name = full_name;
      acc.receive_alerts = receive_alerts;
      setStored(STORAGE_KEYS.ACCOUNTS, [...accounts]);
    }

    return {
      token: 'demo-customer-token',
      user: acc,
    };
  },
};
