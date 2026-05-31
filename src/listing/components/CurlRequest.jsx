import { useState } from "react";
import toast from "react-hot-toast";
import { generateCurlCode } from "../../utils/curlUtils"; 
import "./CurlRequest.css";

function CurlRequest({ method, api, fields, apiKey, sortBy, sortDirection, postedBefore, postedAfter, includeRaw }) {
  const code = generateCurlCode({ method, api, fields, apiKey, sortBy, sortDirection, postedBefore, postedAfter, includeRaw });
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("cURL command copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy");
    }
  };

  const highlightCurlSyntax = (line) => {
    const parts = line.split(/("[^"]*")/g);
    return parts.map((part, index) => {
      if (part.startsWith('"') && part.endsWith('"')) return <span key={index} className="curl-string">{part}</span>;
      if (part.includes("-X") || part.includes("-H")) {
        return part.split(/(-X|-H)/g).map((flag, idx) => (
          (flag === "-X" || flag === "-H")
            ? <span key={`${index}-${idx}`} className="curl-flag">{flag}</span>
            : flag
        ));
      }
      return part;
    });
  };

  return (
    <div className="curl-card">
      <div className="curl-header">
        <div className="curl-window-controls">
          <span className="curl-dot red"></span>
          <span className="curl-dot yellow"></span>
          <span className="curl-dot green"></span>
        </div>
        <h3 className="curl-title">cURL Request</h3>
        <button className="curl-copy-btn" onClick={handleCopy} aria-label="Copy code">
          <i className={`fa-regular ${copied ? "fa-circle-check" : "fa-copy"}`}></i>
        </button>
      </div>

      <div className="curl-content">
        <pre className="curl-pre">
          <code className="curl-code">
            {code.split("\n").map((line, index) => (
              <div key={index} className="curl-line">
                <span className="curl-line-number">{index + 1}</span>
                <span className="curl-line-content">{highlightCurlSyntax(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CurlRequest;