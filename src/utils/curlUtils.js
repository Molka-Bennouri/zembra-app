export const generateCurlCode = ({ method = "", api = "", fields = [], apiKey = "" }) => {
  const fieldsQuery = fields.length ? `&fields=${fields.join(",")}` : "";

  return `curl -X ${method} "${api}${fieldsQuery}" \\
-H "Accept: application/json" \\
-H "Authorization: Bearer ${apiKey}"`;
};