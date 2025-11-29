import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function CustomPizza() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // added

  const [size, setSize] = useState("medium");
  const [crust, setCrust] = useState("classic");
  const [sauce, setSauce] = useState("tomato");
  const [toppings, setToppings] = useState([]);
  const [pizzaName, setPizzaName] = useState("");

  const sizes = {
    small: t("sizes.small"),
    medium: t("sizes.medium"),
    large: t("sizes.large"),
  };

  const prices = { small: 9, medium: 13, large: 18 };

  const allToppings = [
    t("toppings.mozzarella"),
    t("toppings.cheddar"),
    t("toppings.peppers"),
    t("toppings.onions"),
    t("toppings.blackOlives"),
    t("toppings.mushrooms"),
    t("toppings.pepperoni"),
    t("toppings.grilledChicken"),
    t("toppings.mincedMeat"),
    t("toppings.pineapple"),
    t("toppings.corn"),
  ];

  const toggleTopping = (topping) => {
    setToppings(prev =>
      prev.includes(topping) ? prev.filter(t => t !== topping) : [...prev, topping]
    );
  };

  const totalPrice = prices[size] + toppings.length * 1.8;

  const textColor = "var(--text)";
  const mutedColor = "var(--muted)";
  const cardBg = "var(--card)";
  const containerBg = "var(--container)";
  const borderColor = "var(--border)";
  const previewBg = "var(--card)";

  const isRTL = i18n.language === "ar";

  // Add-to-cart function
  const addCustomPizzaToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      id: Date.now(),
      name: pizzaName || "Custom Pizza",
      price: totalPrice,
      details: `${sizes[size]}, ${crust}, ${sauce}, ${toppings.join(", ")}`,
      quantity: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart"); // redirect to cart
  };

  return (
    <div
      className="container"
      style={{
        padding: "3rem 0",
        background: containerBg,
        color: textColor,
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      <h1
        style={{
          fontSize: "2.8rem",
          textAlign: "center",
          marginBottom: "3rem",
          fontWeight: "800",
          color: "var(--primary)",
        }}
      >
        {t("createYourPizza")}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}
      >
        {/* LEFT SIDE (controls) */}
        <div>
          {/* Pizza Name */}
          <div style={{ marginBottom: "2rem" }}>
            <label className="block text-xl font-bold mb-2" style={{ color: textColor }}>
              {t("pizzaName")}
            </label>
            <input
              type="text"
              placeholder={t("writeYourPizzaName")}
              value={pizzaName}
              onChange={(e) => setPizzaName(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: `2px solid ${borderColor}`,
                fontSize: "1.1rem",
                background: cardBg,
                color: textColor,
              }}
            />
          </div>

          {/* Size Selection */}
          <div style={{ marginBottom: "2.5rem" }}>
            <label className="block text-xl font-bold mb-3" style={{ color: textColor }}>
              {t("size")}
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {Object.keys(sizes).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    padding: "1.5rem",
                    borderRadius: "16px",
                    border: size === s ? "3px solid var(--primary)" : `2px solid ${borderColor}`,
                    background: size === s ? "var(--highlight)" : cardBg,
                    color: textColor,
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                >
                  <div>{sizes[s]}</div>
                  <div style={{ fontSize: "0.9rem", color: mutedColor }}>
                    {t(`sizeShort.${s}`)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Crust Selection */}
          <div style={{ marginBottom: "2rem" }}>
            <label className="block text-xl font-bold mb-3" style={{ color: textColor }}>
              {t("crustType")}
            </label>
            <select
              value={crust}
              onChange={(e) => setCrust(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: `2px solid ${borderColor}`,
                fontSize: "1.1rem",
                background: cardBg,
                color: textColor,
              }}
            >
              <option value="classic">{t("crusts.classic")}</option>
              <option value="thin">{t("crusts.thin")}</option>
              <option value="stuffed">{t("crusts.stuffed")}</option>
            </select>
          </div>

          {/* Sauce Selection */}
          <div style={{ marginBottom: "2rem" }}>
            <label className="block text-xl font-bold mb-3" style={{ color: textColor }}>
              {t("sauce")}
            </label>
            <select
              value={sauce}
              onChange={(e) => setSauce(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: `2px solid ${borderColor}`,
                fontSize: "1.1rem",
                background: cardBg,
                color: textColor,
              }}
            >
              <option value="tomato">{t("sauces.tomato")}</option>
              <option value="bbq">{t("sauces.bbq")}</option>
              <option value="white">{t("sauces.white")}</option>
            </select>
          </div>

          {/* Toppings */}
          <div>
            <label className="block text-xl font-bold mb-3" style={{ color: textColor }}>
              {t("additionalToppings")}
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {allToppings.map((topping) => (
                <button
                  key={topping}
                  onClick={() => toggleTopping(topping)}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    border: `2px solid ${borderColor}`,
                    background: toppings.includes(topping) ? "var(--primary)" : cardBg,
                    color: toppings.includes(topping) ? "var(--text-inverse)" : textColor,
                    fontWeight: "600",
                    transition: "all 0.3s",
                  }}
                >
                  {topping}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE / Preview */}
        <div
          style={{
            background: previewBg,
            borderRadius: "24px",
            padding: "2.5rem",
            position: "sticky",
            top: "2rem",
            color: textColor,
          }}
        >
          <h2 style={{ fontSize: "2.2rem", fontWeight: "bold", marginBottom: "2rem", textAlign: "center" }}>
            {t("preview")}
          </h2>

          <div
            style={{
              background: cardBg,
              borderRadius: "20px",
              padding: "2.5rem",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
              textAlign: "center",
              color: textColor,
            }}
          >
            <div style={{ fontSize: "7rem", marginBottom: "1rem" }}>🍕</div>

            {pizzaName && (
              <h3 style={{ fontSize: "2rem", color: "var(--primary)", margin: "1rem 0", fontWeight: "bold" }}>
                "{pizzaName}"
              </h3>
            )}

            <p style={{ fontSize: "1.4rem", margin: "0.5rem 0" }}>{sizes[size]}</p>
            <p style={{ color: mutedColor }}>
              {t("crust")}:{" "}
              {crust === "thin"
                ? t("crusts.thin")
                : crust === "stuffed"
                ? t("crusts.stuffed")
                : t("crusts.classic")}
            </p>
            <p style={{ color: mutedColor }}>
              {t("sauce")}:{" "}
              {sauce === "tomato"
                ? t("sauces.tomato")
                : sauce === "bbq"
                ? t("sauces.bbq")
                : t("sauces.white")}
            </p>

            {toppings.length > 0 && (
              <p style={{ marginTop: "1.2rem", fontSize: "1.1rem", color: mutedColor, fontStyle: "italic" }}>
                + {toppings.join(" • ")}
              </p>
            )}
          </div>

          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--primary)", textAlign: "center", margin: "2.5rem 0" }}>
            {totalPrice.toFixed(2)} €
          </div>

          {/* Updated Add to Cart Button */}
          <button
            style={{
              width: "100%",
              background: "var(--primary)",
              color: "var(--text-inverse)",
              padding: "1.4rem",
              borderRadius: "16px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(220,38,38,0.3)",
              transition: "all 0.3s",
            }}
            onClick={addCustomPizzaToCart}
          >
            {t("addToCart")}
          </button>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link to="/menu" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "1.1rem" }}>
              {t("orChooseFromMenu")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
