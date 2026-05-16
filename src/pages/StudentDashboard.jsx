import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchRequests, createRequest } from "../api/requestApi";
import { fetchUsers, fetchCounselors } from "../api/counselorApi";
import RequestCard from "../components/RequestCard";
import Loader from "../components/Loader";
import { FiPlus, FiX, FiSend, FiInbox, FiTrendingUp, FiEdit3, FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";

const QUOTES = [
  { text: "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.", author: "Unknown" },
  { text: "It is not the mountain we conquer, but ourselves.", author: "Sir Edmund Hillary" },
  { text: "Deep breathing is our body's love language to our nervous system.", author: "Unknown" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "Sometimes the most productive thing you can do is relax.", author: "Mark Black" },
];

const MOODS = [
  { icon: "🤩", label: "Great", cls: "mood-great" },
  { icon: "😊", label: "Good", cls: "mood-good" },
  { icon: "😐", label: "Okay", cls: "mood-okay" },
  { icon: "😔", label: "Sad", cls: "mood-sad" },
  { icon: "😫", label: "Awful", cls: "mood-awful" },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [issue, setIssue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all");
  const [mood, setMood] = useState(localStorage.getItem(`mood_${user._id}`) || null);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const handleMoodSelect = (m) => {
    setMood(m);
    localStorage.setItem(`mood_${user._id}`, m);
  };

  const [studentsCount, setStudentsCount] = useState(0);
  const [counselorsCount, setCounselorsCount] = useState(0);

  const loadRequests = async () => {
    setLoading(true);
    try {
      // Fetch from backend to get live updates
      const [reqRes, usersRes, counsRes] = await Promise.all([
        fetchRequests(),
        fetchUsers().catch(() => ({ data: [] })),
        fetchCounselors().catch(() => ({ data: [] }))
      ]);
      setRequests(reqRes.data);
      setStudentsCount(usersRes.data.length);
      setCounselorsCount(counsRes.data.length);
      
      // Update localStorage
      localStorage.setItem(`requests_${user._id}`, JSON.stringify(reqRes.data));
    } catch (err) {
      console.error("Failed to fetch live data:", err);
      const stored = JSON.parse(localStorage.getItem(`requests_${user._id}`) || "[]");
      setRequests(stored);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await createRequest({ issue });
      const stored = JSON.parse(localStorage.getItem(`requests_${user._id}`) || "[]");
      const updated = [data, ...stored];
      localStorage.setItem(`requests_${user._id}`, JSON.stringify(updated));
      setRequests(updated);
      setIssue("");
      setSuccess("Your request has been submitted successfully!");
      setTimeout(() => {
        setSuccess("");
        setShowModal(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    resolved: requests.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Dashboard</h1>
          <p>Welcome back, <strong>{user.name}</strong> 👋</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> New Request
        </button>
      </div>

      {/* Mood & Quote */}
      <div className="profile-grid" style={{ marginBottom: "2rem" }}>
        <div className="panel" style={{ margin: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <p className="detail-section-title" style={{ margin: 0 }}>How are you feeling today?</p>
            <Link to="/mood-tracker" className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", height: "auto" }}>
              <FiTrendingUp /> Track History
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => handleMoodSelect(m.label)}
                style={{
                  background: mood === m.label ? "var(--bg3)" : "none",
                  border: mood === m.label ? "1.5px solid var(--primary)" : "1.5px solid transparent",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.5rem",
                  fontSize: "1.5rem",
                  flex: 1,
                  transition: "all var(--ease)",
                  cursor: "pointer"
                }}
                title={m.label}
              >
                {m.icon}
                <p style={{ fontSize: "0.6rem", marginTop: "0.3rem", fontWeight: 700, color: "var(--text2)" }}>{m.label}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="panel wellbeing-card" style={{ margin: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p className="wellbeing-quote" style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>"{quote.text}"</p>
          <p className="wellbeing-author">— {quote.author}</p>
        </div>
        <div className="panel" style={{ margin: 0, display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--primary-light)", color: "white" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}><FiEdit3 /> Daily Journal</h3>
          <p style={{ fontSize: "0.75rem", opacity: 0.9, margin: "0.5rem 0" }}>Write or record your thoughts privately.</p>
          <Link to="/journal" className="btn-primary" style={{ background: "white", color: "var(--primary)", border: "none", fontSize: "0.8rem", padding: "0.5rem", marginTop: "0.5rem" }}>
            Start Writing
          </Link>
        </div>

        {/* Academic Stress Manager Moved Here */}
        <div className="panel" style={{ margin: 0, display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(135deg, #fdf2f2 0%, #fff 100%)", border: "1.5px solid #feb2b2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f56565", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
              <FiBookOpen />
            </div>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#c53030" }}>Academic Stress</h3>
          </div>
          <p style={{ margin: "0 0 1rem", fontSize: "0.75rem", color: "#9b2c2c" }}>Beat the deadlines and stay organized.</p>
          <Link to="/academic-manager" className="btn-primary" style={{ background: "#f56565", border: "none", fontSize: "0.8rem", padding: "0.5rem" }}>
            Open Manager
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: "Students", value: studentsCount, cls: "stat-resolved" },
          { label: "Counselors", value: counselorsCount, cls: "stat-progress" },
          { label: "My Requests", value: stats.total, cls: "" },
          { label: "Pending", value: stats.pending, cls: "stat-pending" },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="filter-bar">
        {["all", "pending", "in-progress", "resolved"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Requests */}
      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FiInbox size={48} />
          <h3>No requests yet</h3>
          <p>Click <strong>New Request</strong> to submit your first support request.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Create Request
          </button>
        </div>
      ) : (
        <div className="requests-grid">
          {filtered.map((req) => (
            <RequestCard key={req._id} request={req} isCounselor={false} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Support Request</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <p className="modal-subtitle">
              Describe what you're going through. Your request is private and handled with care.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="issue">What's on your mind?</label>
                <textarea
                  id="issue"
                  rows={6}
                  placeholder="Share your thoughts, concerns, or anything you'd like support with..."
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? <span className="btn-spinner"></span> : <><FiSend /> Submit Request</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
