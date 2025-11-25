import { useState } from "react";
import axios from "axios";
import Aside from "../Layouts/Aside";
import Header from "../Layouts/Header";
import { useSelector } from "react-redux";

function Profile({pages}) {
    const user = useSelector((state) => state.auth.user);
  
    const [newPassword, setNewPaswword] = useState("");

    const ChangePassword = async (e) => {
            e.preventDefault()

            console.log("change pass");

            const res = await axios.put(`http://localhost:8080/api/users/update-password`, {
                id: user?.id,
                newpassword: newPassword
            });

            const user = res.data;
            console.log("✅ user updated :", user);
    }



  return (
    <div className="flex min-h-screen bg-gray-100/60">
        <Aside pages={pages} />      


      <div className="flex flex-col flex-1 w-full">
        <Header />

        <main className="flex-1  mx-auto px-4 sm:px-6 lg:px-14 py-8 w-full">
            <h1 className="text-2xl font-bold mx-10 mb-10"> Change your password </h1>
            <form onSubmit={ChangePassword} className="max-w-sm mx-10">
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                    <input type="email" id="email" disabled value={user?.email} className="bg-gray-50 text-gray-400 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="name@flowbite.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="nom" className="block mb-2 text-sm font-medium text-gray-900 ">Your Full name</label>
                    <input type="text" id="nom" disabled value={user?.nom} className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="name@flowbite.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Your New password</label>
                    <input onChange={(e)=> setNewPaswword(e.target.value)} type="password"  id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required />
                </div>
                <button type="submit" className={`${user?.role == "ADMIN" && "bg-yellow-700 hover:bg-yellow-800    dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 focus:ring-yellow-300 " || user?.role == "PROFESSEUR" && "bg-blue-700 hover:bg-blue-800     dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 focus:ring-blue-300 " || user?.role == "ETUDIANT" && "bg-green-700 hover:bg-green-800    dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 focus:ring-green-300 "}    text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center `}>Submit</button>
            </form>
        </main>
        </div>
    </div>

  )
}

export default Profile