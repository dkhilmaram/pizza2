import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Welcome({ darkMode }) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const smallCardStyle = {
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    flex: 1,
    margin: "0 10px",
    cursor: "pointer",
    transition: "all 0.3s",
  };

  const smallCardButtonStyle = {
    marginTop: "10px",
    padding: "8px 15px",
    borderRadius: "8px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    backgroundColor: "#ea2828ff",
    color: "#f9ededff",
  };

  const smallCards = [
    { title: t("customer_reviews"), path: "/reviews", desc: t("customer_reviews_desc") },
    { title: t("promotions"), path: "/promotions", desc: t("promotions_desc") },
    { title: t("menu"), path: "/menu", desc: t("menu_desc") },
  ];

  return (
    <div className="welcome-page">
      <div className="hero">
        <div className="wrap">
          <div style={{ maxWidth: "500px" }}>
            
            {/* ------ FIXED ONLY THIS PART ------ */}
            <div className="badges" style={{ marginBottom: "10px" }}>
              <Link
                to={user ? "/new" : "/login"}
                className="badge red"
                style={{ textDecoration: "none" }}
              >
                {t("new")}
              </Link>

              <Link
                to={user ? "/express" : "/login"}
                className="badge"
                style={{ textDecoration: "none" }}
              >
                {t("express_delivery")}
              </Link>
            </div>
            {/* ----------------------------------- */}

            <h1>{t("hero_title")} 🍕</h1>
            <p>{t("hero_subtitle")}</p>

            <div className="cta" style={{ gap: "10px", flexWrap: "wrap" }}>
              {!user ? (
                <>
                  <Link to="/login" className="btn btn-primary">
                    {t("start")}
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    {t("create_account")}
                  </Link>
                </>
              ) : (
                <Link to="/orders" className="btn btn-primary">
                  {t("see my orders")}
                </Link>
              )}
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="/images/pizza-hero.png"
              alt="Pizza"
              className="pizza-img"
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

      <div
        className="small-hero-section"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          gap: "20px",
        }}
      >
        {smallCards.map((card, i) => (
          <div
            key={i}
            className={`card ${darkMode ? "dark" : ""}`}
            style={smallCardStyle}
          >
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <Link className="btn" style={smallCardButtonStyle} to={user ? card.path : "/login"}>
              {t("see_more")}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
