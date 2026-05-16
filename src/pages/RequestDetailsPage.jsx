import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRequests, updateRequest, deleteRequest } from "../api/requestApi";
import { FiArrowLeft, FiUser, FiMail, FiClock, FiTrash2, FiSave } from "react-icons/fi";
import Loader from "../components/Loader";

const statusOptions = ["pending", "in-progress", "resolved"];

const RequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchRequests();
        const found = data.find((r) => r._id === id);
        if (!found) { setError("Request not found."); return; }
        setRequest(found);
        setStatus(found.status);
      } catch (err) {
        setError("Failed to load request details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await updateRequest(id, { status });
      setRequest(data);
      setStatus(data.status);
      setSuccess("Status updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this request permanently?")) return;
    try {
      await deleteRequest(id);
      navigate("/counselor/dashboard");
    } catch (err) {
      setError("Failed to delete request.");
    }
  };

  if (loading) return <Loader fullscreen />;

  if (error && !request) return (
    <div className="dashboard">
      <div className="alert alert-error">{error}</div>
      <button className="btn-ghost" onClick={() => navigate(-1)}><FiArrowLeft /> Go Back</button>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="detail-header">
        <button className="btn-ghost" onClick={() => navigate("/counselor/dashboard")}>
          <FiArrowLeft /> Back to Dashboard
        </button>
        <h1>Request Details</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="detail-grid">
        {/* Student Info */}
        <div className="detail-card">
          <h2 className="detail-section-title">Student Information</h2>
          {request.userId ? (
            <div className="detail-info-list">
              <div className="detail-info-row">
                <FiUser className="detail-icon" />
                <div>
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{request.userId.name}</span>
                </div>
              </div>
              <div className="detail-info-row">
                <FiMail className="detail-icon" />
                <div>
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{request.userId.email}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted">Student info unavailable</p>
          )}
        </div>

        {/* Request Info */}
        <div className="detail-card">
          <h2 className="detail-section-title">Request Information</h2>
          <div className="detail-info-list">
            <div className="detail-info-row">
              <FiClock className="detail-icon" />
              <div>
                <span className="detail-label">Submitted On</span>
                <span className="detail-value">
                  {new Date(request.createdAt).toLocaleString("en-US", {
                    dateStyle: "long", timeStyle: "short"
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "1.5rem" }}>
            <label>Issue Description</label>
            <div className="issue-text">{request.issue}</div>
          </div>
        </div>

        {/* Status Management */}
        <div className="detail-card detail-card-full">
          <h2 className="detail-section-title">Manage Status</h2>
          <div className="status-manager">
            <div className="status-options">
              {statusOptions.map((opt) => (
                <label key={opt} className={`status-option ${status === opt ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="status"
                    value={opt}
                    checked={status === opt}
                    onChange={() => setStatus(opt)}
                  />
                  <span className={`status-badge status-${opt.replace("-", "")}`}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </span>
                </label>
              ))}
            </div>
            <div className="detail-actions">
              <button className="btn-primary" onClick={handleUpdate} disabled={saving}>
                {saving ? <span className="btn-spinner"></span> : <><FiSave /> Save Changes</>}
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                <FiTrash2 /> Delete Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
