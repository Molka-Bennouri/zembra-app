import { useState } from 'react';
import '../details/QueryBuild.css';

import { useNetworks } from '../../hooks/useNetworks';
import { validateSlug } from '../../utils/validateSlug';
import { useReviewFields } from '../../hooks/useReviewFields';

function ReviewQueryBuilder() {
    const [network, setNetwork] = useState('');
    const [slug, setSlug] = useState('');
    const [includeRaw, setIncludeRaw] = useState(false);

    const { networks = [] } = useNetworks();
    const { reviewFields = [], selectedFields = {}, handleFieldChange, loading, error } = useReviewFields();

    const selectedPattern = networks.find(n => n.id === parseInt(network))?.slug_pattern ?? null;
    const validation = validateSlug(slug, selectedPattern);

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
                                {networks.map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.name}
                                    </option>
                                ))}
                            </select>

                            <p className="helper-text">Please select a network</p>
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
                                <p className="helper-text" style={{ color: validation.valid ? 'green' : 'red' }}>
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

                            {loading && <p className="helper-text">Loading fields...</p>}
                            {error && <p className="helper-text" style={{ color: 'red' }}>{error}</p>}

                            {!loading && !error && (
                                <div className="fields-grid">
                                    {reviewFields.map(field => (
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

                            <select className="dropdown-select">
                                <option>Sorting attribute</option>
                            </select>

                            <select className="dropdown-select">
                                <option>Sorting direction</option>
                            </select>

                            <input className="parameter-input" placeholder="Limit" />
                            <input className="parameter-input" placeholder="Offset" />

                            <select className="dropdown-select">
                                <option>Min rating</option>
                            </select>

                            <select className="dropdown-select">
                                <option>Max rating</option>
                            </select>

                            <input type="date" className="parameter-input" />
                            <input type="date" className="parameter-input" />
                        </div>

                        {/* Actions */}
                        <div className="section-block" style={{ borderBottom: 'none' }}>
                            <button className="execute-btn">
                                <i className="fa-solid fa-bolt fa-xs"></i>
                                Execute Query
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default ReviewQueryBuilder;