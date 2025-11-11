import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/auth" });

// Auth routes
export const register = (data) => API.post("/register", data);
export const login = (data) => API.post("/login", data);
export const getMe = () =>
  API.get("/me", {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const updateMe = (data) =>
  API.put("/me", data, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

// Admin routes — fix the path here to match backend
export const listUsers = () =>
  API.get("/users", { // <-- was "/admin/users"
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

export const addUser = (data) =>
  API.post("/users", data, { // <-- was "/admin/users"
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

export const deleteUser = (id) =>
  API.delete(`/users/${id}`, { // <-- was "/admin/users/:id"
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
