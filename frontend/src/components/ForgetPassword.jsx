import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const isArabic = i18n.language === "ar";

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const sendCode = async () => {
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setStep(2);
      setMsg(res.data.message || t("reset_code_sent"));
      setIsError(false);
    } catch (err) {
      setMsg(err.response?.data?.message || t("error_sending_code"));
      setIsError(true);
    }
  };

  const resetPass = async () => {
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      setMsg(res.data.message || t("password_reset_success"));
      setIsError(false);

      setTimeout(() => navigate("/login"), 2000);

      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || t("error_resetting_password"));
      setIsError(true);
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
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>{t("password_reset")}</h2>

        {msg && (
          <div
            style={{
              background: isError ? "#fee2e2" : "#d1fae5",
              color: isError ? "#b91c1c" : "#065f46",
              padding: "10px",
              borderRadius: 12,
              marginBottom: 12,
              transition: "opacity 0.5s",
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {msg}
          </div>
        )}

        {step === 1 && (
          <>
            <input
              className="input"
              type="email"
              placeholder={t("enter_email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ textAlign: isArabic ? "right" : "left" }}
            />
            <button className="btn btn-primary" onClick={sendCode}>
              {t("send_reset_code")}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="input"
              type="text"
              placeholder={t("enter_code")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ textAlign: isArabic ? "right" : "left" }}
            />

            <input
              className="input"
              type="password"
              placeholder={t("new_password")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ textAlign: isArabic ? "right" : "left" }}
            />

            <button className="btn btn-primary" onClick={resetPass}>
              {t("reset_password")}
            </button>
          </>
        )}

        <p style={{ marginTop: 12 }}>
          <Link to="/login">{t("back_to_login")}</Link>
        </p>
      </div>
    </div>
  );
}
