import { getAuthHeaders, removeToken } from "./auth";

const BASE_URL = "http://127.0.0.1:8000/api";

const request = async (method, endpoint, data = null, requiresAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(requiresAuth ? getAuthHeaders() : {}),
  };

  const config = {
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (networkError) {
    throw new Error("Cannot reach server. Check your connection.");
  }

  if (response.status === 401) {
    if (requiresAuth) {
      removeToken();
      window.location.href = "/login";
      throw new Error("Unauthorized. Please log in again.");
    }
  }

  let json = {};
  try {
    json = await response.json();
  } catch {
    // body was empty or not JSON
  }

  if (!response.ok) {
    const message =
      json?.message || // Original code only checked (json?.message) which didn't match, so it fell through to the hardcoded fallback
      json?.detail ||
      json?.error ||
      Object.values(json?.errors || {}).flat().join(" ") ||
      "Something went wrong.";
    throw new Error(message);
  }

  return json;
};

export const api = {
  get: (endpoint, requiresAuth = true) =>
    request("GET", endpoint, null, requiresAuth),

  post: (endpoint, data, requiresAuth = false) =>
    request("POST", endpoint, data, requiresAuth),

  put: (endpoint, data, requiresAuth = true) =>
    request("PUT", endpoint, data, requiresAuth),

  delete: (endpoint, data = null, requiresAuth = true) =>
    request("DELETE", endpoint, data, requiresAuth),

  // SSO helper
  getBaseUrl: () => BASE_URL,
};