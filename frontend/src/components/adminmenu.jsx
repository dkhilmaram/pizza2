// src/admin/AdminMenuPage.jsx
import React, { useState, useEffect } from "react";

export default function AdminMenuPage() {
  const [pizzas, setPizzas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", ingredients: "", img: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/pizzas";

  useEffect(() => { fetchPizzas(); }, []);

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
      setError("Failed to fetch pizzas. Check backend URL or server.");
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchPizzas();
    } catch (err) {
      console.error(err);
      setError("Failed to delete pizza.");
    }
  };

  const handleSubmit = async () => {
    const numericPrice = parseFloat(form.price);
    if (!form.name || !form.ingredients || isNaN(numericPrice) || !form.img) {
      setError("All fields are required and price must be a number");
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
      setError("Failed to save pizza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page" style={{ padding: "2rem" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          color: "var(--brand)",
          textAlign: "center",
        }}
      >
        Admin — Manage Pizzas
      </h1>

      {/* FORM + PREVIEW */}
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
          <h2>{editing ? "Edit Pizza" : "Add Pizza"}</h2>
          {error && <p className="msg">{error}</p>}

          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="input"
            placeholder="Ingredients"
            value={form.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          />
          <input
            className="input"
            placeholder="Image URL"
            value={form.img}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
          />

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {editing ? "Save Changes" : "Add Pizza"}
          </button>
        </div>

        {/* RIGHT — PREVIEW */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: "1rem" }}>Preview</h3>

          {form.img ? (
            <img
              src={form.img}
              alt="Preview"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "0.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onError={(e) => {
                e.target.src = "";
              }}
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
              No image
            </div>
          )}
        </div>
      </div>

      {/* GRID OF PIZZAS */}
      {loading ? (
        <p>Loading pizzas...</p>
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
                <strong>{p.price.toFixed(2)} €</strong>

                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <button className="btn btn-primary" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button className="btn btn-muted" onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
