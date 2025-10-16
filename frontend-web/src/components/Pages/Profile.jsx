import { useState } from "react";
import axios from "axios";
import Aside from "../Layouts/Aside";
import Header from "../Layouts/Header";

function Profile({pages}) {
    const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));
  
  const [newPassword, setNewPaswword] = useState("");

  const ChangePassword = async (e) => {
        e.preventDefault()

        console.log("change pass");

        // console.log({utilisateur?.id,  });
        // update-password

        const res = await axios.put(`http://localhost:8080/api/utilisateurs/update-password`, {
            id: utilisateur?.id,
            newpassword: newPassword
        });

        const user = res.data;
        console.log("✅ Utilisateur updated :", user);
  }



  return (
    <div className="flex min-h-screen bg-gray-100">
        <Aside pages={pages} />      


      <div className="flex flex-col flex-1 w-full min-h-screen ">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <h1 className="text-2xl font-bold mx-10 mb-10"> Change your password </h1>
            <form onSubmit={ChangePassword} className="max-w-sm mx-10">
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                    <input type="email" id="email" disabled value={utilisateur?.email} className="bg-gray-50 text-gray-400 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="name@flowbite.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="nom" className="block mb-2 text-sm font-medium text-gray-900 ">Your Full name</label>
                    <input type="text" id="nom" disabled value={utilisateur?.nom} className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="name@flowbite.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Your New password</label>
                    <input onChange={(e)=> setNewPaswword(e.target.value)} type="password"  id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </main>
        </div>
    </div>

  )
}

export default Profile