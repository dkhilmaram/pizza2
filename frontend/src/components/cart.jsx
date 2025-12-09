import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { t } = useTranslation();

  // ===============================
  // DARK MODE SYNC — Uses your navbar toggle
  // ===============================
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [promotions, setPromotions] = useState({});

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/promotions");
        if (res.ok) {
          const data = await res.json();
          const promoList = Array.isArray(data) ? data : data.promotions || [];
          const promoMap = {};
          promoList.forEach((p) => {
            if (p.code) promoMap[p.code.toUpperCase()] = p.discount || 0;
          });
          setPromotions(promoMap);
        }
      } catch (err) {
        console.warn("Backend indisponible → utilisation des codes fallback");
        setPromotions({
          PIZZA10: 0.1,
          PIZZA20: 0.2,
          BIENVENUE10: 0.1,
          "2POUR1": 0.5,
          GROUPE50: 0.5,
          GRATUIT: 1.0,
          MARGERITA: 0.15,
          LIVRAISON0: 0.0,
        });
      }
    };
    fetchPromotions();
  }, []);

  // Load cart + active coupon
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    const active = localStorage.getItem("activeCoupon");
    if (active && promotions[active.toUpperCase()] !== undefined) {
      const rate = promotions[active.toUpperCase()];
      setCouponCode(active);
      setDiscount(rate);
      setMessage(
        rate > 0
          ? t("coupon_applied_percent", {
              code: active,
              discount: (rate * 100).toFixed(0),
            })
          : t("coupon_applied_free_shipping")
      );
    }
  }, [promotions, t]);

  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) =>
      item.id === id || item._id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id && item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setMessage(t("enter_coupon"));
      setDiscount(0);
      localStorage.removeItem("activeCoupon");
      return;
    }

    const rate = promotions[code];
    if (rate !== undefined) {
      setDiscount(rate);
      setMessage(
        rate > 0
          ? t("coupon_applied_percent", {
              code,
              discount: (rate * 100).toFixed(0),
            })
          : t("coupon_applied_free_shipping")
      );
      localStorage.setItem("activeCoupon", code);
    } else {
      setDiscount(0);
      setMessage(t("invalid_coupon"));
      localStorage.removeItem("activeCoupon");
    }
    setCouponCode("");
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );
  const discountedTotal = totalPrice * (1 - discount);

  return (
    <div
      className="min-h-screen"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0f0a1a 0%, #1a0d2e 40%, #2d1b3a 100%)"
          : "linear-gradient(135deg, #fff8f1 0%, #fff1e6 40%, #ffe4cc 100%)",
        padding: "4rem 1.5rem",
        transition: "background 0.7s ease",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Title */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "4rem",
            fontWeight: "900",
            background: "linear-gradient(135deg, var(--brand), #ef4444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1.5rem",
            textShadow: isDark ? "0 0 50px rgba(220,38,38,0.5)" : "none",
            letterSpacing: "-1.5px",
          }}
        >
          {t("your_cart")}
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: "var(--muted)",
            marginBottom: "4rem",
            fontWeight: "500",
          }}
        >
          {cart.length === 0
            ? t("cart_empty")
            : t("cart_items_count", { count: cart.length })}
        </p>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div
            style={{
              background: "var(--card)",
              borderRadius: "32px",
              padding: "5rem 3rem",
              textAlign: "center",
              boxShadow: "0 25px 70px rgba(0,0,0,0.15)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "8rem", marginBottom: "2rem" }}>Pizza</div>
            <p style={{ fontSize: "2rem", color: "var(--muted)", marginBottom: "3rem" }}>
              {t("cart_empty")}
            </p>
            <Link to="/menu">
              <button
                style={{
                  background: "linear-gradient(135deg, var(--primary), #dc2626)",
                  color: "white",
                  padding: "1.5rem 4rem",
                  borderRadius: "50px",
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 15px 40px rgba(220,38,38,0.5)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(220,38,38,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(220,38,38,0.5)";
                }}
              >
                {t("view_menu")}
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div
              style={{
                background: "var(--card)",
                borderRadius: "32px",
                padding: "2.5rem",
                marginBottom: "3rem",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              }}
            >
              {cart.map((item, index) => (
                <div
                  key={item.id || item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "2rem",
                    marginBottom: index < cart.length - 1 ? "2rem" : "0",
                    borderBottom: index < cart.length - 1 ? "2px solid var(--border)" : "none",
                    borderRadius: "20px",
                    transition: "all 0.4s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--nav-active-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        fontSize: "2rem",
                        fontWeight: "800",
                        color: "var(--text)",
                        marginBottom: "0.8rem",
                      }}
                    >
                      {item.name}
                    </h2>
                    {item.description && (
                      <p style={{ color: "var(--muted)", fontSize: "1.2rem", marginBottom: "1rem" }}>
                        {item.description}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "900",
                        color: "var(--brand)",
                      }}
                    >
                      {parseFloat(item.price || 0).toFixed(2)} €
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    {/* Quantity */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "var(--btn-muted-bg)",
                        borderRadius: "50px",
                        padding: "0.8rem",
                        border: "3px solid var(--border)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id || item._id, -1)}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          background: "var(--card)",
                          color: "var(--brand)",
                          border: "none",
                          fontSize: "2rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--brand)";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--card)";
                          e.currentTarget.style.color = "var(--brand)";
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          margin: "0 2.5rem",
                          fontSize: "1.8rem",
                          fontWeight: "900",
                          color: "var(--text)",
                          minWidth: "50px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id || item._id, 1)}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          background: "var(--card)",
                          color: "var(--brand)",
                          border: "none",
                          fontSize: "2rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--brand)";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--card)";
                          e.currentTarget.style.color = "var(--brand)";
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id || item._id)}
                      style={{
                        padding: "1.2rem 2.5rem",
                        borderRadius: "16px",
                        background: "var(--card)",
                        color: "var(--brand)",
                        border: `3px solid ${isDark ? "#ff6b6b" : "#fee2e2"}`,
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--brand)";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--card)";
                        e.currentTarget.style.color = "var(--brand)";
                      }}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon + Total */}
            <div
              style={{
                background: "var(--card)",
                borderRadius: "32px",
                padding: "3rem",
                boxShadow: "0 25px 70px rgba(0,0,0,0.15)",
              }}
            >
              {/* Coupon */}
              <div style={{ marginBottom: "3rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "1.8rem",
                    fontWeight: "800",
                    marginBottom: "1.5rem",
                    color: "var(--text)",
                  }}
                >
                  {t("coupon_code")}
                </label>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <input
                    type="text"
                    placeholder={t("enter_coupon")}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "1.5rem",
                      borderRadius: "20px",
                      border: "3px solid var(--border)",
                      background: "var(--btn-muted-bg)",
                      color: "var(--text)",
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                  <button
                    onClick={applyCoupon}
                    style={{
                      padding: "1.5rem 3.5rem",
                      borderRadius: "20px",
                      background: "linear-gradient(135deg, var(--primary), #dc2626)",
                      color: "white",
                      border: "none",
                      fontWeight: "800",
                      fontSize: "1.3rem",
                      cursor: "pointer",
                      boxShadow: "0 10px 30px rgba(220,38,38,0.5)",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 15px 40px rgba(220,38,38,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(220,38,38,0.5)";
                    }}
                  >
                    {t("apply")}
                  </button>
                </div>

                {message && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1.5rem",
                      borderRadius: "16px",
                      background: message.includes("invalide") ? "rgba(254,226,226,0.9)" : "rgba(220,252,231,0.9)",
                      color: message.includes("invalide") ? "#dc2626" : "#166534",
                      fontWeight: "700",
                      textAlign: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    {message.includes("invalide") ? "Error" : "Success"} {message}
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{ borderTop: "3px solid var(--border)", paddingTop: "3rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "3rem",
                  }}
                >
                  <span style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--text)" }}>
                    {t("total")} :
                  </span>
                  <div style={{ textAlign: "right" }}>
                    {discount > 0 ? (
                      <>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "var(--muted)",
                            fontSize: "1.8rem",
                            marginRight: "1.5rem",
                          }}
                        >
                          {totalPrice.toFixed(2)} €
                        </span>
                        <span
                          style={{
                            fontSize: "4rem",
                            fontWeight: "900",
                            background: "linear-gradient(135deg, var(--brand), #ef4444)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {discountedTotal.toFixed(2)} €
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: "4rem",
                          fontWeight: "900",
                          background: "linear-gradient(135deg, var(--brand), #ef4444)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {totalPrice.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>

                <Link to="/checkout">
                  <button
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, var(--primary), #dc2626)",
                      color: "white",
                      padding: "2rem",
                      borderRadius: "24px",
                      fontSize: "2rem",
                      fontWeight: "900",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 20px 50px rgba(220,38,38,0.5)",
                      transition: "all 0.4s ease",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginBottom: "2rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 30px 60px rgba(220,38,38,0.7)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 20px 50px rgba(220,38,38,0.5)";
                    }}
                  >
                    {t("checkout")}
                  </button>
                </Link>

                <Link to="/pizza">
                  <button
                    style={{
                      width: "100%",
                      background: "var(--card)",
                      color: "var(--brand)",
                      padding: "1.8rem",
                      borderRadius: "24px",
                      fontSize: "1.5rem",
                      fontWeight: "800",
                      border: "3px solid var(--brand)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--brand)";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.transform = "translateY(-5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--card)";
                      e.currentTarget.style.color = "var(--brand)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {t("custom_pizza")}
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}