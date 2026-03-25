// /utils/curlUtils.js
export const generateCurlCode = ({ network = "", slug = "", fields = [], apiKey = "" }) => {
  const fieldsQuery = fields.length ? `&fields=${fields.join(",")}` : "";

  return `curl -X GET "https://api.zembra.io/listing/${network}?slug=${slug}${fieldsQuery}" \\
-H "Accept: application/json" \\
-H "Authorization: Bearer ${apiKey}"`;
};