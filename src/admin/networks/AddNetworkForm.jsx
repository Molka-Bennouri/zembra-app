import { useState } from "react";
import { useCreateNetwork } from "../../hooks/useCreateNetwork";
import { useUpdateNetwork } from "../../hooks/useUpdateNetwork";
import { useLocation } from "react-router-dom";
import "./AddNetworkForm.css";

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const validateSlugPattern = (pattern) => {
  if (!pattern) return null;
  return null;
};

// initialData shape: { id, name, label, slug_pattern }
export default function AddNetworkForm({ initialData: initialDataProp = null, onSuccess }) {
  const location = useLocation();
  // Support both direct prop (if used inline) and router state (when navigated to)
  const initialData = initialDataProp ?? location.state?.network ?? null;
  
  const isEditMode = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    label: initialData?.label ?? "",
    slugPattern: initialData?.slug_pattern ?? "",
  });
  const [touched, setTouched] = useState({});

  const createHook = useCreateNetwork();
  const updateHook = useUpdateNetwork();

  const { submit, loading, error: apiError, success } = isEditMode ? updateHook : createHook;

  const errors = {
    name: touched.name && !form.name.trim() ? "Network name is required." : null,
    label: touched.label && !form.label.trim() ? "Label is required." : null,
    slugPattern: touched.slugPattern ? validateSlugPattern(form.slugPattern) : null,
  };

  const isValid =
    form.name.trim() &&
    form.label.trim() &&
    form.slugPattern.trim() &&
    !validateSlugPattern(form.slugPattern);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: field === "slugPattern" ? value.toLowerCase() : value,
    }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    setTouched({ name: true, label: true, slugPattern: true });
    if (!isValid) return;

    let ok;

    if (isEditMode) {
      ok = await submit(initialData.id, {
        label: form.label.trim(),
        slug_pattern: form.slugPattern.trim(),
      });
    } else {
      ok = await submit({
        name: form.name.trim(),
        label: form.label.trim(),
        slug_pattern: form.slugPattern.trim(),
      });
    }

    if (ok) {
      if (!isEditMode) {
        setForm({ name: "", label: "", slugPattern: "" });
        setTouched({});
      }
      onSuccess?.();
    }
  };

  const handleReset = () => {
    setForm({
      name: initialData?.name ?? "",
      label: initialData?.label ?? "",
      slugPattern: initialData?.slug_pattern ?? "",
    });
    setTouched({});
  };

  const previewSlug = form.name ? slugify(form.name) : null;

  return (
    <div className="anf-page">
      <div className="anf-card">
        {/* Header */}
        <div className="anf-header">
          <div className="anf-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="2" />
              <circle cx="5" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
              <line x1="12" y1="7" x2="5" y2="17" />
              <line x1="12" y1="7" x2="19" y2="17" />
            </svg>
          </div>
          <div>
            <div className="anf-title">{isEditMode ? "Edit Network" : "Add Network"}</div>
            <div className="anf-subtitle">
              {isEditMode
                ? `Editing "${initialData.name}"`
                : "Define a new scraped network for client use"}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="anf-body">
          {success && (
            <div className="anf-success-banner">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {isEditMode ? "Network updated successfully!" : "Network created successfully!"}
            </div>
          )}

          {apiError && (
            <div className="anf-error-banner">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {apiError}
            </div>
          )}

          {/* Name — disabled in edit mode since it's the unique identifier */}
          <div className="anf-field">
            <label className="anf-label">
              Name<span className="anf-label-required">*</span>
            </label>
            <div className="anf-input-wrapper">
              <input
                className={`anf-input${errors.name ? " error" : ""}${isEditMode ? " disabled" : ""}`}
                type="text"
                placeholder="e.g. instagram"
                value={form.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                disabled={isEditMode}
              />
            </div>
            {errors.name ? (
              <span className="anf-error-msg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.name}
              </span>
            ) : (
              <span className="anf-hint">
                {isEditMode ? "Network name cannot be changed." : "Unique identifier for this network."}
              </span>
            )}
          </div>

          {/* Label */}
          <div className="anf-field">
            <label className="anf-label">
              Label<span className="anf-label-required">*</span>
              <span className="anf-label-badge">Display name</span>
            </label>
            <input
              className={`anf-input${errors.label ? " error" : ""}`}
              type="text"
              placeholder="e.g. Instagram"
              value={form.label}
              onChange={handleChange("label")}
              onBlur={handleBlur("label")}
            />
            {errors.label ? (
              <span className="anf-error-msg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.label}
              </span>
            ) : (
              <span className="anf-hint">Human-readable label shown in the UI.</span>
            )}
          </div>

          {/* Slug Pattern */}
          <div className="anf-field">
            <label className="anf-label">
              Slug regex pattern<span className="anf-label-required">*</span>
            </label>
            <div className="anf-input-wrapper">
              <input
                className={`anf-input anf-input-mono${errors.slugPattern ? " error" : ""}`}
                type="text"
                placeholder="@^(?:https?://)...$@i"
                value={form.slugPattern}
                onChange={handleChange("slugPattern")}
                onBlur={handleBlur("slugPattern")}
              />
            </div>
            {errors.slugPattern ? (
              <span className="anf-error-msg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.slugPattern}
              </span>
            ) : (
              <span className="anf-hint">
                Define routing using <code>{"{variable}"}</code> and <code>*</code> wildcards.
                Example: <code>{"{env}"}/us-*</code>
              </span>
            )}
          </div>

          {/* Slug Preview — only relevant when creating */}
          {!isEditMode && (
            <div className="anf-slug-preview">
              <span className="anf-slug-preview-label">Slug preview</span>
              {previewSlug ? (
                <span className="anf-slug-preview-value">/{previewSlug}</span>
              ) : (
                <span className="anf-slug-preview-empty">fill in a name to preview the slug</span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="anf-footer">
          <button className="anf-btn anf-btn-secondary" onClick={handleReset} disabled={loading}>
            Reset
          </button>

          <button
            className="anf-btn anf-btn-primary"
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                {isEditMode ? "Saving…" : "Creating…"}
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {isEditMode ? (
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  ) : (
                    <>
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </>
                  )}
                </svg>
                {isEditMode ? "Save changes" : "Create network"}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}