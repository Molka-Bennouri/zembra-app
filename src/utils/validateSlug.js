/**
 * Strips PCRE-style delimiters (e.g. @...@i or /.../) from a pattern
 * and extracts the flags, then returns a JS RegExp.
 */
function parsePattern(pattern) {
  // Match any non-alphanumeric delimiter (e.g. @ or /) at start and end
  const match = pattern.match(/^([^a-zA-Z0-9\s])(.+)\1([gimsuy]*)$/s);
  if (!match) {
    // No delimiters found — use as-is
    return new RegExp(pattern);
  }
  const [, , body, flags] = match;
  return new RegExp(body, flags);
}

export function validateSlug(slug, pattern) {
  if (!pattern) return { valid: false, message: "Select a network first" };
  if (!slug)    return { valid: false, message: "Slug is empty" };

  const regex = parsePattern(pattern);
  const valid = regex.test(slug);

  return {
    valid,
    message: valid ? "Valid slug ✓" : "Invalid format for this network",
  };
}