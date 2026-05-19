import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createField, updateField } from "../../utils/fieldService";
import "./AddFieldForm.css";

const CONTEXT_OPTIONS = [
  {
    value: "listing",
    label: "Listing",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
        <line x1="5" y1="4" x2="13" y2="4" />
        <line x1="5" y1="8" x2="13" y2="8" />
        <line x1="5" y1="12" x2="13" y2="12" />
        <circle cx="2.5" cy="4" r="1" fill="currentColor" stroke="none" />
        <circle cx="2.5" cy="8" r="1" fill="currentColor" stroke="none" />
        <circle cx="2.5" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    value: "review",
    label: "Review",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5z" />
      </svg>
    ),
  },
];

const DESC_MAX = 200;
const INITIAL_FORM = { name: "", label: "", description: "", context: "" };

export default function AddFieldForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // field is injected by the list via: navigate("/AddFieldForm", { state: { field } })
  const field     = location.state?.field ?? null;
  const isEditing = !!field;

  const [form, setForm]       = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [status, setStatus]   = useState(null); // { type: "success"|"error", message }
  const [loading, setLoading] = useState(false);

  // Pre-fill form when arriving in edit mode
  useEffect(() => {
    if (field) {
      setForm({
        name:        field.name        ?? "",
        label:       field.label       ?? "",
        description: field.description ?? "",
        context:     field.context     ?? "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setTouched({});
    setStatus(null);
  }, [field]); // re-run if the user edits a different field

  /* ── Validation ── */
  const errors = {
    name:        touched.name    && !form.name.trim()   ? "Field name is required."     : null,
    label:       touched.label   && !form.label.trim()  ? "Label is required."          : null,
    description: form.description.length > DESC_MAX     ? `Max ${DESC_MAX} characters.` : null,
    context:     touched.context && !form.context       ? "Please select a context."    : null,
  };

  const isValid =
    form.name.trim() &&
    form.label.trim() &&
    form.context &&
    form.description.length <= DESC_MAX;

  /* ── Handlers ── */
  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleBlur = (key) => () =>
    setTouched((t) => ({ ...t, [key]: true }));

  const handleContextSelect = (value) => {
    setForm((f) => ({ ...f, context: value }));
    setTouched((t) => ({ ...t, context: true }));
  };

  const handleReset = () => {
    setForm(
      isEditing
        ? { name: field.name ?? "", label: field.label ?? "",
            description: field.description ?? "", context: field.context ?? "" }
        : INITIAL_FORM
    );
    setTouched({});
    setStatus(null);
  };

  const handleSubmit = async () => {
    setTouched({ name: true, label: true, description: true, context: true });
    if (!isValid) return;

    setLoading(true);
    setStatus(null);

    const payload = {
      name:        form.name.trim(),
      label:       form.label.trim(),
      description: form.description.trim(),
      context:     form.context,
    };

    const { field: result, error } = isEditing
      ? await updateField(field.id, payload)
      : await createField(payload);

    setLoading(false);

    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setStatus({
      type: "success",
      message: isEditing
        ? `Field "${result?.label ?? payload.label}" updated successfully!`
        : `Field "${result?.label ?? payload.label}" added successfully!`,
    });

    // After create: reset form. After edit: go back to the list.
    if (isEditing) {
      setTimeout(() => navigate(-1), 1200);
    } else {
      setForm(INITIAL_FORM);
      setTouched({});
    }
  };

  const descLen = form.description.length;

  /* ── Render ── */
  return (
    <div className="anf-page">
      <div className="anf-card">

        {/* ── Header ── */}
        <div className="anf-header">
          <div className="anf-header-icon">
            {isEditing ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="3" width="13" height="13" rx="2" />
                <path d="M5 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
              </svg>
            )}
          </div>
          <div>
            <div className="anf-title">{isEditing ? "Edit field" : "Add field"}</div>
            <div className="anf-subtitle">
              {isEditing
                ? `Editing "${field.label}"`
                : "Configure a new field and its display context"}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="anf-body">

          {status?.type === "success" && (
            <div className="anf-success-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {status.message}
            </div>
          )}

          {status?.type === "error" && (
            <div className="anf-error-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <circle cx="12" cy="16" r=".5" fill="currentColor" />
              </svg>
              {status.message}
            </div>
          )}

          {/* Name + Label */}
          <div className="anf-row">
            <div className="anf-field">
              <label className="anf-label">
                Name <span className="anf-label-required">*</span>
              </label>
              <input
                className={`anf-input${errors.name ? " error" : ""}`}
                type="text"
                placeholder="e.g. product_id"
                value={form.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                disabled={loading}
              />
              {errors.name
                ? <span className="anf-error-msg"><ErrorIcon />{errors.name}</span>
                : <span className="anf-hint">Internal identifier.</span>}
            </div>

            <div className="anf-field">
              <label className="anf-label">
                Label <span className="anf-label-required">*</span>
              </label>
              <input
                className={`anf-input${errors.label ? " error" : ""}`}
                type="text"
                placeholder="e.g. Product ID"
                value={form.label}
                onChange={handleChange("label")}
                onBlur={handleBlur("label")}
                disabled={loading}
              />
              {errors.label
                ? <span className="anf-error-msg"><ErrorIcon />{errors.label}</span>
                : <span className="anf-hint">Displayed in the UI.</span>}
            </div>
          </div>

          {/* Description */}
          <div className="anf-field">
            <label className="anf-label">
              Description
              <span className="anf-label-badge">Optional</span>
            </label>
            <div className="anf-textarea-wrap">
              <textarea
                className={`anf-textarea${errors.description ? " error" : ""}`}
                placeholder="Briefly describe what this field represents…"
                value={form.description}
                onChange={handleChange("description")}
                onBlur={handleBlur("description")}
                rows={3}
                disabled={loading}
              />
              <span className={`anf-char-count${descLen > DESC_MAX * 0.85 ? " warn" : ""}`}>
                {descLen}/{DESC_MAX}
              </span>
            </div>
            {errors.description
              ? <span className="anf-error-msg"><ErrorIcon />{errors.description}</span>
              : <span className="anf-hint">Short explanation shown to end-users on hover.</span>}
          </div>

          {/* Context */}
          <div className={`anf-field${errors.context ? " anf-field--error" : ""}`}>
            <label className="anf-label">
              Context <span className="anf-label-required">*</span>
            </label>
            <div className="anf-context-group">
              {CONTEXT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`anf-context-btn${form.context === opt.value ? " anf-context-btn--active" : ""}`}
                  onClick={() => handleContextSelect(opt.value)}
                  disabled={loading}
                >
                  <span className="anf-context-icon">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.context && (
              <span className="anf-error-msg"><ErrorIcon />{errors.context}</span>
            )}
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="anf-footer">
          <span className="anf-footer-info">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="8" cy="8" r="6.5" />
              <line x1="8" y1="5" x2="8" y2="8.5" />
              <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
            </svg>
            Fields marked <span className="anf-footer-star">*</span> are required
          </span>
          <div className="anf-footer-actions">
            <button
              className="anf-btn anf-btn--secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
            <button
              className="anf-btn anf-btn--primary"
              onClick={handleSubmit}
              disabled={!isValid || loading}
            >
              {loading ? (
                <svg className="anf-spinner" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
              ) : isEditing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
              {loading ? "Saving…" : isEditing ? "Save changes" : "Add field"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="5" x2="8" y2="8.5" />
      <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
    </svg>
  );
}