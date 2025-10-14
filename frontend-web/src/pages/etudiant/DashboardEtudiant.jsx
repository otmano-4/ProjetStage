import EtudiantLayout from "../../components/Layouts/EtudiantLayout";
import { Book, Calendar, Award, MessageCircle } from "lucide-react";

export default function DashboardEtudiant() {
  return (
    <EtudiantLayout>
      {/* Bannière */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Bienvenue sur votre espace étudiant 🎓</h2>
          <p className="mt-2 text-blue-100">
            Vous avez terminé 60% de vos objectifs cette semaine. Continuez comme ça !
          </p>
        </div>
        <img
          src="https://illustrations.popsy.co/violet/student.svg"
          alt="illustration"
          className="w-28 md:w-44"
        />
      </div>

      {/* Cartes de stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {[ 
          { icon: <Book className="text-blue-600" />, title: "Examens à venir", value: "3" },
          { icon: <Award className="text-green-500" />, title: "Moyenne Générale", value: "15.4 / 20" },
          { icon: <Calendar className="text-orange-500" />, title: "Prochain Examen", value: "Maths – 20 Oct 2025" },
          { icon: <MessageCircle className="text-purple-600" />, title: "Messages non lus", value: "4" },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow text-center hover:shadow-md transition">
            <div className="flex justify-center">{card.icon}</div>
            <h3 className="font-semibold mt-2 text-gray-700">{card.title}</h3>
            <p className="text-lg font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tableau d’examens */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <Calendar className="text-blue-500" /> Planning des examens
        </h3>
        <table className="w-full min-w-[500px] text-left border-t border-gray-100">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="py-2">Matière</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Salle</th>
            </tr>
          </thead>
          <tbody>
            {[
              { matiere: "Mathématiques", date: "20 Octobre", heure: "08:30", salle: "Lab 1" },
              { matiere: "Physique", date: "22 Octobre", heure: "10:00", salle: "Salle 4" },
              { matiere: "Biologie", date: "25 Octobre", heure: "09:00", salle: "Lab 2" },
            ].map((exam, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="py-2 font-medium">{exam.matiere}</td>
                <td>{exam.date}</td>
                <td>{exam.heure}</td>
                <td>{exam.salle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EtudiantLayout>
  );
}
