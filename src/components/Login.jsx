import React, { useState } from "react";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";


const Login = ({ onSwitch, onLogin }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(form, null, 2));
    onLogin(); // <-- This triggers dashboard view in App.js
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <span className="uacs-logo">UACS</span>
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-logo">LOGO</div>
          <div className="login-input-container">
            <FaEnvelope className="login-input-icon" />
            <input
              className="login-input"
              type="email"
              name="email"
              placeholder="School Email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-input-container">
            <FaLock className="login-input-icon" />
            <input
              className="login-input"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
          <button className="login-btn" type="submit">
            Login
          </button>
          <div className="login-signup-link" style={{ marginTop: "1.2rem", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span
              onClick={onSwitch}
              style={{
                cursor: "pointer",
                color: "#e51d5e",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              Sign up
            </span>
          </div>
        </form>
      </div>
      <div className="login-accent" />
    </div>
  );
};

export default Login;