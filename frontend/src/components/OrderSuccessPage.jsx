import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OrderSuccessPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { orderNumber } = location.state || {};
  const safeOrderNumber = orderNumber || "—";

  const isRTL = i18n.language === "ar";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)",
        textAlign: "center",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "900",
          color: "#16a34a",
          marginBottom: "1rem",
        }}
      >
        🎉 {t("orderSuccess.title")}
      </h1>

      <p style={{ fontSize: "1.6rem", marginBottom: "0.5rem", color: "#065f46" }}>
        {t("orderSuccess.orderNumber")} :
      </p>

      <p
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#064e3b",
          marginBottom: "1.5rem",
        }}
      >
        {safeOrderNumber}
      </p>

      <p
        style={{
          fontSize: "1.2rem",
          color: "#065f46",
          maxWidth: "600px",
          marginBottom: "2.5rem",
        }}
      >
        {t("orderSuccess.thankYou")}
      </p>

      <div style={{ display: "flex", gap: "1rem", flexDirection: isRTL ? "row-reverse" : "row" }}>
        <Link to="/menu">
          <button
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
              color: "white",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              fontSize: "1.2rem",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(220,38,38,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            🍕 {t("orderSuccess.backToMenu")}
          </button>
        </Link>

        <Link to="/">
          <button
            style={{
              background: "#2563eb",
              color: "white",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              fontSize: "1.2rem",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            🏠 {t("orderSuccess.home")}
          </button>
        </Link>

        {/* Track My Order Button */}
        <Link to="/track-order" state={{ orderNumber: safeOrderNumber }}>
          <button
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              color: "white",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              fontSize: "1.2rem",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(251,191,36,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            🚚 Track My Order
          </button>
        </Link>
      </div>
    </div>
  );
}
