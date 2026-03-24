const FIELDS_URL = 'http://127.0.0.1:8000/api/response-fields';

export async function fetchFields() {
  const res = await fetch(FIELDS_URL);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const json = await res.json();

  if (json.status !== 'success') {
    throw new Error('Failed to load fields.');
  }

  return json.data;
}