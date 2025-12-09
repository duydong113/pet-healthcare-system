'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { appointmentAPI, petAPI, serviceAPI, staffAPI, petOwnerAPI } from '@/services/api';
import { Plus, Edit, Trash2, X, Calendar } from 'lucide-react';

export default function AppointmentsPage() {
const [showHistoryModal, setShowHistoryModal] = useState(false);
const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
const [selectedHistory, setSelectedHistory] = useState<any[]>([]);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    pet_id: '',
    service_ids: [] as string[], // nhiều service
    staff_id: '',
    owner_id: '',
    appointment_date: '',
    status: 'Pending',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, petRes, servRes, staffRes, ownerRes] = await Promise.all([
        appointmentAPI.getAll(),
        petAPI.getAll(),
        serviceAPI.getAll(),
        staffAPI.getAll(),
        petOwnerAPI.getAll(),
      ]);
      setAppointments(appRes.data);
      setPets(petRes.data);
      setServices(servRes.data);
      setStaff(staffRes.data);
      setOwners(ownerRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        pet_id: parseInt(formData.pet_id),
        owner_id: parseInt(formData.owner_id),
        appointment_date: new Date(formData.appointment_date).toISOString(),
        status: formData.status,
        service_ids: formData.service_ids.map((id) => parseInt(id)),
      };

      if (formData.staff_id) {
        data.staff_id = parseInt(formData.staff_id);
      }

      if (editing) {
        await appointmentAPI.update(editing.appointment_id, data);
      } else {
        await appointmentAPI.create(data);
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving appointment');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Error deleting appointment');
      }
    }
  };

  const handleEdit = (apt: any) => {
    setEditing(apt);
    setFormData({
      pet_id: String(apt.pet_id),
      owner_id: String(apt.owner_id),
      staff_id: apt.staff_id ? String(apt.staff_id) : '',
      appointment_date: new Date(apt.appointment_date).toISOString().slice(0, 16),
      status: apt.status,
      service_ids:
        apt.appointmentServices?.map((as: any) => String(as.service_id)) ||
        (apt.service_id ? [String(apt.service_id)] : []),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      pet_id: '',
      service_ids: [],
      staff_id: '',
      owner_id: '',
      appointment_date: '',
      status: 'Pending',
    });
    setEditing(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // toggle checkbox service
  const handleServiceToggle = (serviceId: string) => {
    if (formData.service_ids.includes(serviceId)) {
      setFormData({
        ...formData,
        service_ids: formData.service_ids.filter((id) => id !== serviceId),
      });
    } else {
      setFormData({
        ...formData,
        service_ids: [...formData.service_ids, serviceId],
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage pet appointments</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
          >
            <Plus size={20} />
            Add Appointment
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Staff
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
            
                    </th>

                  </tr>
                </thead>
                <tbody className="divide-y">
                  {appointments.map((apt) => (
                    <tr key={apt.appointment_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-black text-sm">{apt.appointment_id}</td>
                      <td className="px-6 py-4 text-black text-sm font-medium">
                        {apt.pet?.name}
                      </td>
                      <td className="px-6 py-4 text-black text-sm">
                        {apt.owner?.full_name}
                      </td>
                      <td className="px-6 py-4 text-black text-sm">
                        {apt.appointmentServices?.length
                          ? apt.appointmentServices
                              .map((as: any) => as.service?.service_name)
                              .filter(Boolean)
                              .join(', ')
                          : apt.service?.service_name}
                      </td>
                      <td className="px-6 py-4 text-black text-sm">
                        {apt.staff?.full_name}
                      </td>
                      <td className="px-6 py-4 text-black text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(apt.appointment_date).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            apt.status,
                          )}`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(apt)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(apt.appointment_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl my-8 shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editing ? 'Edit Appointment' : 'New Appointment'}
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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner *
                </label>
                <select
                  value={formData.owner_id}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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

              {/* Pet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet *
                </label>
                <select
                  value={formData.pet_id}
                  onChange={(e) =>
                    setFormData({ ...formData, pet_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                >
                  <option value="">Select Pet</option>
                  {pets.map((p) => (
                    <option key={p.pet_id} value={p.pet_id}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              </div>

              {/* Services – checkbox group (full width) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services *
                </label>
                <div className="border border-gray-300 rounded-lg p-3 bg-white max-h-48 overflow-y-auto space-y-2">
                  {services.map((s) => {
                    const idStr = String(s.service_id);
                    const checked = formData.service_ids.includes(idStr);
                    return (
                      <label
                        key={s.service_id}
                        className="flex items-center justify-between gap-3 text-sm text-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={checked}
                            onChange={() => handleServiceToggle(idStr)}
                          />
                          <span className="font-medium">{s.service_name}</span>
                        </div>
                        <span className="text-xs text-gray-500">${s.price}</span>
                      </label>
                    );
                  })}
                  {services.length === 0 && (
                    <p className="text-xs text-gray-500">
                      No services available.
                    </p>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Tick nhiều dịch vụ nếu pet cần làm nhiều service trong cùng 1 lần khám.
                </p>
              </div>

              {/* Staff */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff
                </label>
                <select
                  value={formData.staff_id}
                  onChange={(e) =>
                    setFormData({ ...formData, staff_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  <option value="">Select Staff</option>
                  {staff.map((s) => (
                    <option key={s.staff_id} value={s.staff_id}>
                      {s.full_name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Appointment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.appointment_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointment_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              {/* Buttons – full width hàng cuối */}
              <div className="md:col-span-2 flex gap-4 pt-4">
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
      )}
      {showHistoryModal && selectedInvoice && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Payment History – Invoice #{selectedInvoice.invoice_id}
        </h2>
        <button
          onClick={() => {
            setShowHistoryModal(false);
            setSelectedInvoice(null);
            setSelectedHistory([]);
          }}
          className="text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>
      </div>

      {(!selectedHistory || selectedHistory.length === 0) ? (
        <p className="text-sm text-gray-600">No payment history yet.</p>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {selectedHistory.map((h, idx) => (
            <li
              key={idx}
              className="flex justify-between items-start border rounded-lg px-3 py-2 bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Status: {h.status}
                </p>
                {h.changed_by && (
                  <p className="text-xs text-gray-500">
                    by {h.changed_by}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {h.payment_date
                  ? new Date(h.payment_date).toLocaleString()
                  : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}

    </DashboardLayout>
  );
}
