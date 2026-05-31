import { useState } from "react";
import "../details/QueryBuild.css";

import { useNetworks } from "../../hooks/useNetworks";
import { useFields } from "../../hooks/useFields";
import { useMatchQuery } from "../../hooks/useMatchQuery";
import CurlRequest from "../components/CurlRequest";
import QueryResponse from "../components/QueryResponse";

function MatchQueryBuild({ onQueryExecuted }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState({});

  const { networks = [], loading: networksLoading, error: networksError } = useNetworks();
  const { fields = [], selectedFields = {}, handleFieldChange, activeFields, loading: fieldsLoading, error: fieldsError } = useFields();

  const handleNetworkChange = (networkId) => {
    setSelectedNetworks(prev => ({
      ...prev,
      [networkId]: !prev[networkId]
    }));
  };

  const { responseData, loading: queryLoading, executeQuery } = useMatchQuery({ onQueryExecuted });

  const activeNetworks = Object.keys(selectedNetworks)
    .filter(id => selectedNetworks[id])
    .map(id => {
      const net = networks.find(n => String(n.id) === String(id));
      return net?.name;
    })
    .filter(Boolean);

  const fieldsQuery = [
    ...activeFields,
    name && `name=${name}`,
    address && `address=${address}`,
    lat && `lat=${lat}`,
    lng && `lng=${lng}`
  ].filter(Boolean);

  const renderNetworkChips = () => {
    if (networksLoading) {
      return (
        <div className="qb-skeleton-list">
           <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 16 }}></div>
           <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 16 }}></div>
        </div>
      );
    }
    if (networksError) {
      return <p className="qb-error-text"><i className="fa-solid fa-triangle-exclamation"></i> {networksError}</p>;
    }

    return (
      <div className="qb-chips-grid">
        {networks.map(n => {
          const isSelected = selectedNetworks[n.id] ?? false;
          return (
            <button
              key={n.id}
              className={`qb-chip ${isSelected ? "active" : ""}`}
              onClick={() => handleNetworkChange(n.id)}
            >
              {isSelected && <i className="fa-solid fa-check qb-chip-icon"></i>}
              {n.label}
            </button>
          );
        })}
      </div>
    );
  };

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
        {fields.map(f => {
          const isSelected = selectedFields[f.name] ?? false;
          return (
            <button
              key={f.id}
              className={`qb-chip ${isSelected ? "active" : ""}`}
              onClick={() => handleFieldChange(f.name)}
              title={f.description}
            >
              {isSelected && <i className="fa-solid fa-check qb-chip-icon"></i>}
              {f.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="qb-container qb-match">
      <div className="qb-card qb-form-card">
        <div className="qb-match-layout">

          <div className="qb-form-section">
            <h3 className="qb-section-title">Business Profile</h3>
            <div className="qb-match-profile-grid">
              <div className="qb-form-group">
                <label className="qb-label">
                  Business Name <span className="qb-required">*</span>
                </label>
                <input
                  type="text"
                  className="qb-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="qb-form-group">
                <label className="qb-label">
                  Business Address <span className="qb-required">*</span>
                </label>
                <input
                  type="text"
                  className="qb-input"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              <div className="qb-form-group">
                <label className="qb-label">Latitude</label>
                <input
                  type="text"
                  className="qb-input qb-mono-input"
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                />
              </div>

              <div className="qb-form-group">
                <label className="qb-label">Longitude</label>
                <input
                  type="text"
                  className="qb-input qb-mono-input"
                  value={lng}
                  onChange={e => setLng(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="qb-form-section">
            <div className="qb-section-header">
              <h3 className="qb-section-title">Target Networks</h3>
              <span className="qb-badge-count">{activeNetworks.length} selected</span>
            </div>
            {renderNetworkChips()}
          </div>

          <div className="qb-form-section">
            <div className="qb-section-header">
              <h3 className="qb-section-title">Response Fields</h3>
              <span className="qb-badge-count">{activeFields.length} selected</span>
            </div>
            {renderFieldChips()}
          </div>

          <div className="qb-execute-container qb-match-execute">
            <button
              className={`qb-execute-btn ${queryLoading ? "loading" : ""}`}
              onClick={() => executeQuery({
                name,
                address,
                lat,
                lng,
                selectedNetworks,
                selectedFields,
                networks,
              })}
              disabled={!name || !address || !activeNetworks.length || queryLoading}
            >
              {queryLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Matching...
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

      <div className="qb-preview-grid">
        <CurlRequest
          network={activeNetworks.join(",")}
          slug=""
          fields={fieldsQuery}
          apiKey="YOUR_API_KEY" 
        />

        <QueryResponse data={responseData} />
      </div>
    </div>
  );
}

export default MatchQueryBuild;