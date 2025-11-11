import { useEffect, useState } from "react";
import { listUsers, addUser, deleteUser } from "../services/auth";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "acteur" });
  const [msg, setMsg] = useState("");

  // Load all users
  const loadUsers = async () => {
    try {
      const { data } = await listUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Add new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setMsg("⚠️ Please fill all fields.");
      return;
    }
    try {
      await addUser(newUser);
      setMsg("✅ User added successfully!");
      setNewUser({ name: "", email: "", password: "", role: "acteur" });
      loadUsers();
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error adding user");
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setMsg("🗑️ User deleted successfully!");
      loadUsers();
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error deleting user");
    }
  };
return (
  <div className="container-page" style={{ paddingTop: 40, display: "grid", gap: 18 }}>
    <h2 style={{ fontWeight: 800, color: "#dc2626" }}>Dashboard – Users</h2>

    {msg && (
      <div
        style={{
          background: "#fee2e2",  // light red background for visibility
          color: "#991b1b",       // dark red text
          padding: "10px 12px",
          borderRadius: 12,
        }}
      >
        {msg}
      </div>
    )}

      {/* Add User */}
      <div className="card" style={{ padding: 20 }}>
        <h3>Add New User</h3>
        <div style={{ display: "grid", gap: 10 }}>
          <input
            className="input"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            className="select"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="acteur">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-primary" onClick={handleAddUser}>
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span
                    style={{
                      background: "#f3f4f6",
                      padding: "6px 10px",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDeleteUser(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
