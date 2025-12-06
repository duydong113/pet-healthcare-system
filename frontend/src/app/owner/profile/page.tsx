'use client';

import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { petOwnerAPI } from '@/services/api';
import { User, Mail, Phone, Calendar } from 'lucide-react';

export default function OwnerProfilePage() {
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      fetchOwnerProfile(user.id);
    }
  }, []);

  const fetchOwnerProfile = async (id: number) => {
    try {
      const response = await petOwnerAPI.getOne(id);
      setOwner(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PetOwnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      </PetOwnerLayout>
    );
  }

  return (
    <PetOwnerLayout>
      {/* Nền cam – trắng sáng */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-white px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-orange-500 uppercase">
              Account
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2">
              My Profile
              <span className="text-2xl">🐾</span>
            </h1>
            <p className="text-gray-600">
              View and manage your personal information
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100/70 p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-orange-50">
              {/* Avatar + info */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-400 via-pink-400 to-red-400 rounded-full flex items-center justify-center text-3xl md:text-4xl text-white font-bold">
                    {owner?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 right-2 inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-orange-500 shadow-sm border border-orange-100">
                    Pet Owner
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {owner?.full_name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Member since{' '}
                    {owner?.created_at &&
                      new Date(owner.created_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                  </p>
                </div>
              </div>

              {/* Small stats on the right */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="rounded-2xl bg-orange-50 px-4 py-3">
                  <p className="text-lg sm:text-xl font-bold text-orange-500">
                    {owner?.pets?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Pets</p>
                </div>
                <div className="rounded-2xl bg-pink-50 px-4 py-3">
                  <p className="text-lg sm:text-xl font-bold text-pink-500">
                    {owner?.appointments?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Appointments</p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-4 py-3">
                  <p className="text-lg sm:text-xl font-bold text-amber-500">
                    {owner?.invoices?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Invoices</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Email */}
              <div className="flex items-center gap-4 rounded-2xl border border-orange-50 bg-orange-50/60">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Mail className="text-orange-500" size={22} />
                </div>
                <div className="py-3 pr-3">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    Email Address
                  </p>
                  <p className="font-medium text-gray-900 break-all">
                    {owner?.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 rounded-2xl border border-emerald-50 bg-emerald-50/70">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Phone className="text-emerald-500" size={22} />
                </div>
                <div className="py-3 pr-3">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    Phone Number
                  </p>
                  <p className="font-medium text-gray-900">
                    {owner?.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Account ID */}
              <div className="flex items-center gap-4 rounded-2xl border border-purple-50 bg-purple-50/70">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <User className="text-purple-500" size={22} />
                </div>
                <div className="py-3 pr-3">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    Account ID
                  </p>
                  <p className="font-medium text-gray-900">
                    #{owner?.owner_id}
                  </p>
                </div>
              </div>

              {/* Member since */}
              <div className="flex items-center gap-4 rounded-2xl border border-amber-50 bg-amber-50/70">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar className="text-amber-500" size={22} />
                </div>
                <div className="py-3 pr-3">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    Member Since
                  </p>
                  <p className="font-medium text-gray-900">
                    {owner?.created_at &&
                      new Date(owner.created_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="mt-8 pt-5 border-t border-orange-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">
                  Need to update your information?
                </p>
                <p className="text-sm text-gray-600">
                  Please contact the clinic staff or visit the clinic in person
                  to update your profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PetOwnerLayout>
  );
}
