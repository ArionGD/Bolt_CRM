import React from 'react';
import { Customer } from '../../../types';
import { X, Phone, Mail, MapPin, Building, Briefcase, FileText, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  onClose,
}) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{customer.full_name}</h3>
            <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
              {customer.type} Buyer
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 font-medium">Phone</p>
              <a
                href={`tel:${customer.phone}`}
                className="font-bold text-slate-800 hover:text-brand-600 flex items-center mt-0.5"
              >
                <Phone className="w-3.5 h-3.5 mr-1 text-brand-600" />
                {customer.phone}
              </a>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Email</p>
              <p className="font-bold text-slate-800 mt-0.5 truncate">
                {customer.email || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 font-medium">Location</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {customer.city || 'Bengaluru'}, {customer.state || 'Karnataka'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Acquisition Source</p>
              <p className="font-bold text-slate-800 mt-0.5 capitalize">
                {customer.source || 'Walk-in'}
              </p>
            </div>
          </div>

          {customer.gst_number && (
            <div>
              <p className="text-slate-400 font-medium">GST Identification Number</p>
              <p className="font-mono font-bold text-slate-800 mt-0.5">{customer.gst_number}</p>
            </div>
          )}

          {customer.notes && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <p className="text-slate-400 font-medium mb-1">Dealership Notes</p>
              <p className="text-slate-700 leading-relaxed">{customer.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <Link
            to={`/crm/sales?tab=quotations&customer=${encodeURIComponent(customer.full_name)}`}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span>Generate Quote</span>
          </Link>
          <Link
            to={`/crm/sales?tab=orders&customer=${encodeURIComponent(customer.full_name)}`}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
