import { useState } from 'react';
import './QueryBuild.css';

function MatchQueryBuild() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const [setNetworks] = useState({});
    const [setFields] = useState({});

    const handleNetworkChange = (network) => {
        setNetworks(prev => ({
            ...prev,
            [network]: !prev[network]
        }));
    };

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

                        {/* Business Name */}
                        <div className="section-block">
                            <div className="card-header">
                                <label className="parameter-label">
                                    Business / Profile Name
                                </label>
                                <span className="required-badge">Required</span>
                            </div>

                            <input
                                type="text"
                                className="parameter-input"
                                placeholder="Business name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Address */}
                        <div className="section-block">
                            <div className="card-header">
                                <label className="parameter-label">
                                    Business Address
                                </label>
                                <span className="required-badge">Required</span>
                            </div>

                            <input
                                type="text"
                                className="parameter-input"
                                placeholder="Full address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* Coordinates */}
                        <div className="section-block">
                            <div className="card-header">
                                <label className="parameter-label">Coordinates</label>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    className="parameter-input"
                                    placeholder="Latitude"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="parameter-input"
                                    placeholder="Longitude"
                                    value={lng}
                                    onChange={(e) => setLng(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Networks */}
                        <div className="section-block">
                            <div className="card-header">
                                <label className="parameter-label">Networks</label>
                            </div>

                            {[
                                'Community Health Network',
                                'Kununu',
                                'Viator'
                            ].map(net => (
                                <div className="checkbox-group" key={net}>
                                    <input
                                        type="checkbox"
                                        className="checkbox-input"
                                        onChange={() => handleNetworkChange(net)}
                                    />
                                    <label className="checkbox-label">{net}</label>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="query-right">

                        {/* Fields */}
                        <div className="section-block" style={{ borderBottom: 'none' }}>
                            <div className="card-header">
                                <h3 className="parameter-label">Fields</h3>
                            </div>

                            <div className="fields-grid">
                                {[
                                    'Address components',
                                    'Formatted address',
                                    'Page ID',
                                    'Review page slug',
                                    'Review page URL',
                                    'Aliases',
                                    'Categories',
                                    'Business Name',
                                    'Phone',
                                    'Photos',
                                    'Price range',
                                    'Profile image',
                                    'Business website',
                                    'Total review count',
                                    'Overall Rating'
                                ].map(field => (
                                    <div className="checkbox-group" key={field}>
                                        <input
                                            type="checkbox"
                                            className="checkbox-input"
                                            onChange={() => handleFieldChange(field)}
                                        />
                                        <label className="checkbox-label">{field}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Execute Button */}
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

export default MatchQueryBuild;