import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { usePlatforms } from "../hooks/usePlatforms";
import { motion } from "framer-motion";
import "./LandingPage.css";


const FEATURES = [
  {
    icon: "📋",
    title: "Listings",
    desc: "Receive and sync data from any platform in minutes through our intuitive RESTful API."
  },
  {
    icon: "📊",
    title: "Real-time Analytics",
    desc: "Live dashboards with percentage breakdowns and insights from recent queries and activity."
  },
  {
    icon: "🤖",
    title: "AI & Sentiment Analysis",
    desc: "Smart sentiment analysis across multiple real reviews with automated insights and trend detection."
  },
];



function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FeatureCard({ icon, title, desc, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`lp-feature-card ${inView ? "visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="lp-feature-icon">{icon}</div>
      <h3 className="lp-feature-title">{title}</h3>
      <p className="lp-feature-desc">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => { clearTimeout(timer); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const hv = heroVisible ? "visible" : "";
  const navBtn = { padding: "9px 22px", fontSize: 14 };
  const { platforms, loading, error } = usePlatforms();

  return (
    <div>
      <nav className={`lp-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="lp-navbar-logo">
          <span className="lp-navbar-logo-text">Zembra</span>
        </div>
        <div className="lp-navbar-actions">
          <button className="lp-btn-outline" style={navBtn} onClick={() => navigate('/login')}>Sign in</button>
          <button className="lp-btn-primary" style={navBtn} onClick={() => navigate('/signup')}>Sign up</button>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-hero-dot-grid" />
        <div className="lp-hero-blob-blue" />
        <div className="lp-hero-blob-purple" />
        <div className="lp-hero-shape-amber" />
        <div className="lp-hero-shape-blue" />
        <div className="lp-hero-content">
          <h1 className={`lp-hero-title ${hv}`}>
            Fast, Robust Reliable <br />
            <span className="lp-hero-title-gradient">&</span><br />
            Reviews API
          </h1>
          <p className={`lp-hero-subtitle ${hv}`}>
            Access over 125+ review platforms via Zembra Reviews API. Efficient, cost-effective, with 10,000 free credits on signup for real-time data integration.
          </p>
          <div className={`lp-hero-actions ${hv}`}>
            <button className="lp-btn-primary" style={{ padding: "16px 36px", fontSize: 16 }} onClick={() => navigate('/signup')}>
              GET STARTED FOR FREE →
            </button>
          </div>
        </div>
      </section>

      {/* Remplacez le bloc marquee-wrapper par : */}
      <div style={{ overflow: "hidden", padding: "20px 0", borderTop: "1px solid rgba(46,90,244,0.1)", borderBottom: "1px solid rgba(46,90,244,0.1)" }}>
        {loading && <div className="marquee-loading">Chargement...</div>}
        {error && <div className="marquee-error">Impossible de charger les plateformes.</div>}
        {!loading && !error && (
          <motion.div
            style={{ display: "flex", width: "max-content" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          >
            {[...platforms, ...platforms].map((p, i) => (
              <motion.span
                key={i}
                className="platform-pill"
                whileHover={{ scale: 1.1, y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ cursor: "default" }}
              >
                ● {p.label}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>

      <section className="lp-features-section">
        <div className="lp-features-grid">
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} delay={i * 100} />)}
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-logo">
          <span className="lp-footer-logo-text">Zembra</span>
        </div>
        <p className="lp-footer-copy">© Zembra. Tous droits réservés.</p>
      </footer>
    </div>
  );
}