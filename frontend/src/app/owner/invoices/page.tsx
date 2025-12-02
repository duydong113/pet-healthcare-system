'use client';

import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { invoiceAPI } from '@/services/api';
import { Receipt, DollarSign } from 'lucide-react';

export default function OwnerInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      fetchMyInvoices(user.id);
    }
  }, []);

  const fetchMyInvoices = async (ownerId: number) => {
    try {
      const response = await invoiceAPI.getAll();
      const myInvoices = response.data.filter((i: any) => i.owner_id === ownerId);
      setInvoices(myInvoices);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Paid': return 'bg-green-100 text-green-800 border-green-300';
      case 'Canceled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const totalUnpaid = invoices
    .filter(i => i.payment_status === 'Pending')
    .reduce((sum, i) => sum + parseFloat(i.total_amount), 0);

  return (
    <PetOwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Invoices 💰</h1>
          <p className="text-gray-600 mt-1">View and track your payment history</p>
        </div>

        {/* Summary Card */}
        {invoices.length > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Total Unpaid</p>
                <p className="text-3xl font-bold">${totalUnpaid.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-lg">
                <DollarSign size={32} />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Receipt className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Invoices</h3>
            <p className="text-gray-600">Invoices will appear here after services</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.invoice_id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Receipt className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Invoice #{invoice.invoice_id}</h3>
                      <p className="text-sm text-gray-600">
                        Issued on {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.payment_status)}`}>
                    {invoice.payment_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Base Amount</p>
                    <p className="font-medium text-black text-gray-900">${invoice.base_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Additional Cost</p>
                    <p className="font-medium text-black text-gray-900">${invoice.additional_cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="font-bold text-green-600 text-lg">${invoice.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium text-black text-gray-900">{invoice.payment_method}</p>
                  </div>
                </div>

                {invoice.payment_status === 'Pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ This invoice is pending payment. Please contact the clinic for payment options.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PetOwnerLayout>
  );
}
