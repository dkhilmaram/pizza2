import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import ForgetPassword from "./components/ForgetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./components/Welcome";
import About from "./components/about";
import Contact from "./components/contact";
import Reviews from "./components/Reviews";
import Promotions from "./components/Promotions";
import Menu from "./components/menu";
import BoxMessages from "./components/BoxMessage";
import CustomPizza from "./components/customizePizza";
import SeeOrders from "./components/SeeOrders";
import PizzaPetes from "./components/PizzaPetes";
import CartPage from "./components/cart";
import AdminPromo from "./components/adminPromo";
import AdminMenu from "./components/adminmenu"; 
import OrderConfirmationPage from "./components/OrderConfirmationPage"; 
import OrderSuccessPage from "./components/OrderSuccessPage"; 
import TrackOrderPage from "./components/TrackOrderPage"; 
import Favorites from "./components/favorites";


export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "null") : null;

  return (
    <BrowserRouter>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="container-page" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              !token ? <Welcome darkMode={darkMode} /> :
              user?.role === "admin" ? <AdminDashboard darkMode={darkMode} /> :
              <Welcome darkMode={darkMode} />
            }
          />

          {/* Auth */}
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/register" element={<Register darkMode={darkMode} />} />
          <Route path="/forgot-password" element={<ForgetPassword darkMode={darkMode} />} />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
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

          {/* User orders */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                {user?.role === "admin" ? <SeeOrders darkMode={darkMode} /> : <CustomPizza darkMode={darkMode} />}
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

          {/* Checkout / Order Confirmation */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          {/* Order Success */}
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          {/* Track Order */}
          <Route
            path="/track-order"
            element={
              <ProtectedRoute>
                <TrackOrderPage darkMode={darkMode} />
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

          {/* Public pages */}
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