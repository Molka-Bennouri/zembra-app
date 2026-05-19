import { useState } from "react";
import "./ModalCard.css";

export default function ModalCard({ show, onClose, mode = "add", planId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!show) return null;

  const handleBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ plan_id: planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred");
        setLoading(false);
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError("Unable to create the payment session");
        setLoading(false);
      }

    } catch (err) {
      setError("Network error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h3>Confirm Payment</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" style={{ fontSize: 14 }}></i>
          </button>
        </div>

        <div className="modal-body" style={{ padding: "24px", textAlign: "center" }}>
          <p style={{ marginBottom: "16px", color: "#555" }}>
            You will be redirected to the secure Stripe payment page.
          </p>

          {error && (
            <p className="card-error" style={{ color: "#e74c3c", marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-save"
              onClick={handleBuy}
              disabled={loading}
            >
              {loading ? "Redirecting..." : "Pay with Stripe"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}