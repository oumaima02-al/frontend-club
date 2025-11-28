import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'neon-green', trend }) => {
  return (
    <div className="card hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '+' : ''}{trend}% vs mois dernier
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}/10 rounded-lg flex items-center justify-center`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;