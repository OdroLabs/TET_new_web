// Runs before every page request (Next.js 16 "proxy", formerly middleware).
// - Coming Soon mode (Admin → Site Status): visitors see /coming-soon, the URL stays the same.
// - Holders of the admin preview link (?tet_preview=KEY, remembered in a cookie) see the real site.
// - "Hide from search engines": adds X-Robots-Tag: noindex, nofollow to every response.
import { NextResponse, type NextRequest } from "next/server";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");
const COOKIE = "tet_preview";

interface SiteStatus {
  coming_soon: boolean;
  noindex: boolean;
  preview: boolean;
}

async function getStatus(key: string): Promise<SiteStatus | null> {
  try {
    const res = await fetch(`${API_BASE}/api/site-status?key=${encodeURIComponent(key)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) return (await res.json()) as SiteStatus;
  } catch {
    // Backend unreachable: never lock visitors out because of it
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // "Exit preview": forget the preview pass and reload as a normal visitor
  if (searchParams.get(COOKIE) === "exit") {
    const clean = new URL(request.url);
    clean.searchParams.delete(COOKIE);
    const res = NextResponse.redirect(clean);
    res.cookies.set(COOKIE, "", { httpOnly: true, secure: true, sameSite: "none", path: "/", maxAge: 0 });
    return res;
  }

  const queryKey = searchParams.get(COOKIE) || "";
  const key = queryKey || request.cookies.get(COOKIE)?.value || "";

  const status = await getStatus(key);
  if (!status) return NextResponse.next();

  const onComingSoonRoute = pathname === "/coming-soon";
  const showComingSoon = status.coming_soon && !status.preview;

  // The Coming Soon URL only exists while the mode is on (or for previewing it)
  if (onComingSoonRoute && !status.coming_soon && !status.preview) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Live flags for the page render (layout.tsx), so switches apply instantly
  const headers = new Headers(request.headers);
  headers.set("x-tet-noindex", status.noindex ? "1" : "0");
  // Coming Soon is on but this browser holds the preview pass: layout shows a "Preview mode" bar
  headers.set("x-tet-preview", status.coming_soon && status.preview ? "1" : "0");

  let response: NextResponse;
  if (showComingSoon || onComingSoonRoute) {
    headers.set("x-tet-coming-soon", "1"); // layout renders the page without navbar/footer
    response = onComingSoonRoute
      ? NextResponse.next({ request: { headers } })
      : NextResponse.rewrite(new URL("/coming-soon", request.url), { request: { headers } });
  } else {
    response = NextResponse.next({ request: { headers } });
  }

  // Remember a valid preview link for 30 days (SameSite=None so it also works inside the admin preview frame)
  if (queryKey && status.preview) {
    response.cookies.set(COOKIE, queryKey, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (status.noindex) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Pages only: skip Next internals, API routes and any file with an extension (images, robots.txt, sitemap.xml, ...)
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
