import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function Contact({ darkMode }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError(t("fill_required_fields"));
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/boxmessages", form);
      if (res.data.success) {
        setMsg(t(res.data.msg));
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(t(res.data.error || "server_error"));
      }
    } catch (err) {
      setError(t(err.response?.data?.error || "server_error"));
    }
    setLoading(false);
  };

  // --- Styles (keeps old form layout) ---
  const inputBase = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
    color: "var(--text)",
    fontSize: 14,
    outline: "none",
    transition: "0.2s",
    marginBottom: 12,
  };

  const labelStyle = {
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
    color: "var(--text)",
    fontSize: 14,
  };

  const buttonStyle = {
    padding: "12px 20px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "var(--primary)",
    color: "#fff",
    fontWeight: 600,
    fontSize: 16,
    marginTop: 10,
    transition: "0.2s",
  };

  return (
    <div
      className="container-page"
      style={{
        paddingTop: 40,
        direction: isRTL ? "rtl" : "ltr",
        paddingLeft: 20,
        paddingRight: 20,
        color: "var(--text)",
      }}
    >
      <h2 style={{ color: "var(--primary)", marginBottom: 20 }}>{t("contact_us")}</h2>

      {msg && (
        <div
          style={{
            background: "#d1fae5",
            color: "#065f46",
            padding: "10px 12px",
            borderRadius: 12,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {msg}
        </div>
      )}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "10px 12px",
            borderRadius: 12,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: "1 1 400px",
            padding: 30,
            borderRadius: 12,
            background: "var(--card)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            display: "grid",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 180px" }}>
              <label style={labelStyle}>{t("name")}</label>
              <input
                name="name"
                style={inputBase}
                value={form.name}
                onChange={handleChange}
                placeholder={t("name")}
              />
            </div>

            <div style={{ flex: "1 1 180px" }}>
              <label style={labelStyle}>{t("email")}</label>
              <input
                name="email"
                type="email"
                style={inputBase}
                value={form.email}
                onChange={handleChange}
                placeholder={t("email")}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t("subject")}</label>
            <input
              name="subject"
              style={inputBase}
              value={form.subject}
              onChange={handleChange}
              placeholder={t("subject")}
            />
          </div>

          <div>
            <label style={labelStyle}>{t("message")}</label>
            <textarea
              name="message"
              style={{ ...inputBase, minHeight: 120 }}
              value={form.message}
              onChange={handleChange}
              placeholder={t("message")}
            />
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? t("sending") : t("send_message")}
          </button>
        </form>

        {/* Google Map */}
        <div
          style={{
            flex: "1 1 400px",
            borderRadius: 12,
            overflow: "hidden",
            minHeight: 400,
          }}
        >
          <iframe
            title="ISGB Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.585081204905!2d10.1773373!3d36.8208614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd35ab56f77281%3A0xa341ba2aac3e7135!2sISGB+%3A+Institut+Sup%C3%A9rieur+De+Gestion+De+Bizerte!5e0!3m2!1sen!2stn!4v1701499200000!5m2!1sen!2stn"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
