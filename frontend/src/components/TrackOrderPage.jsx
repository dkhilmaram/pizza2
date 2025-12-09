import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOrders } from "../services/orders";
import { useNavigate } from "react-router-dom";

export default function TrackOrderPage({ darkMode = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    // Toggle dark class on body
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const steps = [
    { key: "pending", label: t("Pending"), icon: "⏳" },
    { key: "preparing", label: t("Preparing"), icon: "🍕" },
    { key: "delivering", label: t("Delivering"), icon: "🚚" },
    { key: "completed", label: t("Completed"), icon: "🎉" },
    { key: "canceled", label: t("Canceled"), icon: "❌" },
  ];

  const displayedSteps = isRTL ? [...steps].reverse() : steps;
  const currentIndex = displayedSteps.findIndex((s) => s.key === status);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const orders = await getOrders("/me");
        if (orders && orders.length > 0) {
          const lastOrder = orders[orders.length - 1];
          setStatus(lastOrder.status);
          setOrderNumber(lastOrder._id);
        } else setStatus(null);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLastOrder();
    const interval = setInterval(fetchLastOrder, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return <p style={{ textAlign: "center" }}>{t("Loading...")}</p>;
  if (!status)
    return (
      <p style={{ textAlign: "center" }}>
        {t("No order found. Please place an order first.")}
      </p>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "4rem 2rem",
        fontFamily: "'Inter', sans-serif",
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="gradient-text">{t("Track My Order")}</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--muted)", marginTop: "0.5rem" }}>
          {orderNumber ? `Order #${orderNumber}` : ""}
        </p>
      </div>

      {/* Timeline */}
      <div
        style={{
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto 6rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        {/* Background Line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "5%",
            right: "5%",
            height: "8px",
            background: "var(--border)",
            borderRadius: "4px",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />
        {/* Progress Line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "5%",
            height: "8px",
            width: `${(currentIndex / (displayedSteps.length - 1)) * 90}%`,
            background: "var(--primary)",
            borderRadius: "4px",
            transform: "translateY(-50%)",
            transition: "width 0.5s ease-in-out",
            zIndex: 1,
          }}
        />

        {/* Steps */}
        {displayedSteps.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={step.key}
              style={{
                flex: "0 0 auto",
                textAlign: "center",
                position: "relative",
                zIndex: 2,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: isDone || isActive ? "var(--primary)" : "var(--card)",
                  border: `4px solid ${isDone || isActive ? "var(--primary)" : "var(--muted)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  margin: "0 auto",
                  boxShadow: isActive
                    ? "0 0 25px rgba(16,185,129,0.6)"
                    : "0 4px 10px rgba(0,0,0,0.1)",
                  transform: isActive ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.3s",
                }}
                title={step.label}
              >
                {step.icon}
              </div>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontWeight: isActive ? "700" : "500",
                  color: isDone || isActive ? "var(--primary)" : "var(--muted)",
                  fontSize: "1.1rem",
                }}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Current Status */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
          {t("Current Status")}:
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "1rem 2rem",
            background: "var(--card)",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "1.5rem",
            border: "3px solid var(--primary)",
            boxShadow: "0 10px 30px rgba(16,185,129,0.2)",
            color: "var(--primary)",
            transition: "all 0.3s",
          }}
        >
          {displayedSteps[currentIndex].icon} {displayedSteps[currentIndex].label}
        </div>
        {status === "completed" && (
          <p style={{ marginTop: "1.5rem", fontSize: "1.2rem", color: "var(--primary)" }}>
            🎉 {t("Your order has been delivered! Enjoy your meal!")} 🍕
          </p>
        )}
      </div>
    </div>
  );
}
