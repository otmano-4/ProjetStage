import { useEffect, useState } from "react";
import axios from "axios";

export default function Examens() {
  const [examens, setExamens] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/examens/classe/1")
      .then(res => {
        console.log("✅ Examens reçus :", res.data);
        setExamens(res.data);
      })
      .catch(err => {
        console.error("❌ Erreur :", err);
        setError("Impossible de charger les examens");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📘 Examens de la classe</h1>

      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {examens.map(e => (
          <li key={e.id} className="border p-3 rounded mb-2">
            <h2 className="text-lg font-semibold">{e.titre}</h2>
            <p>{e.description}</p>
            <p>⏱ Durée : {e.duree} min</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
