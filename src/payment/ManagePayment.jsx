import { useState } from "react";
import ModalCard from "./ModalCard";
import "./ManagePayment.css";

export default function ManagePayment() {
  const [selectedPlan, setSelectedPlan] = useState("Startup");
  const [showAddCard, setShowAddCard] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' ou 'buy'

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "visa", last4: "4242", expiry: "12/27", isDefault: true },
    { id: 2, type: "mastercard", last4: "8888", expiry: "06/26", isDefault: false },
  ]);

  const plans = [
    {
      id: "Basic",
      name: "Basic",
      price: 50,
      period: "month",
      features: ["138 pages", "34,500 reviews", "$1 = 1,000 credits", "1 credit = $0.0010"],
    },
    {
      id: "Startup",
      name: "Startup",
      price: 500,
      period: "45 days",
      features: ["1,743 pages", "435,750 reviews", "$1 = 1,250 credits", "1 credit = $0.0008"],
      recommended: true,
    },
    {
      id: "Business",
      name: "Business",
      price: 1000,
      period: "45 days",
      features: ["3,991 pages", "997,750 reviews", "$1 = 1,667 credits", "1 credit = $0.0006"],
    },
    {
      id: "Enterprise",
      name: "Enterprise",
      price: 5000,
      period: "month",
      features: ["9,360 pages", "2,340,000 reviews", "$1 = 2,000 credits", "1 credit = $0.0005"],
    },
  ];

  const handleAddCard = (newCard) => {
    setPaymentMethods(prev => [...prev, newCard]);
  };

  const handleBuyPlan = (planId) => {
    setSelectedPlan(planId);
    setModalMode("buy");
    setShowAddCard(true);
  };

  return (
    <div className="payment-page">
      {/* Header */}
      <div className="payment-header">
        <h1 className="payment-title">Load Credits</h1>
      </div>
      {/* Current Plan Banner */}
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

      {/* Plans */}
      <section className="plans-section">
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.id} className={`plan-card ${selectedPlan === plan.id ? "selected" : ""} ${plan.recommended ? "recommended" : ""}`}>
              {plan.recommended && <span className="recommended-badge">Recommended</span>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-amount">${plan.price}</span>
                <span className="price-period">/{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i} className="plan-feature">{f}</li>
                ))}
              </ul>
              <button className="plan-button" onClick={() => handleBuyPlan(plan.id)}>Buy</button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="payment-methods-section">
        <div className="section-header">
          <h2 className="section-title">Payment Methods</h2>
          <button className="add-card-btn" onClick={() => {setModalMode("add"); setShowAddCard(true);}}>Add Card</button>
        </div>
        <div className="payment-methods-list">
          {paymentMethods.map(m => (
            <div key={m.id} className={`payment-method-card ${m.isDefault ? "default" : ""}`}>
              <div className="card-details">
                <span className="card-type">{m.type === "visa" ? "Visa" : "Mastercard"}</span>
                <span className="card-number">**** **** **** {m.last4}</span>
                <span className="card-expiry">Expires {m.expiry}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ModalCard */}
      <ModalCard show={showAddCard} mode={modalMode} onClose={() => setShowAddCard(false)} onAddCard={handleAddCard} />
    </div>
  );
}