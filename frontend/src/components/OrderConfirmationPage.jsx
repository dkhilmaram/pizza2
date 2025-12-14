import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OrderConfirmationPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  // Sync with global dark mode (your navbar toggle controls it)
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };

    checkTheme(); // initial check
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Your beautiful new theme
  const theme = {
    bg: isDark
      ? "linear-gradient(135deg, #0f0a1a 0%, #1a0d2e 40%, #2d1b3a 100%)"
      : "linear-gradient(135deg, #fff8f1 0%, #fff1e6 40%, #ffe4cc 100%)",
    cardBg: isDark ? "#1a1a2e" : "white",
    text: isDark ? "#f1f5f9" : "#1f2937",
    textMuted: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
    inputBg: isDark ? "#0f172a" : "#f8fafc",
    shadow: isDark 
      ? "0 20px 60px rgba(0,0,0,0.6)" 
      : "0 15px 50px rgba(0,0,0,0.08)",
    divider: isDark ? "#334155" : "#e2e8f0",
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

  // Apply coupon
  useEffect(() => {
    const applyCoupon = async () => {
      if (!activeCoupon || cart.length === 0) {
        setDiscount(0);
        setCouponMessage("");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/promotions");
        if (res.ok) {
          const data = await res.json();
          const promos = Array.isArray(data) ? data : data.promotions || [];
          const promo = promos.find(p => p.code?.toUpperCase() === activeCoupon.toUpperCase());
          if (promo) {
            setDiscount(promo.discount || 0);
            setCouponMessage(t("couponApplied", {
              code: promo.code,
              percent: (promo.discount * 100).toFixed(0)
            }));
            return;
          }
        }
      } catch (err) {
        console.warn("Using fallback coupons");
      }

      const fallback = {
        PIZZA10: 0.1, PIZZA20: 0.2, BIENVENUE10: 0.1,
        "2POUR1": 0.5, GROUPE50: 0.5, GRATUIT: 1.0,
        MARGERITA: 0.15, LIVRAISON0: 0.0
      };

      const rate = fallback[activeCoupon.toUpperCase()] || 0;
      setDiscount(rate);
      setCouponMessage(
        rate > 0
          ? t("couponApplied", { code: activeCoupon, percent: (rate * 100).toFixed(0) })
          : t("freeDelivery")
      );
    };

    applyCoupon();
  }, [activeCoupon, cart.length, t]);

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
  const total = subtotal * (1 - discount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!formData.fullName.trim()) err.fullName = t("validation.required", { field: t("fullName") });
    if (!formData.phone.trim()) err.phone = t("validation.required", { field: t("phone") });
    if (!formData.email.includes("@")) err.email = t("validation.email");
    if (!formData.address.trim()) err.address = t("validation.required", { field: t("address") });
    if (!formData.city.trim()) err.city = t("validation.required", { field: t("city") });
    if (!formData.postalCode.trim()) err.postalCode = t("validation.required", { field: t("postalCode") });
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

  // 🔥 Fonction pour modifier une pizza personnalisée
  const handleEditCustomPizza = (item) => {
    navigate("/pizza", { 
      state: { 
        editItem: item 
      } 
    });
  };

  if (cart.length === 0) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: theme.cardBg, padding: "4rem", borderRadius: "32px", textAlign: "center", boxShadow: theme.shadow }}>
          <div style={{ fontSize: "7rem", marginBottom: "1.5rem" }}>🍕</div>
          <h2 style={{ color: theme.text, fontSize: "2.5rem", fontWeight: "800" }}>
            {t("emptyCart")}
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}>
            <Link to="/menu">
              <button style={{
                background: "#dc2626",
                color: "white",
                padding: "1.2rem 3rem",
                borderRadius: "50px",
                fontWeight: "700",
                border: "none",
                fontSize: "1.3rem",
                boxShadow: "0 10px 30px rgba(220,38,38,0.4)"
              }}>
                {t("retour")}
              </button>
            </Link>
            <Link to="/promotions">
              <button style={{
                background: "#16a34a",
                color: "white",
                padding: "1.2rem 3rem",
                borderRadius: "50px",
                fontWeight: "700",
                border: "none",
                fontSize: "1.3rem",
                boxShadow: "0 10px 30px rgba(22,163,74,0.4)"
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
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: theme.bg, padding: "4rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "3.8rem",
          fontWeight: "900",
          background: "linear-gradient(135deg, #dc2626, #ef4444)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
          textShadow: isDark ? "0 0 40px rgba(220,38,38,0.4)" : "none"
        }}>
          {t("title")}
        </h1>
        <p style={{ textAlign: "center", color: theme.textMuted, fontSize: "1.4rem", marginBottom: "3rem" }}>
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isRTL ? "420px 1fr" : "1fr 420px",
            gap: "3rem",
            alignItems: "start"
          }}>
            {/* LEFT: Form */}
            <div>
              {/* Personal Info */}
              <div style={{ background: theme.cardBg, borderRadius: "32px", padding: "2.5rem", boxShadow: theme.shadow, marginBottom: "2.5rem" }}>
                <h2 style={{ color: theme.text, fontSize: "2rem", fontWeight: "800", marginBottom: "2rem" }}>
                  {t("personalInfo")}
                </h2>
                <input name="fullName" placeholder={t("fullName")} value={formData.fullName} onChange={handleChange}
                  style={{ width: "100%", padding: "1.3rem", borderRadius: "16px", border: `2px solid ${errors.fullName ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text, marginBottom: "1.2rem", fontSize: "1.1rem" }} />
                {errors.fullName && <p style={{ color: "#dc2626", fontSize: "0.95rem", marginTop: "-0.8rem", marginBottom: "1rem" }}>{errors.fullName}</p>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <input name="phone" placeholder={t("phone")} value={formData.phone} onChange={handleChange}
                      style={{ width: "100%", padding: "1.3rem", borderRadius: "16px", border: `2px solid ${errors.phone ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text }} />
                    {errors.phone && <p style={{ color: "#dc2626", fontSize: "0.95rem", marginTop: "0.3rem" }}>{errors.phone}</p>}
                  </div>
                  <div>
                    <input name="email" placeholder={t("email")} value={formData.email} onChange={handleChange}
                      style={{ width: "100%", padding: "1.3rem", borderRadius: "16px", border: `2px solid ${errors.email ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text }} />
                    {errors.email && <p style={{ color: "#dc2626", fontSize: "0.95rem", marginTop: "0.3rem" }}>{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ background: theme.cardBg, borderRadius: "32px", padding: "2.5rem", boxShadow: theme.shadow, marginBottom: "2.5rem" }}>
                <h2 style={{ color: theme.text, fontSize: "2rem", fontWeight: "800", marginBottom: "2rem" }}>
                  {t("deliveryAddress")}
                </h2>
                <input name="address" placeholder={t("address")} value={formData.address} onChange={handleChange}
                  style={{ width: "100%", padding: "1.3rem", borderRadius: "16px", border: `2px solid ${errors.address ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text, marginBottom: "1.5rem" }} />
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                  <input name="city" placeholder={t("city")} value={formData.city} onChange={handleChange}
                    style={{ width: "100%", padding: "1.3rem", borderRadius: "16px", border: `2px solid ${errors.city ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text }} />
                  <input name="postalCode" placeholder={t("postalCode")} value={formData.postalCode} onChange={handleChange}
                    style={{ width: "100%", padding: "1.3rem", borderRadius: "16px", border: `2px solid ${errors.postalCode ? "#dc2626" : theme.border}`, background: theme.inputBg, color: theme.text }} />
                </div>
                <textarea name="deliveryInstructions" placeholder={t("instructions")} rows="4" value={formData.deliveryInstructions} onChange={handleChange}
                  style={{ width: "100%", padding: "1.3rem", borderRadius: "16px", border: `2px solid ${theme.border}`, background: theme.inputBg, color: theme.text, marginTop: "1.5rem", resize: "vertical", fontSize: "1.1rem" }} />
              </div>

              {/* Options */}
              <div style={{ background: theme.cardBg, borderRadius: "32px", padding: "2.5rem", boxShadow: theme.shadow }}>
                <h2 style={{ color: theme.text, fontSize: "2rem", fontWeight: "800", marginBottom: "2rem" }}>{t("options")}</h2>
                <select name="deliveryTime" value={formData.deliveryTime} onChange={handleChange}
                  style={{ width: "100%", padding: "1.3rem", borderRadius: "16px", border: `2px solid ${theme.border}`, background: theme.inputBg, color: theme.text, marginBottom: "2rem", fontSize: "1.1rem" }}>
                  <option value="asap">{t("asap")}</option>
                  <option value="1h">{t("in1h")}</option>
                  <option value="2h">{t("in2h")}</option>
                  <option value="evening">{t("evening")}</option>
                </select>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {["card", "cash"].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                      style={{
                        padding: "1.5rem",
                        borderRadius: "16px",
                        border: formData.paymentMethod === method ? "4px solid #dc2626" : `2px solid ${theme.border}`,
                        background: formData.paymentMethod === method ? "linear-gradient(135deg, #dc2626, #ef4444)" : theme.cardBg,
                        color: formData.paymentMethod === method ? "white" : theme.text,
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        transition: "all 0.3s"
                      }}
                    >
                      {method === "card" ? t("paymentCard") : t("paymentCash")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Summary */}
            <div style={{ position: "sticky", top: "2rem", alignSelf: "start" }}>
              <div style={{ background: theme.cardBg, borderRadius: "32px", padding: "3rem", boxShadow: theme.shadow }}>
                <h2 style={{ color: theme.text, fontSize: "2.2rem", fontWeight: "800", marginBottom: "2rem" }}>{t("summary")}</h2>

                <div style={{ maxHeight: "350px", overflowY: "auto", marginBottom: "2rem" }}>
                  {cart.map(item => (
                    <div key={item._id || item.id} style={{ marginBottom: "1.5rem", background: theme.inputBg, padding: "1.2rem", borderRadius: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "700", color: theme.text, fontSize: "1.2rem", marginBottom: "0.3rem" }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: "1rem", color: theme.textMuted }}>
                            {item.quantity} × {parseFloat(item.price || 0).toFixed(2)} €
                          </div>
                        </div>
                        <div style={{ fontWeight: "700", color: theme.text, fontSize: "1.3rem" }}>
                          {((item.quantity || 1) * parseFloat(item.price || 0)).toFixed(2)} €
                        </div>
                      </div>
                      
                      {/* 🔥 Bouton Modifier professionnel pour les pizzas personnalisées */}
                      {item.type === "custom" && (
                        <button
                          type="button"
                          onClick={() => handleEditCustomPizza(item)}
                          style={{
                            marginTop: "0.8rem",
                            width: "100%",
                            padding: "0.9rem 1.2rem",
                            background: isDark 
                              ? "linear-gradient(135deg, #475569 0%, #334155 100%)" 
                              : "linear-gradient(135deg, #64748b 0%, #475569 100%)",
                            color: "white",
                            border: isDark ? "1px solid #64748b" : "1px solid #94a3b8",
                            borderRadius: "12px",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: isDark 
                              ? "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" 
                              : "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = isDark 
                              ? "0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)" 
                              : "0 6px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = isDark 
                              ? "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" 
                              : "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)";
                          }}
                        >
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          <span>{t("edit") || "Modifier"}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: `3px solid ${theme.divider}`, paddingTop: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ color: theme.textMuted, fontSize: "1.3rem" }}>{t("subtotal")}</span>
                    <span style={{ fontSize: "1.3rem" }}>{subtotal.toFixed(2)} €</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", fontWeight: "700", fontSize: "1.3rem" }}>
                      <span>{t("discount")} ({activeCoupon})</span>
                      <span>-{(subtotal * discount).toFixed(2)} €</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "2rem", borderTop: `3px solid ${theme.divider}` }}>
                    <span style={{ fontSize: "1.8rem", fontWeight: "900", color: theme.text }}>{t("total")}</span>
                    <span style={{
                      fontSize: "3rem",
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
                  <div style={{ margin: "2rem 0", padding: "1.2rem", background: "#dcfce7", color: "#166534", borderRadius: "16px", fontWeight: "700", textAlign: "center", fontSize: "1.2rem" }}>
                    {couponMessage}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} style={{
                  width: "100%",
                  background: isSubmitting ? "#94a3b8" : "linear-gradient(135deg, #dc2626, #ef4444)",
                  color: "white",
                  padding: "2rem",
                  borderRadius: "20px",
                  fontSize: "1.8rem",
                  fontWeight: "900",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  marginTop: "2rem",
                  boxShadow: "0 20px 40px rgba(220,38,38,0.4)",
                  transition: "all 0.3s"
                }}>
                  {isSubmitting ? t("processing") : t("confirmOrder")}
                </button>

                <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem" }}>
                  <Link to="/menu" className="flex-1">
                    <button type="button" style={{
                      width: "100%",
                      padding: "1.3rem",
                      background: theme.cardBg,
                      color: theme.textMuted,
                      border: `2px solid ${theme.border}`,
                      borderRadius: "16px",
                      fontSize: "1.2rem"
                    }}>
                      {t("retour")}
                    </button>
                  </Link>
                  <Link to="/promotions" className="flex-1">
                    <button type="button" style={{
                      width: "100%",
                      padding: "1.3rem",
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "16px",
                      fontSize: "1.2rem"
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