import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, FiActivity, FiSmile, FiFrown, FiMeh, FiZap, 
  FiMusic, FiVideo, FiBook, FiPlay, FiMessageCircle,
  FiSend, FiHeart, FiX, FiPlus, FiTrash2, FiShare2
} from "react-icons/fi";

const MOODS = [
  { id: "happy", label: "Happy", icon: <FiSmile />, color: "#48bb78", text: "That's wonderful! Let's keep the good vibes going." },
  { id: "sad", label: "Sad", icon: <FiFrown />, color: "#4299e1", text: "It's okay to feel sad. I'm here to support you." },
  { id: "angry", label: "Angry", icon: <FiZap />, color: "#f56565", text: "Take a deep breath. Let's find a healthy way to release this." },
  { id: "tired", label: "Tired", icon: <FiMeh />, color: "#a0aec0", text: "You've worked hard. Time for some gentle self-care." },
];

const RECOMMENDATIONS = {
  music: {
    english: [
      { title: "Happy Beats", links: ["https://open.spotify.com/playlist/37i9dQZF1DX3rxVf01967T"] },
      { title: "Confidence Boost", links: ["https://open.spotify.com/playlist/37i9dQZF1DX4fpZWCluLsY"] },
      { title: "Good Vibes", links: ["https://open.spotify.com/playlist/37i9dQZF1DX2sUQpS0tGdc"] },
      { title: "Life Sucks (Sad)", links: ["https://open.spotify.com/playlist/37i9dQZF1DX3YSRYjyv9v3"] },
      { title: "Broken Heart", links: ["https://open.spotify.com/playlist/37i9dQZF1DX156fI7fgtU3"] },
      { title: "Rage Quit (Angry)", links: ["https://open.spotify.com/playlist/37i9dQZF1DXcF6BvY33Z0Z"] },
      { title: "Ambient Sleep", links: ["https://open.spotify.com/playlist/37i9dQZF1DX4sWSp6KmOR3"] },
      { title: "Chill Lofi Study", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8UFs9v9v3n"] },
      { title: "Deep Focus", links: ["https://open.spotify.com/playlist/37i9dQZF1DWZeKzbqnyS25"] },
      { title: "Summer Party", links: ["https://open.spotify.com/playlist/37i9dQZF1DX32696y96Y2U"] }
    ],
    sinhala: [
      { title: "Sinhala Classics (වික්ටර් රත්නායක)", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Sunil Edirisinghe Melodies", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Modern Sinhala Chill", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Piyath Rajapakse Hits", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Hana Shafa Soul", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Bathiya & Santhush Classics", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Kasun Kalhara Gems", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Ridma Weerawardena - Kuweni", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Umaria Sinhawansa Pop", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] },
      { title: "Danthure Hits", links: ["https://open.spotify.com/playlist/37i9dQZF1DX8sl96pYv9v3k"] }
    ],
    tamil: [
      { title: "AR Rahman Hits", links: ["https://open.spotify.com/playlist/37i9dQZF1DXbS8id96PpC5"] },
      { title: "Ilaiyaraaja Melodies", links: ["https://open.spotify.com/playlist/37i9dQZF1DX6XneTBy0bd6"] },
      { title: "Sid Sriram Soulful", links: ["https://open.spotify.com/playlist/37i9dQZF1DXcF6BvY33Z0Z"] },
      { title: "Anirudh High Energy", links: ["https://open.spotify.com/playlist/37i9dQZF1DXbS8id96PpC5"] },
      { title: "Pradeep Kumar Acoustic", links: ["https://open.spotify.com/playlist/37i9dQZF1DX6XneTBy0bd6"] },
      { title: "Santhosh Narayanan Folk", links: ["https://open.spotify.com/playlist/37i9dQZF1DXcF6BvY33Z0Z"] },
      { title: "Shreya Ghoshal Tamil", links: ["https://open.spotify.com/playlist/37i9dQZF1DXbS8id96PpC5"] },
      { title: "Yuvan Shankar Raja Lo-fi", links: ["https://open.spotify.com/playlist/37i9dQZF1DX6XneTBy0bd6"] },
      { title: "Harris Jayaraj Melodic", links: ["https://open.spotify.com/playlist/37i9dQZF1DXcF6BvY33Z0Z"] },
      { title: "Tamil Chill Vibes", links: ["https://open.spotify.com/playlist/37i9dQZF1DXbS8id96PpC5"] }
    ]
  },
  movies: {
    english: [
      { title: "The Grand Budapest Hotel", links: ["https://www.imdb.com/title/tt2278388/"] },
      { title: "Singin' in the Rain", links: ["https://www.imdb.com/title/tt0045152/"] },
      { title: "Paddington 2", links: ["https://www.imdb.com/title/tt4468740/"] },
      { title: "Soul", links: ["https://www.imdb.com/title/tt2948372/"] },
      { title: "Spirited Away", links: ["https://www.imdb.com/title/tt0245429/"] },
      { title: "La La Land", links: ["https://www.imdb.com/title/tt3783958/"] },
      { title: "The Intern", links: ["https://www.imdb.com/title/tt2361509/"] },
      { title: "Chef", links: ["https://www.imdb.com/title/tt2883512/"] },
      { title: "Inside Out", links: ["https://www.imdb.com/title/tt2096673/"] },
      { title: "About Time", links: ["https://www.imdb.com/title/tt2194499/"] }
    ],
    sinhala: [
      { title: "Ho Gaana Pokuna (හෝ ගානා පොකුණ)", links: ["https://www.imdb.com/title/tt5302636/"] },
      { title: "Machan (මචං)", links: ["https://www.imdb.com/title/tt1277435/"] },
      { title: "Nidhanaya (නිධානය)", links: ["https://www.imdb.com/title/tt0068997/"] },
      { title: "Bambaru Avith (බඹරු ඇවිත්)", links: ["https://www.imdb.com/title/tt0075727/"] },
      { title: "Sooriya Arana (සූරිය අරණ)", links: ["https://www.imdb.com/title/tt0418201/"] },
      { title: "Siri Raja Siri (සිරි රජ සිරි)", links: ["https://www.imdb.com/title/tt1230491/"] },
      { title: "Kosthapal Punyasoma (කොස්තාපල් පුන්‍යසෝම)", links: ["https://www.imdb.com/title/tt6169046/"] },
      { title: "Saroja (සාරෝජා)", links: ["https://www.imdb.com/title/tt0284459/"] },
      { title: "Akasa Kusum (ආකාස කුසුම්)", links: ["https://www.imdb.com/title/tt1264426/"] },
      { title: "Ira Madiyama (ඉර මැදියම)", links: ["https://www.imdb.com/title/tt0411516/"] }
    ],
    tamil: [
      { title: "Jai Bhim (ஜெய் பீம்)", links: ["https://www.imdb.com/title/tt15097216/"] },
      { title: "96 (தொண்ணூற்று ஆறு)", links: ["https://www.imdb.com/title/tt7019842/"] },
      { title: "Kannathil Muthamittal (கன்னத்தில் முத்தமிட்டால்)", links: ["https://www.imdb.com/title/tt0301498/"] },
      { title: "Anjali (அஞ்சலி)", links: ["https://www.imdb.com/title/tt0099042/"] },
      { title: "Peranbu (பேரன்பு)", links: ["https://www.imdb.com/title/tt5456488/"] },
      { title: "Super Deluxe (சூப்பர் டீலக்ஸ்)", links: ["https://www.imdb.com/title/tt7019842/"] },
      { title: "Baasha (பாட்ஷா)", links: ["https://www.imdb.com/title/tt0112449/"] },
      { title: "Nayakan (நாயகன்)", links: ["https://www.imdb.com/title/tt0093603/"] },
      { title: "Visaranai (விசாரணை)", links: ["https://www.imdb.com/title/tt4043684/"] },
      { title: "Kadaisi Vivasayi (கடைசி விவசாயி)", links: ["https://www.imdb.com/title/tt11342676/"] }
    ]
  },
  books: {
    english: [
      { title: "The House in the Cerulean Sea", links: ["https://www.goodreads.com/book/show/45047384-the-house-in-the-cerulean-sea"] },
      { title: "A Gentleman in Moscow", links: ["https://www.goodreads.com/book/show/29166170-a-gentleman-in-moscow"] },
      { title: "The Midnight Library", links: ["https://www.goodreads.com/book/show/52578297-the-midnight-library"] },
      { title: "Man's Search for Meaning", links: ["https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning"] },
      { title: "The Alchemist", links: ["https://www.goodreads.com/book/show/1120.The_Alchemist"] },
      { title: "Siddhartha", links: ["https://www.goodreads.com/book/show/52036.Siddhartha"] },
      { title: "Atomic Habits", links: ["https://www.goodreads.com/book/show/40121378-atomic-habits"] },
      { title: "The Power of Now", links: ["https://www.goodreads.com/book/show/6708.The_Power_of_Now"] },
      { title: "Big Magic", links: ["https://www.goodreads.com/book/show/24453082-big-magic"] },
      { title: "Meditations", links: ["https://www.goodreads.com/book/show/30659.Meditations"] }
    ],
    sinhala: [
      { title: "Madol Duwa (මඩොල් දූව)", links: ["https://www.goodreads.com/book/show/6596350-madol-duwa"] },
      { title: "Gamperaliya (ගම්පෙරළිය)", links: ["https://www.goodreads.com/book/show/6596342-gamperaliya"] },
      { title: "Viragaya (විරාගය)", links: ["https://www.goodreads.com/book/show/6347895-viragaya"] },
      { title: "Amba Yahaluwo (අඹ යහළුවෝ)", links: ["https://www.goodreads.com/book/show/13495811-amba-yahaluwo"] },
      { title: "Golu Hadawatha (ගොළු හදවත)", links: ["https://www.goodreads.com/book/show/13495811-golu-hadawatha"] },
      { title: "Gehenu Lamayi (ගැහැනු ළමයි)", links: ["https://www.goodreads.com/book/show/13495811-gehenu-lamayi"] },
      { title: "Karuvala Gedara (කරුවල ගෙදර)", links: ["https://www.goodreads.com/book/show/13495811-karuvala-gedara"] },
      { title: "Senasuru Maruwa (සෙනසුරු මාරුව)", links: ["https://www.goodreads.com/book/show/13495811-senasuru-maruwa"] },
      { title: "Malagiya Atto (මළගිය ඇත්තෝ)", links: ["https://www.goodreads.com/book/show/13495811-malagiya-atto"] },
      { title: "Hevanella (හෙවනැල්ල)", links: ["https://www.goodreads.com/book/show/13495811-hevanella"] }
    ],
    tamil: [
      { title: "Ponniyin Selvan (பொன்னியின் செல்வன்)", links: ["https://www.goodreads.com/book/show/13495811-ponniyin-selvan"] },
      { title: "Sivagamiyin Sabatham (சிவகாமி சபதம்)", links: ["https://www.goodreads.com/book/show/13495811-sivagamiyin-sabatham"] },
      { title: "Parthiban Kanavu (பார்த்திபன் கனவு)", links: ["https://www.goodreads.com/book/show/13495811-parthiban-kanavu"] },
      { title: "Oru Puliyamarathin Kathai (ஒரு புளியமரத்தின் கதை)", links: ["https://www.goodreads.com/book/show/13495811-oru-puliyamarathin-kathai"] },
      { title: "Mogamul (மோகமுள்)", links: ["https://www.goodreads.com/book/show/13495811-mogamul"] },
      { title: "Kuruthipunal (குருதிப்புனல்)", links: ["https://www.goodreads.com/book/show/13495811-kuruthipunal"] },
      { title: "Karukku (கருக்கு)", links: ["https://www.goodreads.com/book/show/13495811-karukku"] },
      { title: "Alai Osai (அலை ஓசை)", links: ["https://www.goodreads.com/book/show/13495811-alai-osai"] },
      { title: "J J: Sila Kurippugal (ஜே ஜே சில குறிப்புகள்)", links: ["https://www.goodreads.com/book/show/13495811-jj-sila-kurippugal"] },
      { title: "Amma Vandhal (அம்மா வந்தாள்)", links: ["https://www.goodreads.com/book/show/13495811-amma-vandhal"] }
    ]
  },
  social: [
    { title: "Facebook", links: ["https://www.facebook.com"] },
    { title: "Instagram", links: ["https://www.instagram.com"] },
    { title: "Twitter (X)", links: ["https://www.twitter.com"] },
    { title: "YouTube", links: ["https://www.youtube.com"] },
    { title: "TikTok", links: ["https://www.tiktok.com"] },
    { title: "LinkedIn", links: ["https://www.linkedin.com"] },
    { title: "Pinterest", links: ["https://www.pinterest.com"] },
    { title: "Reddit", links: ["https://www.reddit.com"] },
    { title: "Snapchat", links: ["https://www.snapchat.com"] },
    { title: "WhatsApp", links: ["https://web.whatsapp.com"] }
  ],
  games: {
    brain: [
      { title: "2048", links: ["https://play2048.co"] },
      { title: "Sudoku", links: ["https://sudoku.com"] },
      { title: "Tetris", links: ["https://tetris.com/play-tetris"] },
      { title: "Wordle", links: ["https://www.nytimes.com/games/wordle"] },
      { title: "Jigsaw Puzzles", links: ["https://www.jigsawexplorer.com"] },
      { title: "Mahjong", links: ["https://www.mahjong.com"] },
      { title: "Solitaire", links: ["https://www.google.com/search?q=solitaire"] },
      { title: "Minesweeper", links: ["https://minesweeperonline.com"] },
      { title: "Chess Online", links: ["https://www.chess.com/play/online"] },
      { title: "Crosswords", links: ["https://www.boatloadpuzzles.com/playcrossword"] }
    ],
    relaxing: [
      { title: "Slither.io", links: ["https://slither.io"] },
      { title: "Agar.io", links: ["https://agar.io"] },
      { title: "Little Alchemy 2", links: ["https://littlealchemy2.com"] },
      { title: "Quick Draw", links: ["https://quickdraw.withgoogle.com"] },
      { title: "Fluid Simulation", links: ["https://paveldogreat.github.io/WebGL-Fluid-Simulation/"] },
      { title: "Sandspiel", links: ["https://sandspiel.club"] },
      { title: "GeoGuessr", links: ["https://www.geoguessr.com"] },
      { title: "Paper.io", links: ["https://paper-io.com"] },
      { title: "Google Earth", links: ["https://www.google.com/earth/"] },
      { title: "Townscaper", links: ["https://oskarstalberg.com/Townscaper/"] }
    ],
    arcade: [
      { title: "Pac-Man", links: ["https://www.google.com/logos/2010/pacman10-i.html"] },
      { title: "Snake", links: ["https://www.google.com/search?q=play+snake"] },
      { title: "Space Invaders", links: ["https://freeinvaders.org"] },
      { title: "Asteroids", links: ["https://freeasteroids.org"] },
      { title: "Frogger", links: ["https://www.frogger.net"] },
      { title: "Galaga", links: ["https://freegalaga.com"] },
      { title: "Pong", links: ["https://pong-2.com"] },
      { title: "Atari Breakout", links: ["https://www.google.com/search?q=atari+breakout"] },
      { title: "Pinball", links: ["https://www.google.com/search?q=play+pinball"] },
      { title: "Donkey Kong", links: ["https://freeclassic80sgames.com/donkey-kong"] }
    ]
  }
};

const PERSONALITIES = [
  { id: "friendly", label: "Friendly", icon: "🤝", intro: "Hey there! I'm your friendly support buddy. How can I help you today?" },
  { id: "funny", label: "Funny", icon: "🤡", intro: "Greetings, human! I'm here to provide support and possibly some terrible jokes. What's up?" },
  { id: "lovely", label: "Lovely", icon: "💖", intro: "Hello beautiful soul. I'm here to wrap you in digital kindness. How are you feeling?" },
  { id: "serious", label: "Serious", icon: "⚖️", intro: "Hello. I am here to provide structured emotional support and logical coping strategies." },
];

const SelfTherapyPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("welcome"); // welcome, mood, activities, specific-flow
  const [mood, setMood] = useState(null);
  const [activity, setActivity] = useState(null);
  const [language, setLanguage] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // --- ACTIONS ---
  const handleMoodSelect = (m) => {
    setMood(m);
    setStep("activities");
  };

  const handleActivitySelect = (a) => {
    console.log("Selecting activity:", a);
    setActivity(a);
    if (a === "chat") {
      setStep("chat-personality");
    } else if (a === "books" || a === "movies" || a === "music") {
      setStep("language-selection");
    } else if (a === "games") {
      setStep("game-selection");
    } else {
      setStep("dynamic-flow");
    }
  };


  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", text: chatInput };
    setChatMessages([...chatMessages, userMsg]);
    setChatInput("");

    // Simulate bot response
    setTimeout(() => {
      let botText = "";
      if (personality === "funny") botText = "That's interesting! Did you know that 80% of all statistics are made up on the spot? Including this one!";
      else if (personality === "lovely") botText = "I hear you, and I want you to know that you are doing your best. Sending you so much love.";
      else if (personality === "serious") botText = "Understood. Let's analyze the core of that feeling and identify three actionable steps.";
      else botText = "I'm here for you. Tell me more about that.";
      
      setChatMessages(prev => [...prev, { role: "bot", text: botText }]);
    }, 1000);
  };

  // --- RENDER HELPERS ---
  const renderStep = () => {
    switch(step) {
      case "welcome":
        return (
          <div className="panel" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div className="auth-logo">🧠</div>
            <h1 className="hero-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Welcome to Your <br/><span>Healing Space</span></h1>
            <p className="section-sub">A safe, private corner designed just for you. No judgment, just care.</p>
            <button className="btn-primary" style={{ marginTop: "2rem" }} onClick={() => setStep("mood")}>
              Start Session
            </button>
          </div>
        );

      case "mood":
        return (
          <div className="panel" style={{ textAlign: "center" }}>
            <h2 className="section-title">How are you feeling right now?</h2>
            <div className="stats-grid" style={{ marginTop: "2.5rem", position: "relative", zIndex: 10 }}>
              {MOODS.map(m => (
                <button 
                  key={m.id} 
                  type="button"
                  className={`mood-btn ${mood?.id === m.id ? "active" : ""}`}
                  style={{ 
                    position: "relative",
                    zIndex: 11,
                    border: mood?.id === m.id ? `2.5px solid ${m.color}` : "1.5px solid var(--border)",
                    boxShadow: mood?.id === m.id ? `0 8px 20px ${m.color}33` : "var(--shadow)"
                  }} 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMoodSelect(m);
                  }}
                >
                  <span style={{ fontSize: "3rem", color: m.color, pointerEvents: "none", display: "block" }}>{m.icon}</span>
                  <span style={{ fontSize: "1rem", fontWeight: "700", pointerEvents: "none" }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "activities":
        return (
          <div className="panel">
            <h2 className="section-title" style={{ textAlign: "center" }}>{mood.text}</h2>
            <p className="section-sub" style={{ textAlign: "center" }}>What would help you feel better today?</p>
            <div className="stats-grid" style={{ marginTop: "2.5rem", position: "relative", zIndex: 10 }}>
              {[
                { id: "music", label: "Listen Music", icon: <FiMusic /> },
                { id: "movies", label: "Watch Movie", icon: <FiVideo /> },
                { id: "books", label: "Read Books", icon: <FiBook /> },
                { id: "games", label: "Play Games", icon: <FiPlay /> },
                { id: "social", label: "Social Media", icon: <FiShare2 /> },
                { id: "chat", label: "Talk with Bot", icon: <FiMessageCircle /> },
              ].map(a => (
                <button 
                  key={a.id} 
                  type="button"
                  className="mood-btn"
                  style={{ position: "relative", zIndex: 11 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleActivitySelect(a.id);
                  }}
                >
                  <span style={{ fontSize: "2rem", color: "var(--primary)", pointerEvents: "none" }}>{a.icon}</span>
                  <span style={{ fontWeight: 700, pointerEvents: "none" }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "language-selection":
        return (
          <div className="panel" style={{ textAlign: "center" }}>
            <h2 className="section-title">Select Your Language</h2>
            <p className="section-sub">Choose a language for your {activity} recommendations.</p>
            <div className="stats-grid" style={{ marginTop: "2rem", position: "relative", zIndex: 10 }}>
              {["English", "Sinhala", "Tamil"].map(lang => (
                <button key={lang} className="stat-card" style={{ cursor: "pointer", position: "relative", zIndex: 11 }} onClick={() => { setLanguage(lang.toLowerCase()); setStep("dynamic-flow"); }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{lang}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "game-selection":
        return (
          <div className="panel" style={{ textAlign: "center" }}>
            <h2 className="section-title">Choose Game Type</h2>
            <p className="section-sub">What kind of games would you like to play?</p>
            <div className="stats-grid" style={{ marginTop: "2rem", position: "relative", zIndex: 10 }}>
              {[
                { id: "brain", label: "Brain & Puzzle" },
                { id: "relaxing", label: "Relaxing" },
                { id: "arcade", label: "Classic Arcade" }
              ].map(type => (
                <button key={type.id} className="stat-card" style={{ cursor: "pointer", position: "relative", zIndex: 11 }} onClick={() => { setGameType(type.id); setStep("dynamic-flow"); }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "dynamic-flow":
        let recs = [];
        if ((activity === "books" || activity === "movies" || activity === "music") && language) {
          recs = RECOMMENDATIONS[activity][language] || [];
        } else if (activity === "games" && gameType) {
          recs = RECOMMENDATIONS.games[gameType] || [];
        } else if (activity === "social") {
          recs = RECOMMENDATIONS.social;
        } else {
          recs = RECOMMENDATIONS[activity]?.[mood.id] || [];
        }
        
        return (
          <div className="panel" style={{ textAlign: "center" }}>
            <h2 className="section-title" style={{ textTransform: "capitalize" }}>
              {activity === "social" ? "Connect via Social Media" : 
               activity === "games" ? `${gameType} Games` :
               `${activity} ${language ? `(${language})` : ""} for your ${mood.label} Mood`}
            </h2>
            <p className="section-sub">
              {activity === "social" ? "Browse your favorite social platforms to stay connected." : 
               activity === "games" ? "Choose a game and start playing instantly in your browser." :
               `Here are some hand-picked suggestions to help you ${mood.id === "sad" ? "feel better" : "stay grounded"}.`}
            </p>
            
            <div className="detail-info-list" style={{ marginTop: "2rem", textAlign: "left" }}>
              {(activity === "music" || activity === "books" || activity === "movies" || activity === "social" || activity === "games") ? (
                recs.map((item, i) => (
                  <div key={i} className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, paddingRight: "1rem" }}>
                      <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{item.title}</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text3)" }}>
                        {activity === "music" ? "Spotify Playlist" : 
                         activity === "movies" ? "Movie Info" : 
                         activity === "social" ? "Social Platform" : 
                         activity === "games" ? "Instant Play" :
                         "Book Link"}
                      </p>
                    </div>
                    <a href={item.links[0]} target="_blank" rel="noopener noreferrer" className="btn-primary-sm" style={{ whiteSpace: "nowrap" }}>
                      {activity === "music" ? "Listen Now" : 
                       activity === "movies" ? "View Trailer" : 
                       activity === "social" ? "Visit Now" : 
                       activity === "games" ? "Play Now" :
                       "Read More"}
                    </a>
                  </div>
                ))
              ) : (
                recs.map((item, i) => (
                  <div key={i} className="panel" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                      {activity === "movies" ? "🎬" : "📚"}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700 }}>{item}</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text3)" }}>Recommended for you</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button className="btn-ghost" style={{ marginTop: "2rem" }} onClick={() => {
              if (activity === "books" || activity === "movies" || activity === "music") setStep("language-selection");
              else if (activity === "games") setStep("game-selection");
              else setStep("activities");
            }}>Back to Selection</button>
          </div>
        );



      case "chat-personality":
        return (
          <div className="panel" style={{ textAlign: "center" }}>
            <h2 className="section-title">Choose Your Companion</h2>
            <p className="section-sub">Who would you like to talk to today?</p>
            <div className="stats-grid" style={{ marginTop: "2rem", position: "relative", zIndex: 10 }}>
              {PERSONALITIES.map(p => (
                <button key={p.id} className="stat-card" style={{ cursor: "pointer", position: "relative", zIndex: 11 }} onClick={() => { setPersonality(p.id); setStep("chat"); setChatMessages([{ role: "bot", text: p.intro }]); }}>
                  <span style={{ fontSize: "2.5rem" }}>{p.icon}</span>
                  <span className="stat-label" style={{ marginTop: "1rem" }}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "chat":
        return (
          <div className="panel" style={{ height: "60vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
               <h2 style={{ fontSize: "1.1rem" }}>Chat with {personality.charAt(0).toUpperCase() + personality.slice(1)} Bot</h2>
               <button className="btn-icon" onClick={() => setStep("chat-personality")}><FiX /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ 
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "var(--primary)" : "var(--bg3)",
                  color: msg.role === "user" ? "#fff" : "var(--text)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  maxWidth: "80%"
                }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <input type="text" placeholder="Type your message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} style={{ flex: 1 }} />
              <button type="submit" className="btn-primary" style={{ padding: "0.75rem 1.25rem" }}><FiSend /></button>
            </form>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="detail-header">
        <button className="btn-ghost" onClick={() => {
          if (step === "welcome") navigate("/profile");
          else if (step === "mood") setStep("welcome");
          else if (step === "activities") setStep("mood");
          else if (step === "language-selection") setStep("activities");
          else if (step === "game-selection") setStep("activities");
          else if (step === "chat-personality") setStep("activities");
          else if (step === "chat") setStep("chat-personality");
          else if (step === "dynamic-flow" && (activity === "books" || activity === "movies" || activity === "music")) setStep("language-selection");
          else if (step === "dynamic-flow" && activity === "games") setStep("game-selection");
          else setStep("activities");
        }}>
          <FiArrowLeft /> Back
        </button>
        <h1>Self Therapy Hub</h1>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {renderStep()}
      </div>
    </div>
  );
};

export default SelfTherapyPage;
