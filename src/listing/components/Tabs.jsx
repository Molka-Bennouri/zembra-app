import "./Tabs.css"

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <section className="tabs-section">
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === "visual" ? "active" : ""}`}
          onClick={() => setActiveTab("visual")}
        >
          <span className="tab-icon">
            <i className="fa-solid fa-code"></i>
          </span>
          Visual Builder
        </button>

        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <span className="tab-icon">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </span>
          Query History
        </button>
      </div>
    </section>
  )
}