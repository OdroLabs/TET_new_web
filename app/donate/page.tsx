import type { Metadata } from "next";
import DonateContent from "./DonateContent";

// 1. SEO Metadata tailored specifically for Donations
export const metadata: Metadata = {
  title: "Donate & Support Equality | Trans Equality Trust",
  description: "Invest in equality, legal aid, healthcare access, and safety for transgender individuals in Sri Lanka. 100% of contributions are audited and securely allocated.",
  keywords: [
    "Donate to transgender rights Sri Lanka",
    "Support Trans Equality Trust",
    "TET donation desk",
    "Fund LGBTQ+ legal defense Sri Lanka",
    "Secure NGO donation LKR"
  ],
  openGraph: {
    title: "Donate to Trans Equality Trust | Invest in Equality & Dignity",
    description: "Your financial support directly enables 24/7 legal aid, healthcare access, and emergency shelter.",
    url: "https://transequalitytrust.lk/donate",
    siteName: "Trans Equality Trust",
    images: [
      {
        url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Support Trans Equality Trust - Donation Desk",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Donate | Trans Equality Trust",
    description: "Invest in equality, legal aid, and safety for transgender individuals.",
  },
  alternates: {
    canonical: "https://transequalitytrust.lk/donate",
  },
};

export default function Page() {
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Donate to Trans Equality Trust",
    "description": "Secure contribution desk supporting legal aid, healthcare access, and crisis shelter for transgender individuals in Sri Lanka.",
    "url": "https://transequalitytrust.lk/donate",
    "mainEntity": {
      "@type": "NGO",
      "name": "Trans Equality Trust",
      "url": "https://transequalitytrust.lk",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Colombo",
        "addressCountry": "LK"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DonateContent />
    </>
  );
}