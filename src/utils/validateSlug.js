export function validateSlug(slug, pattern) {
  if (!pattern) return { valid: false, message: "Select a network first" };
  if (!slug)    return { valid: false, message: "Slug is empty" };

  const regex = new RegExp(pattern);
  const valid = regex.test(slug);

  return {
    valid,
    message: valid ? "Valid slug ✓" : "Invalid format for this network",
  };
}