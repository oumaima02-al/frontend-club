import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-neon-green rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold text-white">HilalVolleyClub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Le club de volleyball de référence. Rejoignez-nous pour vivre votre passion !
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a href="#accueil" className="text-gray-400 hover:text-neon-green transition text-sm">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-neon-green transition text-sm">
                  À propos
                </a>
              </li>
              <li>
                <a href="#trainings" className="text-gray-400 hover:text-neon-green transition text-sm">
                  Entraînements
                </a>
              </li>
              <li>
                <a href="#matches" className="text-gray-400 hover:text-neon-green transition text-sm">
                  Matchs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin size={16} className="text-neon-green" />
                <span> Salle couverture de Nador, Nador</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone size={16} className="text-neon-green" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail size={16} className="text-neon-green" />
                <span>Hilal@volleyClub.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              
              <a  href="https://www.facebook.com/profile.php?id=61561469993020"
                className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:bg-neon-green hover:text-black transition"
              >
                <Facebook size={20} />
              </a>
              
                <a href="https://www.instagram.com/hilalnador_volleyball/"
                className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-gray-400 hover:bg-neon-green hover:text-black transition"
              >
                <Instagram size={20} />
              </a>
  
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 HilalVolleyClub. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;