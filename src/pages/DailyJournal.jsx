import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  FiArrowLeft, FiPlus, FiSave, FiMic, FiSquare, FiTrash2, FiClock, 
  FiMessageSquare, FiSmile, FiPlay, FiStopCircle 
} from "react-icons/fi";

const JOURNAL_MOODS = [
  { icon: "😊", label: "Happy", color: "#48bb78" },
  { icon: "😔", label: "Sad", color: "#4299e1" },
  { icon: "😰", label: "Anxious", color: "#ed8936" },
  { icon: "😡", label: "Angry", color: "#f56565" },
  { icon: "😴", label: "Tired", color: "#a0aec0" },
];

const DailyJournal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState(
    JSON.parse(localStorage.getItem(`journalEntries_${user?._id}`) || "[]")
  );
  const [newEntry, setNewEntry] = useState({ text: "", mood: "😊" });
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(`journalEntries_${user._id}`, JSON.stringify(entries));
    }
  }, [entries, user?._id]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioURL(reader.result); // Base64 string
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const saveEntry = () => {
    if (!newEntry.text && !audioURL) return;

    const entry = {
      id: Date.now(),
      text: newEntry.text,
      mood: newEntry.mood,
      audio: audioURL,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ text: "", mood: "😊" });
    setAudioURL(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="dashboard">
      <div className="detail-header">
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Go Back
        </button>
        <h1>Daily Journal</h1>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", position: "relative", zIndex: 5 }}>
        {/* Write New Entry */}
        <div className="panel" style={{ position: "relative", zIndex: 10 }}>
          <h2 className="section-title"><FiMessageSquare /> Write Your Thoughts</h2>
          <p className="section-sub">Your journal is private and stored only on this device.</p>
          
          <div style={{ marginTop: "1.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
              How do you feel?
            </label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {JOURNAL_MOODS.map(m => (
                <button 
                  key={m.label}
                  onClick={() => setNewEntry({ ...newEntry, mood: m.icon })}
                  style={{ 
                    fontSize: "1.5rem", padding: "0.5rem", flex: 1, borderRadius: "12px", 
                    border: newEntry.mood === m.icon ? `2px solid ${m.color}` : "1.5px solid var(--border)",
                    background: newEntry.mood === m.icon ? `${m.color}11` : "none",
                    cursor: "pointer", transition: "all 0.2s ease"
                  }}
                >
                  {m.icon}
                </button>
              ))}
            </div>

            <textarea 
              className="emergency-input" 
              style={{ minHeight: "150px", resize: "none", marginBottom: "1rem" }}
              placeholder="What's on your mind? No one is judging..."
              value={newEntry.text}
              onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
            ></textarea>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {!isRecording ? (
                <button className="btn-ghost" onClick={startRecording} style={{ color: "var(--primary)" }}>
                  <FiMic /> Voice Journal
                </button>
              ) : (
                <button className="btn-danger" onClick={stopRecording}>
                  <FiStopCircle /> Stop Recording
                </button>
              )}
              {audioURL && <span style={{ fontSize: "0.8rem", color: "#22c55e" }}>✓ Voice recorded</span>}
              
              <button 
                type="button"
                className="btn-primary" 
                style={{ 
                  marginLeft: "auto",
                  background: success ? "#22c55e" : "var(--primary)",
                  border: "none",
                  position: "relative",
                  zIndex: 1000,
                  cursor: "pointer"
                }} 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  saveEntry();
                }}
              >
                {success ? "Saved! ✓" : <><FiSave /> Save Entry</>}
              </button>
            </div>
          </div>
        </div>

        {/* History / Recent Entries */}
        <div className="panel">
          <h2 className="section-title"><FiClock /> Journal History</h2>
          <p className="section-sub">Reflect on your past entries.</p>
          
          <div style={{ marginTop: "1.5rem", maxHeight: "500px", overflowY: "auto", paddingRight: "0.5rem" }}>
            {entries.length === 0 ? (
              <p className="section-sub" style={{ textAlign: "center", padding: "2rem" }}>Your journey begins here. Write your first entry.</p>
            ) : (
              entries.map(entry => (
                <div key={entry.id} className="emergency-contact-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.2rem" }}>{entry.mood}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text3)", fontWeight: 700 }}>{entry.date} at {entry.time}</span>
                    <button className="btn-ghost" style={{ padding: "0.2rem", color: "#ef4444" }} onClick={() => deleteEntry(entry.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                  {entry.text && <p style={{ fontSize: "0.9rem", color: "var(--text)", margin: 0 }}>{entry.text}</p>}
                  {entry.audio && (
                    <audio controls src={entry.audio} style={{ width: "100%", height: "30px", marginTop: "0.5rem" }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyJournal;
