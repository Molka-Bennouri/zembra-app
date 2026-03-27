import { useState } from "react";
import "../details/QueryBuild.css";

import { useNetworks } from "../../hooks/useNetworks";
import { useFields } from "../../hooks/useFields";
import { useMatchQuery } from "../../hooks/useMatchQuery";
import CurlRequest from "../components/CurlRequest";
import QueryResponse from "../components/QueryResponse";

const API_URL = "https://api.zembra.io/match";

function MatchQueryBuild() {
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

  // Hook Match Query
  const { responseData, loading: queryLoading, executeQuery } = useMatchQuery({ apiUrl: API_URL });

  // Networks sélectionnés
  const activeNetworks = Object.keys(selectedNetworks)
    .filter(id => selectedNetworks[id])
    .map(id => {
      const net = networks.find(n => String(n.id) === String(id));
      return net?.name;
    })
    .filter(Boolean);

  // Champs query
  const fieldsQuery = [
    ...activeFields,
    name && `name=${name}`,
    address && `address=${address}`,
    lat && `lat=${lat}`,
    lng && `lng=${lng}`
  ].filter(Boolean);

  return (
    <div className="query-build-container">
      <div className="query-card">
        <div className="query-two-col">

          {/* LEFT COLUMN */}
          <div className="query-left">
            <div className="section-block">
              <div className="card-header">
                <label className="parameter-label">Business / Profile Name</label>
                <span className="required-badge">Required</span>
              </div>
              <input type="text" className="parameter-input" placeholder="Business name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="section-block">
              <div className="card-header">
                <label className="parameter-label">Business Address</label>
                <span className="required-badge">Required</span>
              </div>
              <input type="text" className="parameter-input" placeholder="Full address" value={address} onChange={e => setAddress(e.target.value)} />
            </div>

            <div className="section-block">
              <div className="card-header"><label className="parameter-label">Coordinates</label></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" className="parameter-input" placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)} />
                <input type="text" className="parameter-input" placeholder="Longitude" value={lng} onChange={e => setLng(e.target.value)} />
              </div>
            </div>

            <div className="section-block">
              <div className="card-header"><label className="parameter-label">Networks</label></div>
              {networksLoading && <p className="helper-text">Loading networks...</p>}
              {networksError && <p className="helper-text" style={{ color: 'red' }}>{networksError}</p>}
              {!networksLoading && !networksError && (
                <div className="fields-grid">
                  {networks.map(n => (
                    <div className="checkbox-group" key={n.id}>
                      <input type="checkbox" id={`network-${n.id}`} checked={selectedNetworks[n.id] ?? false} onChange={() => handleNetworkChange(n.id)} className="checkbox-input" />
                      <label htmlFor={`network-${n.id}`} className="checkbox-label">{n.name}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="query-right">
            <div className="section-block" style={{ borderBottom: 'none' }}>
              <div className="card-header"><h3 className="parameter-label">Fields</h3></div>
              {fieldsLoading && <p className="helper-text">Loading fields...</p>}
              {fieldsError && <p className="helper-text" style={{ color: 'red' }}>{fieldsError}</p>}
              {!fieldsLoading && !fieldsError && (
                <div className="fields-grid">
                  {fields.map(f => (
                    <div className="checkbox-group" key={f.id} title={f.description}>
                      <input type="checkbox" id={f.name} checked={selectedFields[f.name] ?? false} onChange={() => handleFieldChange(f.name)} className="checkbox-input" />
                      <label htmlFor={f.name} className="checkbox-label">{f.label}</label>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="execute-btn"
                onClick={() => executeQuery({
                  name,
                  address,
                  lat,
                  lng,
                  selectedNetworks,
                  selectedFields
                })}
                disabled={!name || !address || !activeNetworks.length || queryLoading}
              >
                <i className="fa-solid fa-bolt fa-xs"></i>
                {queryLoading ? "Loading..." : "Execute Query"}
              </button>



            </div>
          </div>

        </div>
      </div>
      {/* CURL PREVIEW */}
      <CurlRequest
        network={activeNetworks.join(",")}
        slug=""
        fields={fieldsQuery}
        apiKey="YOUR_API_KEY" />



      {/* RESPONSE */}
      <QueryResponse data={responseData} />
    </div>
  );
}

export default MatchQueryBuild;