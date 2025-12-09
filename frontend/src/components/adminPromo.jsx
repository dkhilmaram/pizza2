// src/admin/AdminPromotionsPage.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AdminPromotionsPage() {
  const { t, i18n } = useTranslation();

  const [promotions, setPromotions] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    expirationDate: "",
    code: "",
    price: "",
    discount: 0,
    imageUrl: "",
  });

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/promotions";

  // ---------------- Fetch promotions ----------------
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPromotions(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Handle form change ----------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ---------------- Handle submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      discount: Number(form.discount) / 100,
      price: Number(form.price),
      name: { en: form.name },
      description: { en: form.description },
    };

    try {
      let res, data;

      if (editing) {
        res = await fetch(`${API_URL}/${editing}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        data = await res.json();
        setPromotions(promotions.map((p) => (p._id === data._id ? data : p)));
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });

        data = await res.json();
        setPromotions([...promotions, data]);
      }

      // Reset form
      setForm({
        name: "",
        description: "",
        expirationDate: "",
        code: "",
        price: "",
        discount: 0,
        imageUrl: "",
      });

      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Edit ----------------
  const handleEdit = (promo) => {
    setEditing(promo._id);

    setForm({
      name: promo.name.en,
      description: promo.description.en,
      expirationDate: promo.expirationDate.split("T")[0],
      code: promo.code,
      price: promo.price,
      discount: promo.discount * 100,
      imageUrl: promo.imageUrl,
    });
  };

  // ---------------- Delete ----------------
  const handleDelete = async (id) => {
    if (!window.confirm(t("buttons.delete") + "?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setPromotions(promotions.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ========================================================
  // ========================== UI ==========================
  // ========================================================
  return (
    <div
      className="container-page"
      style={{
        padding: "2rem",
        direction: i18n.language === "ar" ? "rtl" : "ltr",
        textAlign: i18n.language === "ar" ? "right" : "left",
      }}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          color: "var(--brand)",
          textAlign: "center",
        }}
      >
        {t("admin.managePromotions")}
      </h1>

      {/* ---------------- FORM + PREVIEW ---------------- */}
      <div
        className="card"
        style={{
          marginBottom: "2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* LEFT — FORM */}
        <div>
          <h2 style={{ marginBottom: "1rem" }}>
            {editing ? t("promo.editPromotion") : t("promo.addPromotion")}
          </h2>

          <input
            className="input"
            name="name"
            placeholder={t("promo.name")}
            value={form.name}
            onChange={handleFormChange}
            required
          />

          <input
            className="input"
            name="description"
            placeholder={t("promo.description")}
            value={form.description}
            onChange={handleFormChange}
            required
          />

          <input
            type="date"
            className="input"
            name="expirationDate"
            value={form.expirationDate}
            onChange={handleFormChange}
            required
          />

          <input
            className="input"
            name="code"
            placeholder={t("promo.code")}
            value={form.code}
            onChange={handleFormChange}
            required
          />

          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              type="number"
              className="input"
              name="price"
              placeholder={t("promo.price")}
              value={form.price}
              onChange={handleFormChange}
              required
            />

            <input
              type="number"
              className="input"
              name="discount"
              placeholder={t("promo.discount")}
              value={form.discount}
              onChange={handleFormChange}
              required
            />
          </div>

          <input
            className="input"
            name="imageUrl"
            placeholder={t("promo.imageUrl")}
            value={form.imageUrl}
            onChange={handleFormChange}
          />

          <button
            className="btn btn-primary"
            type="submit"
            onClick={handleSubmit}
            style={{ marginTop: "1rem" }}
          >
            {editing ? t("buttons.save") : t("buttons.add")}
          </button>
        </div>

        {/* RIGHT — PREVIEW */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: "1rem" }}>{t("promo.preview")}</h3>

          {form.imageUrl ? (
            <img
              src={form.imageUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "0.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "250px",
                border: "2px dashed #ccc",
                borderRadius: "0.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#777",
              }}
            >
              {t("promo.noImage")}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- GRID OF PROMOTIONS ---------------- */}
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {promotions.map((p) => (
          <div key={p._id} className="card">
            <img
              src={p.imageUrl}
              alt={p.name?.en || p.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "1rem" }}>
              <h3 style={{ color: "var(--primary)" }}>{p.name?.en || p.name}</h3>
              <p>{p.description?.en || p.description}</p>

              <strong>
                {t("labels.price")}: {p.price} DT
              </strong>
              <br />
              <strong>
                {t("labels.discount")}: {p.discount * 100}%
              </strong>
              <br />
              <strong>
                {t("labels.expires")}: {new Date(p.expirationDate).toLocaleDateString()}
              </strong>
              <br />
              <strong>
                {t("labels.code")}: {p.code}
              </strong>

              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: i18n.language === "ar" ? "flex-end" : "flex-start",
                }}
              >
                <button className="btn btn-primary" onClick={() => handleEdit(p)}>
                  {t("buttons.edit")}
                </button>
                <button className="btn btn-muted" onClick={() => handleDelete(p._id)}>
                  {t("buttons.delete")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
