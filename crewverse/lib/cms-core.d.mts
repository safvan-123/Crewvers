export function queryUrl(projectId: string, dataset: string, query: string): URL;
export function fetchPublished(query: string, options?: {projectId?: string; dataset?: string; fetcher?: typeof fetch}): Promise<any>;
export function filterPublishedEvents(events: unknown): any[];
