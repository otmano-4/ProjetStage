import Aside from "../Layouts/Aside";
import Header from "../Layouts/Header";

export default function Dashboard({pages}) {
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Aside pages={pages} />      

      <div className="flex flex-col flex-1 w-full min-h-screen ">
        <Header />
          
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        </main>
      </div>
    </div>
  );
}
