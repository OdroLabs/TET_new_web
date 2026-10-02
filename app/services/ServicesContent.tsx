"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://qtxzpyl7n4pxoe9ku8fr280l.51.79.156.158.sslip.io").replace(/\/+$/, "");

type Tri = Record<string, string> | string | null | undefined;

export interface ApiService {
  id: number;
  tag: Tri;
  title: Tri;
  description: Tri;
  image: string | null;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0f2fe"/><stop offset="1" stop-color="#fce7f3"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/></svg>'
  );

export default function ServicesPage({
  initialServices = null,
}: {
  initialServices?: ApiService[] | null;
}) {
  const { t, getAssetUrl, isPreview, locale } = useLanguage();
  const [services, setServices] = useState<ApiService[]>(initialServices ?? []);
  const [selectedService, setSelectedService] = useState<ApiService | null>(null);

  const tr = (v: Tri): string => {
    if (!v) return "";
    if (typeof v === "string") return v;
    return v[locale] || v["en"] || "";
  };

  const splitIntoShortParagraphs = (text: string) => {
    if (!text) return [];

    const directParagraphs = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (directParagraphs.length > 1) {
      return directParagraphs;
    }

    const sentences = text
      .match(/[^.!?।]+[.!?।]+(\s|$)/g)
      ?.map((s) => s.trim())
      .filter(Boolean);

    if (sentences && sentences.length >= 2) {
      const mid = Math.ceil(sentences.length / 2);
      return [
        sentences.slice(0, mid).join(" ").trim(),
        sentences.slice(mid).join(" ").trim(),
      ];
    }

    return [text];
  };

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/services?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) setServices(data);
      } catch (err) {
        console.warn("Services API unavailable:", err);
      }
    };

    loadServices();

    const handleReload = (event: MessageEvent) => {
      if (event.data?.type === "TET_RELOAD_COLLECTION") loadServices();
    };
    window.addEventListener("message", handleReload);

    return () => {
      isMounted = false;
      window.removeEventListener("message", handleReload);
    };
  }, []);

  useEffect(() => {
    const handleScrollMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId, cardIndex } = event.data;

        const targetId = cardIndex ? `service-card-${cardIndex}` : sectionId;

        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - 90;

            window.scrollTo({
              top: targetY,
              behavior: "smooth",
            });

            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
    };

    window.addEventListener("message", handleScrollMessage);
    return () => window.removeEventListener("message", handleScrollMessage);
  }, []);

  const heroParagraphs = splitIntoShortParagraphs(t("s_hero_desc"));
  const processParagraphs = splitIntoShortParagraphs(t("s_process_desc"));
  const emergencyParagraphs = splitIntoShortParagraphs(t("s_emergency_desc"));

  return (
    <div className="bg-[#f8fafc] text-slate-900 overflow-x-hidden scroll-smooth selection:bg-sky-100">
      <section id="services-hero" className="scroll-mt-28 relative bg-slate-950 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={getAssetUrl("service_hero_bg")}
            fill
            alt={t("ui_services_hero_background")}
            className="object-cover"
            priority
            unoptimized={isPreview}
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
            <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-xs uppercase mb-4 block">
              {t("s_hero_label")}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-snug md:leading-tight tracking-normal text-balance">
              {t("s_hero_title")}
            </h1>
            <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              {heroParagraphs.map((para, idx) => (
                <p key={idx} className={idx === 0 ? "text-slate-200 font-medium" : "text-slate-400"}>
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services-grid" className="scroll-mt-28 py-20 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={`service-card-${service.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.08 }}
              className="scroll-mt-32 bg-white group rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#2A8ACD] transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-60 sm:h-64 overflow-hidden flex-shrink-0 bg-slate-100">
                <Image
                  src={(service.image && getAssetUrl(service.image)) || PLACEHOLDER_IMG}
                  fill
                  alt={tr(service.title)}
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  unoptimized={isPreview}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-[#2A8ACD] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                  {tr(service.tag)}
                </div>
              </div>

              <div className="p-7 sm:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#2A8ACD] transition-colors leading-snug min-h-[3.25rem] flex items-center">
                    {tr(service.title)}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                    {tr(service.description)}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className="text-[#2A8ACD] hover:text-[#2374b0] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all group/btn cursor-pointer"
                  >
                    <span>{t("btn_read_more") || "Read More"}</span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="services-process" className="scroll-mt-28 py-20 md:py-24 bg-gradient-to-b from-slate-100/70 to-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2A8ACD] font-bold uppercase tracking-[0.25em] text-[11px] block mb-2">
              {t("s_process_label")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-snug tracking-normal text-balance">
              {t("s_process_title")}
            </h2>
            <div className="space-y-2 text-slate-600 text-sm md:text-base leading-relaxed">
              {processParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ id: 1 }, { id: 2 }, { id: 3 }].map((step) => (
              <motion.div
                key={step.id}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative hover:border-[#2A8ACD] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-[#2A8ACD] font-bold flex items-center justify-center text-lg mb-6">
                    0{step.id}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3 leading-snug">
                    {t(`s_proc_${step.id}_title`)}
                  </h3>
                  <div className="space-y-2 text-slate-500 text-sm leading-relaxed">
                    {splitIntoShortParagraphs(t(`s_proc_${step.id}_text`)).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="services-emergency" className="scroll-mt-28 py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-red-600 to-rose-700 rounded-[3rem] p-8 sm:p-12 md:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-white/30">
              {t("s_emergency_badge")}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-snug tracking-normal text-balance">
              {t("s_emergency_title")}
            </h2>
            <div className="space-y-2 text-white/90 text-sm md:text-base leading-relaxed">
              {emergencyParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end flex-shrink-0">
            <a
              href={`tel:${t("s_emergency_phone").replace(/[^0-9+]/g, "")}`}
              className="bg-white text-red-600 hover:bg-slate-100 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 text-center whitespace-nowrap"
            >
              📞 {t("s_emergency_phone")}
            </a>
            <span className="text-[10px] text-white/70 uppercase tracking-widest mt-2">
              {t("ui_services_confidential_emergency_line")}
            </span>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full z-10 max-h-[88vh] flex flex-col border border-slate-100"
            >
              <div className="relative h-64 sm:h-80 w-full flex-shrink-0 bg-slate-100">
                <Image
                  src={(selectedService.image && getAssetUrl(selectedService.image)) || PLACEHOLDER_IMG}
                  fill
                  alt={tr(selectedService.title)}
                  className="object-cover object-top"
                  unoptimized={isPreview}
                />
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-4 bg-[#2A8ACD] text-white text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                  {tr(selectedService.tag)}
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {tr(selectedService.title)}
                </h3>
                <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {splitIntoShortParagraphs(tr(selectedService.description)).map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:px-8 border-t border-slate-100 flex justify-end bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}