import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';

export default function ClasseStatsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.classeNom || 'Classe',
    soumissions: Number(item.nombreSoumissions || 0),
    moyenne: Number(item.moyenne || 0)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name === 'soumissions' ? 'Nombre de soumissions' : 'Moyenne'}: {entry.value}
              {entry.name === 'moyenne' ? ' points' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📚 Statistiques par classe
        </h3>
        <p className="text-sm text-gray-600">
          Ce graphique montre le nombre de soumissions et la moyenne obtenue pour chaque classe.
          Les barres bleues représentent le nombre de soumissions, et la ligne verte montre la moyenne de chaque classe.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80}
            label={{ value: 'Classes', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: "Nombre de soumissions", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            label={{ value: "Moyenne (points)", angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="soumissions" 
            fill="#3b82f6" 
            name="Nombre de soumissions"
            radius={[8, 8, 0, 0]}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="moyenne" 
            stroke="#10b981" 
            strokeWidth={3}
            name="Moyenne (points)"
            dot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

