"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { petOwnerAPI } from "@/services/api";
import { Plus, Edit, Trash2, Search, Mail, Phone, X } from "lucide-react";

export default function PetOwnersPage() {
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingOwner, setEditingOwner] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await petOwnerAPI.getAll();
      setOwners(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOwner) {
        await petOwnerAPI.update(editingOwner.owner_id, formData);
      } else {
        await petOwnerAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchOwners();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error saving owner");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this owner?")) {
      try {
        await petOwnerAPI.delete(id);
        fetchOwners();
      } catch (error) {
        alert("Error deleting owner");
      }
    }
  };

  const handleEdit = (owner: any) => {
    setEditingOwner(owner);
    setFormData({
      full_name: owner.full_name,
      phone: owner.phone,
      email: owner.email,
      password: "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ full_name: "", phone: "", email: "", password: "" });
    setEditingOwner(null);
  };

  const filteredOwners = owners.filter(
    (owner) =>
      owner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pet Owners</h1>
            <p className="text-gray-600 mt-1">Manage pet owner accounts</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add Owner
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOwners.map((owner) => (
                    <tr key={owner.owner_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {owner.owner_id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {owner.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            {owner.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            {owner.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {owner.pets?.length || 0} pets
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(owner)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(owner.owner_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOwners.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No owners found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex justify-center items-center w-full h-full overflow-y-auto py-10">
            <div className="bg-white rounded-2xl p-8 w-[90%] max-w-xl shadow-2xl mx-auto relative transition-all duration-300">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {editingOwner ? "Edit Owner" : "Add New Owner"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="Enter owner's full name"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingOwner && "(leave blank to keep current)"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder={
                      editingOwner
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                    required={!editingOwner}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    {editingOwner ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
