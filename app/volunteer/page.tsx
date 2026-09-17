import type { Metadata } from "next";
import VolunteerContent from "./VolunteerContent";

export const metadata: Metadata = {
  title: "Volunteer & Youth Empowerment | Trans Equality Trust",
  description: "Join TET's community network as a volunteer or youth peer advocate. Help build a stigma-free Sri Lanka through advocacy, peer circles, and community support.",
  keywords: [
    "Volunteer Sri Lanka NGO",
    "Trans Equality Trust volunteer application",
    "Youth peer support volunteer Colombo",
    "LGBTQ+ advocacy volunteer opportunities Sri Lanka"
  ],
  openGraph: {
    title: "Volunteer & Youth Empowerment | Trans Equality Trust",
    description: "Lend your voice, skills, and empathy to help build a stigma-free Sri Lanka.",
    url: "https://transequalitytrust.lk/volunteer",
    siteName: "Trans Equality Trust",
    images: [
      {
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Trans Equality Trust Volunteer Community",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Volunteer | Trans Equality Trust",
    description: "Join our volunteer network and help shape a stigma-free future.",
  },
  alternates: {
    canonical: "https://transequalitytrust.lk/volunteer",
  },
};

export default function Page() {
  // 2. WebPage & Organization Schema for Volunteer Opportunities
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Volunteer Application Desk",
    "description": "Application portal for general and youth volunteering opportunities with Trans Equality Trust.",
    "url": "https://transequalitytrust.lk/volunteer",
    "provider": {
      "@type": "NGO",
      "name": "Trans Equality Trust",
      "url": "https://transequalitytrust.lk"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VolunteerContent />
    </>
  );
}