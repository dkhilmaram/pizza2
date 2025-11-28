// src/pages/MenuPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Right-to-left support for Arabic


  const pizzas = [
    { name: "Margherita", price: "12.00", ingredients: "Tomate, Mozzarella, Basilic", img: "https://tse4.mm.bing.net/th/id/OIP.86Y1g1N1ds1WeREt8NLxEAHaFp?pid=Api&P=0&h=180" },
    { name: "Pepperoni", price: "14.50", ingredients: "Pepperoni, Mozzarella, Sauce tomate", img: "https://www.simplyrecipes.com/thmb/rLl58QZmVP4C3zSlpkKBo72EUws=/2000x1333/filters:fill(auto,1)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-8f256746d649404baa36a44d271329bc.jpg" },
    { name: "Quatre Fromages", price: "15.90", ingredients: "Mozzarella, Gorgonzola, Parmesan, Chèvre", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
    { name: "Végétarienne", price: "13.90", ingredients: "Légumes grillés, Mozzarella, Sauce tomate", img: "https://maxi.cdnartwhere.eu/wp-content/uploads/recipe/2016-01/pizza-vegetarienne-1280x720-963x542-c-default.jpg?ck=37a6259cc0c1dae299a7866489dff0bd" },
    { name: "Hawaïenne", price: "14.00", ingredients: "Jambon, Ananas, Mozzarella", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800" },
    { name: "Diavola", price: "15.50", ingredients: "Pepperoni piquant, Piments, Mozzarella", img: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=800" },
  ];
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
        {pizzas.map((pizza, i) => (
          <div
            key={i}
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
                  {pizza.price} €
                </span>
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
                >
                  {t("add")}
                </button>
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
      </div>
    </div>
  );
};

export default MenuPage;
