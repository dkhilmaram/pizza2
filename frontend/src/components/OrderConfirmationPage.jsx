import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OrderConfirmationPage({ darkMode = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  // Theme
  const theme = {
    bg: darkMode
      ? "linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)"
      : "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
    cardBg: darkMode ? "#1f2937" : "white",
    text: darkMode ? "#f9fafb" : "#1f2937",
    textMuted: darkMode ? "#9ca3af" : "#6b7280",
    border: darkMode ? "#374151" : "#e5e7eb",
    inputBg: darkMode ? "#111827" : "#f9fafb",
    shadow: darkMode ? "0 10px 40px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.08)",
    divider: darkMode ? "#374151" : "#f3f4f6",
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryInstructions: "",
    paymentMethod: "card",
    deliveryTime: "asap",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  // Load cart & coupon
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);

    const coupon = localStorage.getItem("activeCoupon") || "";
    if (coupon) setActiveCoupon(coupon);
  }, []);

  // Apply coupon logic
  useEffect(() => {
    const applyCoupon = async () => {
      if (!activeCoupon) return;

      try {
        const res = await fetch("http://localhost:5000/api/promotions");
        if (res.ok) {
          const data = await res.json();
          const promos = Array.isArray(data) ? data : data.promotions || [];
          const promo = promos.find(p => p.code?.toUpperCase() === activeCoupon.toUpperCase());
          if (promo) {
            setDiscount(promo.discount || 0);
            setCouponMessage(t("couponApplied", { code: promo.code, percent: (promo.discount * 100).toFixed(0) }));
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch promotions, using fallback");
      }

      // Fallback coupons
      const fallback = {
        PIZZA10: 0.1, PIZZA20: 0.2, BIENVENUE10: 0.1,
        "2POUR1": 0.5, GROUPE50: 0.5, GRATUIT: 1.0,
        MARGERITA: 0.15, LIVRAISON0: 0.0
      };
      const rate = fallback[activeCoupon.toUpperCase()] || 0;
      setDiscount(rate);
      setCouponMessage(
        rate > 0
          ? t("couponApplied", { code: activeCoupon, percent: (rate * 100) })
          : t("freeDelivery")
      );
    };

    if (cart.length > 0) applyCoupon();
  }, [cart, activeCoupon, t]);

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
  const total = subtotal * (1 - discount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!formData.fullName.trim()) err.fullName = t("validation.required", { field: t("fullName").replace("*", "") });
    if (!formData.phone.trim()) err.phone = t("validation.required", { field: t("phone").replace("*", "") });
    if (!formData.email.includes("@")) err.email = t("validation.email");
    if (!formData.address.trim()) err.address = t("validation.required", { field: t("address").replace("*", "") });
    if (!formData.city.trim()) err.city = t("validation.required", { field: t("city").replace("*", "") });
    if (!formData.postalCode.trim()) err.postalCode = t("validation.required", { field: t("postalCode").replace("*", "") });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || cart.length === 0) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert(t("loginRequired"));
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      items: cart.map(i => ({
        name: i.name,
        description: i.description || "",
        price: parseFloat(i.price),
        quantity: i.quantity || 1,
      })),
      totalPrice: parseFloat(total.toFixed(2)),
      coupon: activeCoupon || null,
      discount,
      address: `${formData.address}, ${formData.city} ${formData.postalCode}`,
      phone: formData.phone,
      instructions: formData.deliveryInstructions,
      deliveryTime: formData.deliveryTime,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("error"));

      localStorage.removeItem("cart");
      localStorage.removeItem("activeCoupon");
      navigate("/order-success", { state: { orderNumber: data.orderNumber || "CMD" + Date.now() } });
    } catch (err) {
      alert(t("error") + ": " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: theme.cardBg, padding: "4rem", borderRadius: "24px", textAlign: "center", boxShadow: theme.shadow }}>
          <div style={{ fontSize: "6rem" }}>Pizza</div>
          <h2 style={{ color: theme.text, fontSize: "2rem", margin: "1rem 0" }}>{t("emptyCart")}</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link to="/menu">
              <button style={{
                background: "#dc2626",
                color: "white",
                padding: "1rem 2.5rem",
                borderRadius: "50px",
                fontWeight: "700",
                border: "none",
                fontSize: "1.2rem"
              }}>
                {t("retour")}
              </button>
            </Link>
            <Link to="/promotions">
              <button style={{
                background: "#16a34a",
                color: "white",
                padding: "1rem 2.5rem",
                borderRadius: "50px",
                fontWeight: "700",
                border: "none",
                fontSize: "1.2rem"
              }}>
                {t("seePromo")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: theme.bg, padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "3.2rem",
          fontWeight: "900",
          color: "#dc2626",
          marginBottom: "1rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
        }}>
          {t("title")}
        </h1>
        <p style={{ textAlign: "center", color: theme.textMuted, fontSize: "1.2rem", marginBottom: "3rem" }}>
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isRTL ? "420px 1fr" : "1fr 420px",
            gap: "2rem"
          }}>
            {/* Left: Form */}
            <div>
              {/* Personal Info */}
              <div style={{ background: theme.cardBg, borderRadius: "24px", padding: "2rem", boxShadow: theme.shadow, marginBottom: "2rem" }}>
                <h2 style={{ color: theme.text, fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.5rem" }}>
                  {t("personalInfo")}
                </h2>
                <input name="fullName" placeholder={t("fullName")} value={formData.fullName} onChange={handleChange}
                  style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: `2px solid ${errors.fullName ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text, marginBottom: "1rem" }} />
                {errors.fullName && <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{errors.fullName}</p>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <input name="phone" placeholder={t("phone")} value={formData.phone} onChange={handleChange}
                      style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: `2px solid ${errors.phone ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text }} />
                    {errors.phone && <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{errors.phone}</p>}
                  </div>
                  <div>
                    <input name="email" placeholder={t("email")} value={formData.email} onChange={handleChange}
                      style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: `2px solid ${errors.email ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text }} />
                    {errors.email && <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ background: theme.cardBg, borderRadius: "24px", padding: "2rem", boxShadow: theme.shadow, marginBottom: "2rem" }}>
                <h2 style={{ color: theme.text, fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.5rem" }}>
                  {t("deliveryAddress")}
                </h2>
                <input name="address" placeholder={t("address")} value={formData.address} onChange={handleChange}
                  style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: `2px solid ${errors.address ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text, marginBottom: "1rem" }} />
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                  <input name="city" placeholder={t("city")} value={formData.city} onChange={handleChange}
                    style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: `2px solid ${errors.city ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text }} />
                  <input name="postalCode" placeholder={t("postalCode")} value={formData.postalCode} onChange={handleChange}
                    style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: `2px solid ${errors.postalCode ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text }} />
                </div>
                <textarea name="deliveryInstructions" placeholder={t("instructions")} rows="3" value={formData.deliveryInstructions} onChange={handleChange}
                  style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: `2px solid ${theme.border}`, background: theme.inputBg, color: theme.text, marginTop: "1rem", resize: "vertical" }} />
              </div>

              {/* Options */}
              <div style={{ background: theme.cardBg, borderRadius: "24px", padding: "2rem", boxShadow: theme.shadow }}>
                <h2 style={{ color: theme.text, fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.5rem" }}>{t("options")}</h2>
                <select name="deliveryTime" value={formData.deliveryTime} onChange={handleChange}
                  style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: `2px solid ${theme.border}`, background: theme.inputBg, color: theme.text, marginBottom: "1rem" }}>
                  <option value="asap">{t("asap")}</option>
                  <option value="1h">{t("in1h")}</option>
                  <option value="2h">{t("in2h")}</option>
                  <option value="evening">{t("evening")}</option>
                </select>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {["card", "cash"].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                      style={{
                        padding: "1rem",
                        borderRadius: "12px",
                        border: formData.paymentMethod === method ? "3px solid #dc2626" : `2px solid ${theme.border}`,
                        background: formData.paymentMethod === method ? "linear-gradient(135deg, #dc2626, #ef4444)" : theme.cardBg,
                        color: formData.paymentMethod === method ? "white" : theme.text,
                        fontWeight: "700",
                      }}
                    >
                      {method === "card" ? t("paymentCard") : t("paymentCash")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div style={{ position: "sticky", top: "2rem", alignSelf: "start" }}>
              <div style={{ background: theme.cardBg, borderRadius: "24px", padding: "2rem", boxShadow: theme.shadow }}>
                <h2 style={{ color: theme.text, fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.5rem" }}>{t("summary")}</h2>

                <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1.5rem" }}>
                  {cart.map(item => (
                    <div key={item._id || item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: theme.textMuted }}>
                      <div>
                        <div style={{ fontWeight: "600", color: theme.text }}>{item.name}</div>
                        <div style={{ fontSize: "0.9rem" }}>{item.quantity} × {(item.price || 0).toFixed(2)} €</div>
                      </div>
                      <div style={{ fontWeight: "600", color: theme.text }}>
                        {((item.quantity || 1) * (item.price || 0)).toFixed(2)} €
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: `2px solid ${theme.divider}`, paddingTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                    <span style={{ color: theme.textMuted }}>{t("subtotal")}</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", fontWeight: "600" }}>
                      <span>{t("discount")} ({activeCoupon})</span>
                      <span>-{(subtotal * discount).toFixed(2)} €</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: `2px solid ${theme.divider}` }}>
                    <span style={{ fontSize: "1.4rem", fontWeight: "800", color: theme.text }}>{t("total")}</span>
                    <span style={{
                      fontSize: "2rem",
                      fontWeight: "900",
                      background: "linear-gradient(135deg, #dc2626, #ef4444)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}>
                      {total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {couponMessage && (
                  <p style={{ margin: "1rem 0", padding: "0.8rem", background: "#dcfce7", color: "#166534", borderRadius: "12px", fontWeight: "600", textAlign: "center" }}>
                    {couponMessage}
                  </p>
                )}

                <button type="submit" disabled={isSubmitting} style={{
                  width: "100%",
                  background: isSubmitting ? "#9ca3af" : "linear-gradient(135deg, #dc2626, #ef4444)",
                  color: "white",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  fontSize: "1.3rem",
                  fontWeight: "800",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  marginTop: "1.5rem"
                }}>
                  {isSubmitting ? t("processing") : t("confirmOrder")}
                </button>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <Link to="/menu">
                    <button type="button" style={{
                      flex: 1,
                      padding: "1rem",
                      background: theme.cardBg,
                      color: theme.textMuted,
                      border: `2px solid ${theme.border}`,
                      borderRadius: "14px"
                    }}>
                      {t("retour")}
                    </button>
                  </Link>
                  <Link to="/promotions">
                    <button type="button" style={{
                      flex: 1,
                      padding: "1rem",
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "14px"
                    }}>
                      {t("seePromo")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
