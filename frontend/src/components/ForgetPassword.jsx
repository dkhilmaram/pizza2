import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: send code, Step 2: reset password
  const [msg, setMsg] = useState("");

  const sendCode = async () => {
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setStep(2);
      setMsg(res.data.message || "Reset code sent! Check your email.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending code");
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
      setMsg(res.data.message || "Password reset successful!");
      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="container-page" style={{ paddingTop: 40 }}>
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Password Reset</h2>
        {msg && (
          <div style={{ background: "#ffe5e9", color: "#9f1239", padding: "10px", borderRadius: 12 }}>
            {msg}
          </div>
        )}

        {step === 1 && (
          <>
            <input
              className="input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary" onClick={sendCode}>
              Send Reset Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="input"
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="btn btn-primary" onClick={resetPass}>
              Reset Password
            </button>
          </>
        )}

        <p style={{ marginTop: 12 }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
