import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Favorites({ darkMode = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  // Toggle dark class on body
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Load favorites from localStorage
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
  }, []);

  const removeFromFavorites = (id) => {
    const updatedFavs = favorites.filter((pizza) => pizza.id !== id);
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  const addToCart = (pizza) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...pizza, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 1rem",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "1.5rem",
    border: "2px solid var(--border)",
    borderRadius: "12px",
    background: "var(--card)",
    transition: "transform 0.3s, box-shadow 0.3s",
  };

  const cardHoverStyle = {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  };

  const btnContainerStyle = {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  };

  const btnStyle = {
    padding: "0.5rem 1rem",
    fontSize: "0.95rem",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s",
  };

  const primaryBtnStyle = {
    ...btnStyle,
    backgroundColor: "var(--primary)",
    color: "#f4e3e3ff",
  };

  const mutedBtnStyle = {
    ...btnStyle,
    backgroundColor: "var(--card)", // slightly muted
    color: "var(--text)",
    border: "1px solid var(--border)",
  };

  if (favorites.length === 0) {
    return (
      <div style={containerStyle}>
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>
          {t("favorites")}
        </h1>
        <p style={{ textAlign: "center", fontSize: "1.1rem", color: "var(--text)" }}>
          {t("noFavoritesYet")}
        </p>
        <Link
          to="/menu"
          style={{ color: "var(--primary)", fontWeight: "bold", display: "block", textAlign: "center", marginTop: "1rem" }}
        >
          {t("browseMenu")}
        </Link>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>
        {t("favorites")}
      </h1>
      <div style={gridStyle}>
        {favorites.map((pizza) => (
          <div
            key={pizza.id}
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "none" })
            }
          >
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.5rem" }}>
                {pizza.name}
              </h2>
              <p style={{ color: "var(--text)", marginBottom: "0.3rem" }}>
                {t("size")}: {pizza.details.size || pizza.size}
              </p>
              <p style={{ color: "var(--text)", marginBottom: "0.3rem" }}>
                {t("crust")}: {pizza.details.crust || pizza.crust}
              </p>
              {pizza.details.toppings && pizza.details.toppings.length > 0 && (
                <p style={{ color: "var(--text)", marginBottom: "0.3rem" }}>
                  {t("toppings")}: {pizza.details.toppings.join(" • ")}
                </p>
              )}
              <p style={{ fontWeight: "bold", color: "var(--text)", marginTop: "0.5rem" }}>
                {pizza.price} €
              </p>
            </div>

            <div style={btnContainerStyle}>
              <button onClick={() => addToCart(pizza)} style={primaryBtnStyle}>
                {t("addToCart")}
              </button>
              <button onClick={() => removeFromFavorites(pizza.id)} style={mutedBtnStyle}>
                {t("remove")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
