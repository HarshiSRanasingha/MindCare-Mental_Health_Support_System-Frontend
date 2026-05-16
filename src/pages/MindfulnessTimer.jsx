import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiWind, FiPlay, FiSquare } from "react-icons/fi";

const MindfulnessTimer = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("In"); // "In", "Hold", "Out", "Relax"
  const [counter, setCounter] = useState(4);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isActive) {
      timerRef.current = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            setPhase((p) => {
              if (p === "In") return "Hold";
              if (p === "Hold") return "Out";
              if (p === "Out") return "Relax";
              return "In";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  // Separate effect to handle reset when stopped
  useEffect(() => {
    if (!isActive) {
      setPhase("In");
      setCounter(4);
    }
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  // Helper to get text display
  const getPhaseText = () => {
    if (!isActive) return "Ready?";
    if (phase === "In") return "Breathe In";
    if (phase === "Hold") return "Hold";
    if (phase === "Out") return "Breathe Out";
    if (phase === "Relax") return "Relax";
    return "";
  };

  return (
    <div className="dashboard">
      <div className="detail-header">
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Go Back
        </button>
        <h1>Calm Corner</h1>
      </div>

      <div className="panel" style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--bg2)" }}>
        <div className="section-tag"><FiWind /> Mindfulness</div>
        <h2 className="section-title">Take a moment to breathe</h2>
        <p className="section-sub">Follow the 4-4-4-4 Box Breathing technique to refocus.</p>

        <div className="breathing-container" style={{ 
          margin: "4rem auto", 
          position: "relative", 
          width: "280px", 
          height: "280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none"
        }}>
          {/* Main Breathing Circle */}
          <div className={`breathing-circle ${isActive ? phase.toLowerCase() : ""}`} style={{ pointerEvents: "none" }} />
          
          {/* Ghost Circles for depth */}
          <div className={`breathing-circle ghost-1 ${isActive ? phase.toLowerCase() : ""}`} style={{ pointerEvents: "none" }} />
          <div className={`breathing-circle ghost-2 ${isActive ? phase.toLowerCase() : ""}`} style={{ pointerEvents: "none" }} />
          
          {/* Inner Text */}
          <div className="breathing-text" style={{ 
            position: "absolute", inset: 0, display: "flex", flexDirection: "column", 
            alignItems: "center", justifyContent: "center", zIndex: 5, pointerEvents: "none" 
          }}>
            <p style={{ 
              fontSize: "1.8rem", 
              fontWeight: "700", 
              color: "var(--primary-dark)",
              textShadow: "0 2px 10px rgba(255,255,255,0.8)"
            }}>
              {getPhaseText()}
            </p>
            {isActive && (
              <p style={{ 
                fontSize: "2.5rem", 
                fontWeight: "800", 
                marginTop: "0.5rem",
                color: "var(--text)"
              }}>
                {counter}
              </p>
            )}
          </div>
        </div>

        <div className="timer-controls" style={{ marginTop: "2rem", position: "relative", zIndex: 100 }}>
          <button className={`btn-primary ${isActive ? "btn-danger" : ""}`} style={{ cursor: "pointer" }} onClick={toggleTimer}>
            {isActive ? <><FiSquare /> Stop Exercise</> : <><FiPlay /> Start Breathing</>}
          </button>
        </div>

        <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div className="stat-card" style={{ 
            padding: "1.5rem", 
            border: phase === "In" && isActive ? "2px solid var(--lavender)" : "1.5px solid var(--border)",
            background: phase === "In" && isActive ? "var(--bg3)" : "#fff",
            transform: phase === "In" && isActive ? "scale(1.05)" : "scale(1)",
            transition: "all 0.3s ease"
          }}>
            <span className="stat-label" style={{ color: phase === "In" && isActive ? "var(--lavender)" : "inherit" }}>1. Breathe In</span>
            <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginTop: "0.5rem" }}>Fill lungs slowly (4s)</p>
          </div>

          <div className="stat-card" style={{ 
            padding: "1.5rem", 
            border: phase === "Hold" && isActive ? "2px solid #f6ad55" : "1.5px solid var(--border)",
            background: phase === "Hold" && isActive ? "#fffaf0" : "#fff",
            transform: phase === "Hold" && isActive ? "scale(1.05)" : "scale(1)",
            transition: "all 0.3s ease"
          }}>
            <span className="stat-label" style={{ color: phase === "Hold" && isActive ? "#f6ad55" : "inherit" }}>2. Hold</span>
            <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginTop: "0.5rem" }}>Keep the air in (4s)</p>
          </div>

          <div className="stat-card" style={{ 
            padding: "1.5rem", 
            border: phase === "Out" && isActive ? "2px solid var(--primary)" : "1.5px solid var(--border)",
            background: phase === "Out" && isActive ? "var(--bg2)" : "#fff",
            transform: phase === "Out" && isActive ? "scale(1.05)" : "scale(1)",
            transition: "all 0.3s ease"
          }}>
            <span className="stat-label" style={{ color: phase === "Out" && isActive ? "var(--primary)" : "inherit" }}>3. Breathe Out</span>
            <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginTop: "0.5rem" }}>Exhale completely (4s)</p>
          </div>

          <div className="stat-card" style={{ 
            padding: "1.5rem", 
            border: phase === "Relax" && isActive ? "2px solid #689e8e" : "1.5px solid var(--border)",
            background: phase === "Relax" && isActive ? "#f0fdfa" : "#fff",
            transform: phase === "Relax" && isActive ? "scale(1.05)" : "scale(1)",
            transition: "all 0.3s ease"
          }}>
            <span className="stat-label" style={{ color: phase === "Relax" && isActive ? "#689e8e" : "inherit" }}>4. Relax</span>
            <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginTop: "0.5rem" }}>Wait before next breath (4s)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindfulnessTimer;
