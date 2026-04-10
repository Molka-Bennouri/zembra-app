// AiSummary.jsx
import { useState } from "react";
import "./AiSummary.css";
import { api } from "../../../utils/api";

export default function AiSummary({ reviews }) {
  const [summaries, setSummaries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setSummaries(null);

    try {
      const response = await fetch(`${api.getBaseUrl()}/reviews/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Analysis failed.");
        return;
      }

      setSummaries(data);
    } catch (err) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-summary">
      <button
        className="ai-summary__btn"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? (
          <span className="ai-summary__spinner-wrap">
            <span className="ai-summary__spinner" />
            Analysing...
          </span>
        ) : (
          "✨ Analyse Reviews"
        )}
      </button>

      {error && (
        <div className="ai-summary__error">
          ⚠️ {error}
        </div>
      )}

      {summaries && (
        <div className="ai-summary__results">
          <h3 className="ai-summary__title">AI Review Analysis</h3>
          <div className="ai-summary__cards">

            {summaries.positive && (
              <div className="ai-summary__card ai-summary__card--positive">
                <div className="ai-summary__card-header">
                  <span className="ai-summary__icon">✅</span>
                  <h4>Positive</h4>
                </div>
                <p>{summaries.positive}</p>
              </div>
            )}

            {summaries.neutral && (
              <div className="ai-summary__card ai-summary__card--neutral">
                <div className="ai-summary__card-header">
                  <span className="ai-summary__icon">➖</span>
                  <h4>Neutral</h4>
                </div>
                <p>{summaries.neutral}</p>
              </div>
            )}

            {summaries.negative && (
              <div className="ai-summary__card ai-summary__card--negative">
                <div className="ai-summary__card-header">
                  <span className="ai-summary__icon">❌</span>
                  <h4>Negative</h4>
                </div>
                <p>{summaries.negative}</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}