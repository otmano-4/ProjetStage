export default function HeaderEtudiant({ utilisateur }) {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          👋 Bienvenue <span className="text-blue-600">{utilisateur.nom}</span>
        </h1>
        <p className="text-sm text-gray-500">
          Connecté en tant que <strong>{utilisateur.role}</strong>
        </p>
      </div>

      <img
        src="https://i.pravatar.cc/40"
        alt="avatar"
        className="rounded-full w-10 h-10 border-2 border-blue-200"
      />
    </header>
  );
}
