'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  isActive: boolean;
  orderingEnabled: boolean;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await apiClient.get('/api/branches');
      setBranches(response.data.data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await apiClient.put(`/api/branches/${editingBranch.id}`, formData);
      } else {
        await apiClient.post('/api/branches', formData);
      }
      setShowModal(false);
      setEditingBranch(null);
      setFormData({ name: '', address: '', city: '', state: '', country: '', phone: '', email: '' });
      fetchBranches();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save branch');
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      country: branch.country,
      phone: branch.phone,
      email: branch.email,
    });
    setShowModal(true);
  };

  const handleToggleActive = async (branch: Branch) => {
    try {
      await apiClient.put(`/api/branches/${branch.id}`, {
        isActive: !branch.isActive,
      });
      fetchBranches();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update branch');
    }
  };

  const handleToggleOrdering = async (branch: Branch) => {
    try {
      await apiClient.put(`/api/branches/${branch.id}`, {
        orderingEnabled: !branch.orderingEnabled,
      });
      fetchBranches();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update branch');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Branches</h1>
        <button
          onClick={() => {
            setEditingBranch(null);
            setFormData({ name: '', address: '', city: '', state: '', country: '', phone: '', email: '' });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                <p className="text-sm text-gray-500">{branch.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleActive(branch)}
                  className={`px-2 py-1 text-xs rounded-full ${
                    branch.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {branch.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleToggleOrdering(branch)}
                  className={`px-2 py-1 text-xs rounded-full ${
                    branch.orderingEnabled
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {branch.orderingEnabled ? 'Ordering On' : 'Ordering Off'}
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📍 {branch.address}</p>
              <p>{branch.city}, {branch.state}, {branch.country}</p>
              <p>📞 {branch.phone}</p>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => handleEdit(branch)}
                className="text-primary-600 hover:text-primary-900 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingBranch ? 'Edit Branch' : 'Add Branch'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address *</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country *</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {editingBranch ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
