import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

/* ================= CORE ================= */
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* ================= AUTH ================= */
import Login from "./components/Login";
import Register from "./components/Register";
import ForgetPassword from "./components/ForgetPassword";

/* ================= HOME & PUBLIC ================= */
import Welcome from "./components/Welcome";
import About from "./components/about";
import Contact from "./components/contact";
import Reviews from "./components/Reviews";
import Promotions from "./components/Promotions";
import Menu from "./components/menu";

/* ================= PROFILE ================= */
import Profile from "./components/Profile";

/* ================= ADMIN ================= */
import AdminDashboard from "./components/AdminDashboard";
import DashboardT from "./components/DashboardT"; // ✅ corrigé
import SeeOrders from "./components/SeeOrders";
import BoxMessages from "./components/BoxMessage";
import PizzaPetes from "./components/PizzaPetes";
import AdminPromo from "./components/adminPromo";
import AdminMenu from "./components/adminmenu";

/* ================= USER ================= */
import CustomPizza from "./components/customizePizza";
import CartPage from "./components/cart";
import Favorites from "./components/favorites";
import DashboardT from "./components/DashboardT"; 

/* ================= ORDERS ================= */
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import OrderSuccessPage from "./components/OrderSuccessPage";
import TrackOrderPage from "./components/TrackOrderPage";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "null") : null;

  return (
    <BrowserRouter>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="container-page" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <Routes>

          {/* ================= HOME ================= */}
          <Route
            path="/"
            element={
              !token ? (
                <Welcome darkMode={darkMode} />
              ) : user?.role === "admin" ? (
                <AdminDashboard darkMode={darkMode} />
              ) : (
                <Welcome darkMode={darkMode} />
              )
            }
          />

          {/* ================= AUTH ================= */}
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/register" element={<Register darkMode={darkMode} />} />
          <Route path="/forgot-password" element={<ForgetPassword darkMode={darkMode} />} />

          {/* ================= PROFILE ================= */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/dashboardT"
            element={
              <ProtectedRoute role="admin">
                <DashboardT darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orderdashboard"
            element={
              <ProtectedRoute role="admin">
                <SeeOrders darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/boxmessages"
            element={
              <ProtectedRoute role="admin">
                <BoxMessages darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rate"
            element={
              <ProtectedRoute role="admin">
                <PizzaPetes darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminpromos"
            element={
              <ProtectedRoute role="admin">
                <AdminPromo darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminmenu"
            element={
              <ProtectedRoute role="admin">
                <AdminMenu darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          {/* ================= USER ORDERS ================= */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                {user?.role === "admin" ? (
                  <SeeOrders darkMode={darkMode} />
                ) : (
                  <CustomPizza darkMode={darkMode} />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/pizza"
            element={
              <ProtectedRoute>
                <CustomPizza darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          {/* ================= CHECKOUT / ORDER ================= */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-order"
            element={
              <ProtectedRoute>
                <TrackOrderPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
           {/* Admin routes */}
          {/* ================= ADMIN ================= */}
          <Route
            path="/dashboardT"
            element={
              <ProtectedRoute role="admin">
                <DashboardT darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          {/* ================= PUBLIC PAGES ================= */}
          <Route path="/reviews" element={<Reviews darkMode={darkMode} />} />
          <Route path="/promotions" element={<Promotions darkMode={darkMode} />} />
          <Route path="/menu" element={<Menu darkMode={darkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}