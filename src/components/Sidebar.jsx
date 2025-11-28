import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  Bell,
  User,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin', 'coach', 'player'],
    },
    {
      title: 'Joueurs',
      icon: Users,
      path: '/players',
      roles: ['admin'],
    },
    {
      title: 'Entraînements',
      icon: Calendar,
      path: '/trainings',
      roles: ['admin', 'coach'],
    },
    {
      title: 'Matchs',
      icon: Trophy,
      path: '/matches',
      roles: ['admin', 'coach', 'player'],
    },
    {
      title: 'Notifications',
      icon: Bell,
      path: '/notifications',
      roles: ['admin', 'coach', 'player'],
    },
    {
      title: 'Profil',
      icon: User,
      path: '/profile',
      roles: ['admin', 'coach', 'player'],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-dark-800 border-r border-dark-700 p-4 overflow-y-auto">
      <nav className="space-y-2">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-neon-green text-black font-semibold'
                  : 'text-gray-300 hover:bg-dark-700 hover:text-neon-green'
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;