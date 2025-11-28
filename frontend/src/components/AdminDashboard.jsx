import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { listUsers, addUser, deleteUser, updateUserRole } from "../services/admin";
import { useTranslation } from "react-i18next";

export default function UserDashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Users state
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "",
    role: "user",
  });
  const [userMsg, setUserMsg] = useState("");
  const [search, setSearch] = useState("");

  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Confirm modals
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [selectedRoleUserId, setSelectedRoleUserId] = useState(null);
  const [targetRole, setTargetRole] = useState("");

  /** ------------------ Load Users ------------------ **/
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await listUsers();
      setUsers(data || []);
    } catch (err) {
      setUserMsg(t("failed_load_users"));
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /** ------------------ Auto-hide messages ------------------ **/
  useEffect(() => {
    if (userMsg) {
      const timer = setTimeout(() => setUserMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [userMsg]);

  /** ------------------ Add User ------------------ **/
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setUserMsg(t("fill_required_fields"));
      return;
    }
    try {
      await addUser(newUser);
      setUserMsg(t("user_added_success"));
      setNewUser({ name: "", email: "", password: "", phone: "", address: "", gender: "", role: "user" });
      loadUsers();
    } catch (err) {
      setUserMsg(err.response?.data?.message || t("error_adding_user"));
    }
  };

  /** ------------------ Delete User ------------------ **/
  const handleAskDelete = (id) => {
    setSelectedUserId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await deleteUser(selectedUserId);
      setUserMsg(t("user_deleted_success"));
      loadUsers();
    } catch (err) {
      setUserMsg(err.response?.data?.message || t("error_deleting_user"));
    } finally {
      setSelectedUserId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedUserId(null);
  };

  /** ------------------ Role Change ------------------ **/
  const handleAskRoleChange = (userId, currentRole) => {
    setSelectedRoleUserId(userId);
    setTargetRole(currentRole === "admin" ? "user" : "admin");
    setShowRoleConfirm(true);
  };

  const confirmRoleChange = async () => {
    try {
      await updateUserRole(selectedRoleUserId, targetRole);
      const updatedUsers = users.map(u =>
        u._id === selectedRoleUserId ? { ...u, role: targetRole } : u
      );
      setUsers(updatedUsers);
      setUserMsg(t("role_updated", { role: targetRole }));
    } catch (err) {
      setUserMsg(err.response?.data?.message || t("error_updating_role"));
    } finally {
      setShowRoleConfirm(false);
      setSelectedRoleUserId(null);
      setTargetRole("");
    }
  };

  /** ------------------ Filter Users ------------------ **/
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.toLowerCase().includes(search.toLowerCase()) ||
    u.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}>
      <div className="container-page" style={{ paddingTop: 40, display: "grid", gap: 24 }}>
        <h2 style={{ fontWeight: 800 }}>{t("user_dashboard")}</h2>

        {/* ------------------ Modals ------------------ */}
        {showDeleteConfirm && (
          <ConfirmModal
            message={t("confirm_delete_user")}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}

        {showRoleConfirm && (
          <ConfirmModal
            message={t("confirm_change_role", { role: targetRole })}
            onConfirm={confirmRoleChange}
            onCancel={() => setShowRoleConfirm(false)}
          />
        )}

        {/* ------------------ User Messages ------------------ */}
        {userMsg && <div className="message">{userMsg}</div>}

        {/* ------------------ Add User ------------------ */}
        <div className="card" style={{ padding: 20 }}>
          <h3>{t("add_new_user")}</h3>
          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            <input className="input" placeholder={t("name")} value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
            <input className="input" placeholder={t("email")} value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            <input className="input" type="password" placeholder={t("password")} value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
            <input className="input" placeholder={t("phone")} value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
            <input className="input" placeholder={t("address")} value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
            <select className="select" value={newUser.gender} onChange={e => setNewUser({ ...newUser, gender: e.target.value })}>
              <option value="">{t("select_gender")}</option>
              <option value="male">{t("male")}</option>
              <option value="female">{t("female")}</option>
            </select>
            <select className="select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">{t("user")}</option>
              <option value="admin">{t("admin")}</option>
            </select>
            <button className="btn btn-primary" onClick={handleAddUser}>{t("add_user")}</button>
          </div>

          {/* Search */}
          <input className="input" placeholder={t("search_users")} value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 12 }} />

          {/* Users Table */}
          <table className="table" style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}>
            <thead>
              <tr>
                <th>{t("name")}</th>
                <th>{t("email")}</th>
                <th>{t("phone")}</th>
                <th>{t("address")}</th>
                <th>{t("gender")}</th>
                <th>{t("role")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan="7" style={{ textAlign: "center" }}>{t("loading_users")}</td></tr>
              ) : filteredUsers.length > 0 ? filteredUsers.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.address || "-"}</td>
                  <td>{u.gender || "-"}</td>
                  <td>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      color: "#fff",
                      backgroundColor: u.role === "admin" ? "#b91c1c" : "#16a34a",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      fontSize: 12,
                    }}>{u.role}</span>
                  </td>
                  <td>
                    {u.email !== "admin@gmail.com" ? (
                      <>
                        <button className="btn btn-warning" onClick={() => handleAskRoleChange(u._id, u.role)} style={{ marginRight: 6 }}>{t("edit_role")}</button>
                        {u.role !== "admin" && <button className="btn btn-primary" onClick={() => handleAskDelete(u._id)}>{t("delete")}</button>}
                      </>
                    ) : (
                      <span style={{ color: "#888" }}>{t("protected_account")}</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" style={{ textAlign: "center" }}>{t("no_users_found")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
