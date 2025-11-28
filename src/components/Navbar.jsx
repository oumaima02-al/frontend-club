import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';

const Navbar = ({ isLanding = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLanding) {
    return (
      <nav className="fixed w-full z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-neon-green rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold text-white">VolleyClub</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#accueil" className="text-gray-300 hover:text-neon-green transition">
                Accueil
              </a>
              <a href="#about" className="text-gray-300 hover:text-neon-green transition">
                À propos
              </a>
              <a href="#trainings" className="text-gray-300 hover:text-neon-green transition">
                Entraînements
              </a>
              <a href="#matches" className="text-gray-300 hover:text-neon-green transition">
                Matchs
              </a>
              <a href="#contact" className="text-gray-300 hover:text-neon-green transition">
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-neon-green transition">
                Se connecter
              </Link>
              <Link to="/register" className="btn-primary">
                S'inscrire
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-dark-800 border-t border-dark-700">
            <div className="px-4 py-4 space-y-3">
              <a href="#accueil" className="block text-gray-300 hover:text-neon-green">
                Accueil
              </a>
              <a href="#about" className="block text-gray-300 hover:text-neon-green">
                À propos
              </a>
              <a href="#trainings" className="block text-gray-300 hover:text-neon-green">
                Entraînements
              </a>
              <a href="#matches" className="block text-gray-300 hover:text-neon-green">
                Matchs
              </a>
              <a href="#contact" className="block text-gray-300 hover:text-neon-green">
                Contact
              </a>
              <Link to="/login" className="block text-gray-300 hover:text-neon-green">
                Se connecter
              </Link>
              <Link to="/register" className="block btn-primary text-center">
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Navbar pour les pages protégées
  return (
    <nav className="fixed w-full z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neon-green rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-white">VolleyClub</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="relative p-2 text-gray-300 hover:text-neon-green">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            
            <Link to="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-neon-green">
              <User size={20} />
              <span className="hidden md:block">{user?.name}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-red-500 transition"
            >
              <LogOut size={20} />
              <span className="hidden md:block">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;