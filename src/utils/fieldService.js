import { api } from "./api";

export const getFields = async (context = null) => {
  try {
    const url = context ? `/fields?context=${context}` : "/fields";
    const data = await api.get(url);
    return { fields: data.data, error: null };
  } catch (err) {
    return { fields: [], error: err.message };
  }
};

export const getField = async (id) => {
  try {
    const data = await api.get(`/fields/${id}`);
    return { field: data.data, error: null };
  } catch (err) {
    return { field: null, error: err.message };
  }
};

export const createField = async (payload) => {
  try {
    const data = await api.post("/fields", payload);
    return { field: data.data, error: null };
  } catch (err) {
    return { field: null, error: err.message };
  }
};

export const updateField = async (id, payload) => {
  try {
    const data = await api.put(`/fields/${id}`, payload);
    return { field: data.data, error: null };
  } catch (err) {
    return { field: null, error: err.message };
  }
};

export const deleteField = async (id) => {
  try {
    await api.delete(`/fields/${id}`);
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};