export type UserRole = 'superuser' | 'manager' | 'customer' | 'admin' | 'sales' | 'accounts';
export type StaffRole = UserRole;

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  receive_alerts?: boolean;
}

export interface AccountRecord {
  id: string;
  email?: string;
  phone?: string;
  full_name: string;
  role: UserRole;
  receive_alerts: boolean;
  is_active: boolean;
  created_at: string;
}

export type VehicleStatus = 'in_transit' | 'in_stock' | 'reserved' | 'sold' | 'delivered' | 'returned';
export type VehicleCondition = 'new' | 'demo' | 'used';

export interface VehicleModel {
  id: string;
  brand: string;
  model_name: string;
  variant?: string;
  body_type?: string;
  battery_kwh?: number;
  range_km?: number;
  motor_power_kw?: number;
  charging_ac_kw?: number;
  charging_dc_kw?: number;
  seating_capacity?: number;
  ex_showroom_price: number;
  is_active: boolean;
}

export interface Vehicle {
  id: string;
  model_id: string;
  vin: string;
  motor_no?: string;
  battery_serial?: string;
  colour: string;
  manufacture_year?: number;
  condition: VehicleCondition;
  status: VehicleStatus;
  purchase_price?: number; // only visible to admin
  asking_price: number;
  odometer_km?: number;
  location?: string;
  arrival_date?: string;
  notes?: string;
  brand?: string;
  model_name?: string;
  variant?: string;
  primary_photo_url?: string;
  created_at: string;
}

export type CustomerType = 'individual' | 'business';

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  type: CustomerType;
  gst_number?: string;
  address_line?: string;
  city?: string;
  state?: string;
  pincode?: string;
  source?: string;
  assigned_to?: string;
  notes?: string;
  receive_alerts?: boolean;
  created_at: string;
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'test_drive_scheduled'
  | 'test_drive_done'
  | 'quoted'
  | 'negotiating'
  | 'won'
  | 'lost';

export interface Lead {
  id: string;
  customer_id: string;
  model_id?: string;
  status: LeadStatus;
  lost_reason?: string;
  expected_close_date?: string;
  assigned_to?: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  brand?: string;
  model_name?: string;
}

export type ActivityType = 'call' | 'whatsapp' | 'email' | 'visit' | 'note';

export interface Activity {
  id: string;
  customer_id: string;
  lead_id?: string;
  type: ActivityType;
  notes?: string;
  due_at?: string;
  completed_at?: string;
  staff_id?: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
}

export type TestDriveStatus = 'scheduled' | 'completed' | 'no_show' | 'cancelled';

export interface TestDrive {
  id: string;
  customer_id: string;
  vehicle_id?: string;
  model_id?: string;
  scheduled_at: string;
  status: TestDriveStatus;
  staff_id?: string;
  feedback?: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  model_name?: string;
  brand?: string;
  vin?: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'expired';

export interface Quotation {
  id: string;
  quote_number: string;
  customer_id: string;
  model_id: string;
  vehicle_id?: string;
  ex_showroom: number;
  insurance: number;
  registration: number;
  accessories_total: number;
  handling_charges: number;
  discount: number;
  subsidy_amount: number;
  on_road_total: number;
  valid_until?: string;
  status: QuotationStatus;
  created_by?: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  brand?: string;
  model_name?: string;
  variant?: string;
}

export type OrderStatus = 'booked' | 'payment_pending' | 'ready_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMode = 'cash' | 'finance' | 'lease';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  vehicle_id: string;
  vin: string;
  brand: string;
  model_name: string;
  colour: string;
  vehicle_type?: 'scooter' | 'rickshaw';
  quotation_id?: string;
  booking_date: string;
  initial_price?: number;
  sold_price?: number;
  insurance_charges?: number;
  rto_charges?: number;
  miscellaneous_charges?: number;
  subsidy_discount?: number;
  net_profit?: number;
  dealer_margin_pct?: number;
  total_amount: number;
  booking_amount: number;
  total_paid: number;
  balance_due: number;
  status: OrderStatus;
  payment_mode: PaymentMode;
  finance_partner?: string;
  loan_amount?: number;
  expected_delivery?: string;
  actual_delivery?: string;
  registration_number?: string;
  insurance_policy_no?: string;
  insurance_expiry?: string;
  created_at: string;
}

export interface DailySalesAggregate {
  date: string; // YYYY-MM-DD
  date_label: string; // e.g. "22 Sep 2026"
  day_of_week: string; // e.g. "Tuesday"
  total_units: number;
  scooter_units: number;
  rickshaw_units: number;
  total_initial_cost: number;
  total_revenue: number;
  total_profit: number;
  margin_pct: number;
  orders: Order[];
}

export interface MonthlySalesAggregate {
  month_key: string;
  month_label: string;
  units_sold: number;
  scooter_units?: number;
  rickshaw_units?: number;
  total_initial_cost: number;
  total_revenue: number;
  total_insurance: number;
  total_rto: number;
  total_misc: number;
  total_profit: number;
  margin_pct: number;
}

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'neft' | 'cheque' | 'finance_disbursal';

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  payment_date: string;
  reference_no?: string;
  received_by?: string;
  notes?: string;
  created_at: string;
}

export interface SalesSummaryReport {
  total_orders: number;
  total_delivered: number;
  total_booked: number;
  total_sales_value: number;
  total_cash_collected: number;
  total_outstanding_balance: number;
}

export interface StockAgeingBucket {
  under_30_days: number;
  days_30_to_60: number;
  days_60_to_90: number;
  over_90_days: number;
}

export interface LeadFunnelStage {
  stage: string;
  count: number;
}

export type ComponentCategory =
  | 'batteries'
  | 'motors'
  | 'controllers'
  | 'chargers'
  | 'brakes'
  | 'tyres'
  | 'electronics'
  | 'accessories'
  | 'other';

export type ComponentStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ComponentItem {
  id: string;
  sku: string;
  name: string;
  category: ComponentCategory;
  compatible_models: string[];
  quantity: number;
  min_reorder_level: number;
  unit_price: number;
  location_bin?: string;
  supplier?: string;
  warranty_months?: number;
  status: ComponentStatus;
  notes?: string;
  created_at?: string;
}
