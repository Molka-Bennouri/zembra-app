import { useState } from "react";
import ModalCard from "./ModalCard";
import "./ManagePayment.css";
import { usePlans } from "../hooks/usePlans";

export default function ManagePayment() {
  const [selectedPlan, setSelectedPlan] = useState("Startup");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const { plans, loading, error } = usePlans();

  
  const handleBuyPlan = (planId) => {
    setSelectedPlanId(planId);
    setSelectedPlan(planId);
    setModalMode("buy");
    setShowAddCard(true);
  };

  return (
    <div className="payment-page">

      {loading && <p>Loading plans...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="payment-header">
        <h1 className="payment-title">Load Credits</h1>
      </div>

      <div className="current-plan-banner">
        <div className="current-plan-info">
          <span className="current-plan-label">Current Plan</span>
          <span className="current-plan-name">Startup</span>
        </div>
        <div className="current-plan-usage">
          <div className="usage-bar-container">
            <div className="usage-bar" style={{ width: "65%" }} />
          </div>
          <span className="usage-text">6,500 / 10,000 API requests used</span>
        </div>
      </div>

      <section className="plans-section">
        <div className="plans-grid">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`plan-card ${
                selectedPlan === plan.id ? "selected" : ""
              } ${plan.recommended ? "recommended" : ""}`}
            >
              {plan.recommended && (
                <span className="recommended-badge">Recommended</span>
              )}

              <h3 className="plan-name">{plan.name}</h3>

              <div className="plan-price">
                <span className="price-amount">${plan.amount}</span>
                <span className="price-period">/{plan.duration_days} days</span>
              </div>

              <ul className="plan-features">
                {plan.features?.map((f, i) => (
                  <li key={i} className="plan-feature">{f}</li>
                ))}
              </ul>

              <button
                className="plan-button"
                onClick={() => handleBuyPlan(plan.id)}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </section>

      <ModalCard
        show={showAddCard}
        mode={modalMode}
        planId={selectedPlanId}
        onClose={() => setShowAddCard(false)}
      />
    </div>
  );
}