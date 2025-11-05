'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { invoiceAPI, appointmentAPI, petOwnerAPI } from '@/services/api';
import { Plus, Edit, Trash2, X, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    appointment_id: '',
    owner_id: '',
    base_amount: '',
    additional_cost: '',
    total_amount: '',
    payment_method: 'Cash',
    payment_status: 'Pending',
    payment_date: '',
    issued_by: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, aptRes, ownRes] = await Promise.all([
        invoiceAPI.getAll(),
        appointmentAPI.getAll(),
        petOwnerAPI.getAll(),
      ]);
      setInvoices(invRes.data);
      setAppointments(aptRes.data);
      setOwners(ownRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        appointment_id: parseInt(formData.appointment_id),
        owner_id: parseInt(formData.owner_id),
        base_amount: parseFloat(formData.base_amount),
        additional_cost: parseFloat(formData.additional_cost),
        total_amount: parseFloat(formData.total_amount),
        payment_date: formData.payment_date ? new Date(formData.payment_date) : undefined,
      };
      if (editing) {
        await invoiceAPI.update(editing.invoice_id, data);
      } else {
        await invoiceAPI.create(data);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving invoice');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this invoice?')) {
      try {
        await invoiceAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Error deleting invoice');
      }
    }
  };

  const handleEdit = (invoice: any) => {
    setEditing(invoice);
    setFormData({
      appointment_id: invoice.appointment_id,
      owner_id: invoice.owner_id,
      base_amount: invoice.base_amount,
      additional_cost: invoice.additional_cost,
      total_amount: invoice.total_amount,
      payment_method: invoice.payment_method,
      payment_status: invoice.payment_status,
      payment_date: invoice.payment_date ? new Date(invoice.payment_date).toISOString().split('T')[0] : '',
      issued_by: invoice.issued_by,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      appointment_id: '',
      owner_id: '',
      base_amount: '',
      additional_cost: '0',
      total_amount: '',
      payment_method: 'Cash',
      payment_status: 'Pending',
      payment_date: '',
      issued_by: '',
    });
    setEditing(null);
  };

  const calculateTotal = () => {
    const base = parseFloat(formData.base_amount) || 0;
    const additional = parseFloat(formData.additional_cost) || 0;
    setFormData({ ...formData, total_amount: (base + additional).toFixed(2) });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Manage payment invoices</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg">
            <Plus size={20} />
            Create Invoice
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Additional</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoices.map((inv) => (
                    <tr key={inv.invoice_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">#{inv.invoice_id}</td>
                      <td className="px-6 py-4 text-sm">{inv.owner?.full_name}</td>
                      <td className="px-6 py-4 text-sm">${inv.base_amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">${inv.additional_cost.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-green-600">${inv.total_amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{inv.payment_method}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inv.payment_status)}`}>
                          {inv.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(inv)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(inv.invoice_id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

  {showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto">
    <div className="flex justify-center min-h-screen py-10">
      <div className="bg-white rounded-2xl p-8 w-[90%] max-w-xl shadow-2xl mx-auto relative mt-10 mb-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editing ? 'Edit Invoice' : 'Create Invoice'}
          </h2>
          <button
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          
          {/* Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner *
            </label>
            <select
              value={formData.owner_id}
              onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            >
              <option value="">Select Owner</option>
              {owners.map((o) => (
                <option key={o.owner_id} value={o.owner_id}>
                  {o.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment *
            </label>
            <select
              value={formData.appointment_id}
              onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            >
              <option value="">Select Appointment</option>
              {appointments.map((a) => (
                <option key={a.appointment_id} value={a.appointment_id}>
                  #{a.appointment_id} - {a.pet?.name} (
                  {new Date(a.appointment_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Base Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.base_amount}
              onChange={(e) =>
                setFormData({ ...formData, base_amount: e.target.value })
              }
              onBlur={calculateTotal}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Additional Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.additional_cost}
              onChange={(e) =>
                setFormData({ ...formData, additional_cost: e.target.value })
              }
              onBlur={calculateTotal}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.total_amount}
              onChange={(e) =>
                setFormData({ ...formData, total_amount: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status *
            </label>
            <select
              value={formData.payment_status}
              onChange={(e) =>
                setFormData({ ...formData, payment_status: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              value={formData.payment_date}
              onChange={(e) =>
                setFormData({ ...formData, payment_date: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Issued By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issued By *
            </label>
            <input
              type="text"
              value={formData.issued_by}
              onChange={(e) =>
                setFormData({ ...formData, issued_by: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    </DashboardLayout>
  );
}