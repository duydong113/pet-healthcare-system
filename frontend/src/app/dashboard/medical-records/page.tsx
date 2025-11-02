'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { medicalRecordAPI, appointmentAPI, petAPI, staffAPI } from '@/services/api';
import { Plus, Edit, Trash2, X, FileText } from 'lucide-react';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    appointment_id: '',
    pet_id: '',
    staff_id: '',
    diagnosis: '',
    treatment: '',
    note: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recRes, aptRes, petRes, staffRes] = await Promise.all([
        medicalRecordAPI.getAll(),
        appointmentAPI.getAll(),
        petAPI.getAll(),
        staffAPI.getAll(),
      ]);
      setRecords(recRes.data);
      setAppointments(aptRes.data);
      setPets(petRes.data);
      setStaff(staffRes.data);
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
        pet_id: parseInt(formData.pet_id),
        staff_id: parseInt(formData.staff_id),
      };
      if (editing) {
        await medicalRecordAPI.update(editing.record_id, data);
      } else {
        await medicalRecordAPI.create(data);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving medical record');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this medical record?')) {
      try {
        await medicalRecordAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Error deleting record');
      }
    }
  };

  const handleEdit = (record: any) => {
    setEditing(record);
    setFormData({
      appointment_id: record.appointment_id,
      pet_id: record.pet_id,
      staff_id: record.staff_id,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      note: record.note || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      appointment_id: '',
      pet_id: '',
      staff_id: '',
      diagnosis: '',
      treatment: '',
      note: '',
    });
    setEditing(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600 mt-1">Manage pet medical records</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
          >
            <Plus size={20} />
            Add Record
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            records.map((record) => (
              <div key={record.record_id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Record #{record.record_id} - {record.pet?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {record.staff?.full_name} on {new Date(record.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(record)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(record.record_id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis</p>
                    <p className="text-sm text-gray-900">{record.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Treatment</p>
                    <p className="text-sm text-gray-900">{record.treatment}</p>
                  </div>
                </div>
                {record.note && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                    <p className="text-sm text-gray-600">{record.note}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editing ? 'Edit Record' : 'New Medical Record'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Appointment *</label>
                <select value={formData.appointment_id} onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select Appointment</option>
                  {appointments.map((a) => (
                    <option key={a.appointment_id} value={a.appointment_id}>
                      #{a.appointment_id} - {a.pet?.name} ({new Date(a.appointment_date).toLocaleDateString()})
                    </option>
                  ))}
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
                <label className="block text-sm font-medium mb-1">Staff *</label>
                <select value={formData.staff_id} onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select Staff</option>
                  {staff.map((s) => (<option key={s.staff_id} value={s.staff_id}>{s.full_name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis *</label>
                <textarea value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Treatment *</label>
                <textarea value={formData.treatment} onChange={(e) => setFormData({ ...formData, treatment: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
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