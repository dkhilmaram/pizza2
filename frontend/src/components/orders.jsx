import React, { useEffect, useState } from "react";
import { getOrders } from "../services/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = isAdmin
          ? await getOrders()  // Admin sees all orders
          : await getOrders("/me"); // User sees own orders
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders.");
        console.error(err);
      }
    };
    loadOrders();
  }, [isAdmin]);

  return (
    <div className="container-page">
      <h2 style={{ color: "#b91c1c", marginBottom: 20 }}>Orders</h2>
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name || "Me"}</td>
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
                  {/* You can add buttons to update/delete */}
                  <button style={{ marginRight: 6 }}>Update</button>
                  <button>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
