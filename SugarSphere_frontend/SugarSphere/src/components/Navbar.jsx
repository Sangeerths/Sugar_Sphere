import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          
          {/* Left Side - Back Button */}
          <button
            onClick={handleBack}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition font-semibold flex items-center gap-2 backdrop-blur-sm z-10 flex-shrink-0"
            title="Go back"
          >
            ← Back
          </button>

          {/* Center - Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 z-10 whitespace-nowrap">
            🍬 Sugar Sphere
          </Link>

          {/* Right Side */}
          <div className="flex gap-5 items-center ml-auto z-10 flex-shrink-0">
            {user ? (
              <>
                {/* ✅ Cart Button */}
                <Link
                  to="/cart"
                  className="relative bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition font-semibold"
                >
                  🛒 Cart
                </Link>

                {isAdmin() && (
                  <Link to="/admin" className="hover:text-pink-200 transition">
                    Admin Panel
                  </Link>
                )}

                <span className="text-pink-200">
                  Welcome, {user.username}!
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-pink-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;