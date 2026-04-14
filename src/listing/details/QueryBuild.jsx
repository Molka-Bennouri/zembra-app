import { useState } from "react";
import "./QueryBuild.css";

import { useNetworks } from "../../hooks/useNetworks";
import { useFields } from "../../hooks/useFields";
import { validateSlug } from "../../utils/validateSlug";
import { useQuery } from "../../hooks/useQuery";
import {api} from "../../utils/api";

import CurlRequest from "../components/CurlRequest";
import QueryResponse from "../components/QueryResponse";

const API_BASE = `${api.getBaseUrl()}/listing`;

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

  return (
    <div className="query-build-container">

      {/* QUERY BUILDER */}
      <div className="query-card">
        <div className="query-two-col">

          {/* LEFT : Network & Slug */}
          <div className="query-left">

            {/* NETWORK */}
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
                {networks.map((n) => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
              <p className="helper-text">Please select a network</p>
            </div>

            {/* SLUG */}
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
                <p
                  className="helper-text"
                  style={{ color: validation.valid ? "green" : "red" }}
                >
                  {validation.message}
                </p>
              ) : (
                <p className="helper-text">Unique identifier for your listing</p>
              )}
            </div>

          </div>

          {/* RIGHT : Response Fields */}
          <div className="query-right">
            <div className="section-block" style={{ borderBottom: "none" }}>
              <div className="card-header">
                <h3 className="parameter-label">Response Fields</h3>
              </div>

              {fieldsLoading && <p className="helper-text">Loading fields...</p>}
              {fieldsError && <p className="helper-text" style={{ color: "red" }}>{fieldsError}</p>}

              {!fieldsLoading && !fieldsError && (
                <div className="fields-grid">
                  {fields.map((field) => (
                    <div className="checkbox-group" key={field.id} title={field.description}>
                      <input
                        type="checkbox"
                        id={field.name}
                        checked={selectedFields[field.name] ?? false}
                        onChange={() => handleFieldChange(field.name)}
                        className="checkbox-input"
                      />
                      <label htmlFor={field.name} className="checkbox-label">{field.label}</label>
                    </div>
                  ))}
                </div>
              )}

              <div className="section-block" style={{ borderBottom: "none", paddingBottom: 0 }}>
                <button
                  className="execute-btn"
                  onClick={handleExecute}
                  disabled={!networkName || !slug || !validation.valid || queryLoading}
                >
                  <i className="fa-solid fa-bolt fa-xs"></i>
                  {queryLoading ? "Executing..." : "Execute Query"}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* CURL PREVIEW */}
      <CurlRequest
  method="GET"
  api={`https://api.zembra.io/listing/${networkName}/?slug=${encodeURIComponent(slug)}`}
  fields={activeFields}
/>

      {/* RESPONSE */}
      <QueryResponse data={responseData} />

    </div>
  );
}

export default QueryBuild;