# Trisha Motors — 2-in-1 Marketing Showroom & Staff CRM

A modern, fast web platform built with React, Vite, and Tailwind CSS. Combines a public-facing electric vehicle showroom website for Trisha Motors with an internal 5-pillar operational dealership CRM and customer portal.

> 📖 **Full System Architecture**: Detailed technical documentation, folder structure, diagrams, and domain design are available in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 1. Public Marketing Showroom (`src/website/`)
- `/`: Showroom landing page with hero, value pillars, quick test-drive booking, and vehicle highlights.
- `/explore`: Filterable catalogue and spec comparisons for Scooty (Models 1, 2, Pro) and E-Rickshaw (Model 1).
- `/calculator`: On-road price calculator with 5% EV GST, state subsidies, and EMI slider.
- `/test-drive`: Test drive reservation with time slot picker and marketing alert opt-in checkbox.
- `/contact`: Showroom opening hours, location map, and enquiry form.

---

## 2. Customer Portal (`/my-account`)
- Phone-based login for EV buyers.
- Track active bookings, physical chassis allocation, quotations, and toggle marketing alert preferences.

---

## 3. 5-Pillar Staff CRM Modular Architecture (`src/modules/`)
Organized into 5 dedicated domain modules, each containing a root `[tab]_main.tsx` and isolated sub-components:

1. **Overview (`src/modules/overview/overview_main.tsx`)**:
   - Route: `/crm/overview` (and `/crm`)
   - Showroom Command Center with real-time stock counts, sales volume, cash collections, and recent activity.
2. **Inventory (`src/modules/inventory/inventory_main.tsx`)**:
   - Route: `/crm/inventory` & `/crm/inventory/:id`
   - Physical vehicle inventory tracking with atomic database-level VIN protection, stock aging, and add-stock modal.
3. **Customer (`src/modules/customer/customer_main.tsx`)**:
   - Route: `/crm/customer`
   - Directory for individual buyers and commercial fleets with search, filter, and history drawer.
4. **Sales (`src/modules/sales/sales_main.tsx`)**:
   - Route: `/crm/sales`
   - Unified revenue coordinator with 4 sub-views:
     - `LeadsSubPage.tsx`: 7-stage visual Kanban pipeline.
     - `TestDrivesSubPage.tsx`: Trial slots, demo car allocation, and feedback logging.
     - `QuotationsSubPage.tsx`: Automated on-road pricing with EV subsidies and RTO breakdown.
     - `OrdersSubPage.tsx` & `OrderDetailSubPage.tsx`: Booking ledger, part-payment recording, RTO registration, and delivery handover.
5. **Statistics (`src/modules/statistics/statistics_main.tsx`)**:
   - Route: `/crm/statistics`
   - Executive analytics: inventory holding days monitor (<30d, 30-60d, >90d) and lead conversion funnel drop-off stats.

---

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Strict palette: Emerald, Light Blue / Sky, White, Gray Slate, Black Slate 900)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React

---

## Environment Variables (.env)
```env
VITE_API_URL=https://bolt-axum.onrender.com/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Running Locally
```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

---

## Deploying to Netlify
1. Connect your GitHub repository `https://github.com/ArionGD/Bolt_CRM.git` to Netlify.
2. Build Settings:
   - **Base directory**: (leave blank or `.`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. SPA routing redirects are preconfigured via `public/_redirects` (`/*  /index.html  200`).
4. Under **Site Configuration > Environment variables**, add:
   - `VITE_API_URL`: URL of your deployed Render backend (e.g. `https://bolt-axum.onrender.com/api/v1`)
