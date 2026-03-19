import { useState } from 'react';
import '../details/QueryBuild.css';

function ReviewQueryBuilder() {
    const [network, setNetwork] = useState('');
    const [slug, setSlug] = useState('');
    const [setMonitoring] = useState('');
    const [setRequestType] = useState('');

    const [setFields] = useState({});
    const [includeRaw, setIncludeRaw] = useState(false);

    const handleFieldChange = (field) => {
        setFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="query-build-container">
            <div className="query-card">
                <div className="query-two-col">

                    {/* LEFT COLUMN */}
                    <div className="query-left">

                        {/* Monitoring Level */}
                        <div className="section-block">
                            <div className="card-header">
                                <label className="parameter-label">Monitoring Level</label>
                            </div>

                            {['None', 'Basic', 'Regular', 'Full'].map(level => (
                                <div className="checkbox-group" key={level}>
                                    <input
                                        type="radio"
                                        name="monitoring"
                                        onChange={() => setMonitoring(level)}
                                    />
                                    <label className="checkbox-label">{level}</label>
                                </div>
                            ))}
                        </div>

                        {/* Request Type */}
                        <div className="section-block">
                            <div className="card-header">
                                <label className="parameter-label">Request Type</label>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="radio"
                                    name="request"
                                    onChange={() => setRequestType('create')}
                                />
                                <label className="checkbox-label">
                                    Create a review job
                                </label>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="radio"
                                    name="request"
                                    onChange={() => setRequestType('retrieve')}
                                />
                                <label className="checkbox-label">
                                    Retrieve existing job
                                </label>
                            </div>
                        </div>

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
                                <option>Community Health Network</option>
                                <option>Kununu</option>
                                <option>Viator</option>
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
                            />

                            <p className="helper-text">
                                Unique identifier for your listing
                            </p>
                        </div>

                        {/* Fields */}
                        <div className="section-block">
                            <div className="card-header">
                                <h3 className="parameter-label">Fields</h3>
                            </div>

                            <div className="fields-grid">
                                {[
                                    'Review ID', 'Text', 'Timestamp', 'Last Edited',
                                    'URL', 'Rating', 'Recommendation', 'Is hidden',
                                    'Is deleted', 'Translation', 'Author', 'Photos',
                                    'Replies', 'Edits', 'Reply URL'
                                ].map(field => (
                                    <div className="checkbox-group" key={field}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleFieldChange(field)}
                                            className="checkbox-input"
                                        />
                                        <label className="checkbox-label">
                                            {field}
                                        </label>
                                    </div>
                                ))}
                            </div>
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

                        {/* Toggles */}
                        <div className="section-block">
                            <div className="card-header">
                                <h3 className="parameter-label">Options</h3>
                            </div>

                            <div className="fields-grid">
                                {[
                                    'Include deleted', 'Is hidden', 'Is not hidden',
                                    'Has photos', 'Is recommended', 'Is not recommended',
                                    'Has replies', 'Has edits', 'Has Translation'
                                ].map(opt => (
                                    <div className="checkbox-group" key={opt}>
                                        <input type="checkbox" className="checkbox-input" />
                                        <label className="checkbox-label">{opt}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="section-block" style={{ borderBottom: 'none' }}>
                            <div className="card-header">
                                <h3 className="parameter-label">Auto-renew job</h3>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['No change', 'Enable', 'Disable'].map(btn => (
                                    <button key={btn} className="execute-btn" style={{ margin: 0 }}>
                                        {btn}
                                    </button>
                                ))}
                            </div>

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