import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(t("not_authenticated"));
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        // 1️⃣ Fetch current user from backend
        const resUser = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUser.ok) throw new Error("Failed to get user info");
        const currentUser = await resUser.json();
        const isAdmin = currentUser.role === "admin";

        // 2️⃣ Fetch orders based on role
        const ordersRes = await fetch(
          isAdmin ? "/api/orders" : "/api/orders/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!ordersRes.ok) throw new Error("Failed to get orders");
        const data = await ordersRes.json();

        setOrders(data || []);
      } catch (err) {
        setError(t("failed_load_orders"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [t]);

  return (
    <div
      className="container-page"
      style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}
    >
      <h2 style={{ color: "#b91c1c", marginBottom: 20 }}>{t("orders")}</h2>
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      {loading ? (
        <div>{t("loading_orders")}</div>
      ) : (
        <table className="table" style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}>
          <thead>
            <tr>
              <th>{t("order_id")}</th>
              <th>{t("user")}</th>
              <th>{t("items")}</th>
              <th>{t("total")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  {t("no_orders_found")}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || "Unknown"}</td>
                  <td>
                    {order.items.map((i) => (
                      <div key={i.name}>
                        {i.name} x{i.quantity} (${i.price})
                      </div>
                    ))}
                  </td>
                  <td>${order.totalPrice}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
