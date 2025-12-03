'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { medicalRecordAPI, appointmentAPI, petAPI, staffAPI } from '@/services/api';
import { Plus, Edit, Trash2, X, Calendar } from 'lucide-react';

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
    notes: '',
    record_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recRes, appRes, petRes, staffRes] = await Promise.all([
        medicalRecordAPI.getAll(),
        appointmentAPI.getAll(),
        petAPI.getAll(),
        staffAPI.getAll(),
      ]);
      setRecords(recRes.data);
      setAppointments(appRes.data);
      setPets(petRes.data);
      setStaff(staffRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      appointment_id: '',
      pet_id: '',
      staff_id: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      record_date: '',
    });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.appointment_id || !formData.diagnosis || !formData.treatment) {
      alert('Please fill in all required fields.');
      return;
    }

    const data: any = {
      appointment_id: Number(formData.appointment_id),
      diagnosis: formData.diagnosis.trim(),
      treatment: formData.treatment.trim(),
    };

    // Chỉ gửi pet_id và staff_id nếu có giá trị
    if (formData.pet_id) data.pet_id = Number(formData.pet_id);
    if (formData.staff_id) data.staff_id = Number(formData.staff_id);

    // Gửi notes nếu có
    if (formData.notes) data.notes = formData.notes.trim();

    try {
      let response;
      if (editing) {
        response = await medicalRecordAPI.update(editing.record_id, data);
      } else {
        response = await medicalRecordAPI.create(data);
      }

      console.log('Response from server:', response.data);
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Axios error object:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        alert(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server.');
      } else {
        console.error('Error setting up request:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleEdit = (rec: any) => {
    setEditing(rec);
    setFormData({
      appointment_id: rec.appointment_id,
      pet_id: rec.pet_id || '',
      staff_id: rec.staff_id || '',
      diagnosis: rec.diagnosis,
      treatment: rec.treatment,
      notes: rec.notes || '',
      record_date: '', // Không cần gửi record_date nếu backend không yêu cầu
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this medical record?')) {
      try {
        await medicalRecordAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Error deleting medical record');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Medical Records</h1>
            <p className="text-black mt-1">Manage pet medical history</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg">
            <Plus size={20} /> Add Record
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-black">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Appointment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Pet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Diagnosis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Treatment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {records.map((rec, index) => (
                    <tr key={`${rec.record_id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-black text-sm">{rec.record_id}</td>
                      <td className="px-6 py-4 text-black text-sm">#{rec.appointment?.appointment_id}</td>
                      <td className="px-6 py-4 text-black text-sm">{rec.pet?.name || '-'}</td>
                      <td className="px-6 py-4 text-black text-sm">{rec.staff?.full_name || '-'}</td>
                      <td className="px-6 py-4 text-black text-sm">{rec.diagnosis}</td>
                      <td className="px-6 py-4 text-black text-sm">{rec.treatment}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(rec)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(rec.record_id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg my-8 shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-black">{editing ? 'Edit Medical Record' : 'New Medical Record'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-500 hover:text-gray-800 transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Appointment */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Appointment *</label>
                <select value={formData.appointment_id} onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900" required>
                  <option value="">Select Appointment</option>
                  {appointments.map((a) => (
                    <option key={a.appointment_id} value={a.appointment_id}>
                      #{a.appointment_id} - {a.pet?.name || '-'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pet */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Pet</label>
                <select value={formData.pet_id} onChange={(e) => setFormData({ ...formData, pet_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900">
                  <option value="">Select Pet</option>
                  {pets.map((p) => (
                    <option key={p.pet_id} value={p.pet_id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Staff */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Staff</label>
                <select value={formData.staff_id} onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900">
                  <option value="">Select Staff</option>
                  {staff.map((s) => (
                    <option key={s.staff_id} value={s.staff_id}>{s.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Diagnosis *</label>
                <input type="text" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900" required />
              </div>

              {/* Treatment */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Treatment *</label>
                <input type="text" value={formData.treatment} onChange={(e) => setFormData({ ...formData, treatment: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900" required />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900" />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="flex-1 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
