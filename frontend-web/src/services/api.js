import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Intercepteur → ajoute automatiquement le token si besoin
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    config.headers.Authorization = `Bearer ${user.token || ""}`;
  }
  return config;
});

export default API;
