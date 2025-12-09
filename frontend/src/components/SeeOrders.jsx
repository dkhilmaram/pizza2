import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { getOrders } from "../services/orders";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function SeeOrders({ darkMode }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Toggle dark class on body
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Load orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getOrders("/");
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setMessage(t("failed_load_orders"));
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Auto-hide messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Delete functions
  const handleAskDelete = (id) => {
    setSelectedOrderId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/${selectedOrderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(t("order_deleted_success"));
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || t("error_deleting_order"));
    } finally {
      setSelectedOrderId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedOrderId(null);
  };

  // Dashboard numbers
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.user?._id)).size;
  const totalIncome = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  // Update status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(t("status_updated_success"));
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || t("error_updating_status"));
    }
  };

  // Badge color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#FFA500";
      case "preparing": return "#1E90FF";
      case "delivering": return "#FF69B4";
      case "completed": return "#32CD32";
      case "canceled": return "#FF0000";
      default: return "#000000";
    }
  };

  return (
    <div
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ fontWeight: 800, marginBottom: 20, color: "var(--text)" }}>
        {t("order dashboard")}
      </h2>

      {/* ==== DASHBOARD CARDS ==== */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: t("total_orders"), value: totalOrders },
          { label: t("total_customers"), value: totalCustomers },
          { label: t("total_income"), value: `$${totalIncome.toFixed(2)}` },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              flex: "1",
              minWidth: "200px",
              background: "var(--card)",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>{card.label}</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", marginTop: "10px", color: "var(--text)" }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Delete modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          message={t("confirm_delete_order")}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Messages */}
      {message && <div className="msg">{message}</div>}

      {/* Orders table */}
      <div style={{ width: "100%", height: "calc(100vh - 150px)", overflow: "auto" }}>
        <table className="table" style={{ width: "100%", tableLayout: "auto", minWidth: "1000px" }}>
          <thead>
            <tr>
              {["order_id", "user", "items", "total_price", "status", "actions"].map((key) => (
                <th key={key}>{t(key)}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loadingOrders ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>{t("loading_orders")}</td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(0, 8)}</td>
                  <td>{order.user?.name} ({order.user?.email})</td>
                  <td>
                    {order.items.map((item) => (
                      <div key={item._id}>
                        {item.name} x{item.quantity} (${item.price})
                      </div>
                    ))}
                  </td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: getStatusColor(order.status),
                          display: "inline-block",
                        }}
                      ></span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="select"
                        style={{ color: getStatusColor(order.status), fontWeight: "bold" }}
                      >
                        {["pending","preparing","delivering","completed","canceled"].map((s) => (
                          <option key={s} value={s}>{t(s)}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleAskDelete(order._id)}>
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>{t("no_orders_found")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
