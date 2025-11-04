'use client';

import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { appointmentAPI } from '@/services/api';
import { Calendar, Clock } from 'lucide-react';

export default function OwnerAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      fetchMyAppointments(user.id);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'Canceled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <PetOwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments 📅</h1>
          <p className="text-gray-600 mt-1">View your pet's scheduled appointments</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Appointments</h3>
            <p className="text-gray-600">Contact the clinic to schedule an appointment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.appointment_id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
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
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Service</p>
                    <p className="font-medium text-gray-900">{apt.service?.service_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Doctor</p>
                    <p className="font-medium text-gray-900">{apt.staff?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(apt.appointment_date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pet</p>
                    <p className="font-medium text-gray-900">{apt.pet?.name} ({apt.pet?.species})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PetOwnerLayout>
  );
}