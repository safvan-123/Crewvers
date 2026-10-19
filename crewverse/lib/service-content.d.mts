export function mergeServices<T extends {id: string; title: string; short: string; description: string; roles: string[]; image: string; alt: string}>(defaults: T[], overrides: unknown): T[];
export type ServicePreview = {
 key: string; groupId: string; title: string; short: string; icon: string;
 image: string | {url: string; alt: string; width?: number; height?: number; hotspot?: {x: number; y: number}};
 alt: string;
};
export function mergeServicePreviews(defaults: {key: string; groupId: string; title: string; image: string; icon: string}[], services: {id: string; short: string; alt: string}[], overrides: unknown): ServicePreview[];
