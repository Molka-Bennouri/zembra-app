export const generateCurlCode = ({ method = "", api = "", fields = [], apiKey = "", sortBy = "", sortDirection = "", postedBefore = "", postedAfter = "", includeRaw = false }) => {
  const fieldsQuery    = fields.length ? '&' + fields.map(f => `fields[]=${encodeURIComponent(f)}`).join('&') : '';
  const sortQuery      = sortBy        ? `&sortBy=${sortBy}`              : '';
  const dirQuery       = sortDirection ? `&sortDirection=${sortDirection}` : '';
  const beforeQuery    = postedBefore  ? `&postedBefore=${Math.floor(new Date(postedBefore).getTime() / 1000)}` : '';
  const afterQuery     = postedAfter   ? `&postedAfter=${Math.floor(new Date(postedAfter).getTime() / 1000)}`   : '';
  const rawQuery       = includeRaw    ? `&includeRawData=true`           : '';

  const queryString = `${fieldsQuery}${rawQuery}${sortQuery}${dirQuery}${beforeQuery}${afterQuery}`;

  return `curl -X ${method} "${api}${queryString}" \\
-H "Accept: application/json" \\
-H "Authorization: Bearer ${apiKey}"`;
};