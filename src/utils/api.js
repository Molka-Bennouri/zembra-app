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

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    removeToken();
    window.location.href = "/login";
    throw new Error("Unauthorized. Please log in again.");
  }

  const json = await response.json();

  if (!response.ok) {
    const message =
      json?.message ||
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

  delete: (endpoint, requiresAuth = true) =>
    request("DELETE", endpoint, null, requiresAuth),

  // SSO helper
  getBaseUrl: () => BASE_URL,
};