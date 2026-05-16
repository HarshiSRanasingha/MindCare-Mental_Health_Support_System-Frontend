import { FiClock, FiCheckCircle, FiAlertCircle, FiTrash2, FiEdit2, FiExternalLink } from "react-icons/fi";

const statusConfig = {
  pending: { icon: <FiClock />, label: "Pending", cls: "status-pending" },
  "in-progress": { icon: <FiAlertCircle />, label: "In Progress", cls: "status-progress" },
  resolved: { icon: <FiCheckCircle />, label: "Resolved", cls: "status-resolved" },
};

const RequestCard = ({ request, onUpdate, onDelete, onViewDetails, isCounselor = false }) => {
  const status = statusConfig[request.status] || statusConfig["pending"];

  return (
    <div className={`request-card ${request.status}`}>
      <div className="request-card-header">
        {isCounselor && request.userId && (
          <div className="student-info">
            <span className="student-avatar">
              {request.userId.name?.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="student-name">{request.userId.name}</p>
              <p className="student-email">{request.userId.email}</p>
            </div>
          </div>
        )}
        <span className={`status-badge ${status.cls}`}>
          {status.icon} {status.label}
        </span>
      </div>

      <p className="request-issue">{request.issue}</p>

      <div className="request-card-footer">
        <span className="request-date">
          {new Date(request.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric",
          })}
        </span>

        {isCounselor && (
          <div className="request-actions">
            <select
              className="status-select"
              value={request.status}
              onChange={(e) => onUpdate(request._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <button className="btn-icon" onClick={() => onViewDetails(request._id)} title="View Details" style={{ color: "var(--primary)" }}>
              <FiExternalLink />
            </button>
            <button className="btn-icon btn-danger" onClick={() => onDelete(request._id)} title="Delete">
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
