import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/PromotionsPage.css";

const PromotionsPage = () => {
  const { t, i18n } = useTranslation();
  const [promotions, setPromotions] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showCopied, setShowCopied] = useState(false);

  // Fetch all promotions from backend
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/promotions");
        const data = await res.json();

        setPromotions(
          Array.isArray(data)
            ? data
            : Array.isArray(data.promotions)
            ? data.promotions
            : []
        );
      } catch (err) {
        console.error("Failed to fetch promotions:", err);
        setPromotions([]);
      }
    };

    fetchPromos();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(i18n.language, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const copyCode = (code, discount) => {
    navigator.clipboard.writeText(code);
    localStorage.setItem(
      "activeCoupon",
      JSON.stringify({ code, discount }) // store both
    );
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 3000);
  };

  // ⭐ FIXED WITH PRICE
  const addToCart = (promo) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item._id === promo._id);

    const finalPrice = promo.price - promo.price * promo.discount; // apply discount

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        _id: promo._id,
        name: promo.name?.en || promo.name,
        description: promo.description?.en || promo.description,
        price: promo.price, // ⭐ ORIGINAL PRICE
        discount: promo.discount, // ⭐ DECIMAL (0.10)
        finalPrice, // ⭐ PRICE AFTER DISCOUNT
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <>
      <section
        className="promotions-page"
        style={{
          direction: i18n.language === "ar" ? "rtl" : "ltr",
          textAlign: i18n.language === "ar" ? "right" : "left",
        }}
      >
        <div className="container">
          <h1 className="page-title">{t("promotionsTitle")}</h1>

          <div className="promotions-grid">
            {Array.isArray(promotions) && promotions.length > 0 ? (
              promotions.map((promo) => (
                <article
                  key={promo._id}
                  className={`promotion-card ${
                    selectedPromo?._id === promo._id ? "expanded" : ""
                  } ${i18n.language === "ar" ? "rtl" : ""}`}
                  onClick={() => setSelectedPromo(promo)}
                >
                  <div className="card-inner">
                    <img
                      src={promo.imageUrl}
                      alt={promo.name?.en || promo.name}
                      className="card-img"
                    />

                    <div className="card-content">
                      <h3>{promo.name?.en || promo.name}</h3>
                      <p>{promo.description?.en || promo.description}</p>

                      {/* ⭐ NEW: PRICE */}
                      <p className="price">
                        {t("price")}: {promo.price} DT
                      </p>

                      {/* ⭐ NEW: DISCOUNT */}
                      <p className="discount">
                        {t("discount")}: {promo.discount * 100}%
                      </p>

                      <p className="expiry">
                        {t("validUntil", {
                          date: formatDate(promo.expirationDate),
                        })}
                      </p>

                      {selectedPromo?._id === promo._id && (
                        <div className="expanded-content">
                          <div className="code-promo">
                            <span>{t("yourPromoCode")}</span>
                            <div className="code">{promo.code}</div>

                            <button
                              className="btn-offre"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyCode(promo.code, promo.discount); // ✅ pass discount here
                                addToCart(promo);
                              }}
                            >
                              {t("takeOffer")}
                            </button>
                          </div>

                          <p className="validite">
                            {t("validUntil", {
                              date: formatDate(promo.expirationDate),
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p>{t("noPromotionsAvailable")}</p>
            )}
          </div>
        </div>
      </section>

      {selectedPromo && (
        <div className="backdrop" onClick={() => setSelectedPromo(null)} />
      )}

      {showCopied && (
        <div className="copied-toast">
          <div className="toast-content">
            <span>{t("codeCopied")}</span>
            <div className="pizza-slice">🍕</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionsPage;
