import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sweetService } from '../services/sweetService';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import SweetCard from './SweetCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
      const data = await sweetService.searchSweets(searchTerm, null);
      setSweets(data);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweet) => {
    // Redirect to checkout with single item
    navigate('/checkout', { state: { item: sweet } });
  };

  const handleAddToCart = async (id) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      const response = await cartService.addToCart(id, 1);
      if (response && response.success) {
        alert('Item added to cart!');
      } else {
        alert(response?.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      if (err.response?.status === 403) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to add to cart');
      }
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
        <div className="max-w-2xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search sweets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
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
                onPurchase={() => handlePurchase(sweet)}
                onAddToCart={() => handleAddToCart(sweet._id || sweet.id)}
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