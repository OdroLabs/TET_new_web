"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const serviceFallbackImages = {
  1: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
  2: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
  3: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  4: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
  5: "https://images.unsplash.com/photo-1552664730-d307ca884978",
  6: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
};

const defaultServices = [
  { id: 1, title: "Legal Aid & Human Rights", tag: "Legal" },
  { id: 2, title: "Medical Healthcare Access", tag: "Healthcare" },
  { id: 3, title: "Mental Health & Counseling", tag: "Wellness" },
  { id: 4, title: "Community Support & Safety", tag: "Advocacy" },
  { id: 5, title: "Employment & Skills Training", tag: "Growth" },
  { id: 6, title: "Crisis Intervention", tag: "Emergency" },
];

export default function ServicesPage() {
  const { t, getAssetUrl, isPreview } = useLanguage();

  // Cross-origin position-based scroll listener
  useEffect(() => {
    const handleScrollMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId, cardIndex } = event.data;

        // If a specific card inside the grid was edited, focus that card
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

  return (
    <div className="bg-[#f8fafc] text-slate-900 overflow-x-hidden scroll-smooth selection:bg-sky-100">
      
      {/* 1. HERO SECTION */}
      <section id="services-hero" className="scroll-mt-28 relative bg-slate-950 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={getAssetUrl("service_hero_bg", "https://images.unsplash.com/photo-1511632765486-a01980e01a18")}
            fill
            alt="Hero Background"
            className="object-cover"
            priority
            unoptimized={isPreview}
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
            <span className="text-[#2A8ACD] font-bold tracking-widest text-xs uppercase mb-4 block">
              {t("s_hero_label", "Our Essential Services")}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {t("s_hero_title", "Comprehensive Support for the Transgender Community.")}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              {t(
                "s_hero_desc",
                "TET provides a critical support infrastructure in Sri Lanka. From legal defense to clinical rehabilitation, we exist to dismantle systemic barriers and protect human dignity."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES GRID (6 CARDS) */}
      <section id="services-grid" className="scroll-mt-28 py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {defaultServices.map((service) => (
            <motion.div
              key={service.id}
              id={`service-card-${service.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: service.id * 0.08 }}
              className="scroll-mt-32 bg-white group rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-[#2A8ACD] transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={getAssetUrl(
                    `service_${service.id}_img`,
                    serviceFallbackImages[service.id as keyof typeof serviceFallbackImages]
                  )}
                  fill
                  alt={t(`service_${service.id}_title`, service.title)}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized={isPreview}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* 👇 Applied #2A8ACD */}
                <div className="absolute top-4 left-4 bg-[#2A8ACD] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                  {t(`service_${service.id}_tag`, service.tag)}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#2A8ACD] transition-colors">
                  {t(`service_${service.id}_title`, service.title)}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {t(
                    `service_${service.id}_desc`,
                    "Our specialized team provides immediate intervention and support ensuring fundamental rights are upheld."
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. SUPPORT PROCESS (3 STEPS) */}
      <section id="services-process" className="scroll-mt-28 py-24 bg-gradient-to-b from-slate-100/70 to-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2A8ACD] font-bold uppercase tracking-[0.25em] text-[11px] block mb-2">
              {t("s_process_label", "Intake & Recovery Framework")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t("s_process_title", "How We Deliver Care")}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {t(
                "s_process_desc",
                "A transparent, survivor-centered intake pipeline ensuring confidentiality, medical safety, and long-term legal security."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 1, title: "Initial Contact & Triage", text: "Direct intake via our confidential crisis channel or referral network." },
              { id: 2, title: "Action Plan & Case Assignment", text: "Assigning qualified legal counsel, social workers, and clinical liaisons." },
              { id: 3, title: "Sustained Integration & Care", text: "Ongoing vocational training, housing support, and recovery tracking." },
            ].map((step) => (
              <motion.div
                key={step.id}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
            
                className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative hover:border-[#2A8ACD] hover:shadow-md transition-all"
              >
              
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-[#2A8ACD] font-bold flex items-center justify-center text-lg mb-6">
                  0{step.id}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-3">
                  {t(`s_proc_${step.id}_title`, step.title)}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {t(`s_proc_${step.id}_text`, step.text)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY CRISIS HOTLINE CTA */}
      <section id="services-emergency" className="scroll-mt-28 py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-red-600 to-rose-700 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-white/30">
              {t("s_emergency_badge", "24/7 Rapid Response")}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-black mb-4 leading-tight">
              {t("s_emergency_title", "In Immediate Danger or Facing Unlawful Detention?")}
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              {t(
                "s_emergency_desc",
                "Our rapid response defense team operates around the clock to provide emergency bail interventions and safe-house transit."
              )}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <a
              href={`tel:${t("s_emergency_phone", "+94 11 234 5678").replace(/[^0-9+]/g, "")}`}
              className="bg-white text-red-600 hover:bg-slate-100 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 text-center whitespace-nowrap"
            >
              📞 {t("s_emergency_phone", "+94 11 234 5678")}
            </a>
            <span className="text-[10px] text-white/70 uppercase tracking-widest mt-2">
              Confidential Emergency Line
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}