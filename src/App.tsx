import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Dealership Public Marketing Website Pages
import { WebsiteLayout } from './website/WebsiteLayout';
import { HomePage } from './website/HomePage';
import { ExploreModels } from './website/ExploreModels';
import { PriceCalculator } from './website/PriceCalculator';
import { BookTestDrive } from './website/BookTestDrive';
import { ContactShowroom } from './website/ContactShowroom';

// Showroom Operations CRM Shell & Pages
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { VehicleDetail } from './pages/VehicleDetail';
import { Customers } from './pages/Customers';
import { Leads } from './pages/Leads';
import { TestDrives } from './pages/TestDrives';
import { Quotations } from './pages/Quotations';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { Reports } from './pages/Reports';

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

          {/* Showroom Operations Staff CRM */}
          <Route
            path="/crm"
            element={
              <ProtectedCrmRoute>
                <AppLayout />
              </ProtectedCrmRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<VehicleDetail />} />
            <Route path="customers" element={<Customers />} />
            <Route path="leads" element={<Leads />} />
            <Route path="test-drives" element={<TestDrives />} />
            <Route path="quotations" element={<Quotations />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
