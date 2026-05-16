import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiHeart, FiShield, FiMessageCircle, FiUsers,
  FiArrowRight, FiStar, FiCheckCircle, FiActivity, FiBriefcase
} from "react-icons/fi";
import { fetchUsers, fetchCounselors } from "../api/counselorApi";
import { fetchRequests } from "../api/requestApi";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "🌿", iconCls: "fi-green",  title: "Safe & Confidential", desc: "Everything you share stays private. A judgment-free space, always." },
  { icon: "💬", iconCls: "fi-lavender", title: "Talk to a Counselor", desc: "Connect with qualified mental health professionals ready to listen." },
  { icon: "🌸", iconCls: "fi-blush",  title: "Calm Your Mind", desc: "Resources and support to help you breathe, refocus, and heal." },
  { icon: "🤝", iconCls: "fi-teal",   title: "Community Support", desc: "You're never alone. We're here every step of your journey." },
];

const testimonials = [
  { quote: "MindCare helped me feel heard for the first time. My counselor was incredibly kind and understanding.", name: "Amara S.", role: "Student", av: "av-green",  initial: "A" },
  { quote: "I was nervous to reach out, but the process was so easy and the support I received changed everything.", name: "James T.", role: "Student", av: "av-lavender", initial: "J" },
  { quote: "Working with students on MindCare is deeply rewarding. The platform makes communication seamless.", name: "Dr. Priya M.", role: "Counselor", av: "av-blush", initial: "P" },
];

const LandingPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 120, // Default/Fallback counts
    counselors: 15,
    requests: 450
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      try {
        const [usersRes, counsRes, reqsRes] = await Promise.all([
          fetchUsers().catch(() => ({ data: [] })),
          fetchCounselors().catch(() => ({ data: [] })),
          fetchRequests().catch(() => ({ data: [] }))
        ]);
        
        setStats({
          students: usersRes.data.length || 120,
          counselors: counsRes.data.length || 15,
          requests: reqsRes.data.length || 450
        });
      } catch (err) {
        console.error("Failed to fetch real-time stats:", err);
      }
    };
    loadStats();
  }, [user]);

  return (
    <div className="landing">
      {/* ── HERO ── */}
      <section className="hero-new">
        <div className="hero-top">
          <div className="hero-badge">🧠 Mental Health Support</div>
          <h1 className="hero-title" style={{ fontSize: "3.5rem", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
            Your peace of mind<br /><span>starts here.</span>
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: "600px", margin: "0 auto 2.5rem" }}>
            A calm, safe place to talk about what's on your mind.
            Connect with caring counselors who truly listen — no pressure, no judgment.
          </p>

          {/* Stats Bar */}
          <div className="landing-stats-bar">
            <div className="l-stat-item">
              <span className="l-stat-value">{stats.students}+</span>
              <span className="l-stat-label"><FiUsers /> Students</span>
            </div>
            <div className="l-stat-divider"></div>
            <div className="l-stat-item">
              <span className="l-stat-value">{stats.counselors}+</span>
              <span className="l-stat-label"><FiBriefcase /> Counselors</span>
            </div>
            <div className="l-stat-divider"></div>
            <div className="l-stat-item">
              <span className="l-stat-value">{stats.requests}+</span>
              <span className="l-stat-label"><FiActivity /> Requests</span>
            </div>
          </div>
        </div>

        <div className="hero-gallery-wrapper">
          <div className="hero-gallery">
            {[
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
            ].concat([
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
            ]).map((url, i) => (
              <div className="gallery-item" key={i}>
                <img src={url} alt={`Person ${i+1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features">
        <div className="section-tag">How It Works</div>
        <h2 className="section-title">Everything you need to feel better</h2>
        <p className="section-sub">
          Simple steps to get the support you deserve — we've made it as easy and comfortable as possible.
        </p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className={`feature-icon ${f.iconCls}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials">
        <div style={{ textAlign: "center" }}>
          <div className="section-tag">Stories</div>
          <h2 className="section-title">Kind words from our community</h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card" key={i}>
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                {[...Array(5)].map((_, s) => <FiStar key={s} style={{ color: "#f6ad55", fill: "#f6ad55", fontSize: "0.85rem" }} />)}
              </div>
              <p className="testi-quote">"{t.quote}"</p>
              <div className="testi-author">
                <div className={`testi-avatar ${t.av}`}>{t.initial}</div>
                <div>
                  <p className="testi-name">{t.name}</p>
                  <p className="testi-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to take the first step?</h2>
          <p>
            You deserve support. Register today and start your journey toward calm, clarity, and connection.
          </p>
          <div className="cta-btns">
            <Link to="/register" className="btn-primary">
              Register as Student <FiArrowRight />
            </Link>
            <Link to="/register?role=counselor" className="btn-ghost">
              Join as Counselor
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">🧠 MindCare</div>
        <p>© 2025 MindCare. A safe space for everyone. Built with care. 🌿</p>
      </footer>
    </div>
  );
};

export default LandingPage;
