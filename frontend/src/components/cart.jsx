import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { t } = useTranslation();

  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [promotions, setPromotions] = useState({});

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/promotions");
        if (res.ok) {
          const data = await res.json();
          const promoList = Array.isArray(data) ? data : data.promotions || [];
          const promoMap = {};
          promoList.forEach(p => {
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

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const active = localStorage.getItem("activeCoupon");
    if (active && promotions[active.toUpperCase()] !== undefined) {
      const rate = promotions[active.toUpperCase()];
      setCouponCode(active);
      setDiscount(rate);
      setMessage(rate > 0
        ? t("coupon_applied_percent", { code: active, discount: (rate * 100).toFixed(0) })
        : t("coupon_applied_free_shipping")
      );
    }
  }, [promotions, t]);

  const updateQuantity = (id, delta) => {
    const updated = cart.map(item =>
      (item.id === id || item._id === id)
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id && item._id !== id);
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
      setMessage(rate > 0
        ? t("coupon_applied_percent", { code, discount: (rate * 100).toFixed(0) })
        : t("coupon_applied_free_shipping")
      );
      localStorage.setItem("activeCoupon", code);
    } else {
      setDiscount(0);
      setMessage(t("invalid_coupon"));
      localStorage.removeItem("activeCoupon");
    }
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );
  const discountedTotal = totalPrice * (1 - discount);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
      padding: "3rem 1.5rem",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "3.2rem",
          fontWeight: "900",
          color: "#dc2626",
          marginBottom: "1rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          letterSpacing: "-0.5px",
        }}>
          {t("your_cart")}
        </h1>

        <p style={{
          textAlign: "center",
          fontSize: "1.2rem",
          color: "#78350f",
          marginBottom: "3rem",
          fontWeight: "500",
        }}>
          {cart.length === 0
            ? t("cart_empty")
            : t("cart_items_count", { count: cart.length })}
        </p>

        {cart.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "4rem 2rem",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          }}>
            <div style={{ fontSize: "6rem", marginBottom: "1.5rem" }}>Pizza</div>
            <p style={{ fontSize: "1.3rem", color: "#6b7280", marginBottom: "2rem" }}>
              {t("cart_empty")}
            </p>
            <Link to="/menu">
              <button style={{
                background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                color: "white",
                padding: "1.2rem 2.5rem",
                borderRadius: "50px",
                fontSize: "1.2rem",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(220,38,38,0.3)",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(220,38,38,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(220,38,38,0.3)";
                }}
              >
                {t("view_menu")}
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Liste des articles */}
            <div style={{
              background: "white",
              borderRadius: "24px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}>
              {cart.map((item, index) => (
                <div
                  key={item.id || item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.5rem",
                    marginBottom: index < cart.length - 1 ? "1rem" : "0",
                    borderBottom: index < cart.length - 1 ? "2px solid #f3f4f6" : "none",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fef3c7"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#1f2937",
                      marginBottom: "0.5rem",
                    }}>
                      {item.name}
                    </h2>
                    {item.description && (
                      <p style={{ color: "#6b7280", fontSize: "1rem", marginBottom: "0.5rem" }}>
                        {item.description}
                      </p>
                    )}
                    <p style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#dc2626",
                    }}>
                      {parseFloat(item.price || 0).toFixed(2)} €
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* Quantité */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f9fafb",
                      borderRadius: "50px",
                      padding: "0.5rem",
                      border: "2px solid #e5e7eb",
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id || item._id, -1)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "none",
                          background: "white",
                          color: "#dc2626",
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#dc2626";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.color = "#dc2626";
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        margin: "0 1.5rem",
                        fontSize: "1.3rem",
                        fontWeight: "700",
                        color: "#1f2937",
                        minWidth: "30px",
                        textAlign: "center",
                      }}>
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id || item._id, 1)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "none",
                          background: "white",
                          color: "#dc2626",
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#dc2626";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.color = "#dc2626";
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Supprimer */}
                    <button
                      onClick={() => removeItem(item.id || item._id)}
                      style={{
                        padding: "0.8rem 1.5rem",
                        borderRadius: "12px",
                        border: "2px solid #fee2e2",
                        background: "white",
                        color: "#dc2626",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#dc2626";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "#dc2626";
                      }}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon + Total */}
            <div style={{
              background: "white",
              borderRadius: "24px",
              padding: "2rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}>
              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                  color: "#1f2937",
                }}>
                  {t("coupon_code")}
                </label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input
                    placeholder={t("enter_coupon")}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "1.2rem",
                      borderRadius: "14px",
                      border: "2px solid #e5e7eb",
                      fontSize: "1.1rem",
                      background: "#f9fafb",
                      color: "#1f2937",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#dc2626"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                  <button
                    onClick={applyCoupon}
                    style={{
                      padding: "1.2rem 2rem",
                      borderRadius: "14px",
                      border: "none",
                      background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(220,38,38,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(220,38,38,0.3)";
                    }}
                  >
                    {t("apply")}
                  </button>
                </div>

                {message && (
                  <p style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    borderRadius: "12px",
                    background: message.includes("invalide") || message.includes("Invalid") ? "#fee2e2" : "#dcfce7",
                    color: message.includes("invalide") || message.includes("Invalid") ? "#dc2626" : "#16a34a",
                    fontWeight: "600",
                  }}>
                    {message.includes("invalide") || message.includes("Invalid") ? "❌" : "✅"} {message}
                  </p>
                )}
              </div>

              {/* Total */}
              <div style={{ borderTop: "2px solid #f3f4f6", paddingTop: "2rem" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937" }}>
                    {t("total")} :
                  </span>
                  <div>
                    {discount > 0 ? (
                      <div style={{ textAlign: "right" }}>
                        <span style={{
                          textDecoration: "line-through",
                          color: "#9ca3af",
                          fontSize: "1.3rem",
                          marginRight: "1rem",
                        }}>
                          {totalPrice.toFixed(2)} €
                        </span>
                        <span style={{
                          fontSize: "2.5rem",
                          fontWeight: "900",
                          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>
                          {discountedTotal.toFixed(2)} €
                        </span>
                      </div>
                    ) : (
                      <span style={{
                        fontSize: "2.5rem",
                        fontWeight: "900",
                        background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>
                        {totalPrice.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>

                <Link to="/checkout">
                  <button
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                      color: "white",
                      padding: "1.5rem",
                      borderRadius: "16px",
                      fontSize: "1.3rem",
                      fontWeight: "800",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 10px 25px rgba(220,38,38,0.4)",
                      transition: "all 0.3s ease",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "1rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 15px 35px rgba(220,38,38,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(220,38,38,0.4)";
                    }}
                  >
                    {t("checkout")}
                  </button>
                </Link>
                

                <Link to="/pizza">
                  <button style={{
                    width: "100%",
                    background: "white",
                    color: "#dc2626",
                    padding: "1.2rem",
                    borderRadius: "16px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    border: "2px solid #dc2626",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(220,38,38,0.1)",
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#dc2626";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(220,38,38,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#dc2626";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(220,38,38,0.1)";
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
