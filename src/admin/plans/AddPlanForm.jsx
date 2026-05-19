import { useState } from "react";
import "./AddPlanForm.css";

const DURATION_OPTIONS = [
  { value: "7",   label: "7 days" },
  { value: "14",  label: "14 days" },
  { value: "30",  label: "30 days" },
  { value: "90",  label: "90 days" },
  { value: "180", label: "180 days" },
  { value: "365", label: "1 year" },
];

export default function AddPlanForm() {
  const [form, setForm] = useState({
    name:          "",
    amount:        "",
    duration:      "",
    stripePriceId: "",
    features:      "",
    recommended:   false,
  });
  const [touched, setTouched]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name:
      touched.name && !form.name.trim()
        ? "Plan name is required."
        : null,
    amount:
      touched.amount && !form.amount
        ? "Amount is required."
        : touched.amount && (isNaN(Number(form.amount)) || Number(form.amount) < 0)
        ? "Enter a valid positive amount."
        : null,
    duration:
      touched.duration && !form.duration
        ? "Please select a duration."
        : null,
    stripePriceId:
      touched.stripePriceId && form.stripePriceId && !/^price_/.test(form.stripePriceId)
        ? 'Stripe price IDs start with "price_".'
        : null,
  };

  const isValid =
    form.name.trim() &&
    form.amount !== "" &&
    !isNaN(Number(form.amount)) &&
    Number(form.amount) >= 0 &&
    form.duration &&
    !errors.stripePriceId;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleBlur = (field) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleToggleRecommended = () =>
    setForm((f) => ({ ...f, recommended: !f.recommended }));

  const handleSubmit = () => {
    setTouched({ name: true, amount: true, duration: true, stripePriceId: true, features: true });
    if (!isValid) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
    setForm({ name: "", amount: "", duration: "", stripePriceId: "", features: "", recommended: false });
    setTouched({});
  };

  const handleReset = () => {
    setForm({ name: "", amount: "", duration: "", stripePriceId: "", features: "", recommended: false });
    setTouched({});
    setSubmitted(false);
  };

  const featureList = form.features
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="apf-page">
      <div className="apf-card">

        {/* ── Header ── */}
        <div className="apf-header">
          <div className="apf-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <div className="apf-title">Add payment plan</div>
            <div className="apf-subtitle">Define a new plan with pricing and features</div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="apf-body">

          {submitted && (
            <div className="apf-success-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Plan created successfully!
            </div>
          )}

          {/* Row 1 — Name + Amount */}
          <div className="apf-row">
            <div className="apf-field">
              <label className="apf-label">
                Name <span className="apf-label-required">*</span>
              </label>
              <input
                className={`apf-input${errors.name ? " error" : ""}`}
                type="text"
                placeholder="e.g. Pro"
                value={form.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {errors.name ? (
                <span className="apf-error-msg"><ErrIcon />{errors.name}</span>
              ) : (
                <span className="apf-hint">Public-facing plan name.</span>
              )}
            </div>

            <div className="apf-field">
              <label className="apf-label">
                Amount <span className="apf-label-required">*</span>
              </label>
              <div className="apf-input-prefix-wrap">
                <span className="apf-input-prefix">$</span>
                <input
                  className={`apf-input apf-input--prefixed${errors.amount ? " error" : ""}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                />
              </div>
              {errors.amount ? (
                <span className="apf-error-msg"><ErrIcon />{errors.amount}</span>
              ) : (
                <span className="apf-hint">Price in USD.</span>
              )}
            </div>
          </div>

          {/* Row 2 — Duration + Stripe Price ID */}
          <div className="apf-row">
            <div className="apf-field">
              <label className="apf-label">
                Duration <span className="apf-label-required">*</span>
              </label>
              <div className="apf-select-wrap">
                <select
                  className={`apf-select${errors.duration ? " error" : ""}`}
                  value={form.duration}
                  onChange={handleChange("duration")}
                  onBlur={handleBlur("duration")}
                >
                  <option value="" disabled>Select duration</option>
                  {DURATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="apf-select-arrow">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 6 8 10 12 6" />
                  </svg>
                </span>
              </div>
              {errors.duration ? (
                <span className="apf-error-msg"><ErrIcon />{errors.duration}</span>
              ) : (
                <span className="apf-hint">Billing cycle length.</span>
              )}
            </div>

            <div className="apf-field">
              <label className="apf-label">
                Stripe price ID
                <span className="apf-label-badge">Optional</span>
              </label>
              <input
                className={`apf-input apf-input--mono${errors.stripePriceId ? " error" : ""}`}
                type="text"
                placeholder="price_xxxxxxxxxx"
                value={form.stripePriceId}
                onChange={handleChange("stripePriceId")}
                onBlur={handleBlur("stripePriceId")}
              />
              {errors.stripePriceId ? (
                <span className="apf-error-msg"><ErrIcon />{errors.stripePriceId}</span>
              ) : (
                <span className="apf-hint">From your Stripe dashboard.</span>
              )}
            </div>
          </div>

          {/* Row 3 — Features + Recommended */}
          <div className="apf-row">
            <div className="apf-field">
              <label className="apf-label">
                Features
                <span className="apf-label-badge">Optional</span>
              </label>
              <div className="apf-textarea-wrap">
                <textarea
                  className="apf-textarea"
                  placeholder={"Unlimited projects\nPriority support\nCustom domain"}
                  value={form.features}
                  onChange={handleChange("features")}
                  rows={5}
                />
              </div>
              <span className="apf-hint">One feature per line. {featureList.length > 0 && <strong>{featureList.length} feature{featureList.length > 1 ? "s" : ""} added.</strong>}</span>
            </div>

            <div className="apf-field apf-field--col">

              {/* Recommended toggle */}
              <div>
                <label className="apf-label">Recommended</label>
                <button
                  type="button"
                  className={`apf-toggle-card${form.recommended ? " apf-toggle-card--active" : ""}`}
                  onClick={handleToggleRecommended}
                >
                  <div className="apf-toggle-card-left">
                    <div className="apf-toggle-card-icon">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5z" />
                      </svg>
                    </div>
                    <div className="apf-toggle-card-text">
                      <span className="apf-toggle-card-label">
                        {form.recommended ? "Recommended" : "Not recommended"}
                      </span>
                      <span className="apf-toggle-card-desc">
                        {form.recommended ? "Highlighted to users" : "Standard display"}
                      </span>
                    </div>
                  </div>
                  <div className={`apf-switch${form.recommended ? " apf-switch--on" : ""}`}>
                    <div className="apf-switch-thumb" />
                  </div>
                </button>
                <span className="apf-hint" style={{ marginTop: 6 }}>Badges the plan as most popular.</span>
              </div>

              {/* Preview pill */}
              {form.name && (
                <div className="apf-preview">
                  <span className="apf-preview-label">Preview</span>
                  <div className="apf-preview-pill">
                    <span className="apf-preview-name">{form.name}</span>
                    {form.amount !== "" && (
                      <span className="apf-preview-price">
                        ${Number(form.amount || 0).toFixed(2)}
                        {form.duration && <span className="apf-preview-period">/{form.duration}d</span>}
                      </span>
                    )}
                    {form.recommended && (
                      <span className="apf-preview-badge">Popular</span>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="apf-footer">
          <span className="apf-footer-info">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="8" cy="8" r="6.5" />
              <line x1="8" y1="5" x2="8" y2="8.5" />
              <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
            </svg>
            Fields marked <span className="apf-footer-star">*</span> are required
          </span>
          <div className="apf-footer-actions">
            <button className="apf-btn apf-btn--secondary" onClick={handleReset}>
              Reset
            </button>
            <button
              className="apf-btn apf-btn--primary"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create plan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function ErrIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="5" x2="8" y2="8.5" />
      <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
    </svg>
  );
}