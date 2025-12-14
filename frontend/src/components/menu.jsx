import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/pizzas"; // your backend endpoint

  // Fetch pizzas from backend
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPizzas(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch pizzas. Check backend URL or server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const addToCart = (pizza) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      id: Date.now(),
      name: pizza.name,
      price: parseFloat(pizza.price),
      details: pizza.ingredients,
      quantity: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };
const addToFavorites = async (pizza) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: pizza._id,                 // IMPORTANT
        name: pizza.name,
        price: parseFloat(pizza.price),
        details: pizza.ingredients,
        img: pizza.img
      })
    });

    if (!res.ok) {
      throw new Error("Failed to add favorite");
    }

    // optional redirect
    navigate("/favorites");
  } catch (err) {
    console.error(err);
    alert("Could not add to favorites");
  }
};




  if (loading) return <p style={{ textAlign: "center" }}>Loading pizzas...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div
      className="container-page"
      style={{
        padding: "3rem 0",
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "3rem", color: "#dc2626" }}>
        {t("menu")}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {pizzas.map((pizza) => (
          <div
            key={pizza._id}
            className="card"
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-10px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <img
              src={pizza.img}
              alt={t(pizza.name)}
              style={{ width: "100%", height: "220px", objectFit: "cover" }}
              loading="lazy"
            />
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.6rem", margin: "0 0 0.5rem 0", color: "#dc2626" }}>
                {t(pizza.name)}
              </h3>
              <p style={{ color: "#666", margin: "0 0 1rem 0", fontSize: "0.95rem" }}>
                {t(pizza.ingredients)}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <span style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#dc2626" }}>
    {parseFloat(pizza.price).toFixed(2)} €
  </span>

  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    {/* Heart button for Favorites */}
    <button
      onClick={() => addToFavorites(pizza)}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "1.8rem",
        color: "#dc2626",
      }}
    >
      ❤️
    </button>

    {/* Add to Cart button */}
    <button
      style={{
        background: "#dc2626",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "50px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s",
      }}
      onClick={() => addToCart(pizza)}
    >
      {t("add")}
    </button>
  </div>
</div>

            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <Link
          to="/orders"
          style={{
            background: "#7c2d12",
            color: "white",
            padding: "16px 40px",
            borderRadius: "50px",
            fontSize: "1.3rem",
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {t("create custom pizza")}
        </Link>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
  <Link
    to="/favorites"
    style={{
      background: "#dc2626",
      color: "white",
      padding: "14px 36px",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      textDecoration: "none",
      display: "inline-block",
    }}
  >
    {t("favorite list")}
  </Link>
</div>
      </div>
    </div>
  );
};

export default MenuPage;
