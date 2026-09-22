import {
  AccountRecord,
  ComponentItem,
  Customer,
  DailySalesAggregate,
  Lead,
  MonthlySalesAggregate,
  Order,
  OrderItem,
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
  MOCK_COMPONENTS,
  MOCK_CUSTOMERS,
  MOCK_LEADS,
  MOCK_MODELS,
  MOCK_ORDERS,
  MOCK_QUOTATIONS,
  MOCK_TEST_DRIVES,
  MOCK_VEHICLES,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Clean, versioned local storage keys (zero pre-set junk)
const STORAGE_KEYS = {
  ACCOUNTS: 'trisha_crm_accounts',
  VEHICLES: 'trisha_crm_vehicles',
  COMPONENTS: 'trisha_crm_components',
  CUSTOMERS: 'trisha_crm_customers',
  LEADS: 'trisha_crm_leads',
  QUOTATIONS: 'trisha_crm_quotations',
  ORDERS: 'trisha_crm_orders',
  TEST_DRIVES: 'trisha_crm_test_drives',
  PAYMENTS: 'trisha_crm_payments',
  MODELS: 'trisha_crm_models',
};

// Purge any legacy demo/mock data keys so CRM starts completely clean
if (typeof window !== 'undefined' && window.localStorage) {
  const legacyKeys = [
    'volt_v2_accounts',
    'volt_v2_vehicles',
    'volt_v2_customers',
    'volt_v2_leads',
    'volt_v2_quotations',
    'volt_v2_orders',
    'volt_v2_test_drives',
    'volt_v2_payments',
    'volt_orders',
    'volt_vehicles',
  ];
  legacyKeys.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      // Ignore
    }
  });
}

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

  async addModel(modelData: Partial<VehicleModel>): Promise<VehicleModel> {
    const models = await this.getModels();
    const newM: VehicleModel = {
      id: modelData.id || 'm_' + Date.now(),
      brand: modelData.brand || 'Trisha',
      model_name: modelData.model_name || 'Custom EV Model',
      variant: modelData.variant || 'Standard',
      body_type: modelData.body_type || (modelData.model_name?.toLowerCase().includes('rickshaw') ? 'E-Rickshaw' : 'Scooty'),
      battery_kwh: modelData.battery_kwh || 2.5,
      range_km: modelData.range_km || 95,
      motor_power_kw: modelData.motor_power_kw || 1.5,
      charging_ac_kw: modelData.charging_ac_kw || 3.3,
      charging_dc_kw: modelData.charging_dc_kw || 15,
      seating_capacity: modelData.seating_capacity || (modelData.body_type === 'E-Rickshaw' ? 5 : 2),
      ex_showroom_price: modelData.ex_showroom_price || 75000,
      is_active: true,
    };
    models.unshift(newM);
    setStored(STORAGE_KEYS.MODELS, models);
    return newM;
  },

  async addVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const models = await this.getModels();
    let model = models.find(
      (m) =>
        m.id === vehicle.model_id ||
        (vehicle.model_name && m.model_name.toLowerCase() === vehicle.model_name.trim().toLowerCase())
    );

    if (!model && vehicle.model_name) {
      model = await this.addModel({
        brand: vehicle.brand || 'Trisha',
        model_name: vehicle.model_name.trim(),
        variant: vehicle.variant || 'Standard',
        body_type:
          (vehicle.body_type as any) ||
          (vehicle.model_name.toLowerCase().includes('rickshaw') ? 'E-Rickshaw' : 'Scooty'),
        ex_showroom_price: vehicle.asking_price || 75000,
      });
    }

    const newV: Vehicle = {
      id: 'v_' + Date.now(),
      model_id: model?.id || vehicle.model_id || 'm_' + Date.now(),
      vin: vehicle.vin || 'VIN' + Date.now(),
      motor_no: vehicle.motor_no,
      battery_serial: vehicle.battery_serial,
      colour: vehicle.colour || 'Pearl White',
      manufacture_year: vehicle.manufacture_year || 2026,
      condition: vehicle.condition || 'new',
      status: vehicle.status || 'in_stock',
      purchase_price: vehicle.purchase_price || (vehicle.asking_price ? Math.round(vehicle.asking_price * 0.88) : 65000),
      asking_price: vehicle.asking_price || (model?.ex_showroom_price ? model.ex_showroom_price : 75000),
      odometer_km: vehicle.odometer_km || 0,
      location: vehicle.location || 'Showroom Floor',
      arrival_date: vehicle.arrival_date || new Date().toISOString().split('T')[0],
      notes: vehicle.notes,
      brand: vehicle.brand || model?.brand || 'Trisha',
      model_name: vehicle.model_name || model?.model_name || 'EV Model',
      variant: vehicle.variant || model?.variant || 'Standard',
      body_type: vehicle.body_type || model?.body_type || 'Scooty',
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

  // --- Components / Spare Parts ---
  async getComponents(filter?: { category?: string; status?: string; search?: string }): Promise<ComponentItem[]> {
    let list = getStored<ComponentItem>(STORAGE_KEYS.COMPONENTS, MOCK_COMPONENTS);
    if (filter?.category && filter.category !== 'all') {
      list = list.filter((c) => c.category === filter.category);
    }
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sku.toLowerCase().includes(q) ||
          c.location_bin?.toLowerCase().includes(q) ||
          c.compatible_models.some((m) => m.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async getComponentById(id: string): Promise<ComponentItem | undefined> {
    const list = await this.getComponents();
    return list.find((c) => c.id === id);
  },

  async addComponent(
    data: Omit<ComponentItem, 'id' | 'created_at' | 'status'> & { status?: ComponentItem['status'] }
  ): Promise<ComponentItem> {
    const computedStatus: ComponentItem['status'] =
      data.status ||
      (data.quantity === 0
        ? 'out_of_stock'
        : data.quantity <= data.min_reorder_level
        ? 'low_stock'
        : 'in_stock');
    const newComponent: ComponentItem = {
      ...data,
      id: `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      status: computedStatus,
      created_at: new Date().toISOString(),
    };
    const current = getStored<ComponentItem>(STORAGE_KEYS.COMPONENTS, MOCK_COMPONENTS);
    current.unshift(newComponent);
    setStored(STORAGE_KEYS.COMPONENTS, current);
    return newComponent;
  },

  async updateComponent(id: string, updates: Partial<ComponentItem>): Promise<ComponentItem> {
    const current = getStored<ComponentItem>(STORAGE_KEYS.COMPONENTS, MOCK_COMPONENTS);
    const idx = current.findIndex((c) => c.id === id);
    if (idx !== -1) {
      const updated = { ...current[idx], ...updates };
      if (updates.quantity !== undefined) {
        if (updated.quantity === 0) updated.status = 'out_of_stock';
        else if (updated.quantity <= updated.min_reorder_level) updated.status = 'low_stock';
        else updated.status = 'in_stock';
      }
      current[idx] = updated;
      setStored(STORAGE_KEYS.COMPONENTS, current);
      return updated;
    }
    throw new Error('Component not found');
  },

  async adjustComponentQuantity(id: string, delta: number): Promise<ComponentItem> {
    const current = getStored<ComponentItem>(STORAGE_KEYS.COMPONENTS, MOCK_COMPONENTS);
    const idx = current.findIndex((c) => c.id === id);
    if (idx !== -1) {
      const newQty = Math.max(0, (current[idx].quantity || 0) + delta);
      const updated = { ...current[idx], quantity: newQty };
      if (newQty === 0) updated.status = 'out_of_stock';
      else if (newQty <= updated.min_reorder_level) updated.status = 'low_stock';
      else updated.status = 'in_stock';
      current[idx] = updated;
      setStored(STORAGE_KEYS.COMPONENTS, current);
      return updated;
    }
    throw new Error('Component not found');
  },

  async deleteComponent(id: string): Promise<void> {
    const current = getStored<ComponentItem>(STORAGE_KEYS.COMPONENTS, MOCK_COMPONENTS);
    const filtered = current.filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.COMPONENTS, filtered);
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
    customer_id?: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    vehicle_id?: string;
    items?: OrderItem[];
    quotation_id?: string;
    booking_amount?: number;
    initial_price?: number;
    sold_price?: number;
    insurance_charges?: number;
    rto_charges?: number;
    miscellaneous_charges?: number;
    subsidy_discount?: number;
    payment_mode?: 'cash' | 'finance' | 'lease';
    finance_partner?: string;
    loan_amount?: number;
    expected_delivery?: string;
    sale_date?: string;
  }): Promise<Order> {
    const customers = await this.getCustomers();
    const vehicles = await this.getVehicles();

    // 1. Resolve or dynamically create Customer
    let customer = data.customer_id ? customers.find((c) => c.id === data.customer_id) : undefined;
    const phoneInput = data.customer_phone?.trim();
    if (!customer && phoneInput) {
      const cleanPhone = phoneInput.replace(/\D/g, '');
      customer = customers.find(
        (c) => c.phone.trim() === phoneInput || (cleanPhone.length > 0 && c.phone.replace(/\D/g, '') === cleanPhone)
      );
    }
    if (!customer) {
      const newCust: Customer = {
        id: 'cust_' + Date.now(),
        full_name: data.customer_name?.trim() || 'Walk-in Retail Customer',
        phone: phoneInput || '9876543210',
        email: data.customer_email?.trim() || `${(phoneInput || 'walkin').replace(/\D/g, '') || 'walkin'}@retail.local`,
        type: 'individual',
        address_line: 'Showroom Retail Counter',
        city: 'Local',
        state: 'Local',
        pincode: '000000',
        created_at: new Date().toISOString(),
      };
      customers.unshift(newCust);
      setStored(STORAGE_KEYS.CUSTOMERS, customers);
      customer = newCust;
    }

    const saleDate = data.sale_date || new Date().toISOString().split('T')[0];

    // 2. Prepare multi-item array
    let items: OrderItem[] = [];
    if (data.items && data.items.length > 0) {
      items = [...data.items];
    } else if (data.vehicle_id) {
      const vehicle = vehicles.find((v) => v.id === data.vehicle_id);
      const isRick =
        vehicle?.model_name?.toLowerCase().includes('rickshaw') ||
        (vehicle as any)?.body_type?.toLowerCase().includes('rickshaw');
      const sold = Number(data.sold_price !== undefined ? data.sold_price : (vehicle?.asking_price || 82000));
      const init = Number(data.initial_price !== undefined ? data.initial_price : (vehicle?.purchase_price || Math.round(sold * 0.88)));
      items = [
        {
          id: 'item_' + Date.now(),
          item_type: 'vehicle',
          item_id: data.vehicle_id,
          name: `${vehicle?.brand || 'EV'} ${vehicle?.model_name || 'Vehicle'}`,
          sku_or_vin: vehicle?.vin || 'VIN' + Date.now(),
          category: isRick ? 'E-Rickshaw' : 'E-Scooter',
          quantity: 1,
          initial_cost_price: init,
          mark_price: vehicle?.asking_price || sold,
          sold_price: sold,
          discount: Math.max(0, (vehicle?.asking_price || sold) - sold),
          total_amount: sold,
          total_profit: sold - init,
        },
      ];
    }

    // 3. Strict inventory availability validation - prevent selling anything out of stock
    for (const item of items) {
      if (item.item_type === 'vehicle') {
        const v = vehicles.find((veh) => veh.id === item.item_id);
        if (v && v.status !== 'in_stock' && v.status !== 'in_transit') {
          throw new Error(`Vehicle ${v.vin} (${v.model_name}) is already reserved or sold! Cannot be sold.`);
        }
      } else if (item.item_type === 'component') {
        const comp = await this.getComponentById(item.item_id);
        if (!comp || comp.quantity < item.quantity) {
          throw new Error(
            `Component "${comp?.name || item.name}" has only ${comp?.quantity || 0} in stock. Cannot sell ${item.quantity} units!`
          );
        }
      }
    }

    // 4. Atomically reserve vehicles and decrement component stock
    for (const item of items) {
      if (item.item_type === 'vehicle') {
        await this.updateVehicle(item.item_id, { status: 'reserved' });
      } else if (item.item_type === 'component') {
        await this.adjustComponentQuantity(item.item_id, -item.quantity);
      }
    }

    // 5. Aggregate financial computations
    const totalSoldItems = items.reduce((sum, it) => sum + it.sold_price * it.quantity, 0);
    const totalInitialCost = items.reduce((sum, it) => sum + it.initial_cost_price * it.quantity, 0);
    const totalDiscount = items.reduce((sum, it) => sum + it.discount * it.quantity, 0);
    const componentUnits = items
      .filter((it) => it.item_type === 'component')
      .reduce((sum, it) => sum + it.quantity, 0);

    const insuranceCharges = Number(data.insurance_charges || 0);
    const rtoCharges = Number(data.rto_charges || 0);
    const miscCharges = Number(data.miscellaneous_charges || 0);
    const subsidyDiscount = Number(data.subsidy_discount || 0);

    // Total Invoiced = Sum of Items Sold + Insurance + RTO + Misc - Subsidy
    const totalAmount = totalSoldItems + insuranceCharges + rtoCharges + miscCharges - subsidyDiscount;
    // Net Dealer Profit = (Items Sold - Dealer Initial Cost) + Misc doc/handling fees
    const netProfit = totalSoldItems - totalInitialCost + miscCharges;
    const dealerMarginPct = totalSoldItems > 0 ? Number(((netProfit / totalSoldItems) * 100).toFixed(2)) : 0;
    const bookingAmt = data.booking_amount !== undefined ? Number(data.booking_amount) : totalAmount;

    // 6. Determine primary vehicle attributes if vehicle item included
    const primaryVehItem = items.find((it) => it.item_type === 'vehicle');
    const primaryVehicle = primaryVehItem ? vehicles.find((v) => v.id === primaryVehItem.item_id) : undefined;
    const isRickshaw =
      primaryVehicle?.model_name?.toLowerCase().includes('rickshaw') ||
      (primaryVehicle as any)?.body_type?.toLowerCase().includes('rickshaw') ||
      primaryVehItem?.category?.toLowerCase().includes('rickshaw');
    const vehicleType: 'scooter' | 'rickshaw' | undefined = primaryVehItem
      ? isRickshaw
        ? 'rickshaw'
        : 'scooter'
      : undefined;

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      order_number: `ORD-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      customer_id: customer.id,
      customer_name: customer.full_name,
      customer_phone: customer.phone,
      customer_email: customer.email,
      vehicle_id: primaryVehicle?.id || primaryVehItem?.item_id,
      vin: primaryVehicle?.vin || primaryVehItem?.sku_or_vin,
      brand: primaryVehicle?.brand || (primaryVehItem ? 'Trisha Motors' : 'Trisha Retail'),
      model_name: primaryVehicle?.model_name || (primaryVehItem ? primaryVehItem.name : 'Accessories / Spares Sale'),
      colour: primaryVehicle?.colour || (primaryVehItem ? 'Standard' : ''),
      vehicle_type: vehicleType,
      items: items,
      component_count: componentUnits,
      quotation_id: data.quotation_id,
      booking_date: saleDate,
      initial_price: totalInitialCost,
      sold_price: totalSoldItems,
      discount_amount: totalDiscount,
      insurance_charges: insuranceCharges,
      rto_charges: rtoCharges,
      miscellaneous_charges: miscCharges,
      subsidy_discount: subsidyDiscount,
      net_profit: netProfit,
      dealer_margin_pct: dealerMarginPct,
      total_amount: totalAmount,
      booking_amount: bookingAmt,
      total_paid: bookingAmt,
      balance_due: Math.max(0, totalAmount - bookingAmt),
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
        body: JSON.stringify({
          ...data,
          total_amount: totalAmount,
        }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const current = getStored(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
    current.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, current);

    // If initial payment was made, log structured Payment receipt
    if (bookingAmt > 0) {
      const initialPayment: Payment = {
        id: 'pay_' + Date.now(),
        order_id: newOrder.id,
        amount: bookingAmt,
        method: (data.payment_mode as Payment['method']) || 'cash',
        payment_date: newOrder.booking_date,
        reference_no: 'RETAIL-SALE-RECEIPT',
        notes: `Initial counter payment for sale ${newOrder.order_number}`,
        created_at: new Date().toISOString(),
      };
      const payments = getStored<Payment>(STORAGE_KEYS.PAYMENTS, []);
      payments.unshift(initialPayment);
      setStored(STORAGE_KEYS.PAYMENTS, payments);
    }

    return newOrder;
  },

  async getOrderPayments(orderId: string): Promise<Payment[]> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const payments = getStored<Payment>(STORAGE_KEYS.PAYMENTS, []);
    return payments.filter((p) => p.order_id === orderId);
  },

  async addPayment(
    orderId: string,
    payment: { amount: number; method: Payment['method']; reference_no?: string; notes?: string }
  ): Promise<void> {
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

    const newPayment: Payment = {
      id: 'pay_' + Date.now(),
      order_id: orderId,
      amount: Number(payment.amount),
      method: payment.method,
      payment_date: new Date().toISOString().split('T')[0],
      reference_no: payment.reference_no,
      notes: payment.notes,
      created_at: new Date().toISOString(),
    };
    const payments = getStored<Payment>(STORAGE_KEYS.PAYMENTS, []);
    payments.unshift(newPayment);
    setStored(STORAGE_KEYS.PAYMENTS, payments);

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

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    try {
      const token = localStorage.getItem('volt_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
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

    const orders = getStored<Order>(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const updated = { ...orders[idx], ...updates };
    orders[idx] = updated;
    setStored(STORAGE_KEYS.ORDERS, orders);

    // If order is delivered, update vehicle to delivered
    if (updated.vehicle_id) {
      if (updates.status === 'delivered') {
        await this.updateVehicle(updated.vehicle_id, { status: 'delivered' });
      } else if (updates.status === 'cancelled') {
        // If cancelled, free vehicle back to in_stock
        await this.updateVehicle(updated.vehicle_id, { status: 'in_stock' });
      }
    }

    return updated;
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
      brand: data.brand || 'Trisha Motors',
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

  async getMonthlySalesReports(): Promise<MonthlySalesAggregate[]> {
    const orders = await this.getOrders();
    const map = new Map<string, MonthlySalesAggregate>();

    for (const order of orders) {
      if (order.status === 'cancelled') continue;
      const dateStr = order.booking_date || (order.created_at ? order.created_at.split('T')[0] : '');
      const d = dateStr ? new Date(dateStr) : new Date();
      const year = isNaN(d.getFullYear()) ? new Date().getFullYear() : d.getFullYear();
      const month = isNaN(d.getMonth()) ? new Date().getMonth() : d.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' }) || monthKey;

      const soldPrice = Number(order.sold_price !== undefined ? order.sold_price : (order.total_amount || 0));
      const initialCost = Number(order.initial_price !== undefined ? order.initial_price : Math.round(soldPrice * 0.88));
      const insurance = Number(order.insurance_charges || 0);
      const rto = Number(order.rto_charges || 0);
      const misc = Number(order.miscellaneous_charges || 0);
      const profit = Number(order.net_profit !== undefined ? order.net_profit : ((soldPrice - initialCost) + misc));
      const revenue = Number(order.total_amount || soldPrice);

      const existing = map.get(monthKey) || {
        month_key: monthKey,
        month_label: monthLabel,
        units_sold: 0,
        total_initial_cost: 0,
        total_revenue: 0,
        total_insurance: 0,
        total_rto: 0,
        total_misc: 0,
        total_profit: 0,
        margin_pct: 0,
        scooter_units: 0,
        rickshaw_units: 0,
      };

      existing.units_sold += 1;
      const hasVehicle = !order.items || order.items.length === 0 || order.items.some((it) => it.item_type === 'vehicle');
      if (hasVehicle) {
        const isRick =
          order.vehicle_type === 'rickshaw' ||
          order.model_name?.toLowerCase().includes('rickshaw');
        if (isRick) {
          existing.rickshaw_units = (existing.rickshaw_units || 0) + 1;
        } else {
          existing.scooter_units = (existing.scooter_units || 0) + 1;
        }
      }

      let compUnitsInOrder = 0;
      if (order.items && order.items.length > 0) {
        for (const it of order.items) {
          if (it.item_type === 'component') compUnitsInOrder += it.quantity;
        }
      } else if (order.component_count) {
        compUnitsInOrder += order.component_count;
      }
      existing.component_units = (existing.component_units || 0) + compUnitsInOrder;

      existing.total_initial_cost += initialCost;
      existing.total_revenue += revenue;
      existing.total_insurance += insurance;
      existing.total_rto += rto;
      existing.total_misc += misc;
      existing.total_profit += profit;
      existing.margin_pct = existing.total_revenue > 0
        ? Number(((existing.total_profit / existing.total_revenue) * 100).toFixed(1))
        : 0;

      map.set(monthKey, existing);
    }

    return Array.from(map.values()).sort((a, b) => a.month_key.localeCompare(b.month_key));
  },

  async getDailySalesReports(daysRange = 14): Promise<DailySalesAggregate[]> {
    const orders = await this.getOrders();
    const activeOrders = orders.filter((o) => o.status !== 'cancelled');

    const ordersByDate = new Map<string, Order[]>();
    for (const o of activeOrders) {
      const dateKey = o.booking_date || (o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0]);
      const list = ordersByDate.get(dateKey) || [];
      list.push(o);
      ordersByDate.set(dateKey, list);
    }

    const allDates = Array.from(ordersByDate.keys());
    const today = new Date();
    const dateSet = new Set<string>();

    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dateSet.add(d.toISOString().split('T')[0]);
    }
    for (const d of allDates) {
      dateSet.add(d);
    }

    const sortedDates = Array.from(dateSet).sort();

    const dailyAggregates: DailySalesAggregate[] = sortedDates.map((dateStr) => {
      const d = new Date(dateStr + 'T00:00:00');
      const dateLabel = !isNaN(d.getTime())
        ? d.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' })
        : dateStr;
      const dayOfWeek = !isNaN(d.getTime())
        ? d.toLocaleDateString('default', { weekday: 'short' })
        : '';

      const dayOrders = ordersByDate.get(dateStr) || [];
      let totalInitial = 0;
      let totalRev = 0;
      let totalProf = 0;
      let scooterUnits = 0;
      let rickshawUnits = 0;
      let componentUnits = 0;

      for (const ord of dayOrders) {
        const soldPrice = Number(ord.sold_price !== undefined ? ord.sold_price : (ord.total_amount || 0));
        const initialCost = Number(ord.initial_price !== undefined ? ord.initial_price : Math.round(soldPrice * 0.88));
        const misc = Number(ord.miscellaneous_charges || 0);
        const profit = Number(ord.net_profit !== undefined ? ord.net_profit : ((soldPrice - initialCost) + misc));
        const rev = Number(ord.total_amount || soldPrice);

        totalInitial += initialCost;
        totalRev += rev;
        totalProf += profit;

        const hasVehicle = !ord.items || ord.items.length === 0 || ord.items.some((it) => it.item_type === 'vehicle');
        if (hasVehicle) {
          const isRick =
            ord.vehicle_type === 'rickshaw' ||
            ord.model_name?.toLowerCase().includes('rickshaw');
          if (isRick) {
            rickshawUnits++;
          } else {
            scooterUnits++;
          }
        }

        let compUnitsInOrder = 0;
        if (ord.items && ord.items.length > 0) {
          for (const it of ord.items) {
            if (it.item_type === 'component') compUnitsInOrder += it.quantity;
          }
        } else if (ord.component_count) {
          compUnitsInOrder += ord.component_count;
        }
        componentUnits += compUnitsInOrder;
      }

      const marginPct = totalRev > 0 ? Number(((totalProf / totalRev) * 100).toFixed(1)) : 0;

      return {
        date: dateStr,
        date_label: dateLabel,
        day_of_week: dayOfWeek,
        total_units: dayOrders.length,
        scooter_units: scooterUnits,
        rickshaw_units: rickshawUnits,
        component_units: componentUnits,
        total_initial_cost: totalInitial,
        total_revenue: totalRev,
        total_profit: totalProf,
        margin_pct: marginPct,
        orders: dayOrders,
      };
    });

    return dailyAggregates;
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
    const superEmail = import.meta.env.VITE_SUPERUSER_EMAIL || 'superuser@boltcrm.com';
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
