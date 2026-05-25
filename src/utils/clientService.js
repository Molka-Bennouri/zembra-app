import { getAuthHeaders } from "./auth";

const BASE_URL = "http://127.0.0.1:8000/api/admin";

const handleResponse = async (res) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
};

export const getClients = async () => {
  try {
    const data = await fetch(`${BASE_URL}/clients`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }).then(handleResponse);

    // API returns a plain array, not wrapped in data.data
    const list = Array.isArray(data) ? data : (data.data ?? []);
    // Map full_name → name so the component works without changes
    const clients = list.map((c) => ({ ...c, name: c.full_name }));
    return { clients, error: null };
  } catch (err) {
    return { clients: [], error: err.message };
  }
};

export const deleteClient = async (id) => {
  try {
    await fetch(`${BASE_URL}/clients/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }).then(handleResponse);

    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};

export const updateClient = async (id, payload) => {
  try {
    const data = await fetch(`${BASE_URL}/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    }).then(handleResponse);

    const client = { ...data, name: data.full_name };
    return { client, error: null };
  } catch (err) {
    return { client: null, error: err.message };
  }
};