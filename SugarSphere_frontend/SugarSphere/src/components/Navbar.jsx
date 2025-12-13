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

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            🍬 Sweet Shop
          </Link>
          
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-pink-200 transition">
                  Dashboard
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="hover:text-pink-200 transition">
                    Admin Panel
                  </Link>
                )}
                <span className="text-pink-200">Welcome, {user.username}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-pink-200 transition"
                >
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
