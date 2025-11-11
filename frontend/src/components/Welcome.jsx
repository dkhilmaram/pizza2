import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="hero">
      <div
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Section Texte */}
        <div style={{ maxWidth: "500px" }}>
          <div className="badges" style={{ marginBottom: "10px" }}>
            <span className="badge red" style={{ marginRight: 5 }}>
              Nouveau
            </span>
            <span className="badge">Livraison express</span>
          </div>

          <h1 style={{ fontSize: "2rem", marginBottom: "15px", fontWeight: "bold" }}>
            Votre pizza, chaude et croustillante, en quelques clics 🍕
          </h1>

          <p style={{ fontSize: "1.1rem", marginBottom: "20px", opacity: 0.9 }}>
            Composez, personnalisez et recommandez votre favorite. Simple, rapide et délicieux.
          </p>

          <div className="cta">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-primary" style={{ marginRight: 10 }}>
                  Commencer
                </Link>
                <Link to="/register" className="btn btn-muted">
                  Créer un compte
                </Link>
              </>
            ) : (
              <Link
                to="/pizza"
                className="btn btn-primary"
                style={{
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                🍕 Mes commandes de pizza
              </Link>
            )}
          </div>
        </div>

        {/* Image de Pizza */}
        <div
          className="hero-visual"
          style={{
            maxWidth: "400px",
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/pizza-hero.png"
            alt="Pizza"
            className="pizza-float"
            style={{
              width: "100%",
              borderRadius: "15px",
              filter: "drop-shadow(0px 5px 10px rgba(0,0,0,0.2))",
            }}
            onError={(e) => {
              e.currentTarget.replaceWith(
                Object.assign(document.createElement("div"), {
                  className: "pizza-fallback",
                  innerText: "🍕",
                  style: "font-size:80px; text-align:center;",
                })
                
              );
            }}
          />
        </div>
      </div>
    </div>
    
  );
}
