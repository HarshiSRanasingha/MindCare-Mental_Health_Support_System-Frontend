import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiUser, FiMail, FiShield, FiCalendar,
  FiLogOut, FiHeart, FiActivity
} from "react-icons/fi";

const QUOTES = [
  { text: "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.", author: "Unknown" },
  { text: "It is not the mountain we conquer, but ourselves.", author: "Sir Edmund Hillary" },
  { text: "Deep breathing is our body's love language to our nervous system.", author: "Unknown" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "Sometimes the most productive thing you can do is relax.", author: "Mark Black" },
];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const joinedDate = (() => {
    // JWT issued-at is not stored, so show a friendly placeholder
    return "Member since joining MindCare";
  })();

  const avatarColors = user.role === "counselor"
    ? "linear-gradient(135deg, #9b8dca, #6b9e8e)"
    : "linear-gradient(135deg, #6b9e8e, #a8c5bb)";

  return (
    <div className="dashboard">
      <div className="profile-page">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar" style={{ background: avatarColors }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className={`role-badge role-${user.role}`} style={{ fontSize: "0.85rem", padding: "0.3rem 1rem" }}>
              {user.role === "student" ? "🎓 Student" : "🩺 Counselor"}
            </span>
          </div>

          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="profile-sub">Your MindCare profile</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="profile-grid">
          <div className="detail-card">
            <p className="detail-section-title">Account Details</p>
            <div className="detail-info-list">
              <div className="detail-info-row">
                <FiUser className="detail-icon" />
                <div>
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user.name}</span>
                </div>
              </div>
              <div className="detail-info-row">
                <FiMail className="detail-icon" />
                <div>
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user.email}</span>
                </div>
              </div>
              <div className="detail-info-row">
                <FiShield className="detail-icon" />
                <div>
                  <span className="detail-label">Account Role</span>
                  <span className="detail-value" style={{ textTransform: "capitalize" }}>{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <p className="detail-section-title">Quick Actions</p>
            <div className="profile-actions">
              <button
                className="profile-action-btn"
                onClick={() => navigate(user.role === "student" ? "/student/dashboard" : "/counselor/dashboard")}
              >
                <FiHeart />
                <span>Go to Dashboard</span>
              </button>
              {user.role === "student" && (
                <button
                  className="profile-action-btn"
                  onClick={() => navigate("/counselors")}
                >
                  <FiUser />
                  <span>View Counselors</span>
                </button>
              )}
              {user.role === "counselor" && (
                <button
                  className="profile-action-btn"
                  onClick={() => navigate("/users")}
                >
                  <FiUser />
                  <span>View All Students</span>
                </button>
              )}
              {user.role === "student" && (
                <button
                  className="profile-action-btn"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--lavender))", color: "#fff", border: "none", boxShadow: "0 4px 15px rgba(123,175,212,0.3)" }}
                  onClick={() => navigate("/therapy")}
                >
                  <FiActivity />
                  <span>Self Therapy Hub</span>
                </button>
              )}
              <button className="profile-action-btn profile-action-logout" onClick={handleLogout}>
                <FiLogOut />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Wellbeing Tip */}
          {user.role === "student" && (
            <div className="detail-card detail-card-full wellbeing-card">
              <p className="detail-section-title">🌿 Daily Wellbeing Tip</p>
              <p className="wellbeing-quote">
                "{quote.text}"
              </p>
              <p className="wellbeing-author">— {quote.author}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
