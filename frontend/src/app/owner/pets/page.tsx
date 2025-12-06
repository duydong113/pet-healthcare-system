'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { petAPI } from '@/services/api';
import { PawPrint, Calendar, Weight, Pencil } from 'lucide-react';

export default function OwnerPetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState<number | null>(null);

  // tránh hydration error
  const [mounted, setMounted] = useState(false);

  // modal edit
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    species: '',
    gender: 'Male',
    weight: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setOwnerId(user.id);
      fetchMyPets(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyPets = async (id: number) => {
    try {
      const response = await petAPI.getAll();
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
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years <= 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return `${years} year${years > 1 ? 's' : ''}`;
  };

  const openEditModal = (pet: any) => {
    setSelectedPet(pet);
    setEditForm({
      name: pet.name || '',
      species: pet.species || '',
      gender: pet.gender || 'Male', // 'Male' | 'Female' như DB
      weight: pet.weight?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
    setEditForm({
      name: '',
      species: '',
      gender: 'Male',
      weight: '',
    });
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    try {
      const payload = {
        ...selectedPet, // giữ lại owner_id, dob, ...
        name: editForm.name,
        species: editForm.species,
        gender: editForm.gender, // 'Male' | 'Female'
        weight: parseFloat(editForm.weight),
      };

      await petAPI.update(selectedPet.pet_id, payload);

      if (ownerId) {
        await fetchMyPets(ownerId);
      }

      closeEditModal();
    } catch (err) {
      console.error('Error updating pet', err);
      alert('Error updating pet');
    }
  };

  // tránh mismatch giữa SSR & client
  if (!mounted) {
    return null;
  }

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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Pets 🐾</h1>
          <p className="text-gray-600 mt-1">
            View your beloved pets&apos; information
          </p>
        </div>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <PawPrint className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Pets Yet</h3>
            <p className="text-gray-600 mb-4">
              Contact the clinic to register your pets
            </p>
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
                      {pet.species === 'Dog'
                        ? '🐕'
                        : pet.species === 'Cat'
                        ? '🐈'
                        : '🐾'}
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

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-gray-400">
                      Pet ID: #{pet.pet_id}
                    </span>

                    <button
                      onClick={() => openEditModal(pet)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 text-xs font-semibold text-orange-600 hover:bg-orange-100 transition-colors"
                    >
                      <Pencil size={14} />
                      Edit info
                    </button>
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
            To add new pets or update pet information, please contact the clinic
            staff.
          </p>
        </div>
      </div>

      {/* EDIT PET MODAL */}
      {isModalOpen && selectedPet && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-3xl shadow-md">
                {selectedPet.species === 'Dog'
                  ? '🐕'
                  : selectedPet.species === 'Cat'
                  ? '🐈'
                  : '🐾'}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Pet Info
                </h2>
                <p className="text-sm text-gray-700">
                  Updating profile for{' '}
                  <span className="font-semibold">{selectedPet.name}</span>
                </p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSaveChanges}>
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Name
                </label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 
                  focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm"
                />
              </div>

              {/* Species */}
              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Species
                </label>
                <input
                  name="species"
                  value={editForm.species}
                  onChange={(e) =>
                    setEditForm({ ...editForm, species: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 
                  focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Gender
                </label>
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={(e) =>
                    setEditForm({ ...editForm, gender: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 
                  focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm"
                >
                  <option value="Male">Male ♂️</option>
                  <option value="Female">Female ♀️</option>
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={editForm.weight}
                  onChange={(e) =>
                    setEditForm({ ...editForm, weight: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 
                  focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gray-100 text-sm transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white 
                  text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PetOwnerLayout>
  );
}
