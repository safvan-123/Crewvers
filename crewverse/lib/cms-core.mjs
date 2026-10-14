// A fresh request tag per build process prevents restored fetch caches from
// freezing CMS content across deployments. Requests still deduplicate per build.
const buildTag = `crewverse.${Date.now().toString(36)}`;
export function queryUrl(projectId, dataset, query) {
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) {
    throw new Error("Invalid Sanity project ID or dataset. Check the website environment variables.");
  }
  const url = new URL(`https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  url.searchParams.set("returnQuery", "false");
  return url;
}
export async function fetchPublished(query, {projectId, dataset = "production", fetcher = fetch} = {}) {
  if (!projectId) return null;
  const url = queryUrl(projectId, dataset, query);
  url.searchParams.set("tag", buildTag);
  const response = await fetcher(url, {
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Sanity read failed (${response.status}). Build stopped to preserve the current deployed website.`);
  const payload = await response.json();
  if (payload.error || !("result" in payload)) throw new Error("Sanity returned an invalid query response.");
  return payload.result;
}
export function filterPublishedEvents(events) {
  const slugs = new Set();
  return (Array.isArray(events) ? events : []).filter((event) => {
    if (!event || /^drafts\.|^versions\./.test(event._id || "") || !event.title ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug || "") ||
        !event.startDate || Number.isNaN(Date.parse(event.startDate)) || slugs.has(event.slug)) return false;
    slugs.add(event.slug);
    return true;
  });
}
