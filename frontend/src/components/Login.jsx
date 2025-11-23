import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await login(form); // Send email and password only
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/profile"); // Redirect to the profile page
    } catch (e) {
      setErr(e?.response?.data?.message || t("login_failed"));
    }
  };

  return (
    <div className="container-page" style={{ paddingTop: 40 }}>
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2 style={{ margin: "0 0 6px 0", fontWeight: 800 }}>{t("login")}</h2>
        <p className="helper" style={{ marginBottom: 16 }}>{t("access_account")}</p>
        {err && (
          <div style={{ background: '#ffe5e9', color: '#9f1239', padding: '10px 12px', borderRadius: 12, marginBottom: 10 }}>
            {err}
          </div>
        )}
        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            type="email"
            placeholder={t("email_address")}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder={t("password")}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn btn-primary" type="submit">{t("login")}</button>
        </form>

        <p className="helper" style={{ marginTop: 12 }}>
          <Link to="/forgot-password">{t("forgot_password")}</Link>
        </p>

        <p className="helper" style={{ marginTop: 12 }}>
          {t("dont_have_account")}? <Link to="/register">{t("create_account")}</Link>
        </p>
      </div>
    </div>
  );
}
