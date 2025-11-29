import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "../services/orders";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");

  // Load cart on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    let newDiscount = 0;

    if (code === "PIZZA10") newDiscount = 0.1;
    else if (code === "PIZZA20") newDiscount = 0.2;

    setDiscount(newDiscount);
    setMessage(newDiscount > 0 ? `Coupon applied: ${newDiscount * 100}% off` : "Invalid coupon");
  };

  const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const discountedTotal = totalPrice * (1 - discount);

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please log in to place an order.");
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      await createOrder({
        items: cart,
        totalPrice: discountedTotal,
        coupon: couponCode,
        discount,
        address: user.address || "",
        phone: user.phone || "",
      });

      localStorage.removeItem("cart");
      setCart([]);
      setCouponCode("");
      setDiscount(0);
      setMessage("Order placed successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to place order.");
    }
  };

  return (
    <div style={{ padding: "3rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Your Cart</h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          Cart is empty. <Link to="/menu">Go to Menu</Link>
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}
            >
              <div>
                <h2>{item.name}</h2>
                <p>{item.details}</p>
                <p>{parseFloat(item.price).toFixed(2)} €</p>
              </div>
              <div>
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                <button onClick={() => removeItem(item.id)} style={{ marginLeft: "10px" }}>
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
                <span style={{ textDecoration: "line-through" }}>{totalPrice.toFixed(2)} €</span>{" "}
                {discountedTotal.toFixed(2)} €
              </>
            ) : (
              `${totalPrice.toFixed(2)} €`
            )}
          </div>

          <button onClick={handleCheckout} style={{ marginTop: "1rem" }}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
