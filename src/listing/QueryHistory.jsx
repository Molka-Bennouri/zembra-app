import { useState, useEffect, useCallback } from 'react';
import ResponseViewer from './components/QueryResponse';
import './QueryHistory.css';
import { getAuthHeaders } from "../utils/auth";

const API_BASE = "http://localhost:8000/api/clients";

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...getAuthHeaders(),
});

const QueryHistory = ({ refreshTrigger, type }) => {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
        const url = type
        ? `${API_BASE}/query-history?type=${type}`
        : `${API_BASE}/query-history`;

      const res = await fetch(url, {  // ← fixed
        headers: getHeaders(),
      });
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger, loadHistory]);

  const toggleExpand = (id) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/query-history/${id}`, {  // ← fixed
        method: 'DELETE',
        headers: getHeaders(),
      });
      setHistory(history.filter(item => item.id !== id));
    } catch (e) {
      console.error('Failed to delete:', e);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      try {
        await fetch(`${API_BASE}/query-history`, {  // ← fixed
          method: 'DELETE',
          headers: getHeaders(),
        });
        setHistory([]);
      } catch (e) {
        console.error('Failed to clear history:', e);
      }
    }
  };

  const getNetworkInfo = (networkName) => {
    const networks = {
      Airbnb:      { name: 'Airbnb',       color: '#FF5A5F' },
      Google_Maps: { name: 'Google Maps',   color: '#4285F4' },
      Yelp:        { name: 'Yelp',          color: '#E53238' },
    };
    return networks[networkName] || { name: networkName, color: '#6B7280' };
  };

  if (loading) {
    return (
      <div className="history-loading">
        <div className="history-loading-text">Loading history...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty-content">
          <p className="history-empty-title">No query history yet</p>
          <p className="history-empty-subtitle">Execute a query to see your query history here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="history-header-info">
          <h3 className="history-title">Query History</h3>
          <p className="history-count">{history.length} queries</p>
        </div>
        {history.length > 0 && (
          <button onClick={handleClearAll} className="history-clear-btn">
            <i className="fas fa-trash" style={{ fontSize: 16 }} />
            Clear All
          </button>
        )}
      </div>

      <div className="history-list">
        {history.map(item => {
          const isExpanded = expanded.has(item.id);
          const network = getNetworkInfo(item.network);
          const timestamp = new Date(item.executed_at).toLocaleString();
          const status = item.status ?? 'UNKNOWN';
          const fields = Array.isArray(item.fields) ? item.fields : [];

          return (
            <div key={item.id} className="history-card">
              <div className="history-card-header">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="history-card-toggle"
                >
                  <div className="history-card-chevron">
                    {isExpanded
                      ? <i className="fas fa-chevron-down" style={{ fontSize: 12 }} />
                      : <i className="fas fa-chevron-right" style={{ fontSize: 12 }} />
                    }
                  </div>

                  <div className="history-card-content">
                    <div className="history-card-title">
                      <span className="history-card-network">{network.name}</span>
                      <span className="history-card-slug">/{item.slug}</span>
                      <span className={`history-card-status ${status === 'SUCCESS' ? 'status-success' : 'status-error'}`}>
                        {status}
                      </span>
                    </div>

                    <div className="history-card-meta">
                      <p className="history-card-fields">
                        {fields.length > 0 ? `${fields.length} fields selected` : 'All fields'}
                      </p>
                      <p className="history-card-time">{timestamp}</p>
                    </div>
                  </div>
                </button>

                <button onClick={() => handleDelete(item.id)} className="history-card-delete">
                  <i className="fas fa-trash" style={{ fontSize: 16 }} />
                </button>
              </div>

              {isExpanded && (
                <div className="history-card-expanded">
                  <div className="history-card-details">
                    <div className="history-card-detail-grid">
                      <div className="history-card-detail-item">
                        <p className="history-card-detail-label">Network</p>
                        <p className="history-card-detail-value">{network.name}</p>
                      </div>
                      <div className="history-card-detail-item">
                        <p className="history-card-detail-label">Slug</p>
                        <p className="history-card-detail-value">{item.slug}</p>
                      </div>
                      <div className="history-card-detail-item">
                        <p className="history-card-detail-label">Type</p>
                        <p className="history-card-detail-value">{item.type}</p>
                      </div>
                      <div className="history-card-detail-item history-card-detail-full">
                        <p className="history-card-detail-label">Fields</p>
                        <div className="history-card-detail-tags">
                          {fields.length > 0 ? (
                            fields.map(field => (
                              <span key={field} className="history-card-detail-tag">{field}</span>
                            ))
                          ) : (
                            <span className="history-card-detail-no-fields">All fields</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.response && (
                    <div className="history-card-response-section">
                      <ResponseViewer data={item.response} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QueryHistory;