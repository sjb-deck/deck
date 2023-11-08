export function buildUrl(template, params) {
  let url = template;
  for (const key in params) {
    if (params[key].length === 0) continue;
    url = url.replace(`:${key}`, params[key]);
  }
  // Remove any remaining placeholders that were not provided
  url = url.replace(/:\w+/g, '');
  return url;
}
