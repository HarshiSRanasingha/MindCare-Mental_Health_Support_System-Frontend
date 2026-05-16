import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  FiArrowLeft, FiPlus, FiCalendar, FiCheckCircle, FiCircle, 
  FiTrash2, FiClock, FiAlertCircle, FiBookOpen 
} from "react-icons/fi";

const AcademicManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem(`academicTasks_${user?._id}`) || "[]")
  );
  const [newTask, setNewTask] = useState({ title: "", deadline: "", type: "Assignment" });

  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(`academicTasks_${user._id}`, JSON.stringify(tasks));
    }
  }, [tasks, user?._id]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      deadline: newTask.deadline,
      type: newTask.type,
      completed: false,
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: "", deadline: "", type: "Assignment" });
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getUrgentCount = () => {
    const today = new Date();
    return tasks.filter(t => !t.completed && new Date(t.deadline) <= new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)).length;
  };

  return (
    <div className="dashboard">
      <div className="detail-header">
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Go Back
        </button>
        <h1>Academic Stress Manager</h1>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", position: "relative", zIndex: 5 }}>
        {/* Add New Task */}
        <div className="panel" style={{ position: "relative", zIndex: 10 }}>
          <h2 className="section-title"><FiPlus /> Add New Deadline</h2>
          <p className="section-sub">Stay ahead of your schedule and reduce last-minute stress.</p>
          
          <form onSubmit={addTask} style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>Task / Assignment Title</label>
              <input 
                type="text" 
                className="emergency-input" 
                placeholder="e.g. Data Structures Project"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>Deadline</label>
                <input 
                  type="date" 
                  className="emergency-input" 
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>Type</label>
                <select 
                  className="emergency-input"
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                >
                  <option value="Assignment">Assignment</option>
                  <option value="Exam">Exam</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Project">Project</option>
                  <option value="Reminder">Reminder</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                marginTop: "0.5rem",
                position: "relative",
                zIndex: 1000,
                cursor: "pointer"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <FiPlus /> Add to Schedule
            </button>
          </form>

          {getUrgentCount() > 0 && (
            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#fff5f5", borderRadius: "12px", display: "flex", alignItems: "center", gap: "1rem", color: "#f56565" }}>
              <FiAlertCircle fontSize="1.5rem" />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>Action Required</p>
                <p style={{ margin: 0, fontSize: "0.8rem" }}>You have {getUrgentCount()} tasks due within 48 hours.</p>
              </div>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="panel">
          <h2 className="section-title"><FiCalendar /> Your Schedule</h2>
          <div style={{ marginTop: "1.5rem", maxHeight: "500px", overflowY: "auto", paddingRight: "0.5rem" }}>
            {tasks.length === 0 ? (
              <p className="section-sub" style={{ textAlign: "center", padding: "2rem" }}>No upcoming tasks. Enjoy your free time!</p>
            ) : (
              tasks.sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).map(task => (
                <div 
                  key={task.id} 
                  className="emergency-contact-card" 
                  style={{ 
                    opacity: task.completed ? 0.6 : 1,
                    borderLeft: `5px solid ${task.type === "Exam" ? "#f56565" : task.type === "Assignment" ? "var(--primary)" : "#ed8936"}`
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: task.completed ? "#48bb78" : "var(--text3)" }}
                    >
                      {task.completed ? <FiCheckCircle /> : <FiCircle />}
                    </button>
                    <div>
                      <h4 style={{ margin: 0, textDecoration: task.completed ? "line-through" : "none", fontSize: "0.95rem" }}>{task.title}</h4>
                      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.2rem" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text3)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <FiClock /> {task.deadline}
                        </span>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)" }}>{task.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-ghost" style={{ padding: "0.5rem", color: "#ef4444" }} onClick={() => deleteTask(task.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicManager;
