import { useState } from "react"
import "./QueryResponse.css"

function QueryResponse({ data = null }) {
  const [copied, setCopied] = useState(false)

  const defaultData = {
    status: "success",
    count: 5,
    data: [
      {
        name: "Listing A",
        ratings: 4.5,
        reviews: 1240,
        active: true,
        region: "North"
      },
      {
        name: "Listing B",
        ratings: 4.2,
        reviews: 856,
        active: true,
        region: "South"
      }
    ],
    timestamp: "2026-03-09T13:07:58.467Z",
    execution_time: "142ms"
  }

  const responseData = data || defaultData

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(responseData, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const highlightJson = (json, indent = 0) => {
    const spaces = "  ".repeat(indent)
    
    if (json === null) return <span className="json-null">null</span>
    if (typeof json === "boolean") return <span className="json-boolean">{json.toString()}</span>
    if (typeof json === "number") return <span className="json-number">{json}</span>
    if (typeof json === "string") return <span className="json-string">"{json}"</span>
    
    if (Array.isArray(json)) {
      if (json.length === 0) return <span>[]</span>
      return (
        <>
          {"[\n"}
          {json.map((item, index) => (
            <span key={index}>
              {"  ".repeat(indent + 1)}
              {highlightJson(item, indent + 1)}
              {index < json.length - 1 ? ",\n" : "\n"}
            </span>
          ))}
          {spaces}{"]"}
        </>
      )
    }
    
    if (typeof json === "object") {
      const keys = Object.keys(json)
      if (keys.length === 0) return <span>{"{}"}</span>
      return (
        <>
          {"{\n"}
          {keys.map((key, index) => (
            <span key={key}>
              {"  ".repeat(indent + 1)}
              <span className="json-key">"{key}"</span>
              {": "}
              {highlightJson(json[key], indent + 1)}
              {index < keys.length - 1 ? ",\n" : "\n"}
            </span>
          ))}
          {spaces}{"}"}
        </>
      )
    }
    
    return String(json)
  }

  return (
    <div className="response-card">
      <div className="response-header">
        <h3 className="response-title">Query Response</h3>
      </div>
      <div className="response-content">
        <div className="response-code-block">
          <pre className="response-pre">
            <code className="response-code">
              {highlightJson(responseData)}
            </code>
          </pre>
        </div>
      </div>
      <div className="response-footer">
        <button className="response-copy-button" onClick={handleCopy}>
          <i class="fa-regular fa-copy"></i>
          {copied ? "Copied!" : "Copy Response"}
        </button>
      </div>
    </div>
  )
}

export default QueryResponse
