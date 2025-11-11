import { useState } from "react";
import { register } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); 
    setMsg("");

    // Simple validation
    if (!form.name || !form.email || !form.password || !form.phone) {
      setErr("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErr("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      setMsg("Compte créé avec succès 🎉");
      setTimeout(() => navigate("/login"), 1000);
    } catch (e) {
      setErr(e?.response?.data?.message || "Échec de l’inscription ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page" style={{ paddingTop: 40 }}>
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h2 style={{ margin: "0 0 6px 0", fontWeight: 800 }}>Inscription</h2>
        <p className="helper" style={{ marginBottom: 16 }}>
          Créez votre compte pour accéder à nos services
        </p>

        {msg && (
          <div
            style={{
              background: "#eaffea",
              color: "#166534",
              padding: "10px 12px",
              borderRadius: 12,
              marginBottom: 10
            }}
          >
            {msg}
          </div>
        )}
        {err && (
          <div
            style={{
              background: "#ffe5e9",
              color: "#9f1239",
              padding: "10px 12px",
              borderRadius: 12,
              marginBottom: 10
            }}
          >
            {err}
          </div>
        )}

        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Nom complet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            type="email"
            placeholder="Adresse e-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            type="tel"
            placeholder="Numéro de téléphone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="input"
            placeholder="Adresse complète"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            className="input"
            placeholder="Ville"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </form>

        <p className="helper" style={{ marginTop: 12 }}>
          Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
