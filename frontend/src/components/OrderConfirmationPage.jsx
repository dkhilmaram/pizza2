import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OrderConfirmationPage({ darkMode }) {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // 🎨 Theme dynamic
  const theme = {
    bg: darkMode
      ? "linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)"
      : "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
    cardBg: darkMode ? "#1f2937" : "white",
    text: darkMode ? "#f9fafb" : "#1f2937",
    textMuted: darkMode ? "#9ca3af" : "#6b7280",
    border: darkMode ? "#374151" : "#e5e7eb",
    inputBg: darkMode ? "#111827" : "#f9fafb",
    shadow: darkMode ? "0 10px 40px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.08)",
    divider: darkMode ? "#374151" : "#f3f4f6",
  };

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryInstructions: '',
    paymentMethod: 'card',
    deliveryTime: 'asap',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeCoupon, setActiveCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Fetch active coupon from backend
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await axios.get('/api/cart/active-coupon');
        if (res.data && res.data.code) {
          setActiveCoupon(res.data.code);
          setDiscount(res.data.discount || 0);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du coupon :', err);
      }
    };
    fetchCoupon();
  }, []);

  const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  const total = subtotal * (1 - discount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Le nom complet est requis';
    if (!formData.phone.trim()) newErrors.phone = 'Le numéro de téléphone est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate sending the order
    setTimeout(() => {
      const order = {
        orderNumber: Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString(),
        items: cart,
        customerInfo: formData,
        subtotal,
        discount,
        total,
        coupon: activeCoupon,
        status: 'confirmed'
      };

      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      localStorage.removeItem('cart');

      navigate('/order-success', { state: { orderNumber: order.orderNumber } });
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div style={{ 
        minHeight: "100vh",
        background: theme.bg,
        padding: "3rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          background: theme.cardBg,
          borderRadius: "24px",
          padding: "4rem 2rem",
          textAlign: "center",
          boxShadow: theme.shadow,
          maxWidth: "500px",
        }}>
          <div style={{ fontSize: "6rem", marginBottom: "1.5rem" }}>🍕</div>
          <h2 style={{ fontSize: "2rem", color: theme.text, marginBottom: "1rem" }}>Panier vide</h2>
          <p style={{ fontSize: "1.2rem", color: theme.textMuted, marginBottom: "2rem" }}>
            Votre panier est vide. Ajoutez des articles pour continuer.
          </p>
          <Link to="/menu">
            <button style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
              color: "white",
              padding: "1.2rem 2.5rem",
              borderRadius: "50px",
              fontSize: "1.2rem",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(220,38,38,0.3)",
              transition: "all 0.3s ease",
            }}>
              🍕 Voir le Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ... Keep the rest of your form and order summary as-is, just replace any reference to localStorage coupon with `activeCoupon` and `discount`

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "3.2rem", fontWeight: "900", color: "#dc2626", marginBottom: "1rem", textShadow: "2px 2px 4px rgba(0,0,0,0.1)", letterSpacing: "-0.5px" }}>
          🚚 Finaliser la commande
        </h1>
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: theme.textMuted, marginBottom: "3rem", fontWeight: "500" }}>
          Plus qu'une étape pour recevoir vos délicieuses pizzas !
        </p>

        <form onSubmit={handleSubmit}>
          {/* Your full form here with all inputs, errors, order summary */}
          {/* Replace any localStorage coupon logic with activeCoupon and discount */}
        </form>
      </div>
    </div>
  );
}
