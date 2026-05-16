import { useState, useEffect } from "react";
import { fetchUsers } from "../api/counselorApi";
import { FiMail, FiUser, FiSearch, FiShield } from "react-icons/fi";
import Loader from "../components/Loader";

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>All Students</h1>
          <p>A list of all registered students on the platform.</p>
        </div>
        <div className="stat-card" style={{ minWidth: 120, textAlign: "center" }}>
          <span className="stat-value">{users.length}</span>
          <span className="stat-label">Total Students</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loader fullscreen />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "2.5rem" }}>👤</span>
          <h3>No students found</h3>
          <p>{search ? "Try a different search term." : "No students registered yet."}</p>
        </div>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id}>
                  <td className="td-num">{i + 1}</td>
                  <td>
                    <div className="user-cell">
                      <div className="user-table-avatar">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-table-name">{u.name}</span>
                    </div>
                  </td>
                  <td className="td-email">{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </td>
                  <td className="td-date">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersListPage;
