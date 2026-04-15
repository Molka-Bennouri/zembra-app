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

  return (
    <div className="query-build-container">
      <div className="query-card">
        <div className="query-two-col">

          {/* LEFT COLUMN */}
          <div className="query-left">

            {/* Network */}
            <div className="section-block">
              <div className="card-header">
                <label className="parameter-label">Network</label>
              </div>
              <select
                className="dropdown-select"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
              >
                <option value=""></option>
                {networks.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>

            {/* Slug */}
            <div className="section-block">
              <div className="card-header">
                <label className="parameter-label">Slug / Page ID</label>
                <span className="required-badge">Required</span>
              </div>
              <input
                type="text"
                className="parameter-input"
                placeholder="slug-per-network"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={!network}
              />
              {slug ? (
                <p className="helper-text" style={{ color: validation.valid ? "green" : "red" }}>
                  {validation.message}
                </p>
              ) : (
                <p className="helper-text">Unique identifier for your listing</p>
              )}
            </div>

            {/* Fields */}
            <div className="section-block">
              <div className="card-header">
                <h3 className="parameter-label">Fields</h3>
              </div>
              {fieldsLoading && <p className="helper-text">Loading fields...</p>}
              {fieldsError && <p className="helper-text" style={{ color: 'red' }}>{fieldsError}</p>}
              {!fieldsLoading && !fieldsError && (
                <div className="fields-grid">
                  {reviewFields.map(f => (
                    <div className="checkbox-group" key={f.id} title={f.description}>
                      <input
                        type="checkbox"
                        id={f.name}
                        checked={selectedFields[f.name] ?? false}
                        onChange={() => handleFieldChange(f.name)}
                        className="checkbox-input"
                      />
                      <label htmlFor={f.name} className="checkbox-label">{f.label}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="query-right">

            {/* Include Raw */}
            <div className="section-block">
              <div className="card-header">
                <label className="parameter-label">Include Raw Data</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  checked={includeRaw}
                  onChange={() => setIncludeRaw(!includeRaw)}
                  className="checkbox-input"
                />
                <label className="checkbox-label">Enable</label>
              </div>
            </div>

            {/* Filters */}
            <div className="section-block">
              <div className="card-header">
                <h3 className="parameter-label">Review Filters</h3>
              </div>

              <label>Sorting attribute</label>
              <select
                className="dropdown-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value=""></option>
                <option value="timestamp">Publish time</option>
                <option value="rating">Rating</option>
              </select>

              <label>Sorting direction</label>
              <select
                className="dropdown-select"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
              >
                <option value=""></option>
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
              <label>Min rating</label>
<select className="dropdown-select" onChange={e => setMinRating(e.target.value || null)}>
  <option value="">select an option</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
</select>

<label>Max rating</label>
<select className="dropdown-select" onChange={e => setMaxRating(e.target.value || null)}>
  <option value="">select an option</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
</select>

              <label>Posted before</label>
              <input
                id="postedBefore"
                type="date"
                className="parameter-input"
                value={postedBefore}
                onChange={(e) => setPostedBefore(e.target.value)}
              />

              <label>Posted after</label>
              <input
                id="postedAfter"
                type="date"
                className="parameter-input"
                value={postedAfter}
                onChange={(e) => setPostedAfter(e.target.value)}
              />
            </div>

            {/* Status indicator */}
            {status === 'pending' && (
              <p className="helper-text" style={{ color: 'orange' }}>
                ⏳ Waiting for Zembra to process...
              </p>
            )}
            {status === 'completed' && (
              <p className="helper-text" style={{ color: 'green' }}>
                ✅ Reviews fetched successfully!
              </p>
            )}
            {status === 'error' && (
              <p className="helper-text" style={{ color: 'red' }}>
                ❌ Something went wrong.
              </p>
            )}

            {/* Execute Button */}
            <div className="section-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <button
                className="execute-btn"
                onClick={handleExecute}
                disabled={!networkName || !slug || !validation.valid || queryLoading}
              >
                <i className="fa-solid fa-bolt fa-xs"></i>
                {queryLoading ? "Fetching reviews..." : "Execute Query"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* CURL Request */}
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
  );
}

export default ReviewQueryBuilder;