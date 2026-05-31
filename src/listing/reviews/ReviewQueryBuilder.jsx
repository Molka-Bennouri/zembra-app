import { useState } from "react";
import "../details/QueryBuild.css";

import { useNetworks } from "../../hooks/useNetworks";
import { useReviewFields } from "../../hooks/useReviewFields";
import { useReviewQuery } from "../../hooks/useReviewQuery";
import { validateSlug } from "../../utils/validateSlug";
import { api } from "../../utils/api";
import CurlRequest from "../components/CurlRequest";
import QueryResponse from "../components/QueryResponse";
import AiSummary from "./ai/AiSummary";

const API_BASE = `${api.getBaseUrl()}`;

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

function ReviewQueryBuilder({ onQueryExecuted }) {
  const [network, setNetwork] = useState("");
  const [slug, setSlug] = useState("");
  const [includeRaw, setIncludeRaw] = useState(false);

  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [postedBefore, setPostedBefore] = useState("");
  const [postedAfter, setPostedAfter] = useState("");

  const [minRating, setMinRating] = useState(null);
  const [maxRating, setMaxRating] = useState(null);

  const { networks = [] } = useNetworks();
  const {
    reviewFields = [],
    selectedFields = {},
    handleFieldChange,
    activeFields,
    loading: fieldsLoading,
    error: fieldsError
  } = useReviewFields();

  const selectedNetwork = networks.find(n => String(n.id) === String(network));
  const selectedPattern = selectedNetwork?.slug_pattern ?? null;
  const validation = validateSlug(slug, selectedPattern);
  const networkName = selectedNetwork?.name ?? "";

  const { responseData, loading: queryLoading, status, executeQuery } = useReviewQuery({ apiBase: API_BASE });

  const handleExecute = async () => {
    await executeQuery({
      network: networkName,
      slug,
      selectedFields,
      includeRaw,
      sortBy,
      sortDirection,
      minRating,
      maxRating,
      postedBefore: postedBefore ? Math.floor(new Date(postedBefore).getTime() / 1000) : null,
      postedAfter: postedAfter ? Math.floor(new Date(postedAfter).getTime() / 1000) : null,
    });
    if (onQueryExecuted) onQueryExecuted();
  };

  const reviewTexts = responseData?.reviews ?? [];

  const renderFieldChips = () => {
    if (fieldsLoading) {
      return (
        <div className="qb-skeleton-list">
           <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 16 }}></div>
           <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 16 }}></div>
        </div>
      );
    }
    if (fieldsError) {
      return <p className="qb-error-text"><i className="fa-solid fa-triangle-exclamation"></i> {fieldsError}</p>;
    }

    return (
      <div className="qb-chips-grid">
        {reviewFields.map((field) => {
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
    <div className="qb-container qb-balanced">
      <div className="qb-card qb-form-card">
        <div className="qb-balanced-layout">

          <div className="qb-form-section qb-balanced-target">
            <h3 className="qb-section-title">Target Setup</h3>
            <div className="qb-balanced-target-row">
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
                    {networks.map(n => (
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
          </div>

          <div className="qb-balanced-columns">
            <div className="qb-form-section qb-balanced-side">
              <h3 className="qb-section-title">Review Filters</h3>

              <div className="qb-balanced-filter-grid">
                <div className="qb-form-group">
                  <label className="qb-label">Sort Attribute</label>
                  <div className="qb-select-wrapper">
                    <select className="qb-input qb-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="">Default</option>
                      <option value="timestamp">Publish time</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>

                <div className="qb-form-group">
                  <label className="qb-label">Sort Direction</label>
                  <div className="qb-select-wrapper">
                    <select className="qb-input qb-select" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                      <option value="">Default</option>
                      <option value="ASC">Ascending</option>
                      <option value="DESC">Descending</option>
                    </select>
                  </div>
                </div>

                <div className="qb-form-group">
                  <label className="qb-label">Min Rating</label>
                  <div className="qb-select-wrapper">
                    <select className="qb-input qb-select" onChange={e => setMinRating(e.target.value || null)}>
                      <option value="">Any</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>

                <div className="qb-form-group">
                  <label className="qb-label">Max Rating</label>
                  <div className="qb-select-wrapper">
                    <select className="qb-input qb-select" onChange={e => setMaxRating(e.target.value || null)}>
                      <option value="">Any</option>
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                    </select>
                  </div>
                </div>

                <div className="qb-form-group">
                  <label className="qb-label">Posted After</label>
                  <input
                    type="date"
                    className="qb-input"
                    value={postedAfter}
                    onChange={(e) => setPostedAfter(e.target.value)}
                  />
                </div>

                <div className="qb-form-group">
                  <label className="qb-label">Posted Before</label>
                  <input
                    type="date"
                    className="qb-input"
                    value={postedBefore}
                    onChange={(e) => setPostedBefore(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="qb-form-section qb-balanced-fields">
              <div className="qb-section-header">
                <h3 className="qb-section-title">Response Fields</h3>
                <span className="qb-badge-count">{activeFields.length} selected</span>
              </div>

              <div className="qb-fields-container">
                {renderFieldChips()}
              </div>

              <div className="qb-balanced-options">
                <h3 className="qb-section-title">Options</h3>
                <div className="qb-chips-grid">
                  <button
                    className={`qb-chip ${includeRaw ? "active" : ""}`}
                    onClick={() => setIncludeRaw(!includeRaw)}
                  >
                    {includeRaw ? <i className="fa-solid fa-check qb-chip-icon"></i> : <i className="fa-solid fa-code qb-chip-icon"></i>}
                    Include Raw Data
                  </button>
                </div>
              </div>

              {status && status !== 'idle' && (
                <div className="qb-form-group">
                  {status === 'pending' && (
                    <p className="qb-validation-msg" style={{ color: 'var(--warning)' }}>
                      <i className="fa-solid fa-circle-notch fa-spin"></i> Processing with Zembra backend...
                    </p>
                  )}
                  {status === 'completed' && (
                    <p className="qb-validation-msg valid">
                      <i className="fa-solid fa-circle-check"></i> Reviews fetched successfully!
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="qb-validation-msg invalid">
                      <i className="fa-solid fa-circle-exclamation"></i> Something went wrong.
                    </p>
                  )}
                </div>
              )}

              <div className="qb-execute-container qb-balanced-execute">
                <button
                  className={`qb-execute-btn ${queryLoading ? "loading" : ""}`}
                  onClick={handleExecute}
                  disabled={!networkName || !slug || !validation.valid || queryLoading}
                >
                  {queryLoading ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      Fetching reviews...
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
      </div>

      {/* CURL Request */}
      <div className="qb-preview-grid">
        <CurlRequest
          method="POST"
          api={`https://api.zembra.io/reviews/?network=${encodeURIComponent(networkName)}&slug=${encodeURIComponent(slug)}&monitoring=none`}
          fields={activeFields}
          includeRaw={includeRaw}
          sortBy={sortBy}
          sortDirection={sortDirection}
          postedBefore={postedBefore}
          postedAfter={postedAfter}
        />

        {/* Query Response */}
        <QueryResponse data={responseData?.zembra ?? responseData} />

        {/* AI Summary */}
        {reviewTexts.length > 0 && (
          <AiSummary reviews={reviewTexts} />
        )}
      </div>
    </div>
  );
}

export default ReviewQueryBuilder;