import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  FiLogOut, FiUser, FiUsers, FiGrid, FiSun, FiMoon, FiWind, FiHome, 
  FiSettings, FiChevronDown, FiGlobe, FiBellOff, FiBell, FiAlertCircle,
  FiPhone, FiPlus, FiTrash2, FiX 
} from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [silentMode, setSilentMode] = useState(localStorage.getItem("silentMode") === "true");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "English");
  const [showSettings, setShowSettings] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState(
    JSON.parse(localStorage.getItem("emergencyContacts") || "[]")
  );
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-silent", silentMode);
    localStorage.setItem("silentMode", silentMode);
  }, [silentMode]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("emergencyContacts", JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleSilentMode = () => setSilentMode(!silentMode);
  const toggleLanguage = () => {
    const langs = ["English", "Sinhala", "Tamil"];
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const addContact = () => {
    if (newContact.name && newContact.phone && emergencyContacts.length < 3) {
      setEmergencyContacts([...emergencyContacts, { ...newContact, id: Date.now() }]);
      setNewContact({ name: "", phone: "" });
    }
  };

  const deleteContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
  };

  const initiateCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <>
      <nav className="navbar">
        <Link 
          to={user ? (user.role === "student" ? "/student/dashboard" : "/counselor/dashboard") : "/landing"} 
          className="navbar-brand"
        >
          <span className="brand-icon">🧠</span>
          <span>MindCare</span>
        </Link>

        <div className="navbar-right">
          {user ? (
            <>
              {/* SOS Button - ONLY FOR STUDENTS */}
              {user.role === "student" && (
                <button className="emergency-btn" onClick={() => setShowEmergencyModal(true)}>
                  <FiAlertCircle /> SOS Help
                </button>
              )}
              {/* Role-based nav links */}
              {user.role === "student" && (
                <>
                  <Link to="/landing" className="nav-link"><FiHome /> Home</Link>
                  <Link to="/student/dashboard" className="nav-link"><FiGrid /> Dashboard</Link>
                  <Link to="/counselors" className="nav-link"><FiUsers /> Counselors</Link>
                </>
              )}
              {user.role === "counselor" && (
                <>
                  <Link to="/landing" className="nav-link"><FiHome /> Home</Link>
                  <Link to="/counselor/dashboard" className="nav-link"><FiGrid /> Dashboard</Link>
                  <Link to="/users" className="nav-link"><FiUsers /> Students</Link>
                </>
              )}

              {user.role === "student" && (
                <Link to="/calm" className="nav-link" title="Mindfulness Timer">
                  <FiWind /> Calm Corner
                </Link>
              )}

              {/* User Profile & Settings */}
              <div className="navbar-user-section" ref={dropdownRef} style={{ position: "relative" }}>
                <button 
                  className="navbar-user" 
                  onClick={() => setShowSettings(!showSettings)}
                  style={{ border: "none", background: "none", cursor: "pointer" }}
                >
                  <span>{user.name}</span>
                  <div className="user-avatar-small">{user.name.charAt(0)}</div>
                  <FiChevronDown />
                </button>

                {showSettings && (
                  <div className="settings-dropdown">
                    <div className="dropdown-header">User Settings</div>
                    
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowSettings(false)}>
                      <FiUser /> View Profile
                    </Link>

                    <button className="dropdown-item" onClick={toggleTheme}>
                      {theme === "light" ? <><FiMoon /> Night Mode: Off</> : <><FiSun /> Night Mode: On</>}
                    </button>

                    <button className="dropdown-item" onClick={toggleLanguage}>
                      <FiGlobe /> Language: {language}
                    </button>

                    <button className="dropdown-item" onClick={toggleSilentMode}>
                      {silentMode ? <><FiBellOff /> Silent Mode: On</> : <><FiBell /> Silent Mode: Off</>}
                    </button>

                    <div className="dropdown-divider"></div>
                    
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="nav-icon-btn" onClick={toggleTheme} style={{ marginRight: "1rem" }}>
                {theme === "light" ? <FiMoon /> : <FiSun />}
              </button>
              <Link to="/login" className="nav-link" style={{ marginRight: "1rem" }}>Login</Link>
              <Link to="/register" className="btn-nav-primary">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Emergency SOS Modal */}
      {showEmergencyModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "450px" }}>
            <div className="modal-header">
              <h2 style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiAlertCircle /> Emergency Help
              </h2>
              <button className="modal-close" onClick={() => setShowEmergencyModal(false)}>
                <FiX />
              </button>
            </div>
            
            <p className="modal-subtitle">Manage up to 3 trusted contacts for immediate assistance.</p>

            <div className="emergency-contacts-list">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="emergency-contact-card">
                  <div className="emergency-contact-info">
                    <span className="emergency-contact-name">{contact.name}</span>
                    <span className="emergency-contact-phone">{contact.phone}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button 
                      className="emergency-call-btn" 
                      onClick={() => initiateCall(contact.phone)}
                      title="Call Now"
                    >
                      <FiPhone />
                    </button>
                    <button 
                      className="modal-close" 
                      style={{ background: "#fff0ee", color: "#ef4444" }}
                      onClick={() => deleteContact(contact.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}

              {emergencyContacts.length < 3 && (
                <div className="emergency-input-group">
                  <input 
                    type="text" 
                    placeholder="Contact Name" 
                    className="emergency-input"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Phone Number" 
                    className="emergency-input"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  />
                  <button className="btn-primary" style={{ background: "#ef4444", border: "none" }} onClick={addContact}>
                    <FiPlus /> Add Trusted Contact
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowEmergencyModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
