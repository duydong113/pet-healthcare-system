'use client';

import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { appointmentAPI, petAPI, serviceAPI, staffAPI } from '@/services/api';
import { Calendar, Clock, Plus, X } from 'lucide-react';

export default function OwnerAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [bookingForm, setBookingForm] = useState<{
    pet_id: string;
    service_ids: number[];
    staff_id: string;
    date: string;
    timeSlot: string;
    note: string;
  }>({
    pet_id: '',
    service_ids: [],
    staff_id: '',
    date: '',
    timeSlot: '',
    note: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setOwnerId(user.id);
      fetchMyAppointments(user.id);
      fetchMetaData(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyAppointments = async (ownerId: number) => {
    try {
      const response = await appointmentAPI.getAll();
      const myAppointments = response.data.filter((a: any) => a.owner_id === ownerId);
      setAppointments(myAppointments);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetaData = async (ownerId: number) => {
    try {
      const [petRes, serviceRes, staffRes] = await Promise.all([
        petAPI.getAll(),
        serviceAPI.getAll(),
        staffAPI.getAll(),
      ]);

      const myPets = petRes.data.filter((p: any) => p.owner_id === ownerId);
      setPets(myPets);

      setServices(serviceRes.data || []);

      // Nếu staff có role, có thể filter chỉ Doctor
      const doctors = (staffRes.data || []).filter(
        (s: any) =>
          !s.role ||
          s.role === 'Doctor' ||
          s.position === 'Doctor',
      );
      setStaffs(doctors);
    } catch (error) {
      console.error('Error fetching meta data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Canceled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Assigned':
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Archived':
        return 'bg-gray-200 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatServices = (apt: any) => {
    if (apt.appointmentServices?.length) {
      return apt.appointmentServices
        .map((as: any) => as.service?.service_name)
        .filter(Boolean)
        .join(', ');
    }
    return apt.service?.service_name || '—';
  };

  const handleOpenBookingModal = () => {
    setBookingForm({
      pet_id: '',
      service_ids: [],
      staff_id: '',
      date: '',
      timeSlot: '',
      note: '',
    });
    setAvailableSlots([]);
    setShowBookingModal(true);
  };

  const toggleService = (serviceId: number) => {
    setBookingForm((prev) => {
      const exists = prev.service_ids.includes(serviceId);
      return {
        ...prev,
        service_ids: exists
          ? prev.service_ids.filter((id) => id !== serviceId)
          : [...prev.service_ids, serviceId],
      };
    });
  };

  const loadAvailableSlots = async (date: string, staffId?: string) => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      // date: format YYYY-MM-DD từ input type="date"
      const params: any = { date };
      if (staffId) {
        params.staffId = staffId;
      }

      // Bạn cần có method này trong appointmentAPI, ví dụ:
      // appointmentAPI.getAvailableSlots(params)
      const res = await appointmentAPI.getAvailableSlots(params);
      setAvailableSlots(res.data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChangeDate = (value: string) => {
    setBookingForm((prev) => ({ ...prev, date: value, timeSlot: '' }));
    loadAvailableSlots(value, bookingForm.staff_id);
  };

  const handleChangeStaff = (value: string) => {
    setBookingForm((prev) => ({ ...prev, staff_id: value, timeSlot: '' }));
    if (bookingForm.date) {
      loadAvailableSlots(bookingForm.date, value);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) return;

    if (
      !bookingForm.pet_id ||
      bookingForm.service_ids.length === 0 ||
      !bookingForm.date ||
      !bookingForm.timeSlot
    ) {
      alert('Please select pet, service(s), date and time slot.');
      return;
    }

    try {
      const payload: any = {
        pet_id: parseInt(bookingForm.pet_id, 10),
        owner_id: ownerId,
        appointment_date: bookingForm.timeSlot, // server đang dùng ISO string
        note: bookingForm.note || undefined,
        service_ids: bookingForm.service_ids,
      };

      if (bookingForm.staff_id) {
        payload.staff_id = parseInt(bookingForm.staff_id, 10);
      }

      await appointmentAPI.create(payload);
      setShowBookingModal(false);
      await fetchMyAppointments(ownerId);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Error booking appointment');
    }
  };

  const formatSlotLabel = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PetOwnerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments 📅</h1>
            <p className="text-gray-600 mt-1">
              View your pet&apos;s scheduled appointments
            </p>
          </div>

          <button
            onClick={handleOpenBookingModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
          >
            <Plus size={18} />
            Book Appointment
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Appointments</h3>
            <p className="text-gray-600">
              Click &quot;Book Appointment&quot; to schedule your first visit
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.appointment_id}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Appointment #{apt.appointment_id}
                      </h3>
                      <p className="text-sm text-gray-600">for {apt.pet?.name}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      apt.status,
                    )}`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Services</p>
                    <p className="font-medium text-gray-900">
                      {formatServices(apt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Doctor</p>
                    <p className="font-medium text-gray-900">
                      {apt.staff?.full_name || 'Not assigned yet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date &amp; Time</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(apt.appointment_date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pet</p>
                    <p className="font-medium text-gray-900">
                      {apt.pet?.name} ({apt.pet?.species})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl my-8 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                Book New Appointment
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {/* Pet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet *
                </label>
                <select
                  value={bookingForm.pet_id}
                  onChange={(e) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      pet_id: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

              {/* Services (multi) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {services.map((s) => (
                    <label
                      key={s.service_id}
                      className="flex items-start gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={bookingForm.service_ids.includes(s.service_id)}
                        onChange={() => toggleService(s.service_id)}
                      />
                      <span className="flex-1">
                        <span className="font-medium text-gray-900 block">
                          {s.service_name}
                        </span>
                        {typeof s.price !== 'undefined' && (
                          <span className="text-xs text-gray-500">
                            ${Number(s.price).toFixed(2)}
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Staff + Date (2 columns) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Doctor (optional)
                  </label>
                  <select
                    value={bookingForm.staff_id}
                    onChange={(e) => handleChangeStaff(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Any available doctor</option>
                    {staffs.map((s) => (
                      <option key={s.staff_id} value={s.staff_id}>
                        {s.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => handleChangeDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Time Slots *
                </label>
                {loadingSlots ? (
                  <p className="text-sm text-gray-500">Loading time slots...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Select a date (and optionally a doctor) to see available time
                    slots.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setBookingForm((prev) => ({ ...prev, timeSlot: slot }))
                        }
                        className={`px-3 py-1.5 text-xs rounded-full border ${
                          bookingForm.timeSlot === slot
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-800 hover:bg-blue-50 border-gray-300'
                        }`}
                      >
                        {formatSlotLabel(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <textarea
                  rows={3}
                  value={bookingForm.note}
                  onChange={(e) =>
                    setBookingForm((prev) => ({ ...prev, note: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Describe your pet's symptoms or special requests..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PetOwnerLayout>
  );
}
