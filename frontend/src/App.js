import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import ForgetPassword from "./components/ForgetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./components/Welcome";

export default function App() {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "null") : null;

  return (
    <BrowserRouter>
      <Navbar />
      <main className="container-page" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <Routes>
          {/* Home / Welcome */}
          <Route
            path="/"
            element={
              !token ? (
                <Welcome />
              ) : user.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Welcome />
              )
            }
          />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />  {/* <-- Add this */}

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Pizza orders placeholder */}
          <Route
            path="/pizza"
            element={
              <ProtectedRoute>
                <div style={{ textAlign: "center", marginTop: 50, fontSize: 22 }}>
                  🍕 Coming soon: Customize your pizza orders here!
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
