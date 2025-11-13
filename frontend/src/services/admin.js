import api from "./api"; // your axios instance

// Get all users
export const listUsers = () => api.get("/admin/users");

// Add new user
export const addUser = (data) => api.post("/admin/users", data);

// Delete user
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Update user role
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role });
