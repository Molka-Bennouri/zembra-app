// CurlRequest.jsx
import { useState } from "react";
import { generateCurlCode } from "../../utils/curlUtils"; 
import "./CurlRequest.css";

function CurlRequest({ network, slug, fields, apiKey }) {
  const [copied, setCopied] = useState(false);

  const code = generateCurlCode({ network, slug, fields, apiKey });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
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
        <h3 className="curl-title">cURL Request</h3>
      </div>

      <div className="curl-content">
        <div className="curl-code-block">
          <pre className="curl-pre">
            <code className="curl-code">
              {code.split("\n").map((line, index) => (
                <span key={index} className="curl-line">{highlightCurlSyntax(line)}</span>
              ))}
            </code>
          </pre>
        </div>
      </div>

      <div className="curl-footer">
        <button className="curl-button" onClick={handleCopy}>
          <i className="fa-regular fa-copy"></i>
          {copied ? "Copied" : "Copy"}
        </button>
        <button className="curl-button" onClick={() => console.log("Run curl")}>
          <i className="fa-solid fa-play"></i>
          Run
        </button>
      </div>
    </div>
  );
}

export default CurlRequest;