const REVIEW_FIELDS_URL = 'http://127.0.0.1:8000/api/review-fields';

export async function fetchReviewFields() {
  const res = await fetch(REVIEW_FIELDS_URL);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const json = await res.json();

  if (json.status !== 'success') {
    throw new Error('Failed to load review fields.');
  }

  return json.data;
}