import React from "react";
import Aside from "../Layouts/Aside";
import Header from "../Layouts/Header";
import { BookOpen, Users, ClipboardList, Calendar } from "lucide-react";

export default function Dashboard({ pages }) {
  const stats = [
    {
      title: "Total Exams",
      value: 12,
      icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Students",
      value: 230,
      icon: <Users className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Courses",
      value: 8,
      icon: <BookOpen className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Upcoming Exams",
      value: 3,
      icon: <Calendar className="w-6 h-6 text-orange-600" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Aside pages={pages} />

      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Dashboard Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Professor Dashboard
          </h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="p-3 bg-gray-100 rounded-full">{item.icon}</div>
                <div>
                  <p className="text-gray-500 text-sm">{item.title}</p>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.value}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
