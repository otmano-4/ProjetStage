import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceChart({ data, title = "Performance par examen" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.examenTitre?.substring(0, 20) + (item.examenTitre?.length > 20 ? '...' : '') || 'Examen',
    score: Number(item.score || item.moyenne || 0),
    pourcentage: Number(item.pourcentage || 0),
    totalPoints: Number(item.totalPoints || 0)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value?.toFixed(1)}
              {entry.name.includes('Pourcentage') ? '%' : ' points'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const isStudent = title.includes('Mes résultats');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isStudent ? '📈 Mes résultats par examen' : '📈 Performance moyenne par examen'}
        </h3>
        <p className="text-sm text-gray-600">
          {isStudent 
            ? "Ce graphique montre votre progression à travers les différents examens. La ligne bleue représente votre score en points, et la ligne verte votre pourcentage de réussite."
            : "Ce graphique montre la performance moyenne de vos étudiants pour chaque examen. La ligne bleue représente le score moyen en points, et la ligne verte le pourcentage moyen de réussite."
          }
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80}
            label={{ value: 'Examens', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: isStudent ? 'Votre score / %' : 'Score moyen / %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            name={isStudent ? "Votre score (points)" : "Score moyen (points)"}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="pourcentage" 
            stroke="#10b981" 
            name="Pourcentage (%)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

