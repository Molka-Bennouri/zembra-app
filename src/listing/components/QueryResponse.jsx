import { useState } from "react"
import toast from "react-hot-toast"
import "./QueryResponse.css"

function QueryResponse({ data = null }) {
  const [copied, setCopied] = useState(false)

  const defaultData = {
    status: "waiting",
    message: "Execute a query to see the response here."
  }

  const responseData = data ?? defaultData

  // Simple heuristic to determine status code for badge (if present)
  let statusCode = null;
  if (data && data.status) {
    if (typeof data.status === 'number') statusCode = data.status;
    else if (data.status.toLowerCase() === 'success') statusCode = 200;
    else if (data.status.toLowerCase() === 'error') statusCode = 400;
  } else if (!data) {
    statusCode = "waiting";
  } else {
    statusCode = 200; // Assuming success if data exists and no status field
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(responseData, null, 2))
      setCopied(true)
      toast.success("Response copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
      toast.error("Failed to copy")
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
        <div className="response-status-badge">
          {statusCode === "waiting" ? (
             <span className="badge-waiting"><i className="fa-regular fa-clock"></i> Waiting</span>
          ) : statusCode >= 200 && statusCode < 300 ? (
             <span className="badge-success"><i className="fa-solid fa-check"></i> {statusCode} OK</span>
          ) : (
             <span className="badge-error"><i className="fa-solid fa-triangle-exclamation"></i> {statusCode || 'Error'}</span>
          )}
        </div>
        <h3 className="response-title">Query Response</h3>
        <button className="response-copy-btn" onClick={handleCopy} aria-label="Copy response">
          <i className={`fa-regular ${copied ? "fa-circle-check" : "fa-copy"}`}></i>
        </button>
      </div>
      <div className="response-content">
        <pre className="response-pre">
          <code className="response-code">
            {highlightJson(responseData)}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default QueryResponse
