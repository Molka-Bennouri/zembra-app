import { useState, useEffect } from "react";
import ModalCard from "./ModalCard";
import "./ManagePayment.css";
import { usePlans } from "../hooks/usePlans";
import { getAuthHeaders } from "../utils/auth";

export default function ManagePayment() {

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const [currentPlan, setCurrentPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);

  const { plans, loading, error } = usePlans();

  useEffect(() => {

    const fetchCurrentPlan = async () => {

      try {

        const res = await fetch(
          "http://localhost:8000/api/current-plan",
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch current plan");
        }

        const data = await res.json();

        setCurrentPlan(data.plan);

      } catch (err) {

        console.error(err);

      } finally {

        setPlanLoading(false);

      }
    };

    fetchCurrentPlan();

  }, []);

  const handleBuyPlan = (planId) => {
    setSelectedPlanId(planId);
    setModalMode("buy");
    setShowAddCard(true);
  };

  // Loader global
  if (loading || planLoading) {
    return (
      <div className="pp-loader">
        <div className="pp-spinner" />
        <span className="pp-loader-text">
          Loading plans…
        </span>
      </div>
    );
  }

  return (
    <div className="payment-page">

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div className="payment-header">
        <h1 className="payment-title">
          Load Credits
        </h1>
      </div>

      {/* Current Plan */}
      {currentPlan && (
        <div className="current-plan-banner">

          <div className="current-plan-info">

            <span className="current-plan-label">
              Current Plan
            </span>

            <span className="current-plan-name">
              {currentPlan.name}
            </span>

          </div>

          <div className="current-plan-usage">

            {/* Progress Bar */}
            <div className="usage-bar-container">
              <div
                className="usage-bar"
                style={{ width: "100%" }}
              />
            </div>

            <span className="usage-text">
              Active until{" "}
              {new Date(currentPlan.ends_at)
                .toLocaleDateString()}
            </span>

          </div>

        </div>
      )}

      {/* Plans */}
      <section className="plans-section">

        <div className="plans-grid">

          {plans.map((plan) => (

            <div
              key={plan.id}
              className={`plan-card 
                ${selectedPlanId === plan.id ? "selected" : ""}
                ${plan.recommended ? "recommended" : ""}
              `}
            >

              {plan.recommended && (
                <span className="recommended-badge">
                  Recommended
                </span>
              )}

              <h3 className="plan-name">
                {plan.name}
              </h3>

              <div className="plan-price">

                <span className="price-amount">
                  ${plan.amount}
                </span>

                <span className="price-period">
                  /{plan.duration_days} days
                </span>

              </div>

              <ul className="plan-features">

                {plan.features?.map((feature, index) => (
                  <li
                    key={index}
                    className="plan-feature"
                  >
                    {feature}
                  </li>
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

      {/* Modal */}
      <ModalCard
        show={showAddCard}
        mode={modalMode}
        planId={selectedPlanId}
        onClose={() => setShowAddCard(false)}
      />

    </div>
  );
}