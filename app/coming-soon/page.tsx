import type { Metadata } from "next";
import ComingSoonContent from "./ComingSoonContent";
import { getSettings, text } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: text(s, "seo_comingsoon_title") || undefined,
    description: text(s, "seo_comingsoon_description") || undefined,
  };
}

export default function Page() {
  return <ComingSoonContent />;
}
