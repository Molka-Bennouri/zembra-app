import { useState } from "react";
import "../details/QueryBuild.css";

import { useNetworks } from "../../hooks/useNetworks";
import { useReviewFields } from "../../hooks/useReviewFields";
import { useReviewQuery } from "../../hooks/useReviewQuery";
import CurlRequest from "../components/CurlRequest";
import QueryResponse from "../components/QueryResponse";

const API_URL = "https://api.zembra.io/reviews";
const API_KEY = "hYPXWQH8jYS5JU5eIiUgVpDqNBnrXOCZX4fCGTiuC5pDSaiG45LCOT20bnf1GYYifHkMgQrVi2MPZGF6awVAoawySE2oVXYjHzLuxDFVBNXPPkZpUBFiavMxgK1E7jEu";

function ReviewQueryBuilder() {
  const [network, setNetwork] = useState("");
  const [slug, setSlug] = useState("");
  const [includeRaw, setIncludeRaw] = useState(false);

  const { networks = [] } = useNetworks();
  const { reviewFields = [], selectedFields = {}, handleFieldChange, activeFields, loading: fieldsLoading, error: fieldsError } = useReviewFields();

  const selectedNetwork = networks.find(n => String(n.id) === String(network));
  const networkName = selectedNetwork?.name ?? "";

  // Hook ReviewQuery
  const { responseData, loading: queryLoading, executeQuery } = useReviewQuery({ apiUrl: API_URL });

  // Champs query
  const fieldsQuery = [
    ...activeFields,
  ];

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
              <select className="dropdown-select" value={network} onChange={(e) => setNetwork(e.target.value)}>
                <option value=""></option>
                {networks.map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            {/* Slug */}
            <div className="section-block">
              <div className="card-header">
                <label className="parameter-label">Slug / Page ID</label>
                <span className="required-badge">Required</span>
              </div>
              <input type="text" className="parameter-input" placeholder="slug-per-network" value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!network} />
            </div>

            {/* Fields */}
            <div className="section-block">
              <div className="card-header"><h3 className="parameter-label">Fields</h3></div>
              {fieldsLoading && <p className="helper-text">Loading fields...</p>}
              {fieldsError && <p className="helper-text" style={{ color: 'red' }}>{fieldsError}</p>}
              {!fieldsLoading && !fieldsError && (
                <div className="fields-grid">
                  {reviewFields.map(f => (
                    <div className="checkbox-group" key={f.id} title={f.description}>
                      <input type="checkbox" id={f.name} checked={selectedFields[f.name] ?? false} onChange={() => handleFieldChange(f.name)} className="checkbox-input" />
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
              <div className="card-header"><label className="parameter-label">Include Raw Data</label></div>
              <div className="checkbox-group">
                <input type="checkbox" checked={includeRaw} onChange={() => setIncludeRaw(!includeRaw)} className="checkbox-input" />
                <label className="checkbox-label">Enable</label>
              </div>
            </div>

            {/* Execute Button */}
            <div className="section-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <button
                className="execute-btn"
                onClick={() => executeQuery({
                  network: networkName,
                  slug,
                  includeRaw,
                  selectedFields
                })}
                disabled={!networkName || !slug || queryLoading}
              >
                <i className="fa-solid fa-bolt fa-xs"></i>
                {queryLoading ? "Loading..." : "Execute Query"}
              </button>
            </div>


          </div>

        </div>
      </div>
      {/* CURL Request */}
      <CurlRequest
        network={networkName}
        slug={slug}
        fields={[...fieldsQuery, includeRaw ? "include_raw=true" : null].filter(Boolean)}
        apiKey={API_KEY}
      />

      {/* Query Response */}
      <QueryResponse data={responseData} />
    </div>
  );
}

export default ReviewQueryBuilder;