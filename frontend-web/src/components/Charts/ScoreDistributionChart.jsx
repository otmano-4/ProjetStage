import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ScoreDistributionChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: Number(value)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`${payload[0].payload.name}`}</p>
          <p className="text-blue-600">{`${payload[0].value} étudiant(s)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📊 Distribution des notes des étudiants
        </h3>
        <p className="text-sm text-gray-600">
          Ce graphique montre combien d'étudiants ont obtenu des notes dans chaque tranche de pourcentage (0-10%, 10-20%, etc.).
          Cela vous permet de voir la répartition des performances de vos étudiants.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            label={{ value: 'Tranches de notes (%)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: "Nombre d'étudiants", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#3b82f6" name="Nombre d'étudiants" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

