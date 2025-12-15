// src/admin/AdminMenuPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../components/ConfirmModal"; // make sure path is correct

export default function AdminMenuPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [pizzas, setPizzas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", ingredients: "", img: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPizzaId, setSelectedPizzaId] = useState(null);

  const API_URL = "http://localhost:5000/api/pizzas";

  // NEW: ref for the hero section
  const heroRef = useRef(null);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPizzas(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("error.fetchPizzas"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pizza) => {
    setEditing(pizza._id);
    setForm({
      name: pizza.name,
      price: pizza.price.toString(),
      ingredients: pizza.ingredients,
      img: pizza.img,
    });

    // Scroll hero section into view smoothly
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDelete = (id) => {
    setSelectedPizzaId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${selectedPizzaId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPizzas(pizzas.filter((p) => p._id !== selectedPizzaId));
    } catch (err) {
      console.error(err);
      setError(t("error.deletePizza"));
    } finally {
      setShowConfirm(false);
      setSelectedPizzaId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedPizzaId(null);
  };

  const handleSubmit = async () => {
    const numericPrice = parseFloat(form.price);
    if (!form.name || !form.ingredients || isNaN(numericPrice) || !form.img) {
      setError(t("error.invalidForm"));
      return;
    }

    try {
      setLoading(true);
      const url = editing ? `${API_URL}/${editing}` : API_URL;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: numericPrice }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setForm({ name: "", price: "", ingredients: "", img: "" });
      setEditing(null);
      fetchPizzas();
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("error.savePizza"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-page"
      style={{
        padding: "2rem",
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          color: "var(--brand)",
          textAlign: "center",
        }}
      >
        {t("admin.managePizzas")}
      </h1>

      {/* FORM + PREVIEW */}
      <div
        ref={heroRef} // NEW: attach ref here
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
          <h2>{editing ? t("editPizza") : t("addPizza")}</h2>
          {error && <p className="msg">{error}</p>}

          <input
            className="input"
            placeholder={t("Name")}
            value={form.name}
            style={{ textAlign: isRTL ? "right" : "left" }}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            placeholder={t("Price")}
            value={form.price}
            style={{ textAlign: isRTL ? "right" : "left" }}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="input"
            placeholder={t("Ingredients")}
            value={form.ingredients}
            style={{ textAlign: isRTL ? "right" : "left" }}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          />
          <input
            className="input"
            placeholder={t("Image URL")}
            value={form.img}
            style={{ textAlign: isRTL ? "right" : "left" }}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
          />

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {editing ? t("saveChanges") : t("addPizza")}
          </button>
        </div>

        {/* RIGHT — PREVIEW */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: "1rem" }}>{t("preview")}</h3>

          {form.img ? (
            <img
              src={form.img}
              alt={t("preview")}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "0.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onError={(e) => (e.target.src = "")}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #ccc",
                borderRadius: "0.5rem",
                color: "#777",
              }}
            >
              {t("noImage")}
            </div>
          )}
        </div>
      </div>

      {/* GRID OF PIZZAS */}
      {loading ? (
        <p>{t("loading.pizzas")}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {pizzas.map((p) => (
            <div key={p._id} className="card">
              <img
                src={p.img}
                alt={p.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <div style={{ padding: "1rem" }}>
                <h3 style={{ color: "var(--primary)" }}>{p.name}</h3>
                <p>{p.ingredients}</p>
                <strong>{parseFloat(p.price).toFixed(2)} €</strong>

                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                    flexDirection: isRTL ? "row-reverse" : "row",
                  }}
                >
                  <button className="btn btn-primary" onClick={() => handleEdit(p)}>
                    {t("edit")}
                  </button>
                  <button className="btn btn-muted" onClick={() => handleDelete(p._id)}>
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <ConfirmModal
          message={t("confirmDeletePizza")}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
