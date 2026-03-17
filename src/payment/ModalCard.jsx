import { useState } from "react";
import "./ModalCard.css";

export default function ModalCard({ show, onClose, onAddCard, mode = "add" }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholder, setCardholder] = useState("");

  if (!show) return null;

  const handleOverlayClick = () => onClose();
  const handleContentClick = (e) => e.stopPropagation();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Déterminer le type de carte par les premiers chiffres (simplifié)
    let type = cardNumber.startsWith("5") ? "mastercard" : "visa";

    const newCard = {
      id: Date.now(),
      type,
      last4: cardNumber.slice(-4),
      expiry,
      isDefault: false,
    };

    onAddCard(newCard);

    // Réinitialiser le formulaire
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setCardholder("");

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h3>{mode === "buy" ? "Validate Payment Method" : "Add Payment Method"}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form className="add-card-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Number</label>
            <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" />
            </div>
            <div className="form-group">
              <label>CVC</label>
              <input value={cvc} onChange={e => setCvc(e.target.value)} placeholder="123" />
            </div>
          </div>
          <div className="form-group">
            <label>Cardholder Name</label>
            <input value={cardholder} onChange={e => setCardholder(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">
              {mode === "buy" ? "Validate Card" : "Add Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}