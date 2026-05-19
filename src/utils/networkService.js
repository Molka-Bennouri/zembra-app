const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Creates a new network via the Laravel API.
 *
 * @param {{ name: string, label: string, slug_pattern?: string }} payload
 * @returns {Promise<{ data: any, error: string|null }>}
 */
export async function createNetwork(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/networks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Laravel validation errors come back as { message, errors: { field: [msgs] } }
      const message =
        data?.message ||
        Object.values(data?.errors ?? {})
          .flat()
          .join(" ") ||
        "Something went wrong.";

      return { data: null, error: message };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: "Network request failed. Is the server running?",
    };
  }
}

/**
 * Fetches all networks from the Laravel API.
 *
 * @returns {Promise<{ data: any[], error: string|null }>}
 */
export async function fetchNetworks() {
  try {
    const response = await fetch(`${API_BASE_URL}/networks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      return {
        data: null,
        error: data?.message || "Failed to fetch networks.",
      };
    }
 
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: "Network request failed. Is the server running?",
    };
  }
}

export async function deleteNetwork(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/networks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return { error: data?.message || "Failed to delete network." };
    }

    return { error: null };
  } catch (err) {
    return { error: "Network request failed. Is the server running?" };
  }
}

export async function updateNetwork(id, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/networks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data?.message || "Failed to update network." };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: "Network request failed. Is the server running?" };
  }
}