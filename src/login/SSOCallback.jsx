import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../utils/auth";

function SSOCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Authentication failed. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (token) {
      saveToken(token);
      navigate("/Dashboard");
    } else {
      setError("No token received.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {error ? (
        <div>
          <p style={{ color: "red" }}>{error}</p>
          <p>Redirecting to login...</p>
        </div>
      ) : (
        <p>Completing authentication...</p>
      )}
    </div>
  );
}

export default SSOCallback;