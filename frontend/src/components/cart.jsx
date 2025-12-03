import React, { useState, useEffect } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const promotions = {
    PIZZA10: 0.1,
    PIZZA20: 0.2,
    BIENVENUE10: 0.1,
    "2POUR1": 0.5,
    GROUPE50: 0.5,
    GRATUIT: 1.0,
    MARGERITA: 0.15,
    LIVRAISON0: 0.0,
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const active = localStorage.getItem("activeCoupon");
    if (active && promotions[active]) {
      setCouponCode(active);
      setDiscount(promotions[active]);
      setMessage(`Coupon applied: ${promotions[active] * 100}% off`);
    }
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cart.map(item =>
      (item.id === id || item._id === id)
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id && item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (promotions[code]) {
      setDiscount(promotions[code]);
      setMessage(`Coupon applied: ${promotions[code] * 100}% off`);
      localStorage.setItem("activeCoupon", code);
    } else {
      setDiscount(0);
      setMessage("Invalid coupon");
      localStorage.removeItem("activeCoupon");
    }
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const discountedTotal = totalPrice * (1 - discount);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return alert("Please log in to place an order.");
    }
    if (cart.length === 0) {
      return alert("Your cart is empty!");
    }

    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const orderData = {
      items: cart.map(item => ({
        name: item.name || "Unknown Pizza",
        description: item.description || "",
        price: parseFloat(item.price),
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

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

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
              key={item.id || item._id}
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
                <p>{parseFloat(item.price).toFixed(2)} €</p>
              </div>
              <div>
                <button onClick={() => updateQuantity(item.id || item._id, -1)}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id || item._id, 1)}>+</button>
                <button onClick={() => removeItem(item.id || item._id)} style={{ marginLeft: "10px" }}>Remove</button>
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
