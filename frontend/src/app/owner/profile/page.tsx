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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </PetOwnerLayout>
    );
  }

  return (
    <PetOwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile 👤</h1>
          <p className="text-gray-600 mt-1">View your account information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-2xl">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-4xl text-white font-bold">
              {owner?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{owner?.full_name}</h2>
              <p className="text-gray-600">Pet Owner</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <p className="font-medium text-gray-900">{owner?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Phone className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <p className="font-medium text-gray-900">{owner?.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <User className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Account ID</p>
                <p className="font-medium text-gray-900">#{owner?.owner_id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Calendar className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Member Since</p>
                <p className="font-medium text-gray-900">
                  {new Date(owner?.created_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{owner?.pets?.length || 0}</p>
              <p className="text-sm text-gray-600">Pets</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{owner?.appointments?.length || 0}</p>
              <p className="text-sm text-gray-600">Appointments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{owner?.invoices?.length || 0}</p>
              <p className="text-sm text-gray-600">Invoices</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ Update Information</h3>
          <p className="text-sm text-blue-800">
            To update your profile information, please contact the clinic staff or visit the clinic in person.
          </p>
        </div>
      </div>
    </PetOwnerLayout>
  );
}