import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Aside({pages}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside
        className={`fixed md:static z-30  w-64 bg-white shadow-lg transform transition-transform duration-300 h-screen ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="font-bold text-3xl text-blue-600 mb-6 text-center pt-5">🎓 E-Exam</div>
        
        {pages?.map((item,key)=> (
            <Link
                to={item.link}
                key={key}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
            >
                {item.title}
            </Link>
        ))}
    </aside>

  )
}

export default Aside