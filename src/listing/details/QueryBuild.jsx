/* ============================================================
   QUERY BUILDER — Visual Builder for Listing API
   Redesign: Postman/Stripe API Explorer aesthetics, dark theme,
   toggle chip buttons instead of checkboxes.
============================================================ */

import { useState } from "react";
import "./QueryBuild.css";

import { useNetworks } from "../../hooks/useNetworks";
import { useFields } from "../../hooks/useFields";
import { validateSlug } from "../../utils/validateSlug";
import { useQuery } from "../../hooks/useQuery";
import { api } from "../../utils/api";

import CurlRequest from "../components/CurlRequest";
import QueryResponse from "../components/QueryResponse";

const API_BASE = `${api.getBaseUrl()}/listing`;

// Helper to map network names to icons
const getNetworkIcon = (networkName) => {
  const icons = {
    Airbnb: "fa-brands fa-airbnb",
    Google_Maps: "fa-brands fa-google",
    Yelp: "fa-brands fa-yelp",
  };
  return icons[networkName] || "fa-solid fa-globe";
};

// Helper for input placeholder based on network
const getSlugPlaceholder = (networkName) => {
  const placeholders = {
    Airbnb: "e.g., room/12345678",
    Google_Maps: "e.g., place/ChIJ... (Place ID)",
    Yelp: "e.g., biz/some-restaurant-new-york",
  };
  return placeholders[networkName] || "slug-per-network";
};

function QueryBuild({ onQueryExecuted }) {
  const { networks = [] } = useNetworks();
  const {
    fields = [],
    selectedFields = {},
    handleFieldChange,
    activeFields,
    loading: fieldsLoading,
    error: fieldsError
  } = useFields();

  const [network, setNetwork] = useState("");
  const [slug, setSlug] = useState("");

  const selectedNetwork = networks.find((n) => String(n.id) === String(network));
  const networkName = selectedNetwork?.name ?? "";

  const selectedPattern = selectedNetwork?.slug_pattern ?? null;
  const validation = validateSlug(slug, selectedPattern);

  const { responseData, loading: queryLoading, executeQuery } = useQuery({
    apiBase: API_BASE,
  });

  const handleExecute = async () => {
    await executeQuery({ networkName, slug, activeFields });
    if (onQueryExecuted) onQueryExecuted();
  };

  // Group fields logically if needed, but for now we render them flat as before, just styled as chips
  const renderFieldChips = () => {
    if (fieldsLoading) {
      return (
        <div className="qb-skeleton-list">
           <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 16 }}></div>
           <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 16 }}></div>
           <div className="skeleton" style={{ width: 90, height: 32, borderRadius: 16 }}></div>
        </div>
      );
    }
    if (fieldsError) {
      return <p className="qb-error-text"><i className="fa-solid fa-triangle-exclamation"></i> {fieldsError}</p>;
    }

    return (
      <div className="qb-chips-grid">
        {fields.map((field) => {
          const isSelected = selectedFields[field.name] ?? false;
          return (
            <button
              key={field.id}
              className={`qb-chip ${isSelected ? "active" : ""}`}
              onClick={() => handleFieldChange(field.name)}
              title={field.description}
            >
              {isSelected && <i className="fa-solid fa-check qb-chip-icon"></i>}
              {field.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="qb-container">
      
      {/* ── Visual Form ── */}
      <div className="qb-card qb-form-card">
        <div className="qb-form-grid">
          
          {/* Form Left: Target */}
          <div className="qb-form-section">
            <h3 className="qb-section-title">Target Setup</h3>
            
            <div className="qb-form-group">
              <label className="qb-label">
                Network <span className="qb-required">*</span>
              </label>
              <div className="qb-select-wrapper">
                {networkName && (
                  <i className={`${getNetworkIcon(networkName)} qb-select-icon`} />
                )}
                <select
                  className={`qb-input qb-select ${networkName ? "has-icon" : ""}`}
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                >
                  <option value="" disabled>Select a platform</option>
                  {networks.map((n) => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="qb-form-group">
              <label className="qb-label">
                Slug / Page ID <span className="qb-required">*</span>
              </label>
              <input
                type="text"
                className="qb-input qb-mono-input"
                placeholder={getSlugPlaceholder(networkName)}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={!network}
              />
              {slug && (
                <div className={`qb-validation-msg ${validation.valid ? "valid" : "invalid"}`}>
                  <i className={`fa-solid ${validation.valid ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
                  {validation.message}
                </div>
              )}
            </div>
          </div>

          {/* Form Right: Fields */}
          <div className="qb-form-section qb-fields-section">
            <div className="qb-section-header">
              <h3 className="qb-section-title">Response Fields</h3>
              <span className="qb-badge-count">{activeFields.length} selected</span>
            </div>
            
            <div className="qb-fields-container">
              {renderFieldChips()}
            </div>
            
            <div className="qb-execute-container">
              <button
                className={`qb-execute-btn ${queryLoading ? "loading" : ""}`}
                onClick={handleExecute}
                disabled={!networkName || !slug || !validation.valid || queryLoading}
              >
                {queryLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    Executing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-play"></i>
                    Run Query
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── cURL & Response Preview (handled by components) ── */}
      <div className="qb-preview-grid">
        <CurlRequest
          method="GET"
          api={`https://api.zembra.io/listing/${networkName}/?slug=${encodeURIComponent(slug)}`}
          fields={activeFields}
        />
        
        <QueryResponse data={responseData} />
      </div>

    </div>
  );
}

export default QueryBuild;