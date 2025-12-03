import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/PromotionsPage.css";

const PromotionsPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const navigate = useNavigate();

  const promotions = [
    {
      id: 1,
      nameKey: "promo1.name",
      descriptionKey: "promo1.description",
      expirationDate: "2025-12-31",
      code: "BIENVENUE10",
      price: 10,
      imageUrl:
        "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=600&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      nameKey: "promo2.name",
      descriptionKey: "promo2.description",
      expirationDate: "2025-12-15",
      code: "2POUR1",
      price: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      nameKey: "promo3.name",
      descriptionKey: "promo3.description",
      expirationDate: "2025-11-30",
      code: "GROUPE50",
      price: 30,
      imageUrl:
        "https://cdn.thefork.com/tf-lab/image/upload/w_640,c_fill,q_auto,f_auto/restaurant/3c248400-03c3-4fdb-be69-0472041482c3/ba26cb2c-ac6d-44f6-88a5-b0814cf8403c.jpg",
    },
    {
      id: 4,
      nameKey: "promo4.name",
      descriptionKey: "promo4.description",
      expirationDate: "2026-01-31",
      code: "GRATUIT",
      price: 0,
      imageUrl:
        "https://cdn.pixabay.com/photo/2020/06/08/16/49/pizza-5275191_640.jpg",
    },
    {
      id: 5,
      nameKey: "promo5.name",
      descriptionKey: "promo5.description",
      expirationDate: "2025-12-25",
      code: "MARGERITA",
      price: 15,
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    },
    {
      id: 6,
      nameKey: "promo6.name",
      descriptionKey: "promo6.description",
      expirationDate: "2025-12-31",
      code: "LIVRAISON0",
      price: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop",
    },
  ];

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(i18n.language, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    localStorage.setItem("activeCoupon", code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 3000);
  };

  // FIXED VERSION — clean id, clean push to cart
  const takeOffer = (promo, e) => {
    e.stopPropagation();
    setSelectedPromo(promo);
    copyCode(promo.code);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === promo.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: promo.id, // KEEP THIS — CartPage supports id or _id
        name: t(promo.nameKey),
        description: t(promo.descriptionKey),
        price: promo.price,
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
            {promotions.map((promo) => (
              <article
                key={promo.id}
                className={`promotion-card ${
                  selectedPromo?.id === promo.id ? "expanded" : ""
                } ${i18n.language === "ar" ? "rtl" : ""}`}
                onClick={() => setSelectedPromo(promo)}
              >
                <div className="card-inner">
                  <img
                    src={promo.imageUrl}
                    alt={t(promo.nameKey)}
                    className="card-img"
                  />

                  <div className="card-content">
                    <h3>{t(promo.nameKey)}</h3>
                    <p>{t(promo.descriptionKey)}</p>
                    <p className="expiry">
                      {t("validUntil", {
                        date: formatDate(promo.expirationDate),
                      })}
                    </p>

                    <button
                      className="btn-offre"
                      onClick={(e) => takeOffer(promo, e)}
                    >
                      {t("takeOffer")}
                    </button>

                    {selectedPromo?.id === promo.id && (
                      <div className="expanded-content">
                        <div className="code-promo">
                          <span>{t("yourPromoCode")}</span>
                          <div className="code">{promo.code}</div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyCode(promo.code);
                            }}
                            className="copy-btn"
                          >
                            {t("copyCode")}
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
            ))}
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
