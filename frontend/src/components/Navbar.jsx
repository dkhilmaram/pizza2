import { Link, NavLink, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import LanguageSwitcher from "./langageswitcher";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

export default function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle = {
    color: "#dc2626",
    textDecoration: "none",
    fontWeight: 600,
  };

  return (
    <header className="header" style={{ background: "#f9fafb", color: "#dc2626" }}>
      <div className="inner container-page">
        {/* Logo */}
        <div className="brand">
          <span style={{ fontSize: "22px" }}>🍕</span>
          <Link to="/" className="brand-link" style={linkStyle}>
            Pizza Pete’s
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="nav">
          {user?.role !== "admin" && <NavLink to="/" style={linkStyle}>{t("home")}</NavLink>}
          {!user && <NavLink to="/login" style={linkStyle}>{t("login")}</NavLink>}
          {!user && <NavLink to="/register" style={linkStyle}>{t("register")}</NavLink>}
          {user && <NavLink to="/profile" style={linkStyle}>{t("profile")}</NavLink>}
          {user?.role === "admin" && <NavLink to="/dashboard" style={linkStyle}>{t("dashboard")}</NavLink>}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <DarkModeToggle />
          <LanguageSwitcher />
          {user ? (
            <button
              className="btn btn-muted"
              onClick={logout}
              style={{ color: "#dc2626", borderColor: "#dc2626", background: "#f9fafb" }}
            >
              {t("logout")}
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ background: "#dc2626", color: "#fff" }}
            >
              {t("order")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
