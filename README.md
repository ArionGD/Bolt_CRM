# Volt EV Dealership — 2-in-1 Marketing Showroom & Staff CRM

A modern, fast web platform built with React, Vite, and Tailwind CSS. Combines a public-facing electric vehicle showroom website with an internal operational dealership CRM and customer portal.

## Modules
1. **Public Marketing Showroom (`src/website/`)**:
   - `/`: Showroom landing page with hero, value pillars, quick test-drive booking, and vehicle highlights.
   - `/explore`: Filterable catalogue and spec comparisons for Scooty (Models 1, 2, Pro) and E-Rickshaw (Model 1).
   - `/calculator`: On-road price calculator with 5% EV GST, state subsidies, and EMI slider.
   - `/test-drive`: Test drive reservation with time slot picker and marketing alert opt-in checkbox.
   - `/contact`: Showroom opening hours, location map, and enquiry form.
2. **Customer Portal (`/my-account`)**:
   - Phone-based login for EV buyers.
   - Track active bookings, physical chassis allocation, quotations, and toggle marketing alert preferences.
3. **Showroom Staff CRM (`/crm/*`)**:
   - `/crm`: Executive KPIs, vehicle ageing monitors, and recent orders.
   - `/crm/inventory`: Stock tracker with atomic VIN reservation and dealer cost/margin tools.
   - `/crm/leads`: Kanban pipeline from enquiry to booked sale.
   - `/crm/test-drives`: Calendar schedule & customer feedback logs.
   - `/crm/quotations`: PDF-ready on-road quotation generator.
   - `/crm/orders`: Order lifecycle and physical VIN locking.
   - `/crm/reports`: Dealership revenue metrics and conversion funnel.

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Strict palette: Emerald, Light Blue / Sky, White, Gray Slate, Black Slate 900)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React

## Environment Variables (.env)
```env
VITE_API_URL=https://bolt-axum.onrender.com/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Running Locally
```bash
npm install
npm run dev
```

## Deploying to Netlify
1. Connect your GitHub repository `https://github.com/ArionGD/Bolt_CRM.git` to Netlify.
2. Build Settings:
   - **Base directory**: (leave blank or `.`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. SPA routing redirects are preconfigured via `public/_redirects` (`/*  /index.html  200`).
4. Under **Site Configuration > Environment variables**, add:
   - `VITE_API_URL`: URL of your deployed Render backend (e.g. `https://bolt-axum.onrender.com/api/v1`)
