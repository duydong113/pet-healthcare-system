'use client';

import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { PawPrint, Calendar, FileText, Receipt, Phone, Mail } from 'lucide-react';
import { petAPI, appointmentAPI, medicalRecordAPI, invoiceAPI } from '@/services/api';
import Image from 'next/image';
const dogHero = "/pi.png";


export default function OwnerDashboardPage() {
  const [stats, setStats] = useState({
    myPets: 0,
    upcomingAppointments: 0,
    medicalRecords: 0,
    unpaidInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
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

  const services = [
    {
      title: 'My Pets',
      description: 'View and manage your beloved pets information',
      icon: PawPrint,
      color: 'from-blue-400 to-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      href: '/owner/pets',
      count: stats.myPets,
    },
    {
      title: 'Appointments',
      description: 'Schedule and track your pet appointments',
      icon: Calendar,
      color: 'from-orange-400 to-red-400',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      href: '/owner/appointments',
      count: stats.upcomingAppointments,
    },
    {
      title: 'Medical Records',
      description: 'Access your pet complete health history',
      icon: FileText,
      color: 'from-purple-400 to-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      href: '/owner/medical-records',
      count: stats.medicalRecords,
    },
    {
      title: 'Invoices',
      description: 'View and manage your payment history',
      icon: Receipt,
      color: 'from-green-400 to-emerald-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      href: '/owner/invoices',
      count: stats.unpaidInvoices,
    },
  ];

  if (loading) {
    return (
      <PetOwnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Your pet is running...</p>
          </div>
        </div>
      </PetOwnerLayout>
    );
  }

  return (
    <PetOwnerLayout>
      <div>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 rounded-3xl p-12 mb-8 shadow-xl">
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-50 animate-bounce"></div>
          <div className="absolute bottom-10 right-20 w-16 h-16 bg-blue-400 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-20 right-40 w-12 h-12 bg-purple-400 rounded-full opacity-50"></div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-block mb-4 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full">
              <p className="text-orange-600 font-semibold text-sm">🐾 Pet Owner Portal</p>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
              For Your Pet's<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                Natural Life & Care
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-2xl">
              Welcome back, <span className="font-semibold text-gray-800">{user?.full_name}</span>! 
              Manage your pets health, appointments, and medical records all in one place.
            </p>
            
            <div className="flex gap-4">
              <a
                href="/owner/pets"
                className="px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                View My Pets
              </a>
              <a
                href="/owner/appointments"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-2 border-gray-200"
              >
                Book Appointment
              </a>
            </div>
          </div>

         {/* Decorative Pet Image */}
<div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block">
  <div className="relative w-[460px] h-[380px] animate-soft-bounce">
    <Image
      src="/pi.png"
      alt="Pet decorative"
      fill
      className="object-contain pointer-events-none select-none"
      style={{
        filter: `
          drop-shadow(0 8px 18px rgba(0, 0, 0, 0.25))
          drop-shadow(0 0 10px rgba(255, 180, 120, 0.25))
        `,
      }}
      priority
    />
    <div className="absolute -top-4 -right-4 text-4xl animate-pulse">✨</div>
    <div className="absolute -bottom-6 -left-6 text-3xl animate-soft-bounce delay-75">
      🦴
    </div>
  </div>
</div>


        </div>

        {/* What We Offer Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <p className="text-orange-500 font-semibold mb-2">Care For Your Pet</p>
            <h2 className="text-4xl font-bold text-gray-800">What We Offer</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <a
                  key={index}
                  href={service.href}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className={`relative w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={service.iconColor} size={32} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-purple-600 transition-all duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Count Badge */}
                  {service.count > 0 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                      {service.count} {service.count === 1 ? 'item' : 'items'}
                    </div>
                  )}

                  {/* Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">Need Help? Contact Us!</h3>
              <p className="text-blue-100">Our team is here to help you 24/7</p>
            </div>
            
            <div className="flex gap-4">
              <a
                href="tel:384-129-293-39"
                className="flex items-center gap-3 px-6 py-3 bg-white text-gray-800 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Phone size={20} />
                <span>384-129-293-39</span>
              </a>
              
              <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200">
                <Mail className="text-white" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-2">🐾</div>
            <div className="text-3xl font-bold text-gray-800">{stats.myPets}</div>
            <div className="text-sm text-gray-600">Total Pets</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-3xl font-bold text-orange-500">{stats.upcomingAppointments}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-3xl font-bold text-purple-500">{stats.medicalRecords}</div>
            <div className="text-sm text-gray-600">Records</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold text-green-500">{stats.unpaidInvoices}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>
    </PetOwnerLayout>
  );
}