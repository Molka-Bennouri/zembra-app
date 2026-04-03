import { useState } from "react";
import "./Dashboard.css";

const METRICS = [
  { label: "Total reviews", value: "48,320", sub: "+12% this week", up: true },
  { label: "Credits used", value: "6,841", sub: "of 10,000 free", up: null },
  { label: "Platforms scraped", value: "18", sub: "+3 this month", up: true },
];

const RATINGS = [
  { stars: "5 stars", pct: 72, color: "#639922" },
  { stars: "4 stars", pct: 15, color: "#378ADD" },
  { stars: "3 stars", pct: 7,  color: "#BA7517" },
  { stars: "2 stars", pct: 4,  color: "#D85A30" },
  { stars: "1 star",  pct: 2,  color: "#E24B4A" },
];

const PLATFORMS = [
  { name: "Airbnb",   count: "12,400 reviews", status: "active" },
  { name: "Viator",   count: "8,920 reviews",  status: "active" },
  { name: "Kununu",   count: "5,310 reviews",  status: "active" },
  { name: "Justia",   count: "3,100 reviews",  status: "idle"   },
  { name: "Lawtally", count: "1,870 reviews",  status: "idle"   },
];

const REVIEWS = [
  { initials: "JM", name: "Jean Martin", platform: "Airbnb",  stars: 5, sentiment: "positive", text: "Excellent séjour, hôte très réactif et appartement conforme aux photos." },
  { initials: "SL", name: "Sara Lopez",  platform: "Viator",  stars: 3, sentiment: "neutral",  text: "Tour correct mais guide peu disponible pour les questions du groupe." },
  { initials: "AK", name: "Ali Karimi",  platform: "Kununu",  stars: 2, sentiment: "negative", text: "Management peu transparent, promesses non tenues lors de l'onboarding." },
];

function Stars({ count }) {
  return (
    <span className="db-stars">
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

export default function Dashboard() {
  const [active] = useState("main");

  return (
    <div className="db-layout">

      <main className="db-main full">
        <div className="db-topbar">
          <span className="db-topbar-title">Overview</span>
          <div className="db-topbar-right">
            <span className="db-badge-blue">125+ platforms</span>
            <span className="db-badge-green">API active</span>
          </div>
        </div>

        <div className="db-metrics">
          {METRICS.map(m => (
            <div className="db-metric" key={m.label}>
              <div className="db-metric-label">{m.label}</div>
              <div className="db-metric-value">{m.value}</div>
              <div className={`db-metric-sub ${m.up === true ? "up" : m.up === false ? "down" : ""}`}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="db-grid2">
          <div className="db-card">
            <div className="db-card-title">Rating distribution</div>
            {RATINGS.map(r => (
              <div className="db-bar-row" key={r.stars}>
                <span className="db-bar-label">{r.stars}</span>
                <div className="db-bar-track">
                  <div className="db-bar-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
                <span className="db-bar-count">{r.pct}%</span>
              </div>
            ))}
          </div>

          <div className="db-card">
            <div className="db-card-title">Top platforms</div>
            {PLATFORMS.map(p => (
              <div className="db-platform-row" key={p.name}>
                <span className="db-platform-name">{p.name}</span>
                <span className="db-platform-count">{p.count}</span>
                <span className={`db-platform-status ${p.status === "active" ? "s-active" : "s-idle"}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-title">Recent reviews</div>
          {REVIEWS.map(r => (
            <div className="db-review-row" key={r.name}>
              <div className="db-review-avatar">{r.initials}</div>
              <div className="db-review-body">
                <div className="db-review-meta">
                  <span className="db-review-name">{r.name}</span>
                  <span className="db-review-platform">· {r.platform}</span>
                  <Stars count={r.stars} />
                  <span className={`db-sentiment ${r.sentiment}`}>{r.sentiment}</span>
                </div>
                <p className="db-review-text">{r.text}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}