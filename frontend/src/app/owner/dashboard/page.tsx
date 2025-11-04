'use client';

import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { PawPrint, Calendar, FileText, Receipt } from 'lucide-react';
import { petAPI, appointmentAPI, medicalRecordAPI, invoiceAPI } from '@/services/api';

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState({
    myPets: 0,
    upcomingAppointments: 0,
    medicalRecords: 0,
    unpaidInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setOwnerId(user.id);
      fetchOwnerStats(user.id);
    }
  }, []);

  const fetchOwnerStats = async (id: number) => {
    try {
      const [petsRes, appointmentsRes, recordsRes, invoicesRes] = await Promise.all([
        petAPI.getAll(),
        appointmentAPI.getAll(),
        medicalRecordAPI.getAll(),
        invoiceAPI.getAll(),
      ]);

      // Filter data for current owner
      const myPets = petsRes.data.filter((p: any) => p.owner_id === id);
      const myAppointments = appointmentsRes.data.filter((a: any) => a.owner_id === id);
      const upcomingAppointments = myAppointments.filter(
        (a: any) => a.status === 'Pending'
      );
      
      const myPetIds = myPets.map((p: any) => p.pet_id);
      const myRecords = recordsRes.data.filter((r: any) => 
        myPetIds.includes(r.pet_id)
      );
      
      const myInvoices = invoicesRes.data.filter((i: any) => i.owner_id === id);
      const unpaidInvoices = myInvoices.filter(
        (i: any) => i.payment_status === 'Pending'
      );

      setStats({
        myPets: myPets.length,
        upcomingAppointments: upcomingAppointments.length,
        medicalRecords: myRecords.length,
        unpaidInvoices: unpaidInvoices.length,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'My Pets',
      value: stats.myPets,
      icon: PawPrint,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Medical Records',
      value: stats.medicalRecords,
      icon: FileText,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Unpaid Invoices',
      value: stats.unpaidInvoices,
      icon: Receipt,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
  ];

  if (loading) {
    return (
      <PetOwnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PetOwnerLayout>
    );
  }

  return (
    <PetOwnerLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Pet Care Portal! 🐾</h1>
          <p className="text-green-50">Manage your pets' health and appointments all in one place</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`bg-white p-6 rounded-xl shadow-sm border ${stat.borderColor} hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                    <Icon className={stat.iconColor} size={28} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/owner/pets"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group text-center"
            >
              <PawPrint className="mx-auto mb-2 text-gray-400 group-hover:text-green-600" size={32} />
              <p className="text-sm font-medium text-gray-700">View My Pets</p>
            </a>
            <a
              href="/owner/appointments"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group text-center"
            >
              <Calendar className="mx-auto mb-2 text-gray-400 group-hover:text-blue-600" size={32} />
              <p className="text-sm font-medium text-gray-700">My Appointments</p>
            </a>
            <a
              href="/owner/medical-records"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group text-center"
            >
              <FileText className="mx-auto mb-2 text-gray-400 group-hover:text-purple-600" size={32} />
              <p className="text-sm font-medium text-gray-700">Medical History</p>
            </a>
            <a
              href="/owner/invoices"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group text-center"
            >
              <Receipt className="mx-auto mb-2 text-gray-400 group-hover:text-orange-600" size={32} />
              <p className="text-sm font-medium text-gray-700">My Invoices</p>
            </a>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📋 Important Information</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Keep your pet's information up to date</li>
            <li>• Check upcoming appointments regularly</li>
            <li>• Review medical records after each visit</li>
            <li>• Pay invoices on time to maintain good service</li>
          </ul>
        </div>
      </div>
    </PetOwnerLayout>
  );
}