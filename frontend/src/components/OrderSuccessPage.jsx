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

        /* Adapted gradient using theme colors */
        background: "linear-gradient(135deg, var(--card) 0%, var(--bg) 100%)",
        textAlign: "center",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "900",
          color: "var(--primary)",
          marginBottom: "1rem",
        }}
      >
        🎉 {t("orderSuccess.title")}
      </h1>

      <p style={{ fontSize: "1.6rem", marginBottom: "0.5rem", color: "var(--text)" }}>
        {t("orderSuccess.orderNumber")} :
      </p>

      <p
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "var(--text)",
          marginBottom: "1.5rem",
        }}
      >
        {safeOrderNumber}
      </p>

      <p
        style={{
          fontSize: "1.2rem",
          color: "var(--muted)",
          maxWidth: "600px",
          marginBottom: "2.5rem",
        }}
      >
        {t("orderSuccess.thankYou")}
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        {/* Back to Menu */}
        <Link to="/menu">
          <button
            style={{
              background: "var(--primary)",
              color: "#fff",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              fontSize: "1.2rem",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              transition: "0.3s",
            }}
          >
            🍕 {t("orderSuccess.backToMenu")}
          </button>
        </Link>

        {/* Home */}
        <Link to="/">
          <button
            style={{
              background: "var(--link)",
              color: "#fff",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              fontSize: "1.2rem",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              transition: "0.3s",
            }}
          >
            🏠 {t("orderSuccess.home")}
          </button>
        </Link>

        {/* Track Order */}
        <Link to="/track-order" state={{ orderNumber: safeOrderNumber }}>
          <button
            style={{
              background: "var(--primary)",
              color: "#fff",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              fontSize: "1.2rem",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              transition: "0.3s",
            }}
          >
            🚚 Track My Order
          </button>
        </Link>
      </div>
    </div>
  );
}
