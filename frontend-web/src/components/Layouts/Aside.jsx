import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function Aside({pages}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);


  return (
    <aside
        className={`  z-30  w-64 bg-white shadow-lg transform transition-transform duration-300 sticky left-0 top-0 h-screen 
          ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className={`${user?.role == "ADMIN" && "text-yellow-400"}  font-bold text-3xl  mb-6 text-center pt-5`}>🎓 E-Exam</div>
        <div className='space-y-2'>
          {pages?.map((item, key) => (
            <NavLink
            to={item.link}
            key={key}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                ? `${user?.role == "ADMIN" && "text-yellow-500 bg-yellow-50" || user?.role == "PROFESSEUR" && "text-blue-500 bg-blue-50" || user?.role == "ETUDIANT" && "text-green-500 bg-green-50"}`
                : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
    </aside>

  )
}

export default Aside