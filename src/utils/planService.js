const BASE = "http://localhost:8000/api";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
});

export async function deletePlan(id) {
  try {
    const res = await fetch(`${BASE}/plans/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Delete failed" };
    return { data };
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

export async function createPlan(payload) {
  try {
    const res = await fetch(`${BASE}/plans`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Create failed" };
    return { data };
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

export async function updatePlan(id, payload) {
  try {
    const res = await fetch(`${BASE}/plans/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Update failed" };
    return { data };
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}