import { useState } from "react"
import "./CurlRequest.css"

function CurlRequest({ 
  network = "google", 
  slug = "mon-entreprise-123",
  apiKey = "hYPXWQH8jYS5JU5eIiUgVpDqNBnrXOCZX4fCGTiuC5pDSaiG45LCOT20bnf1GYYifHkMgQrVi2MPZGF6awVAoawySE2oVXYjHzLuxDFVBNXPPkZpUBFiavMxgK1E7jEu",
  onGenerate 
}) {
  const [copied, setCopied] = useState(false)

  const code = `curl -X GET "https://api.zembra.io/listing/${network}?slug=${slug}" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer ${apiKey}"`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  function highlightCurlSyntax(line) {
    const parts = line.split(/("[^"]*")/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('"') && part.endsWith('"')) {
        return <span key={index} className="curl-string">{part}</span>
    }
    
      if (part.includes('-X') || part.includes('-H')) {
        const flagParts = part.split(/(-X|-H)/g)
        return flagParts.map((flagPart, flagIndex) => {
          if (flagPart === '-X' || flagPart === '-H') {
            return <span key={`${index}-${flagIndex}`} className="curl-flag">{flagPart}</span>
          }
          return flagPart
        })
      }
      
      return part
    })
  }

  return (
    <div className="curl-card">
      <div className="curl-header">
        <h3 className="curl-title">cURL Request</h3>
      </div>
      <div className="curl-content">
        <div className="curl-code-block">
          <pre className="curl-pre">
            <code className="curl-code">
              {code.split('\n').map((line, index) => (
                <span key={index} className="curl-line">
                  {highlightCurlSyntax(line)}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
      <div className="curl-footer">
        <button className="curl-button" onClick={handleCopy}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
           <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />

          </svg>
          {copied ? "Copied" : "Copy"}
        </button>
        <button className="curl-button" onClick={() => {}}>
  <i className="fa-solid fa-play" style={{marginRight: '6px'}}></i>
  Run
</button>
      </div>
    </div>
  )
}

export default CurlRequest;