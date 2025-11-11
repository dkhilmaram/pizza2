import { useEffect, useState } from "react";
import { listUsers, addUser, deleteUser } from "../services/auth";
import { getOrders } from "../services/orders";
import ConfirmModal from "./ConfirmModal";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "acteur" });
  const [userMsg, setUserMsg] = useState("");
  const [orders, setOrders] = useState([]);
  const [orderMsg, setOrderMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const loadUsers = async () => {
    try {
      const { data } = await listUsers();
      setUsers(data);
    } catch {
      setUserMsg("Échec du chargement des utilisateurs.");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setUserMsg("Veuillez remplir tous les champs.");
      return;
    }
    try {
      await addUser(newUser);
      setUserMsg("Utilisateur ajouté avec succès !");
      setNewUser({ name: "", email: "", password: "", role: "acteur" });
      loadUsers();
    } catch (err) {
      setUserMsg(err.response?.data?.message || "Erreur lors de l’ajout de l’utilisateur.");
    }
  };

  const handleAskDelete = (id) => {
    setSelectedUserId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteUser(selectedUserId);
      setUserMsg("Utilisateur supprimé avec succès !");
      loadUsers();
    } catch (err) {
      setUserMsg(err.response?.data?.message || "Erreur lors de la suppression de l’utilisateur.");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedUserId(null);
  };

  const loadOrders = async () => {
    try {
      const { data } = await getOrders();
      setOrders(data);
    } catch {
      setOrderMsg("Échec du chargement des commandes.");
    }
  };

  useEffect(() => {
    loadUsers();
    loadOrders();
  }, []);

  return (
    <div className="container-page" style={{ paddingTop: 40, display: "grid", gap: 24 }}>
      <h2 style={{ fontWeight: 800 }}>Tableau de bord administrateur</h2>

      {showConfirm && (
        <ConfirmModal
          message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className="card" style={{ padding: 20, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3>Ajouter un nouvel utilisateur</h3>
        {userMsg && (
          <div style={{ padding: "10px 12px", borderRadius: 12, marginBottom: 10 }}>
            {userMsg}
          </div>
        )}
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          <input className="input" placeholder="Nom" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
          <input className="input" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          <input className="input" type="password" placeholder="Mot de passe" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
          <select className="select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="acteur">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
          <button className="btn btn-primary" onClick={handleAddUser}>
            Ajouter
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge">{u.role}</span>
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleAskDelete(u._id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: "12px", textAlign: "center" }}>Aucun utilisateur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: 20, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3>Commandes</h3>
        {orderMsg && (
          <div style={{ padding: "10px 12px", borderRadius: 12, marginBottom: 10 }}>
            {orderMsg}
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Utilisateur</th>
              <th>Articles</th>
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
                <td colSpan="5" style={{ padding: "12px", textAlign: "center" }}>Aucune commande trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
