import { useState } from 'react';
import './QueryBuild.css';

import { useNetworks } from '../../hooks/useNetworks';
import { useFields } from '../../hooks/useFields';
import { validateSlug } from '../../utils/validateSlug';

function QueryBuild() {
  const { networks = [] } = useNetworks();
  const [network, setNetwork] = useState('');
  const [slug, setSlug] = useState('');

  const { fields = [], selectedFields = {}, handleFieldChange, activeFields, loading, error } = useFields();

  // Get the pattern of the selected network
  const selectedPattern = networks.find(n => n.id === parseInt(network))?.slug_pattern ?? null;

  // Validate on every keystroke
  const validation = validateSlug(slug, selectedPattern);

  return (
    <div className="query-build-container">
      <div className="query-card">
        <div className="query-two-col">
          {/* LEFT COLUMN */}
          <div className="query-left">
            {/* Network Section */}
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
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
              <p className="helper-text">Please select a network</p>
            </div>

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
                <p className="helper-text" style={{ color: validation.valid ? 'green' : 'red' }}>
                  {validation.message}
                </p>
              ) : (
                <p className="helper-text">Unique identifier for your listing</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="query-right">
            <div className="section-block" style={{ borderBottom: 'none' }}>
              <div className="card-header">
                <h3 className="parameter-label">Response Fields</h3>
              </div>

              {loading && <p className="helper-text">Loading fields...</p>}
              {error && <p className="helper-text" style={{ color: 'red' }}>{error}</p>}

              {!loading && !error && (
                <div className="fields-grid">
                  {fields.map(field => (
                    <div className="checkbox-group" key={field.id} title={field.description}>
                      <input
                        type="checkbox"
                        id={field.name}
                        checked={selectedFields[field.name] ?? false}
                        onChange={() => handleFieldChange(field.name)}
                        className="checkbox-input"
                      />
                      <label htmlFor={field.name} className="checkbox-label">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <div className="section-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <button
                  className="execute-btn"
                  onClick={() => console.log('Active fields:', activeFields)}
                >
                  <i className="fa-solid fa-bolt fa-xs"></i>
                  Execute Query
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryBuild;