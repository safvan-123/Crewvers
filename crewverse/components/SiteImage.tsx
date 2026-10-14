import imageData from "../lib/image-data.json";
import type {CmsImage} from "../lib/cms";
export default function SiteImage({image, alt, className = "", sizes = "100vw", priority = false}: {
  image: string | CmsImage; alt?: string; className?: string; sizes?: string; priority?: boolean;
}) {
  const source = typeof image === "string" ? image : image.url;
  const local = (imageData as Record<string, {width: number; height: number; sources: string}>)[source];
  const remote = typeof image !== "string" ? image : null;
  const srcSet = local?.sources || (remote?.width && source.startsWith("https://cdn.sanity.io/")
    ? [...new Set([480, 960, 1600, Math.min(2560, remote.width)].filter(w => w <= remote.width!))]
        .sort((a,b) => a-b).map(w => `${source}?auto=format&w=${w}&q=85 ${w}w`).join(", ") : undefined);
  return <img src={source} srcSet={srcSet} sizes={srcSet ? sizes : undefined}
    alt={alt || remote?.alt || ""} className={className}
    width={local?.width || remote?.width} height={local?.height || remote?.height}
    loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async"
    style={remote?.hotspot ? {objectPosition: `${remote.hotspot.x * 100}% ${remote.hotspot.y * 100}%`} : undefined} />;
}
