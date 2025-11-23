import { useEffect, useState } from "react";
import { getOrders } from "../services/orders";

export default function SeeOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await getOrders();
    setOrders(res.data || []);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard - Orders</h1>

      <h2>All Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Items</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.user}</td>
              <td>{o.items.join(", ")}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
