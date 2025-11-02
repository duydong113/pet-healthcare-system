'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { appointmentAPI, petAPI, serviceAPI, staffAPI, petOwnerAPI } from '@/services/api';
import { Plus, Edit, Trash2, X, Calendar } from 'lucide-react';

export default function AppointmentsPage() {
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
    service_id: '',
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
      const data = {
        ...formData,
        pet_id: parseInt(formData.pet_id),
        service_id: parseInt(formData.service_id),
        staff_id: parseInt(formData.staff_id),
        owner_id: parseInt(formData.owner_id),
        appointment_date: new Date(formData.appointment_date).toISOString(),
      };
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
      pet_id: apt.pet_id,
      service_id: apt.service_id,
      staff_id: apt.staff_id,
      owner_id: apt.owner_id,
      appointment_date: new Date(apt.appointment_date).toISOString().slice(0, 16),
      status: apt.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      pet_id: '',
      service_id: '',
      staff_id: '',
      owner_id: '',
      appointment_date: '',
      status: 'Pending',
    });
    setEditing(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {appointments.map((apt) => (
                    <tr key={apt.appointment_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{apt.appointment_id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{apt.pet?.name}</td>
                      <td className="px-6 py-4 text-sm">{apt.owner?.full_name}</td>
                      <td className="px-6 py-4 text-sm">{apt.service?.service_name}</td>
                      <td className="px-6 py-4 text-sm">{apt.staff?.full_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(apt.appointment_date).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(apt)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(apt.appointment_id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editing ? 'Edit Appointment' : 'New Appointment'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Owner *</label>
                <select value={formData.owner_id} onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select Owner</option>
                  {owners.map((o) => (<option key={o.owner_id} value={o.owner_id}>{o.full_name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pet *</label>
                <select value={formData.pet_id} onChange={(e) => setFormData({ ...formData, pet_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select Pet</option>
                  {pets.map((p) => (<option key={p.pet_id} value={p.pet_id}>{p.name} ({p.species})</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service *</label>
                <select value={formData.service_id} onChange={(e) => setFormData({ ...formData, service_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select Service</option>
                  {services.map((s) => (<option key={s.service_id} value={s.service_id}>{s.service_name} (${s.price})</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Staff *</label>
                <select value={formData.staff_id} onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select Staff</option>
                  {staff.map((s) => (<option key={s.staff_id} value={s.staff_id}>{s.full_name} ({s.role})</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Appointment Date *</label>
                <input type="datetime-local" value={formData.appointment_date} onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status *</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
