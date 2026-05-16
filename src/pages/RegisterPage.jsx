import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser, registerCounselor } from "../api/authApi";
import { FiUser, FiMail, FiLock, FiHeart, FiBriefcase, FiEye, FiEyeOff } from "react-icons/fi";

import authBg from "../assets/auth_bg.png";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") === "counselor" ? "counselor" : "student");
  const [form, setForm] = useState({ name: "", email: "", password: "", specialization: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    setLoading(true);
    try {
      role === "student"
        ? await registerUser({ name: form.name, email: form.email, password: form.password })
        : await registerCounselor({ name: form.name, email: form.email, password: form.password, specialization: form.specialization });
      
      navigate("/login", { 
        replace: true, 
        state: { message: "Registration successful! Please sign in with your credentials." } 
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Left Visual Side */}
      <div className="auth-visual-side">
        <img src={authBg} alt="Register Illustration" className="auth-illustration" />
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-modern-card">
          <h1 className="auth-modern-title">Create Account</h1>

          {/* Role Toggle */}
          <div className="auth-modern-toggle">
            <button
              type="button"
              className={`auth-toggle-btn ${role === "student" ? "active" : ""}`}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`auth-toggle-btn ${role === "counselor" ? "active" : ""}`}
              onClick={() => setRole("counselor")}
            >
              Counselor
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-modern-form">
            <div className="auth-modern-input-group">
              <FiUser className="auth-input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="auth-modern-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-modern-input-group">
              <FiMail className="auth-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="auth-modern-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-modern-input-group">
              <FiLock className="auth-input-icon" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Create Password"
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

            {role === "counselor" && (
              <div className="auth-modern-input-group">
                <FiBriefcase className="auth-input-icon" />
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization (e.g. Anxiety)"
                  className="auth-modern-input"
                  value={form.specialization}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button type="submit" className="auth-modern-btn" disabled={loading}>
              {loading ? <span className="btn-spinner"></span> : `Register as ${role === "student" ? "Student" : "Counselor"}`}
            </button>
          </form>

          <div className="auth-modern-links">
            <Link to="/login" className="auth-modern-link">Already have an account? Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
