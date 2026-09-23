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
  ServiceJob,
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

export const MOCK_SERVICES: ServiceJob[] = [
  {
    id: 'srv_1',
    job_card_no: 'SRV-2026-001',
    service_date: '2026-09-21',
    customer_name: 'Ramesh Verma',
    customer_phone: '+91 98390 12345',
    customer_email: 'ramesh.verma@gmail.com',
    vehicle_model: 'Trisha E-Rickshaw Model 1',
    vehicle_number: 'UP-32-ER-4412',
    odometer_km: 6850,
    service_type: 'Brakes & Suspension',
    issue_description: 'Rear brake shoes severely worn out, squeaking noise, and minor axle grease replacement.',
    mechanic_notes: 'Replaced rear brake shoe sets and greased wheel hubs. Road tested OK.',
    assigned_technician: 'Vikram Singh (Senior Tech)',
    parts_used: [
      {
        id: 'p_1',
        part_name: 'E-Rickshaw Heavy Duty Brake Shoe Set',
        quantity: 2,
        unit_cost: 380,
        total_cost: 760,
      },
      {
        id: 'p_2',
        part_name: 'Synthetic High-Temp Axle Grease (500g)',
        quantity: 1,
        unit_cost: 180,
        total_cost: 180,
      },
    ],
    parts_total_cost: 940,
    labour_charges: 450,
    miscellaneous_charges: 50,
    discount: 0,
    total_amount: 1440,
    paid_amount: 1440,
    balance_due: 0,
    payment_mode: 'cash',
    status: 'delivered',
    delivery_date: '2026-09-21',
    created_at: '2026-09-21T09:30:00Z',
  },
  {
    id: 'srv_2',
    job_card_no: 'SRV-2026-002',
    service_date: '2026-09-22',
    customer_name: 'Anita Devi',
    customer_phone: '+91 98450 67890',
    customer_email: 'anita.devi@yahoo.com',
    vehicle_model: 'Trisha Scooty Model 2',
    vehicle_number: 'UP-32-SC-8819',
    odometer_km: 3200,
    service_type: 'General Servicing',
    issue_description: 'Periodic 3,000 km general maintenance checkup, tyre pressure check, and front suspension alignment.',
    mechanic_notes: 'Inspected brake pads, tightened front fork bolts, adjusted mirror brackets.',
    assigned_technician: 'Amit Kumar (EV Mechanic)',
    parts_used: [
      {
        id: 'p_3',
        part_name: 'Front Fork Oil Seal & Lubricant',
        quantity: 1,
        unit_cost: 150,
        total_cost: 150,
      },
    ],
    parts_total_cost: 150,
    labour_charges: 350,
    miscellaneous_charges: 0,
    discount: 50,
    total_amount: 450,
    paid_amount: 450,
    balance_due: 0,
    payment_mode: 'upi',
    status: 'ready_for_pickup',
    delivery_date: '2026-09-23',
    created_at: '2026-09-22T11:15:00Z',
  },
  {
    id: 'srv_3',
    job_card_no: 'SRV-2026-003',
    service_date: '2026-09-23',
    customer_name: 'Mohd. Salim',
    customer_phone: '+91 94150 99881',
    customer_email: '',
    vehicle_model: 'Trisha Scooty Model Pro',
    vehicle_number: 'UP-32-SP-1092',
    odometer_km: 8400,
    service_type: 'Motor & Controller',
    issue_description: 'Intermittent throttle stutter and headlamp dimmer switch not functioning in high beam.',
    mechanic_notes: 'Diagnosed hall sensor in throttle grip. Replacing throttle grip and headlight switch assembly.',
    assigned_technician: 'Vikram Singh (Senior Tech)',
    parts_used: [
      {
        id: 'p_4',
        part_name: 'Waterproof Magnetic Throttle Grip Assembly',
        quantity: 1,
        unit_cost: 650,
        total_cost: 650,
      },
      {
        id: 'p_5',
        part_name: 'Handlebar Switch Panel & Dimmer',
        quantity: 1,
        unit_cost: 280,
        total_cost: 280,
      },
    ],
    parts_total_cost: 930,
    labour_charges: 500,
    miscellaneous_charges: 0,
    discount: 0,
    total_amount: 1430,
    paid_amount: 500,
    balance_due: 930,
    payment_mode: 'upi',
    status: 'in_progress',
    delivery_date: '2026-09-24',
    created_at: '2026-09-23T08:30:00Z',
  },
];

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
