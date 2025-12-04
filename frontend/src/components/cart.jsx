import React, { useState, useEffect } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);

  // Fetch promotions from backend
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/promotions");
        const data = await res.json();
        setPromotions(Array.isArray(data) ? data : data.promotions || []);
      } catch (err) {
        console.error("Failed to fetch promotions:", err);
        setPromotions([]);
      }
    };
    fetchPromos();
  }, []);

  // Load cart and active coupon from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const activeCode = localStorage.getItem("activeCoupon");
    if (activeCode && promotions.length) {
      const promo = promotions.find((p) => p.code.toUpperCase() === activeCode.toUpperCase());
      if (promo) {
        setCouponCode(activeCode);
        setDiscount(promo.discount ?? 0);
        setMessage(`Coupon applied: ${((promo.discount ?? 0) * 100).toFixed(0)}% off`);
      }
    }
  }, [promotions]);

  // Update item quantity
  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Remove item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Apply coupon
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const promo = promotions.find((p) => p.code.toUpperCase() === code);
    if (promo) {
      setDiscount(promo.discount ?? 0);
      setMessage(`Coupon applied: ${((promo.discount ?? 0) * 100).toFixed(0)}% off`);
      localStorage.setItem("activeCoupon", promo.code);
    } else {
      setDiscount(0);
      setMessage("Invalid coupon");
      localStorage.removeItem("activeCoupon");
    }
  };

  // Calculate totals
  const totalPrice = cart.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity,
    0
  );
  const discountedTotal = cart.reduce(
    (acc, item) => acc + ((parseFloat(item.price) || 0) * (1 - (item.discount ?? discount))) * item.quantity,
    0
  );

  // Checkout
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to place an order.");
    if (cart.length === 0) return alert("Your cart is empty!");

    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const orderData = {
      items: cart.map((item) => ({
        name: item.name || "Unknown",
        description: item.description || "",
        price: parseFloat(item.price) || 0,
        quantity: item.quantity,
      })),
      totalPrice: discountedTotal,
      coupon: couponCode || null,
      discount,
      address: user.address || "",
      phone: user.phone || "",
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      setMessage("Order placed successfully! Redirecting...");
      setTimeout(() => {
        localStorage.removeItem("cart");
        localStorage.removeItem("activeCoupon");
        window.location.href = "/order-success";
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage(`Failed to place order: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "3rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Your Cart</h1>

      {cart.length === 0 && !message.includes("success") ? (
        <p style={{ textAlign: "center" }}>
          Cart is empty. <a href="/menu">Go to Menu</a>
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
              }}
            >
              <div>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p>{item.price ? parseFloat(item.price).toFixed(2) + " €" : "Free"}</p>
              </div>
              <div>
                <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                <button
                  onClick={() => removeItem(item._id)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: "2rem" }}>
            <input
              placeholder="Coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{ padding: "6px", marginRight: "10px" }}
            />
            <button onClick={applyCoupon}>Apply</button>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
          </div>

          <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
            Total:{" "}
            {discount > 0 ? (
              <>
                <span style={{ textDecoration: "line-through" }}>
                  {totalPrice.toFixed(2)} €
                </span>{" "}
                {discountedTotal.toFixed(2)} €
              </>
            ) : (
              `${totalPrice.toFixed(2)} €`
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              marginTop: "1rem",
              background: loading ? "#a3a3a3" : "#dc2626",
              color: "white",
              padding: "12px 24px",
              borderRadius: "50px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </>
      )}
    </div>
  );
}
