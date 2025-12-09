'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  appointmentAPI,
  petAPI,
  serviceAPI,
  staffAPI,
  petOwnerAPI,
} from '@/services/api';
import { Plus, Edit, Trash2, X, Calendar } from 'lucide-react';

export default function AppointmentsPage() {
  // HISTORY MODAL
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyAppointments, setHistoryAppointments] = useState<any[]>([]);

  // NORMAL PAGE STATE
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
    service_ids: [] as string[],
    staff_id: '',
    owner_id: '',
    appointment_date: '',
    status: 'Pending',
  });

  // FETCH NORMAL DATA (KHÔNG INCLUDE ARCHIVED)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, petRes, servRes, staffRes, ownerRes] = await Promise.all([
        appointmentAPI.getAll(), // 🔥 chỉ lấy appointments không Archived
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

  // SUBMIT FORM
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

      if (formData.staff_id) data.staff_id = parseInt(formData.staff_id);

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

  // DELETE APPOINTMENT (SOFT DELETE → ARCHIVED)
  const handleDelete = async (id: number) => {
    if (confirm('Delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        fetchData();
      } catch {
        alert('Error deleting appointment');
      }
    }
  };

  // EDIT
  const handleEdit = (apt: any) => {
    setEditing(apt);

    setFormData({
      pet_id: String(apt.pet_id),
      owner_id: String(apt.owner_id),
      staff_id: apt.staff_id ? String(apt.staff_id) : '',
      appointment_date: new Date(apt.appointment_date)
        .toISOString()
        .slice(0, 16),
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
      case 'Archived':
        return 'bg-gray-300 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleServiceToggle = (id: string) => {
    setFormData((prev) => {
      if (prev.service_ids.includes(id)) {
        return {
          ...prev,
          service_ids: prev.service_ids.filter((x) => x !== id),
        };
      }
      return { ...prev, service_ids: [...prev.service_ids, id] };
    });
  };

  // 🔥 LẤY TOÀN BỘ APPOINTMENTS, BAO GỒM ARCHIVED (history)
  const openHistoryModal = async () => {
    try {
      const res = await appointmentAPI.getAll(true); // <—— includeArchived
      setHistoryAppointments(res.data);
      setShowHistoryModal(true);
    } catch (error) {
      console.error(error);
      alert('Failed to load history.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl text-black font-bold">Appointments</h1>
            <p className="text-gray-600">Manage pet appointments</p>
          </div>

          <div className="flex gap-3">
            {/* VIEW HISTORY BUTTON */}
            <button
              onClick={openHistoryModal}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg"
            >
              <Calendar size={18} />
              View History
            </button>

            {/* ADD BUTTON */}
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
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-black font-medium">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-black font-medium">
                      Pet
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-black font-medium">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-black font-medium">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-black font-medium">
                      Staff
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-black font-medium">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-black font-medium">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-black font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {appointments.map((apt) => (
                    <tr key={apt.appointment_id}>
                      <td className="px-6 py-4 text-black">{apt.appointment_id}</td>
                      <td className="px-6 py-4 text-black">{apt.pet?.name}</td>
                      <td className="px-6 py-4 text-black">{apt.owner?.full_name}</td>
                      <td className="px-6 py-4 text-black">
                        {apt.appointmentServices
                          ?.map((x: any) => x.service?.service_name)
                          .join(', ')}
                      </td>
                      <td className="px-6 py-4 text-black">{apt.staff?.full_name}</td>
                      <td className="px-6 py-4 text-black">
                        {new Date(apt.appointment_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-black">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
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

                  {appointments.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-6 text-gray-500 text-center"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL — ADD / EDIT */}
        {showModal && (
          <div className="text-black fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="text-2xl font-semibold">
                  {editing ? 'Edit Appointment' : 'New Appointment'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* OWNER */}
                <div>
                  <label>Owner *</label>
                  <select
                    value={formData.owner_id}
                    onChange={(e) =>
                      setFormData({ ...formData, owner_id: e.target.value })
                    }
                    required
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="">Select Owner</option>
                    {owners.map((o) => (
                      <option key={o.owner_id} value={o.owner_id}>
                        {o.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PET */}
                <div>
                  <label>Pet *</label>
                  <select
                    value={formData.pet_id}
                    onChange={(e) =>
                      setFormData({ ...formData, pet_id: e.target.value })
                    }
                    required
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="">Select Pet</option>
                    {pets
                      .filter((p) => p.owner_id === Number(formData.owner_id))
                      .map((p) => (
                        <option key={p.pet_id} value={p.pet_id}>
                          {p.name} ({p.species})
                        </option>
                      ))}
                  </select>
                </div>

                {/* SERVICES */}
                <div className="md:col-span-2">
                  <label>Services *</label>
                  <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                    {services.map((s) => {
                      const idStr = String(s.service_id);
                      const checked = formData.service_ids.includes(idStr);
                      return (
                        <label
                          key={s.service_id}
                          className="flex justify-between items-center py-1"
                        >
                          <div className="flex gap-2 items-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                handleServiceToggle(String(s.service_id))
                              }
                            />
                            {s.service_name}
                          </div>
                          <span className="text-sm text-gray-500">
                            ${s.price}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* STAFF */}
                <div>
                  <label>Staff</label>
                  <select
                    value={formData.staff_id}
                    onChange={(e) =>
                      setFormData({ ...formData, staff_id: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="">Select Staff</option>
                    {staff.map((s) => (
                      <option key={s.staff_id} value={s.staff_id}>
                        {s.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DATE */}
                <div>
                  <label>Appointment Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.appointment_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointment_date: e.target.value,
                      })
                    }
                    required
                    className="w-full border p-2 rounded-lg"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>

                {/* BUTTONS */}
                <div className="md:col-span-2 flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 border rounded-lg p-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white p-2 rounded-lg"
                  >
                    {editing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* HISTORY MODAL */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-10 w-full max-w-6xl shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-xl text-black font-semibold">
                  Appointment History (All)
                </h2>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={22} />
                </button>
              </div>

              <table className="w-full text-left border">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2 text-black">ID</th>
                    <th className="px-4 py-2 text-black">Pet</th>
                    <th className="px-4 py-2 text-black">Owner</th>
                    <th className="px-4 py-2 text-black">Services</th>
                    <th className="px-4 py-2 text-black">Date</th>
                    <th className="px-4 py-2 text-black">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyAppointments.map((apt) => (
                    <tr
                      key={apt.appointment_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 text-black py-2">{apt.appointment_id}</td>
                      <td className="px-4 text-black py-2">{apt.pet?.name}</td>
                      <td className="px-4 text-black py-2">{apt.owner?.full_name}</td>

                      <td className="px-4 text-black py-2">
                        {apt.appointmentServices
                          ?.map((x: any) => x.service?.service_name)
                          .join(', ')}
                      </td>

                      <td className="px-4 text-black py-2">
                        {new Date(apt.appointment_date).toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-black">
                        {apt.status === 'Archived' ? (
                          <span className="px-2 py-1 text-xs font-semibold bg-gray-300 text-gray-700 rounded-full">
                            Archived
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              apt.status,
                            )}`}
                          >
                            {apt.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {historyAppointments.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
