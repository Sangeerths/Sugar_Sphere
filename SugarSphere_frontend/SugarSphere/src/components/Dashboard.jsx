import React, { useState, useEffect } from 'react';
import { sweetService } from '../services/sweetService';
import { useAuth } from '../context/AuthContext';
import SweetCard from './SweetCard';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading sweets from API...');
      const data = await sweetService.getAllSweets();
      console.log('API Response:', data);
      console.log('Number of sweets received:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('First sweet:', data[0]);
      }
      setSweets(data || []);
    } catch (err) {
      console.error('Error loading sweets:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Failed to load sweets: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await sweetService.searchSweets(searchTerm, category);
      setSweets(data);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    try {
      await sweetService.purchaseSweet(id);
      alert('Purchase successful!');
      loadSweets();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  if (loading && sweets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading sweets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-8">
          Our Sweet Collection
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search sweets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Categories</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Candy">Candy</option>
              <option value="Gummy">Gummy</option>
              <option value="Lollipop">Lollipop</option>
              <option value="Hard Candy">Hard Candy</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Sweets Grid */}
        {sweets.length === 0 && !loading ? (
          <div className="text-center text-gray-600 text-xl mt-12">
            No sweets found. {isAdmin() && 'Add some sweets to get started!'}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet, index) => (
              <SweetCard
                key={sweet.id || sweet._id || index}
                sweet={sweet}
                onPurchase={handlePurchase}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;