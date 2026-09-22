import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Dealership Public Marketing Website Pages
import { WebsiteLayout } from './website/WebsiteLayout';
import { HomePage } from './website/HomePage';
import { ExploreModels } from './website/ExploreModels';
import { PriceCalculator } from './website/PriceCalculator';
import { BookTestDrive } from './website/BookTestDrive';
import { ContactShowroom } from './website/ContactShowroom';

// Showroom Operations CRM Shell
import { AppLayout } from './components/layout/AppLayout';

// 5-Pillar CRM Modular Architecture Root Pages
import { OverviewMain } from './modules/overview/overview_main';
import { InventoryMain } from './modules/inventory/inventory_main';
import { CustomerMain } from './modules/customer/customer_main';
import { SalesMain } from './modules/sales/sales_main';
import { StatisticsMain } from './modules/statistics/statistics_main';

// Auth & Customer Portal Pages
import { LoginPage } from './pages/LoginPage';
import { CustomerPortal } from './pages/CustomerPortal';

// Route Guard for Showroom Staff CRM
const ProtectedCrmRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Redirect helper for Order ID legacy routes
const LegacyOrderRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/crm/sales?tab=orders&order_id=${id || ''}`} replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public 2-in-1 Dealership Marketing Website */}
          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExploreModels />} />
            <Route path="/calculator" element={<PriceCalculator />} />
            <Route path="/test-drive" element={<BookTestDrive />} />
            <Route path="/contact" element={<ContactShowroom />} />
          </Route>

          {/* Customer Portal */}
          <Route path="/my-account" element={<CustomerPortal />} />

          {/* Authentication (Manager & Customer with No Role Switching) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 5-Pillar Staff CRM (Protected) */}
          <Route
            path="/crm"
            element={
              <ProtectedCrmRoute>
                <AppLayout />
              </ProtectedCrmRoute>
            }
          >
            {/* 1. Overview Tab */}
            <Route index element={<Navigate to="/crm/overview" replace />} />
            <Route path="overview" element={<OverviewMain />} />

            {/* 2. Inventory Tab (Vehicle & Components Sub-Tabs, plus VIN Detail) */}
            <Route path="inventory" element={<InventoryMain />} />
            <Route path="inventory/:tabOrId" element={<InventoryMain />} />

            {/* 3. Customer Tab */}
            <Route path="customer" element={<CustomerMain />} />
            <Route path="customers" element={<Navigate to="/crm/customer" replace />} />

            {/* 4. Sales Tab (Leads, Test Drives, Quotations, Orders & Payments) */}
            <Route path="sales" element={<SalesMain />} />
            <Route path="sales/:subtab" element={<SalesMain />} />
            <Route path="leads" element={<Navigate to="/crm/sales?tab=leads" replace />} />
            <Route path="test-drives" element={<Navigate to="/crm/sales?tab=test-drives" replace />} />
            <Route path="quotations" element={<Navigate to="/crm/sales?tab=quotations" replace />} />
            <Route path="orders" element={<Navigate to="/crm/sales?tab=orders" replace />} />
            <Route path="orders/:id" element={<LegacyOrderRedirect />} />

            {/* 5. Statistics Tab (Reports, Ageing & Analytics) */}
            <Route path="statistics" element={<StatisticsMain />} />
            <Route path="reports" element={<Navigate to="/crm/statistics" replace />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
