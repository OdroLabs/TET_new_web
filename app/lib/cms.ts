// Server-side helpers: every piece of site text, SEO metadata and structured data
// comes from the admin CMS (Laravel /api/settings). Nothing is hardcoded here.
import type { Metadata } from "next";

export const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

export type Tri = Record<string, string> | string | null | undefined;
export type SettingsMap = Record<string, unknown>;

/** All settings, cached for 60s by Next's fetch cache (shared by layout, pages and metadata). */
export async function getSettings(): Promise<SettingsMap> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, { next: { revalidate: 60 } });
    if (res.ok) return (await res.json()) as SettingsMap;
  } catch (err) {
    console.error("Failed to load settings from the CMS:", err);
  }
  return {};
}

/** Fetch a published collection (projects, services, events, ...). null = backend unreachable. */
export async function getCollection<T>(path: string): Promise<T[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/${path}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? (data as T[]) : null;
    }
  } catch (err) {
    console.error(`Failed to load ${path} from the CMS:`, err);
  }
  return null;
}

/** English text of a trilingual value (SEO output is English). */
export function en(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    const v = value as Record<string, string>;
    return v.en || Object.values(v).find(Boolean) || "";
  }
  return String(value);
}

export const text = (s: SettingsMap, key: string) => en(s[key]).trim();
export const list = (s: SettingsMap, key: string) => text(s, key).split(",").map((x) => x.trim()).filter(Boolean);

/** Absolute URL for a stored image value (CDN URL, external URL or legacy storage path). */
export function assetUrl(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//.test(value)) return value;
  return `${API_BASE}/storage/${value.replace(/^\/?(storage\/)?/, "")}`;
}

export const siteUrl = (s: SettingsMap) => text(s, "seo_site_url").replace(/\/+$/, "");
const orUndef = (v: string) => (v ? v : undefined);

/**
 * Page metadata from settings:
 * seo_{page}_title / _description / _keywords / _og_title / _og_description /
 * _og_image / _og_image_alt / _tw_title / _tw_description / _tw_image
 */
export async function pageMetadata(page: string, path: string): Promise<Metadata> {
  const s = await getSettings();
  const k = (field: string) => text(s, `seo_${page}_${field}`);
  const url = siteUrl(s) + path;
  const ogImage = assetUrl(k("og_image"));
  const twImage = assetUrl(k("tw_image"));

  return {
    title: orUndef(k("title")),
    description: orUndef(k("description")),
    keywords: list(s, `seo_${page}_keywords`),
    openGraph: {
      title: orUndef(k("og_title")),
      description: orUndef(k("og_description")),
      url: orUndef(url),
      siteName: orUndef(text(s, "seo_site_name")),
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: k("og_image_alt") }] : undefined,
      locale: orUndef(text(s, "seo_locale")),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: orUndef(k("tw_title")),
      description: orUndef(k("tw_description")),
      images: twImage ? [twImage] : undefined,
    },
    alternates: url ? { canonical: url } : undefined,
  };
}

/** The organisation block reused across structured data. */
export function orgLd(s: SettingsMap) {
  return {
    "@type": "NGO",
    name: text(s, "seo_site_name"),
    url: siteUrl(s),
  };
}
