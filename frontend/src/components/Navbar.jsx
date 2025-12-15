import { Link, NavLink, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import LanguageSwitcher from "./langageswitcher";
import { useTranslation } from "react-i18next";

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

  const avatarStyle = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #dc2626",
    cursor: "pointer",
  };

  const logoutButtonStyle = {
    width: 36,
    height: 36,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconStyle = {
    width: 28,
    height: 28,
    cursor: "pointer",
    marginRight: "8px",
  };

  return (
    <header className="header" style={{ background: "#f9fafb", color: "#dc2626" }}>
      <div
        className="inner container-page"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo + Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "22px" }}>🍕</span>

          <Link to="/" className="brand-link" style={linkStyle}>
            {t("brand")}
          </Link>

          {user && (
            <Link to="/profile">
              <img
                src={user.avatar || user.image || "https://via.placeholder.com/44"}
                alt={t("profile")}
                style={avatarStyle}
              />
            </Link>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {!user || user.role !== "admin" ? (
            <NavLink to="/" style={linkStyle}>{t("home")}</NavLink>
          ) : null}

          {!user && (
            <>
              <NavLink to="/login" style={linkStyle}>{t("login")}</NavLink>
              <NavLink to="/register" style={linkStyle}>{t("register")}</NavLink>
            </>
          )}

          {/* USER LINKS */}
          {user && user.role !== "admin" && (
            <>
              <NavLink to="/orders" style={linkStyle}>{t("orders")}</NavLink>
              <NavLink to="/contact" style={linkStyle}>{t("contact")}</NavLink>
              <NavLink to="/about" style={linkStyle}>{t("about")}</NavLink>
            </>
          )}

          {/* 🔥 ADMIN LINKS */}
          {user && user.role === "admin" && (
            <>
              <NavLink to="/dashboardt" style={linkStyle}>
                {t("dashboard")}
              </NavLink>

              <NavLink to="/userdashboard" style={linkStyle}>
                {t("userdashboard")}
              </NavLink>

              <NavLink to="/orderdashboard" style={linkStyle}>
                {t("orderdashboard")}
              </NavLink>

              <NavLink to="/boxmessages" style={linkStyle}>
                {t("box_messages")}
              </NavLink>

              <NavLink to="/rate" style={linkStyle}>
                {t("rate")}
              </NavLink>
            </>
          )}
        </nav>

        {/* Right-side actions */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <DarkModeToggle />

          {/* USER ICONS */}
          {user && user.role !== "admin" && (
            <>
              <Link to="/cart">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
                  alt={t("cart")}
                  style={iconStyle}
                />
              </Link>

              <Link to="/track-order">
                <img
                  src="https://tse1.mm.bing.net/th/id/OIP.OBIgGWiwQgbwu7_2FZZY7QHaHa"
                  alt={t("trackorder")}
                  style={iconStyle}
                />
              </Link>
            </>
          )}

          {/* ADMIN ICONS */}
          {user && user.role === "admin" && (
            <>
              <Link to="/adminpromos">
                <img
                  src="https://tse3.mm.bing.net/th/id/OIP._YAayfvyzHi9OgQ70JWJBgHaHa"
                  alt={t("promotions")}
                  style={iconStyle}
                />
              </Link>

              <Link to="/adminmenu">
                <img
                  src="https://www.creativefabrica.com/wp-content/uploads/2023/05/10/Pizza-menu-logo-Decorative-color-design-Graphics-69339231-1-1-580x387.png"
                  alt={t("menu")}
                  style={iconStyle}
                />
              </Link>
            </>
          )}

          {/* Logout */}
          {user && (
            <button onClick={logout} style={logoutButtonStyle}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
                alt={t("logout")}
                style={{ width: 20, height: 20 }}
              />
            </button>
          )}

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
