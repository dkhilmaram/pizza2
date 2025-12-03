import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(t("not_authenticated"));
        setLoading(false);
        return;
      }

      try {
        // Get current user info
        const resUser = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUser.ok) throw new Error("Failed to get user info");
        const currentUser = await resUser.json();

        const isAdmin = currentUser.role === "admin";

        // Fetch orders depending on role
        const resOrders = await fetch(
          isAdmin ? "/api/orders" : "/api/orders/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!resOrders.ok) throw new Error("Failed to load orders");
        const data = await resOrders.json();

        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(t("failed_load_orders"));
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

      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div>{t("loading_orders")}</div>
      ) : (
        <table className="table">
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
                <td colSpan="5" style={{ textAlign: "center" }}>
                  {t("no_orders_found")}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || "—"}</td>
                  <td>
                    {order.items.map((i) => (
                      <div key={i.name}>
                        {i.name} × {i.quantity} (${i.price})
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
