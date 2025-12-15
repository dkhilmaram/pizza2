import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function DashboardT({ darkMode }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= THEME ================= */
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ================= DATA LOAD ================= */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users", { headers }),
        axios.get("http://localhost:5000/api/orders", { headers }),
      ]);

      setUsers(usersRes.data ?? []);
      setOrders(ordersRes.data ?? []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= KPIs ================= */
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const countByStatus = status =>
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
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 35 }}>
        {kpiCards.map(({ label, value }) => (
          <div
            key={label}
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
            <h3 style={{ margin: 0, fontWeight: 700 }}>{label}</h3>
            <p style={{ fontSize: 28, fontWeight: "bold", marginTop: 12 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ================= ORDERS BY STATUS ================= */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 35 }}>
        {["pending", "preparing", "delivering", "completed", "canceled"].map(
          status => (
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
              <h4>{t(status)}</h4>
              <strong style={{ fontSize: 22 }}>
                {countByStatus(status)}
              </strong>
            </div>
          )
        )}
      </div>

      {/* ================= LAST ORDERS ================= */}
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ marginBottom: 15 }}>{t("last_orders")}</h3>

        <table className="table">
          <thead>
            <tr>
              <th>{t("ID")}</th>
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
}
