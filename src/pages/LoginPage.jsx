import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authApi";
import { FiMail, FiLock, FiHeart, FiEye, FiEyeOff } from "react-icons/fi";

import authBg from "../assets/auth_bg.png";

const LoginPage = () => {
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (user) {
      navigate(user.role === "student" ? "/student/dashboard" : "/counselor/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      navigate(data.role === "student" ? "/student/dashboard" : "/counselor/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Left Visual Side */}
      <div className="auth-visual-side">
        <img src={authBg} alt="Welcome Illustration" className="auth-illustration" />
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-modern-card">
          <h1 className="auth-modern-title">User Login</h1>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-modern-form">
            <div className="auth-modern-input-group">
              <FiMail className="auth-input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Username (Email)"
                className="auth-modern-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-modern-input-group">
              <FiLock className="auth-input-icon" />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="auth-modern-input"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="auth-pass-toggle"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <Link to="#" className="auth-modern-link" style={{ alignSelf: "center", fontSize: "0.85rem" }}>
              Forgot Password?
            </Link>

            <button type="submit" className="auth-modern-btn" disabled={loading}>
              {loading ? <span className="btn-spinner"></span> : "Login"}
            </button>
          </form>

          <div className="auth-modern-links">
            <Link to="/register" className="auth-modern-link">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
