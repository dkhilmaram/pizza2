import { useState } from "react"; 
import { register } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t, i18n } = useTranslation();
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

  const isArabic = i18n.language === "ar";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); 
    setMsg("");

    if (!form.name || !form.email || !form.password || !form.phone) {
      setErr(t("fill_required_fields"));
      return;
    }
    
    if (form.password.length < 8) {
      setErr(t("password_min_8"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErr(t("passwords_not_match"));
      return;
    }

    setLoading(true);
    try {
      await register(form);
      setMsg(t("account_created_success"));
      setTimeout(() => navigate("/login"), 1000);
    } catch (e) {
      setErr(e?.response?.data?.message || t("register_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-page"
      style={{
        paddingTop: 40,
        direction: isArabic ? "rtl" : "ltr",
        textAlign: isArabic ? "right" : "left",
      }}
    >
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h2 style={{ margin: "0 0 6px 0", fontWeight: 800 }}>{t("register")}</h2>
        <p className="helper" style={{ marginBottom: 16 }}>
          {t("create_account_desc")}
        </p>

        {msg && (
          <div
            style={{
              background: "#eaffea",
              color: "#166534",
              padding: "10px 12px",
              borderRadius: 12,
              marginBottom: 10,
              textAlign: isArabic ? "right" : "left",
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
              marginBottom: 10,
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {err}
          </div>
        )}

        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder={t("full_name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ textAlign: isArabic ? "right" : "left" }}
          />

          <input
            className="input"
            type="email"
            placeholder={t("email_address")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ textAlign: isArabic ? "right" : "left" }}
          />

          <input
            className="input"
            type="tel"
            placeholder={t("phone_number")}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={{ textAlign: isArabic ? "right" : "left" }}
          />

          <input
            className="input"
            placeholder={t("full_address")}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={{ textAlign: isArabic ? "right" : "left" }}
          />

          <input
            className="input"
            placeholder={t("city")}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            style={{ textAlign: isArabic ? "right" : "left" }}
          />

          <input
            className="input"
            type="password"
            placeholder={t("password")}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ textAlign: isArabic ? "right" : "left" }}
          />

          <input
            className="input"
            type="password"
            placeholder={t("confirm_password")}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            style={{ textAlign: isArabic ? "right" : "left" }}
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t("creating") : t("create_account")}
          </button>
        </form>

        <p className="helper" style={{ marginTop: 12 }}>
          {t("already_have_account")}? <Link to="/login">{t("login")}</Link>
        </p>
      </div>
    </div>
  );
}
