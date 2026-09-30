"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import Logo from "../components/Logo";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "si", label: "සිං" },
  { code: "ta", label: "தமி" },
];

export default function ComingSoonContent() {
  const { t, getAssetUrl, data, locale, setLocale, isPreview } = useLanguage();
  const email = t("cs_contact_email");
  const phone = t("cs_contact_phone");
  const customLogo = data?.["site_logo"];

  return (
    <main className="min-h-screen w-full bg-[#fdfcf9] text-[#1a365d] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative h-12 w-48 mb-12">
        {customLogo ? (
          <Image src={getAssetUrl(customLogo)} fill alt={t("seo_site_name")} className="object-contain" priority unoptimized={isPreview} />
        ) : (
          <Logo className="h-12 w-auto mx-auto" />
        )}
      </div>

      {t("cs_badge") && (
        <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[11px] uppercase mb-6">{t("cs_badge")}</span>
      )}

      <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-[#2374b0] max-w-3xl">
        {t("cs_title_1")}{" "}
        <span className="italic font-normal text-pride-gradient">{t("cs_title_2")}</span>
      </h1>

      <div className="w-16 h-1 bg-pride-line rounded-full my-8" />

      <p className="max-w-xl text-slate-600 text-base md:text-lg leading-relaxed">{t("cs_message")}</p>

      {(email || phone) && (
        <p className="mt-10 text-sm text-slate-500">
          {t("cs_contact_label")}{" "}
          {phone && (
            <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="font-semibold text-[#2A8ACD] hover:underline whitespace-nowrap">{phone}</a>
          )}
          {phone && email && <span className="mx-2 text-slate-300">·</span>}
          {email && (
            <a href={`mailto:${email}`} className="font-semibold text-[#2A8ACD] hover:underline whitespace-nowrap">{email}</a>
          )}
        </p>
      )}

      <div className="mt-12 flex gap-1 text-[11px] font-bold">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
              locale === l.code ? "bg-[#2A8ACD] text-white" : "text-slate-400 hover:text-[#2A8ACD]"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </main>
  );
}
