import { useEffect, useState } from "react";
import { listUsers, addUser, deleteUser } from "../services/auth";
import { getOrders } from "../services/orders";
import ConfirmModal from "./ConfirmModal";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const [userMsg, setUserMsg] = useState("");
  const [orders, setOrders] = useState([]);
  const [orderMsg, setOrderMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState("");

  // Role change confirmation
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [selectedRoleUserId, setSelectedRoleUserId] = useState(null);
  const [targetRole, setTargetRole] = useState("");

  // Load users from backend
  const loadUsers = async () => {
    try {
      const { data } = await listUsers();
      setUsers(data);
    } catch {
      setUserMsg("Failed to load users.");
    }
  };

  // Load orders from backend
  const loadOrders = async () => {
    try {
      const { data } = await getOrders();
      setOrders(data);
    } catch {
      setOrderMsg("Failed to load orders.");
    }
  };

  useEffect(() => {
    loadUsers();
    loadOrders();
  }, []);

  // Auto-hide messages
  useEffect(() => {
    if (userMsg) {
      const timer = setTimeout(() => setUserMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [userMsg]);

  useEffect(() => {
    if (orderMsg) {
      const timer = setTimeout(() => setOrderMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [orderMsg]);

  // Add new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setUserMsg("Please fill all fields.");
      return;
    }
    try {
      await addUser(newUser);
      setUserMsg("User added successfully!");
      setNewUser({ name: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch (err) {
      setUserMsg(err.response?.data?.message || "Error adding user.");
    }
  };

  // Delete user
  const handleAskDelete = (id) => {
    setSelectedUserId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await deleteUser(selectedUserId);
      setUserMsg("User deleted successfully!");
      loadUsers();
    } catch (err) {
      setUserMsg(err.response?.data?.message || "Error deleting user.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedUserId(null);
  };

  // Role change
  const handleAskRoleChange = (userId, currentRole) => {
    setSelectedRoleUserId(userId);
    setTargetRole(currentRole === "admin" ? "user" : "admin");
    setShowRoleConfirm(true);
  };

  const confirmRoleChange = async () => {
    try {
      const userId = selectedRoleUserId;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ role: targetRole })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");

      // Update local state
      const updatedUsers = users.map(u =>
        u._id === userId ? { ...u, role: targetRole } : u
      );
      setUsers(updatedUsers);
      setUserMsg(data.message);
    } catch (err) {
      setUserMsg(err.message);
    } finally {
      setShowRoleConfirm(false);
      setSelectedRoleUserId(null);
      setTargetRole("");
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-page" style={{ paddingTop: 40, display: "grid", gap: 24 }}>
      <h2 style={{ fontWeight: 800 }}>Admin Dashboard</h2>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this user?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Role-change confirmation modal */}
      {showRoleConfirm && (
        <ConfirmModal
          message={`Are you sure you want to change this user to ${targetRole}?`}
          onConfirm={confirmRoleChange}
          onCancel={() => setShowRoleConfirm(false)}
        />
      )}

      {/* User message */}
      {userMsg && (
        <div className="message">{userMsg}</div>
      )}

      {/* Add user section */}
      <div className="card" style={{ padding: 20 }}>
        <h3>Add New User</h3>
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          <input className="input" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
          <input className="input" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
          <select className="select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-primary" onClick={handleAddUser}>Add User</button>
        </div>

        {/* Search bar */}
        <input className="input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 12 }} />

        {/* Users table */}
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
            {filteredUsers.length > 0 ? filteredUsers.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.email !== "maramkhalil@gmail.com" ? (
                    <>
                      <button className="btn btn-warning" onClick={() => handleAskRoleChange(u._id, u.role)} style={{ marginRight: 6 }}>
                        Edit Role
                      </button>
                      {u.role !== "admin" && (
                        <button className="btn btn-primary" onClick={() => handleAskDelete(u._id)}>
                          Delete
                        </button>
                      )}
                    </>
                  ) : (
                    <span style={{ color: "#888" }}>Protected Account</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: "12px", textAlign: "center" }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Orders section */}
      <div className="card" style={{ padding: 20 }}>
        <h3>Orders</h3>
        {orderMsg && <div className="message">{orderMsg}</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.user?.name}</td>
                <td>{o.items?.map(i => i.name).join(", ")}</td>
                <td>{o.total} DT</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: "12px", textAlign: "center" }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
