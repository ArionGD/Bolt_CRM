import {
  AccountRecord,
  ComponentItem,
  Customer,
  Lead,
  Order,
  Quotation,
  TestDrive,
  Vehicle,
  VehicleModel,
} from '../types';

/**
 * Dealership Base EV Model Catalogue (Marketing & Inventory Specification)
 * Strictly limited to Scooty (2W) and E-Rickshaw (3W) as specified.
 */
export const MOCK_MODELS: VehicleModel[] = [
  // Scooty models (separate models in Scooty)
  {
    id: 'm1',
    brand: 'Trisha Motors',
    model_name: 'Scooty Model 1',
    variant: 'Standard 2.0 kWh',
    body_type: 'Scooty',
    battery_kwh: 2.0,
    range_km: 85,
    motor_power_kw: 2.5,
    charging_ac_kw: 0.6,
    charging_dc_kw: 1.2,
    seating_capacity: 2,
    ex_showroom_price: 65000,
    is_active: true,
  },
  {
    id: 'm2',
    brand: 'Trisha Motors',
    model_name: 'Scooty Model 2',
    variant: 'City 2.5 kWh',
    body_type: 'Scooty',
    battery_kwh: 2.5,
    range_km: 105,
    motor_power_kw: 3.2,
    charging_ac_kw: 0.8,
    charging_dc_kw: 1.5,
    seating_capacity: 2,
    ex_showroom_price: 78000,
    is_active: true,
  },
  {
    id: 'm3',
    brand: 'Trisha Motors',
    model_name: 'Scooty Model Pro',
    variant: 'Long Range 3.2 kWh',
    body_type: 'Scooty',
    battery_kwh: 3.2,
    range_km: 130,
    motor_power_kw: 4.0,
    charging_ac_kw: 1.0,
    charging_dc_kw: 2.0,
    seating_capacity: 2,
    ex_showroom_price: 92000,
    is_active: true,
  },

  // E-Rickshaw (1 single model)
  {
    id: 'm4',
    brand: 'Trisha Motors',
    model_name: 'E-Rickshaw Model 1',
    variant: 'Passenger 5-Seater L5M',
    body_type: 'E-Rickshaw',
    battery_kwh: 4.8,
    range_km: 110,
    motor_power_kw: 4.5,
    charging_ac_kw: 1.2,
    charging_dc_kw: 3.0,
    seating_capacity: 5,
    ex_showroom_price: 145000,
    is_active: true,
  },
];

/**
 * Zero pre-set data: CRM starts plain, clean, and ready for deployment.
 */
export const MOCK_VEHICLES: Vehicle[] = [];

export const MOCK_CUSTOMERS: Customer[] = [];

export const MOCK_LEADS: Lead[] = [];

export const MOCK_TEST_DRIVES: TestDrive[] = [];

export const MOCK_QUOTATIONS: Quotation[] = [];

export const MOCK_ORDERS: Order[] = [];

export const MOCK_COMPONENTS: ComponentItem[] = [];

/**
 * Operational Authentication Accounts (No dummy customer profiles)
 */
export const MOCK_ACCOUNTS: AccountRecord[] = [
  {
    id: 'usr_superuser_0',
    email: 'superuser@boltcrm.com',
    full_name: 'Developer Superuser',
    role: 'superuser',
    receive_alerts: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_manager_1',
    email: 'manager1@trishamotors.com',
    phone: '+91 98000 11111',
    full_name: 'Manager 1',
    role: 'manager',
    receive_alerts: false,
    is_active: true,
    created_at: '2026-02-01T09:00:00Z',
  },
];
