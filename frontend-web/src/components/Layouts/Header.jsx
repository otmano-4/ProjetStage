import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Header() {
    const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));
    const [isOpen, setIsOpen] = useState(false);

    const Logout = () => {
        localStorage.removeItem("utilisateur")
        window.location.reload();
    }

  return (
    <div className="sticky top-0 w-full left-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    👋 Bienvenue <span className="text-blue-600">{utilisateur.nom}</span>
                    </h1>
                    <p className="text-sm text-gray-500">
                        Connecté en tant que <strong>{utilisateur.role}</strong>
                    </p>
                </div>

                <button onClick={()=> setIsOpen(!isOpen)}>
                <img
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="rounded-full w-10 h-10 border-2 border-blue-200"
                />
                </button>
            </header>


            

            {isOpen &&
            <div className="bg-white shadow-2xl px-2 py-6 border border-gray-300 w-60  absolute right-8 rounded-lg">
                <h2 className="text-center text-xs opacity-50 font-semibold"> {utilisateur?.email} </h2>
                <img
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="rounded-full w-32 h-32 mx-auto mt-6 border-2 border-blue-200"
                />
                <button className="bg-gray-300 text-gray-700  w-full mt-6 py-2 rounded-md  font-semibold hover:bg-gray-200 cursor-pointer transition-all"> <Link to="/profile"> Profile </Link> </button>
                <button onClick={()=> Logout()} className="bg-blue-600 w-full mt-2 py-2 rounded-md text-white font-semibold hover:bg-blue-500 cursor-pointer transition-all"> Log out </button>
            </div>
            }
        </div>
    </div>

  )
}

export default Header