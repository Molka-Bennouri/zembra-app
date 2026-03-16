import { useState } from "react"
import "./ManagePayment.css"

export default function ManagePayment() {
  const [selectedPlan, setSelectedPlan] = useState("Startup")
  const [showAddCard, setShowAddCard] = useState(false)

  const plans = [
    {
      id: "Basic",
      name: "Basic",
      price: 50,
      period: "month",
      features: [
        "138 pages",
        "34,500 reviews",
        "$1 = 1,000 credits",
        "1 credit = $0.0010"
      ]
    },
    {
      id: "Startup",
      name: "Startup",
      price: 500,
      period: "45 days",
      features: [
        "1,743 pages",
        "435,750 reviews",
        "$1 = 1,250 credits",
        "1 credit = $0.0008",
      ],
      recommended: true
    },
    {
      id: "Business",
      name: "Business",
      price: 1000,
      period: "45 days",
      features: [
        "3,991 pages",
        "997,750 reviews",
        "$1 = 1,667 credits",
        "1 credit = $0.0006",
      ]
    },
    {
      id: "Enterprise",
      name: "Enterprise",
      price: 5000,
      period: "30 days",
      features: [
        "9,360 pages",
        "2,340,000 reviews",
        "$1 = 2,000 credits",
        "1 credit = $0.0005",
      ]
    }
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "visa",
      last4: "4242",
      expiry: "12/27",
      isDefault: true
    },
    {
      id: 2,
      type: "mastercard",
      last4: "8888",
      expiry: "06/26",
      isDefault: false
    }
  ]
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
        </div>
      </div>

      {/* Plans Section */}
      <section className="plans-section">
        <h2 className="section-title">Plans & Pricing</h2>
        <p className="section-subtitle">Choose the plan that fits your needs</p>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? "selected" : ""} ${plan.recommended ? "recommended" : ""}`}
            >
              {plan.recommended && (
                <span className="recommended-badge">Recommended</span>
              )}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-amount">${plan.price}</span>
                <span className="price-period">/{plan.period}</span>
              </div>
              <p className="plan-description">{plan.description}</p>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="plan-feature">
                    <svg className="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`plan-button ${selectedPlan === plan.id ? "current" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {selectedPlan === plan.id ? "Buy" : plan.id === "free" ? "Downgrade" : "Buy"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="payment-methods-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Payment Methods</h2>
            <p className="section-subtitle">Manage your cards and billing details</p>
          </div>
          <button className="add-card-btn" onClick={() => setShowAddCard(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Card
          </button>
        </div>

        <div className="payment-methods-list">
          {paymentMethods.map((method) => (
            <div key={method.id} className={`payment-method-card ${method.isDefault ? "default" : ""}`}>
              <div className="card-icon">
                {method.type === "visa" ? (
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill="#1A1F71" />
                    <path d="M19.5 30H16.5L18.5 18H21.5L19.5 30Z" fill="white" />
                    <path d="M29 18L26.5 26L26 24L25 19.5C25 19.5 24.8 18 23 18H18L18 18.2C18 18.2 20 18.6 22 20L25 30H28L32 18H29Z" fill="white" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill="#EB001B" />
                    <circle cx="20" cy="24" r="10" fill="#EB001B" />
                    <circle cx="28" cy="24" r="10" fill="#F79E1B" />
                    <path d="M24 17.5C26 19.5 27 22 27 24C27 26 26 28.5 24 30.5C22 28.5 21 26 21 24C21 22 22 19.5 24 17.5Z" fill="#FF5F00" />
                  </svg>
                )}
              </div>
              <div className="card-details">
                <span className="card-type">{method.type === "visa" ? "Visa" : "Mastercard"}</span>
                <span className="card-number">**** **** **** {method.last4}</span>
                <span className="card-expiry">Expires {method.expiry}</span>
              </div>
              {method.isDefault && <span className="default-badge">Default</span>}
              <div className="card-actions">
                <button className="card-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="card-action-btn delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="modal-overlay" onClick={() => setShowAddCard(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Payment Method</h3>
              <button className="modal-close" onClick={() => setShowAddCard(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form className="add-card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddCard(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
