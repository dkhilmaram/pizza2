import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function OrderSuccessPage() {
  const location = useLocation();
  const { orderNumber } = location.state || {}; // الحصول على رقم الطلب

  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#16a34a" }}>
        🎉 Votre commande a été confirmée !
      </h1>
      <p style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
        Numéro de commande : <strong>{orderNumber}</strong>
      </p>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        Merci pour votre commande ! Vous recevrez bientôt une confirmation par email.
      </p>
      
      {/* إضافة زر للتوجيه إلى الصفحة الرئيسية أو قائمة الطعام */}
      <Link to="/menu">
        <button
          style={{
            background: "#dc2626", 
            color: "white", 
            padding: "1.2rem 2.5rem", 
            borderRadius: "50px", 
            fontSize: "1.2rem", 
            fontWeight: "700", 
            border: "none", 
            cursor: "pointer", 
            boxShadow: "0 8px 20px rgba(220,38,38,0.3)", 
            transition: "all 0.3s ease",
            marginTop: "2rem"
          }}
        >
          🍕 Retour au Menu
        </button>
      </Link>
    </div>
  );
}