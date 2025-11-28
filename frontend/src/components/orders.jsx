import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOrders } from "../services/orders";

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = isAdmin
          ? await getOrders()          // Admin sees all orders
          : await getOrders("/me");    // User sees own orders
        setOrders(data || []);
      } catch (err) {
        setError(t("failed_load_orders"));
        console.error(err);
      }
    };
    loadOrders();
  }, [isAdmin, t]);

  return (
    <div className="container-page" style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}>
      <h2 style={{ color: "#b91c1c", marginBottom: 20 }}>{t("orders")}</h2>
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <table className="table" style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}>
        <thead>
          <tr>
            <th>{t("order_id")}</th>
            <th>{t("user")}</th>
            <th>{t("items")}</th>
            <th>{t("total")}</th>
            <th>{t("status")}</th>
            {isAdmin && <th>{t("actions")}</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center" }}>
                {t("no_orders_found")}
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{isAdmin ? order.user?.name || "-" : "Me"}</td>
                <td>
                  {order.items.map((i) => (
                    <div key={i.name}>
                      {i.name} x{i.quantity} (${i.price})
                    </div>
                  ))}
                </td>
                <td>${order.totalPrice}</td>
                <td>{order.status}</td>
                {isAdmin && (
                  <td>
                    <button style={{ marginRight: 6 }}>{t("update")}</button>
                    <button>{t("delete")}</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
