import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';

function Aside({pages}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside
        className={`fixed md:static z-30  w-64 bg-white shadow-lg transform transition-transform duration-300 h-screen ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="font-bold text-3xl text-blue-600 mb-6 text-center pt-5">🎓 E-Exam</div>
        {pages?.map((item, key) => (
          <NavLink
            to={item.link}
            key={key}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-blue-50'
              }`
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
    </aside>

  )
}

export default Aside