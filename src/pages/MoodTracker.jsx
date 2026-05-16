import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiCalendar, FiTrendingUp } from "react-icons/fi";

const MOOD_OPTIONS = [
  { id: "happy", label: "Happy", icon: "😊", color: "#48bb78", bg: "#f0fff4" },
  { id: "stressed", label: "Stressed", icon: "😓", color: "#f56565", bg: "#fff5f5" },
  { id: "anxious", label: "Anxious", icon: "😰", color: "#ed8936", bg: "#fffaf0" },
  { id: "lonely", label: "Lonely", icon: "😔", color: "#4299e1", bg: "#ebf8ff" },
  { id: "motivated", label: "Motivated", icon: "🔥", color: "#9f7aea", bg: "#f5f3ff" },
];

const MoodTracker = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("moodTrackerHistory") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("moodTrackerHistory", JSON.stringify(history));
  }, [history]);

  const saveMood = (moodId) => {
    const newEntry = {
      id: Date.now(),
      moodId,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().getTime(),
    };
    setHistory([newEntry, ...history]);
  };

  const getMoodCounts = () => {
    const counts = {};
    MOOD_OPTIONS.forEach(m => counts[m.id] = 0);
    history.forEach(entry => {
      if (counts[entry.moodId] !== undefined) counts[entry.moodId]++;
    });
    return counts;
  };

  const counts = getMoodCounts();
  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <div className="dashboard">
      <div className="detail-header">
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Go Back
        </button>
        <h1>Mood Tracker</h1>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {/* Mood Selection */}
        <div className="panel">
          <h2 className="section-title"><FiPlus /> How are you feeling today?</h2>
          <p className="section-sub">Tracking your mood daily helps you understand your emotional patterns.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem" }}>
            {MOOD_OPTIONS.map(m => (
              <button 
                key={m.id}
                className="mood-btn"
                style={{ 
                  background: m.bg, 
                  borderColor: m.color,
                  padding: "1.5rem 1rem",
                  height: "auto",
                  borderWidth: "1.5px"
                }}
                onClick={() => saveMood(m.id)}
              >
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem", pointerEvents: "none" }}>{m.icon}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: m.color, pointerEvents: "none" }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mood Insights Chart */}
        <div className="panel">
          <h2 className="section-title"><FiTrendingUp /> Mood Insights</h2>
          <p className="section-sub">Your emotional trends based on total history.</p>
          
          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {MOOD_OPTIONS.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ width: "80px", fontSize: "0.85rem", fontWeight: 600 }}>{m.label}</span>
                <div style={{ flex: 1, height: "12px", background: "var(--bg)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ 
                    width: `${(counts[m.id] / maxCount) * 100}%`, 
                    height: "100%", 
                    background: m.color,
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}></div>
                </div>
                <span style={{ width: "30px", fontSize: "0.85rem", fontWeight: 700, textAlign: "right" }}>{counts[m.id]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="panel" style={{ marginTop: "2rem" }}>
        <h2 className="section-title"><FiCalendar /> Recent History</h2>
        <div style={{ marginTop: "1.5rem" }}>
          {history.length === 0 ? (
            <p className="section-sub" style={{ textAlign: "center", padding: "2rem" }}>No mood entries yet. Start tracking today!</p>
          ) : (
            <div className="requests-grid">
              {history.slice(0, 10).map(entry => {
                const mood = MOOD_OPTIONS.find(m => m.id === entry.moodId);
                return (
                  <div key={entry.id} className="request-card" style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.25rem" }}>
                    <div style={{ 
                      width: "50px", height: "50px", borderRadius: "12px", 
                      background: mood?.bg, display: "flex", alignItems: "center", 
                      justifyContent: "center", fontSize: "1.5rem" 
                    }}>
                      {mood?.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: "1rem" }}>Feeling {mood?.label}</h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text3)" }}>{entry.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
