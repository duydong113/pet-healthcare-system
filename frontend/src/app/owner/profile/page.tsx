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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
        </div>
      </PetOwnerLayout>
    );
  }

  return (
    <PetOwnerLayout>
      <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-sky-50 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              My Profile
              <span className="text-xl">👤</span>
            </h1>
            <p className="text-gray-600 mt-1">View your account information</p>
          </div>

          {/* Main card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-3xl md:text-4xl text-white font-bold">
                  {owner?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {owner?.full_name}
                  </h2>
                  <p className="text-gray-600">Pet Owner</p>
                  <p className="text-xs text-gray-400 mt-1">
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
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-green-600">
                    {owner?.pets?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Pets</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-600">
                    {owner?.appointments?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Appointments</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-orange-600">
                    {owner?.invoices?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Invoices</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="text-blue-600" size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <p className="font-medium text-gray-900 break-all">
                    {owner?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Phone className="text-green-600" size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900">
                    {owner?.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <User className="text-purple-600" size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account ID</p>
                  <p className="font-medium text-gray-900">
                    #{owner?.owner_id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Calendar className="text-orange-600" size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Member Since</p>
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
            <div className="mt-8 pt-5 border-t">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-sm font-semibold text-gray-800">
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
