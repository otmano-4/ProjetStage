import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // <-- assure-toi que Tailwind est bien importé ici

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
