import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchRequests, updateRequest, deleteRequest } from "../api/requestApi";
import { fetchCounselors, fetchUsers } from "../api/counselorApi";
import RequestCard from "../components/RequestCard";
import Loader from "../components/Loader";
import { FiInbox, FiUsers, FiRefreshCw } from "react-icons/fi";

const CounselorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [reqRes, couRes, userRes] = await Promise.all([
        fetchRequests(),
        fetchCounselors(),
        fetchUsers()
      ]);
      setRequests(reqRes.data);
      setCounselors(couRes.data);
      setStudents(userRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (id, newStatus) => {
    try {
      const { data } = await updateRequest(id, { status: newStatus });
      setRequests((prev) => prev.map((r) => (r._id === id ? data : r)));
      // Success is implicit by UI change, but error is now handled via state
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update request.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    setError("");
    try {
      await deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete request.");
      setTimeout(() => setError(""), 4000);
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
          <h1>Counselor Dashboard</h1>
          <p>Welcome, <strong>{user.name}</strong> — manage all student requests below 👇</p>
        </div>
        <button className="btn-ghost" onClick={loadData} title="Refresh">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: "Total Requests", value: stats.total, cls: "", color: "var(--primary)" },
          { label: "Students", value: students.length, cls: "stat-resolved", color: "var(--sage)" },
          { label: "Counselors", value: counselors.length, cls: "stat-progress", color: "var(--lavender)" },
          { label: "Pending", value: stats.pending, cls: "stat-pending", color: "#f6ad55" },
        ].map((s) => (
          <div className={`stat-card ${s.cls}`} key={s.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="stat-value">{s.value}</span>
              {s.label !== "Total Requests" && stats.total > 0 && (
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text3)" }}>
                  {Math.round((s.value / stats.total) * 100)}%
                </span>
              )}
            </div>
            <span className="stat-label">{s.label}</span>
            {stats.total > 0 && (
              <div style={{ height: "4px", background: "var(--bg3)", borderRadius: "2px", marginTop: "0.75rem", overflow: "hidden" }}>
                <div style={{ 
                  height: "100%", 
                  width: s.label === "Total Requests" ? "100%" : `${(s.value / stats.total) * 100}%`, 
                  background: s.color,
                  transition: "width 1s ease-out"
                }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Counselors Panel */}
      {counselors.length > 0 && (
        <div className="panel">
          <h2 className="panel-title"><FiUsers /> Available Counselors ({counselors.length})</h2>
          <div className="counselors-list">
            {counselors.map((c) => (
              <div className="counselor-chip" key={c._id}>
                <span className="counselor-avatar">{c.name?.charAt(0).toUpperCase()}</span>
                <div>
                  <p className="counselor-name">{c.name}</p>
                  <p className="counselor-spec">{c.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="filter-bar">
        {["all", "pending", "in-progress", "resolved"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? `All (${requests.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${requests.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Requests */}
      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FiInbox size={48} />
          <h3>No requests found</h3>
          <p>No {filter !== "all" ? filter : ""} requests at the moment.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {filtered.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              isCounselor={true}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onViewDetails={(id) => navigate(`/counselor/request/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;
