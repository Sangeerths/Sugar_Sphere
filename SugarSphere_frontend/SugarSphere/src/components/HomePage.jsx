import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sweetService } from '../services/sweetService';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredSweets, setFeaturedSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedSweets();
  }, []);

  const loadFeaturedSweets = async () => {
    try {
      const sweets = await sweetService.getAllSweets();
      // Get first 6 sweets as featured
      setFeaturedSweets(sweets.slice(0, 6));
    } catch (err) {
      console.error('Failed to load featured sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseProducts = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to Sugar Sphere
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100">
              Indulge in the Sweetest Delights
            </p>
            <p className="text-lg md:text-xl mb-10 text-pink-50">
              Discover our handcrafted collection of premium sweets, chocolates, and confections
              that will satisfy your sweetest cravings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBrowseProducts}
                className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-all transform hover:scale-105 shadow-xl"
              >
                🛍️ Browse Products
              </button>
              {!user && (
                <button
                  onClick={() => navigate('/register')}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-pink-600 transition-all transform hover:scale-105"
                >
                  ✨ Get Started
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🍬</div>
        <div className="absolute top-20 right-20 text-5xl opacity-20 animate-pulse">🍰</div>
        <div className="absolute bottom-10 left-1/4 text-5xl opacity-20 animate-bounce delay-300">🍭</div>
        <div className="absolute bottom-20 right-1/4 text-6xl opacity-20 animate-pulse delay-500">🧁</div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Why Choose Sugar Sphere?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Experience the finest quality sweets delivered with care
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Premium Quality</h3>
              <p className="text-gray-600">
                Handcrafted with the finest ingredients and attention to detail
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and secure delivery to your doorstep, fresh and ready to enjoy
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Perfect Gifts</h3>
              <p className="text-gray-600">
                Beautifully packaged sweets perfect for any occasion or celebration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Featured Sweets
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Discover our most popular confections
          </p>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-600">Loading delicious sweets...</p>
            </div>
          ) : featuredSweets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredSweets.map((sweet) => (
                <div
                  key={sweet._id || sweet.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  <div className="relative h-64 bg-gradient-to-br from-pink-200 to-purple-200">
                    {sweet.imageUrl ? (
                      <img
                        src={sweet.imageUrl}
                        alt={sweet.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🍬
                      </div>
                    )}
                    {sweet.quantity > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        In Stock
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">{sweet.name}</h3>
                    {sweet.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{sweet.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-pink-600">
                        ₹{sweet.price}
                      </span>
                      <button
                        onClick={handleBrowseProducts}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No sweets available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <button
              onClick={handleBrowseProducts}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Satisfy Your Sweet Tooth?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-pink-100">
            Browse our complete collection and find your perfect treat
          </p>
          <button
            onClick={handleBrowseProducts}
            className="bg-white text-pink-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-all transform hover:scale-105 shadow-xl"
          >
            {user ? 'Go to Dashboard' : 'Get Started Now'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">🍬 Sugar Sphere</p>
          <p className="text-gray-400">
            Your one-stop destination for premium sweets and confections
          </p>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 Sugar Sphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;