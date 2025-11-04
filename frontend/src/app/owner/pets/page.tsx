'use client';

import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { petAPI } from '@/services/api';
import { PawPrint, Calendar, Weight } from 'lucide-react';

export default function OwnerPetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setOwnerId(user.id);
      fetchMyPets(user.id);
    }
  }, []);

  const fetchMyPets = async (id: number) => {
    try {
      const response = await petAPI.getAll();
      // Chỉ lấy pets của owner hiện tại
      const myPets = response.data.filter((pet: any) => pet.owner_id === id);
      setPets(myPets);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    
    if (years === 0) {
      return `${months} months`;
    }
    return `${years} year${years > 1 ? 's' : ''}`;
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Pets 🐾</h1>
          <p className="text-gray-600 mt-1">View your beloved pets' information</p>
        </div>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <PawPrint className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Pets Yet</h3>
            <p className="text-gray-600 mb-4">Contact the clinic to register your pets</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.pet_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Pet Header */}
                <div className="bg-gradient-to-r from-green-400 to-blue-400 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">
                      {pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐈' : '🐾'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{pet.name}</h3>
                      <p className="text-green-50">{pet.species}</p>
                    </div>
                  </div>
                </div>

                {/* Pet Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      {pet.gender === 'Male' ? '♂️' : '♀️'}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="font-medium">{pet.gender}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Age</p>
                      <p className="font-medium">{calculateAge(pet.dob)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Weight size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="font-medium">{pet.weight} kg</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(pet.dob).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ Note</h3>
          <p className="text-sm text-blue-800">
            To add new pets or update pet information, please contact the clinic staff.
          </p>
        </div>
      </div>
    </PetOwnerLayout>
  );
}