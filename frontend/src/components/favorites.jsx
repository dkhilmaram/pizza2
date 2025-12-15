// src/components/Favorites.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ConfirmModal from "./ConfirmModal"; // adjust path if needed

export default function Favorites({ darkMode = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPizzaId, setSelectedPizzaId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!token) return;
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [token]);

  const removeFromFavorites = (pizzaId) => {
    setSelectedPizzaId(pizzaId);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    try {
      await fetch(`http://localhost:5000/api/favorites/${selectedPizzaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((p) => p._id !== selectedPizzaId));
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setSelectedPizzaId(null);
    }
  };

  const cancelRemove = () => {
    setShowConfirm(false);
    setSelectedPizzaId(null);
  };

  const addToCart = (pizza) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...pizza, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" };
  const heroStyle = {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    height: "250px",
    minHeight: "250px",
    maxHeight: "250px",
    overflow: "hidden",
    marginBottom: "2.5rem",
    background: "var(--primary-light, #fde2e2)",
    borderRadius: "20px",
    padding: "1rem 2rem",
    color: "var(--primary-dark, #dc2626)",
    flexWrap: "wrap",
  };
  const heroImageStyle = {
    width: "250px",
    height: "100%",
    objectFit: "cover",
    borderRadius: "15px",
    flexShrink: 0,
    minWidth: "100px",
  };
  const heroTextStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: isRTL ? "right" : "left",
    height: "100%",
    overflow: "hidden",
  };
  const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" };
  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    background: "var(--card)",
    borderRadius: "16px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    height: "400px",
  };
  const cardHoverStyle = { transform: "translateY(-6px)", boxShadow: "0 12px 25px rgba(0,0,0,0.15)" };
  const cardContentStyle = { padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" };
  const btnContainerStyle = { display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "space-between" };
  const btnStyle = { flex: 1, padding: "0.5rem 0", borderRadius: "10px", border: "none", fontWeight: "600", cursor: "pointer", transition: "0.25s all" };
  const primaryBtnStyle = { ...btnStyle, background: "var(--primary)", color: "#fff" };
  const mutedBtnStyle = { ...btnStyle, background: "transparent", border: "1px solid var(--border)", color: "var(--text)" };

  if (loading) return <div style={containerStyle}><p style={{ textAlign: "center" }}>{t("loading")}...</p></div>;

  const heroImage = favorites.length > 0 ? favorites[0].img : "/images/hero-pizza.jpg";

  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <img src={heroImage} alt="Hero Pizza" style={heroImageStyle} />
        <div style={heroTextStyle}>
          <h1>{t("favorites")}</h1>
          <p style={{ opacity: 0.8 }}>{favorites.length === 0 ? t("noFavoritesYet") : t("yourFavoritePizzas")}</p>
          {favorites.length === 0 && (
            <Link to="/menu" style={{ color: "var(--primary-dark)", fontWeight: "700", fontSize: "1.1rem" }}>
              {t("browseMenu")} →
            </Link>
          )}
        </div>
      </div>

      {favorites.length > 0 && (
        <div style={gridStyle}>
          {favorites.map((pizza) => (
            <div
              key={pizza._id}
              style={cardStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" })}
            >
              <img src={pizza.img} alt={pizza.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              <div style={cardContentStyle}>
                <div>
                  <h2>{pizza.name}</h2>
                  <p style={{ opacity: 0.85, fontSize: "0.9rem" }}>{pizza.details}</p>
                  <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>{pizza.price} €</p>
                </div>
                <div style={btnContainerStyle}>
                  <button onClick={() => addToCart(pizza)} style={primaryBtnStyle}>{t("addToCart")}</button>
                  <button onClick={() => removeFromFavorites(pizza._id)} style={mutedBtnStyle}>{t("remove")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message={t("confirmDeletePizza")}
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
        />
      )}
    </div>
  );
}
