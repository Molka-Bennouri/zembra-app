import { useState } from 'react';
import '../details/QueryBuild.css';

import { useNetworks } from '../../hooks/useNetworks';
import { useFields } from '../../hooks/useFields';

function MatchQueryBuild() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [selectedNetworks, setSelectedNetworks] = useState({});

    const { networks = [], loading: networksLoading, error: networksError } = useNetworks();
    const { fields = [], selectedFields = {}, handleFieldChange, loading: fieldsLoading, error: fieldsError } = useFields();

    const handleNetworkChange = (networkId) => {
        setSelectedNetworks(prev => ({
            ...prev,
            [networkId]: !prev[networkId]
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

                            {networksLoading && <p className="helper-text">Loading networks...</p>}
                            {networksError && <p className="helper-text" style={{ color: 'red' }}>{networksError}</p>}

                            {!networksLoading && !networksError && (
                                <div className="fields-grid">
                                    {networks.map(n => (
                                        <div className="checkbox-group" key={n.id}>
                                            <input
                                                type="checkbox"
                                                id={`network-${n.id}`}
                                                checked={selectedNetworks[n.id] ?? false}
                                                onChange={() => handleNetworkChange(n.id)}
                                                className="checkbox-input"
                                            />
                                            <label htmlFor={`network-${n.id}`} className="checkbox-label">
                                                {n.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="query-right">

                        {/* Fields */}
                        <div className="section-block" style={{ borderBottom: 'none' }}>
                            <div className="card-header">
                                <h3 className="parameter-label">Fields</h3>
                            </div>

                            {fieldsLoading && <p className="helper-text">Loading fields...</p>}
                            {fieldsError && <p className="helper-text" style={{ color: 'red' }}>{fieldsError}</p>}

                            {!fieldsLoading && !fieldsError && (
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