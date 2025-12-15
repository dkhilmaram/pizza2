import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function DashboardT({ darkMode }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  /* ================= THEME ================= */
=======
  // Dark mode
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

<<<<<<< HEAD
  /* ================= DATA LOAD ================= */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
=======
  // Load data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users", { headers }),
        axios.get("http://localhost:5000/api/orders", { headers }),
      ]);

<<<<<<< HEAD
      setUsers(usersRes.data ?? []);
      setOrders(ordersRes.data ?? []);
    } catch (err) {
      console.error("Dashboard load error:", err);
=======
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Dashboard load error:", error);
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
    } finally {
      setLoading(false);
    }
  };

  /* ================= KPIs ================= */
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

<<<<<<< HEAD
  const countByStatus = status =>
=======
  const statusCount = (status) =>
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
    orders.filter(o => o.status === status).length;

  const kpiCards = [
    { label: t("total_users"), value: totalUsers },
    { label: t("total_admins"), value: totalAdmins },
    { label: t("total_orders"), value: totalOrders },
    { label: t("total_revenue"), value: `$${totalRevenue.toFixed(2)}` },
  ];

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        {t("loading")}...
      </div>
    );
  }

  return (
    <div
      style={{
        direction: isRTL ? "rtl" : "ltr",
        padding: 20,
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <h2 style={{ fontWeight: 800, marginBottom: 25 }}>
        {t("admin_dashboard")}
      </h2>

      {/* ================= KPI CARDS ================= */}
<<<<<<< HEAD
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 35 }}>
        {kpiCards.map(({ label, value }) => (
          <div
            key={label}
=======
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 35,
        }}
      >
        {kpiCards.map((card, index) => (
          <div
            key={index}
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
            style={{
              flex: 1,
              minWidth: 220,
              background: "var(--card)",
              padding: 22,
              borderRadius: 14,
              boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
              textAlign: "center",
            }}
          >
<<<<<<< HEAD
            <h3 style={{ margin: 0, fontWeight: 700 }}>{label}</h3>
            <p style={{ fontSize: 28, fontWeight: "bold", marginTop: 12 }}>
              {value}
=======
            <h3 style={{ margin: 0, fontWeight: 700 }}>
              {card.label}
            </h3>
            <p
              style={{
                fontSize: 28,
                fontWeight: "bold",
                marginTop: 12,
              }}
            >
              {card.value}
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
            </p>
          </div>
        ))}
      </div>

      {/* ================= ORDERS BY STATUS ================= */}
<<<<<<< HEAD
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 35 }}>
        {["pending", "preparing", "delivering", "completed", "canceled"].map(
          status => (
=======
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 35,
        }}
      >
        {["pending", "preparing", "delivering", "completed", "canceled"].map(
          (status) => (
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
            <div
              key={status}
              style={{
                flex: 1,
                minWidth: 180,
                background: "var(--card)",
                padding: 18,
                borderRadius: 12,
                textAlign: "center",
              }}
            >
<<<<<<< HEAD
              <h4>{t(status)}</h4>
              <strong style={{ fontSize: 22 }}>
                {countByStatus(status)}
=======
              <h4 style={{ marginBottom: 10 }}>
                {t(status)}
              </h4>
              <strong style={{ fontSize: 22 }}>
                {statusCount(status)}
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
              </strong>
            </div>
          )
        )}
      </div>

      {/* ================= LAST ORDERS ================= */}
      <div className="card" style={{ padding: 22 }}>
<<<<<<< HEAD
        <h3 style={{ marginBottom: 15 }}>{t("last_orders")}</h3>
=======
        <h3 style={{ marginBottom: 15 }}>
          {t("last_orders")}
        </h3>
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2

        <table className="table">
          <thead>
            <tr>
<<<<<<< HEAD
              <th>{t("ID")}</th>
=======
              <th>ID</th>
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
              <th>{t("user")}</th>
              <th>{t("total_price")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(order => (
              <tr key={order._id}>
                <td>{order._id.slice(0, 6)}</td>
                <td>{order.user?.name || "-"}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{t(order.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 40d2bfd4fe1e30953639b23b858c10ea46fb30b2
