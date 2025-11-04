'use client';

import { useEffect, useState } from 'react';
import PetOwnerLayout from '@/components/layout/PetOwnerLayout';
import { medicalRecordAPI, petAPI } from '@/services/api';
import { FileText } from 'lucide-react';

export default function OwnerMedicalRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      fetchMyRecords(user.id);
    }
  }, []);

  const fetchMyRecords = async (ownerId: number) => {
    try {
      const [recordsRes, petsRes] = await Promise.all([
        medicalRecordAPI.getAll(),
        petAPI.getAll(),
      ]);
      
      const myPets = petsRes.data.filter((p: any) => p.owner_id === ownerId);
      const myPetIds = myPets.map((p: any) => p.pet_id);
      const myRecords = recordsRes.data.filter((r: any) => myPetIds.includes(r.pet_id));
      
      setRecords(myRecords);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PetOwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Records 📋</h1>
          <p className="text-gray-600 mt-1">View your pet's medical history</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <FileText className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Medical Records</h3>
            <p className="text-gray-600">Medical records will appear here after appointments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.record_id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <FileText className="text-purple-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      Record #{record.record_id} - {record.pet?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      by Dr. {record.staff?.full_name} • {new Date(record.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-xs font-medium text-red-600 mb-2">DIAGNOSIS</p>
                    <p className="text-sm text-gray-900">{record.diagnosis}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-600 mb-2">TREATMENT</p>
                    <p className="text-sm text-gray-900">{record.treatment}</p>
                  </div>
                </div>

                {record.note && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-600 mb-2">NOTES</p>
                    <p className="text-sm text-gray-900">{record.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PetOwnerLayout>
  );
}