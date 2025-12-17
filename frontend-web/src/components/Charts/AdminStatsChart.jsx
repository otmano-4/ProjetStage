import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminStatsChart({ data, title, type = "classe" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value}
              {entry.name.includes('Moyenne') ? ' points' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  let chartData;
  let bars;

  if (type === "classe") {
    chartData = data.map(item => ({
      name: item.classeNom?.substring(0, 15) + (item.classeNom?.length > 15 ? '...' : '') || 'Classe',
      'Nombre d\'étudiants': Number(item.nombreEtudiants || 0),
      'Nombre d\'examens': Number(item.nombreExamens || 0),
      'Nombre de soumissions': Number(item.nombreSoumissions || 0),
      'Moyenne': Number(item.moyenne || 0)
    }));

    bars = [
      <Bar key="etudiants" dataKey="Nombre d'étudiants" fill="#3b82f6" radius={[8, 8, 0, 0]} />,
      <Bar key="examens" dataKey="Nombre d'examens" fill="#10b981" radius={[8, 8, 0, 0]} />,
      <Bar key="soumissions" dataKey="Nombre de soumissions" fill="#f59e0b" radius={[8, 8, 0, 0]} />
    ];
  } else if (type === "professeur") {
    chartData = data.map(item => ({
      name: item.professeurNom?.substring(0, 15) + (item.professeurNom?.length > 15 ? '...' : '') || 'Professeur',
      'Nombre d\'examens': Number(item.nombreExamens || 0),
      'Nombre de soumissions': Number(item.nombreSoumissions || 0)
    }));

    bars = [
      <Bar key="examens" dataKey="Nombre d'examens" fill="#3b82f6" radius={[8, 8, 0, 0]} />,
      <Bar key="soumissions" dataKey="Nombre de soumissions" fill="#10b981" radius={[8, 8, 0, 0]} />
    ];
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {type === "classe" 
            ? "Ce graphique montre les statistiques détaillées pour chaque classe : nombre d'étudiants, nombre d'examens créés, nombre de soumissions et moyenne obtenue."
            : "Ce graphique montre l'activité de chaque professeur : nombre d'examens créés et nombre de soumissions reçues."
          }
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80}
            label={{ value: type === "classe" ? 'Classes' : 'Professeurs', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: "Nombre", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {bars}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

