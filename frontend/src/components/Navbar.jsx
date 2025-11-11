// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle = {
    color: "#dc2626", // red for light mode
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
          {user?.role !== "admin" && <NavLink to="/" style={linkStyle}>Accueil</NavLink>}
          {!user && <NavLink to="/login" style={linkStyle}>Connexion</NavLink>}
          {!user && <NavLink to="/register" style={linkStyle}>Inscription</NavLink>}
          {user && <NavLink to="/profile" style={linkStyle}>Profil</NavLink>}
          {user?.role === "admin" && <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <DarkModeToggle />
          {user ? (
            <button 
              className="btn btn-muted" 
              onClick={logout} 
              style={{ color: "#dc2626", borderColor: "#dc2626", background: "#f9fafb" }}
            >
              Déconnexion
            </button>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary" 
              style={{ background: "#dc2626", color: "#fff" }}
            >
              Commander
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
