import { useState, useEffect } from "react";
import { fetchCounselors } from "../api/counselorApi";
import { FiBriefcase, FiMail, FiUser, FiSearch } from "react-icons/fi";
import Loader from "../components/Loader";

const CounselorsListPage = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchCounselors();
        setCounselors(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load counselors.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = counselors.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const colors = ["#6b9e8e", "#9b8dca", "#e8a598", "#8faa8b", "#a8c5bb"];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Our Counselors</h1>
          <p>Meet the caring professionals ready to support you.</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loader fullscreen />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "2.5rem" }}>🔍</span>
          <h3>No counselors found</h3>
          <p>{search ? "Try a different search term." : "No counselors registered yet."}</p>
        </div>
      ) : (
        <>
          <p className="results-count">{filtered.length} counselor{filtered.length !== 1 ? "s" : ""} available</p>
          <div className="counselors-grid">
            {filtered.map((c, i) => (
              <div className="counselor-card" key={c._id}>
                <div className="counselor-card-avatar" style={{ background: colors[i % colors.length] }}>
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <div className="counselor-card-body">
                  <h3>{c.name}</h3>
                  <div className="counselor-card-row">
                    <FiBriefcase className="cc-icon" />
                    <span>{c.specialization || "General Counseling"}</span>
                  </div>
                  <div className="counselor-card-row">
                    <FiMail className="cc-icon" />
                    <span>{c.email}</span>
                  </div>
                </div>
                <span className="counselor-available-badge">Available</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CounselorsListPage;
