import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Helper to format path slugs to clean human-readable labels
  const getLabel = (slug: string, prevSlug?: string): string => {
    switch (slug.toLowerCase()) {
      case 'crm':
        return 'CRM';
      case 'overview':
        return 'Overview';
      case 'inventory':
        return 'Inventory';
      case 'customer':
      case 'customers':
        return 'Customer';
      case 'sales':
        return 'Sales';
      case 'statistics':
        return 'Statistics';
      case 'reports':
        return prevSlug?.toLowerCase() === 'sales' ? 'Reports' : 'Statistics';
      case 'tracker':
        return 'Sales Tracker';
      case 'leads':
        return 'Leads & Pipeline';
      case 'test-drives':
        return 'Test Drives';
      case 'quotations':
        return 'Quotations';
      case 'orders':
        return 'Orders & Payments';
      case 'vehicle':
        return 'Vehicle';
      case 'components':
        return 'Components';
      default:
        // Format UUIDs, IDs, or hyphenated names
        if (slug.length > 15) {
          return `#${slug.substring(0, 8)}...`;
        }
        return slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [];

  // Home / CRM root
  if (pathnames[0] === 'crm') {
    breadcrumbs.push({ label: 'CRM', to: '/crm' });

    if (pathnames.length === 1) {
      breadcrumbs.push({ label: 'Overview' });
    } else {
      let currentPath = '/crm';
      for (let i = 1; i < pathnames.length; i++) {
        const slug = pathnames[i];
        const prevSlug = i > 0 ? pathnames[i - 1] : undefined;
        currentPath += `/${slug}`;
        const isLast = i === pathnames.length - 1;
        breadcrumbs.push({
          label: getLabel(slug, prevSlug),
          to: isLast ? undefined : currentPath,
        });
      }
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs select-none">
      <Link
        to="/crm"
        className="text-slate-400 hover:text-emerald-600 transition-colors flex items-center"
        title="CRM Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={item.label + index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {isLast || !item.to ? (
              <span className="font-bold text-slate-800 tracking-tight">{item.label}</span>
            ) : (
              <Link
                to={item.to}
                className="text-slate-500 hover:text-emerald-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
