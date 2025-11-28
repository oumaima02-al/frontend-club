import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

const RadarChartComponent = ({ data, title }) => {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="subject" stroke="#999" />
          <PolarRadiusAxis stroke="#999" />
          <Radar name="Performance" dataKey="value" stroke="#00FF00" fill="#00FF00" fillOpacity={0.5} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;