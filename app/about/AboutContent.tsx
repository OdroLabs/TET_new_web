"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const coreValueSlots = [1, 2, 3, 4];

interface DetailModalItem {
  title: string;
  text: string;
  badge?: string;
  icon?: string;
}

export default function AboutPage() {
  const { t, getAssetUrl, isPreview } = useLanguage();
  const [selectedDetail, setSelectedDetail] = useState<DetailModalItem | null>(null);

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
    const handleScrollMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId } = event.data;

        if (sectionId) {
          const targetElement = document.getElementById(sectionId);
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

  const heroParagraphs = splitIntoShortParagraphs(t("about_hero_description"));
  const teamParagraphs = splitIntoShortParagraphs(t("about_team_desc"));
  const leaderBioParagraphs = splitIntoShortParagraphs(t("about_leader_bio"));

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-sky-900 overflow-x-hidden scroll-smooth">
      <section 
        id="about-hero" 
        className="scroll-mt-28 relative max-w-7xl mx-auto px-6 pt-12 pb-16 md:pt-20 flex flex-col items-center text-center"
      >
        <motion.div initial="initial" whileInView="whileInView" variants={fadeInUp} viewport={{ once: true }} className="w-full">
          <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[10px] uppercase mb-4 px-4 py-1.5 bg-sky-50 rounded-full border border-[#EFBAC6]/40 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {t("about_hero_label")}
          </span>
            
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] font-bold text-[#1b5e94] mb-6 leading-snug md:leading-[1.24] tracking-normal text-balance max-w-4xl mx-auto">
            {t("about_hero_title")}
          </h1>

          <div className="max-w-5xl mx-auto mt-8 text-left bg-white/95 backdrop-blur-md p-7 sm:p-10 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-sky-100 shadow-xl shadow-sky-900/5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-7 border-b border-sky-100">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A8ACD]"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1b5e94]">
                  {t("ui_about_our_foundation") || "Our Journey & Purpose"}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A8ACD] bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/60">
                Since 2002 • Sri Lanka
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {heroParagraphs.map((para, idx) => (
                <div key={idx} className="flex flex-col justify-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600 block mb-2.5">
                    {idx === 0
                      ? (t("ui_about_pillar_advocacy") || "Advocacy & Autonomy")
                      : (t("ui_about_pillar_community") || "Direct Action & Resilience")}
                  </span>
                  <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed">
                    {para}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-sky-100 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <span className="block text-base sm:text-lg font-bold text-[#1b5e94]">20+ Yrs</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mt-0.5">Grassroots Legacy</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100">
                <span className="block text-base sm:text-lg font-bold text-pink-700">Holistic</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mt-0.5">Health & Care</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <span className="block text-base sm:text-lg font-bold text-[#1b5e94]">Rights-Based</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mt-0.5">Legal Protection</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100">
                <span className="block text-base sm:text-lg font-bold text-pink-700">Community</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mt-0.5">Led & Governed</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative w-full max-w-4xl h-[320px] md:h-[500px] mt-12 rounded-t-[2.5rem] md:rounded-t-full overflow-hidden shadow-2xl border-4 border-white border-b-8 border-b-[#2A8ACD]">
          <Image
            src={getAssetUrl("about_hero_image")}
            fill
            alt={t("ui_about_advocacy_header")}
            className="object-cover object-top"
            priority
            unoptimized={isPreview}
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/30 via-transparent to-pink-500/10"></div>
        </div>
      </section>

      <section 
        id="about-vision" 
        className="scroll-mt-28 py-16 md:py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
      >
        <motion.div
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-sm p-8 sm:p-10 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-sky-200/80 shadow-sm hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between h-full"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl mb-6 border border-sky-200">
              👁️
            </div>
              
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b5e94] mb-3 leading-snug">
              {t("about_vision_title")}
            </h2>
            <div className="space-y-2 text-slate-600 text-sm md:text-base leading-relaxed line-clamp-4 min-h-[4.5rem]">
              {splitIntoShortParagraphs(t("about_vision_text")).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-sky-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setSelectedDetail({
                  title: t("about_vision_title"),
                  text: t("about_vision_text"),
                  icon: "👁️",
                  badge: "Vision",
                })
              }
              className="text-[#2A8ACD] hover:text-[#2374b0] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all group/btn cursor-pointer"
            >
              <span>{t("btn_read_more") || "Read More"}</span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-sm p-8 sm:p-10 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-pink-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between h-full"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl mb-6 border border-pink-200">
              🎯
            </div>
          
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b5e94] mb-3 leading-snug">
              {t("about_mission_title")}
            </h2>
            <div className="space-y-2 text-slate-600 text-sm md:text-base leading-relaxed line-clamp-4 min-h-[4.5rem]">
              {splitIntoShortParagraphs(t("about_mission_text")).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-pink-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setSelectedDetail({
                  title: t("about_mission_title"),
                  text: t("about_mission_text"),
                  icon: "🎯",
                  badge: "Mission",
                })
              }
              className="text-[#2A8ACD] hover:text-[#2374b0] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all group/btn cursor-pointer"
            >
              <span>{t("btn_read_more") || "Read More"}</span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </section>

      <section 
        id="about-values" 
        className="scroll-mt-28 py-20 md:py-24 bg-gradient-to-b from-[#ebf6ff]/70 via-white to-[#fdf2f8]/70 rounded-[2.5rem] md:rounded-[4rem] mx-4 md:mx-10 px-6 border border-sky-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-pink-600 font-bold uppercase text-[10px] tracking-[0.25em] block mb-2">
            {t("ui_about_guiding_principles")}
          </span>
        
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b5e94] mb-14 leading-snug tracking-normal text-balance">
            {t("about_values_main_title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {coreValueSlots.map((id) => {
              const title = t(`about_value_${id}_title`);
              const text = t(`about_value_${id}_text`);
              return (
                <motion.div
                  key={id}
                  initial="initial"
                  whileInView="whileInView"
                  variants={fadeInUp}
                  viewport={{ once: true }}
                  className="bg-white/90 p-7 sm:p-8 rounded-3xl border border-sky-200/70 shadow-sm flex flex-col justify-between items-center text-center hover:border-pink-300 hover:shadow-md transition-all h-full"
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="w-2 h-10 bg-gradient-to-b from-[#2A8ACD] to-pink-400 rounded-full mb-5"></div>
                    
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1b5e94] mb-3 leading-snug min-h-[3rem] flex items-center justify-center">
                      {title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 min-h-[4rem]">
                      {text}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-sky-50 w-full flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDetail({
                          title,
                          text,
                          badge: t("ui_about_guiding_principles"),
                        })
                      }
                      className="text-[#2A8ACD] hover:text-[#2374b0] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all group/btn cursor-pointer"
                    >
                      <span>{t("btn_read_more") || "Read More"}</span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section 
        id="about-leader" 
        className="scroll-mt-28 py-20 md:py-28 max-w-7xl mx-auto px-6"
      >
        <div className="bg-white rounded-3xl md:rounded-[3rem] overflow-hidden shadow-xl border border-sky-200/80 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-2/5 h-[380px] lg:h-[560px] relative bg-slate-100">
            <Image
              src={getAssetUrl("about_leader_image")}
              fill
              alt={t("ui_about_leader")}
              className="object-cover object-top"
              unoptimized={isPreview}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-transparent to-pink-500/10"></div>
          </div>

          <div className="w-full lg:w-3/5 p-8 sm:p-10 md:p-14 flex flex-col justify-between">
            <div>
              <span className="text-[#2A8ACD] font-bold tracking-[0.25em] text-[10px] uppercase mb-2 block">
                {t("about_leader_label")}
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b5e94] mb-2 leading-snug">
                {t("about_leader_name")}
              </h2>
              <p className="text-pink-600 font-serif mb-5 font-semibold text-sm md:text-base">
                {t("about_leader_role")}
              </p>
              
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed mb-8">
                {leaderBioParagraphs.map((para, idx) => (
                  <p key={idx} className={idx === 0 ? "text-slate-800 font-medium" : "text-slate-500"}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-sky-100 pt-6">
              <div>
                <p className="text-3xl font-serif font-bold text-[#1b5e94]">
                  {t("about_leader_stat1_val")}
                </p>
                <p className="text-[10px] font-bold text-[#2A8ACD] uppercase tracking-widest mt-1">
                  {t("about_leader_stat1_label")}
                </p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-pink-600">
                  {t("about_leader_stat2_val")}
                </p>
                <p className="text-[10px] font-bold text-[#2A8ACD] uppercase tracking-widest mt-1">
                  {t("about_leader_stat2_label")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        id="about-team" 
        className="scroll-mt-28 py-20 md:py-24 px-6 bg-gradient-to-b from-[#ebf6ff]/50 via-white to-sky-50/30 border-y border-sky-100"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            variants={fadeInUp}
            viewport={{ once: true }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <span className="text-pink-600 font-bold uppercase text-[10px] tracking-[0.25em] block mb-2">
              {t("about_team_label")}
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b5e94] mb-4 leading-snug tracking-normal text-balance">
              {t("about_team_title")}
            </h2>
            <div className="space-y-2 text-slate-600 text-sm md:text-base leading-relaxed">
              {teamParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="whileInView"
            variants={fadeInUp}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-200/50 via-pink-200/40 to-sky-200/50 blur-3xl -z-10 transform scale-95 rounded-full"></div>

            <div className="relative w-full h-[350px] sm:h-[450px] md:h-[540px] rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <Image
                src={getAssetUrl("about_team_group_image")}
                fill
                alt={t("ui_about_our_team_members")}
                className="object-cover object-top"
                unoptimized={isPreview}
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/50 via-transparent to-pink-500/10"></div>

              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-sky-200 shadow-md text-left">
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest block">
                  {t("ui_about_trans_equality_trust")}
                </span>
                    
                <span className="text-xs md:text-sm font-bold text-[#1b5e94]">
                  {t("ui_about_team_and_grassroots_community_organizers")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetail(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full z-10 max-h-[85vh] flex flex-col border border-sky-100"
            >
              <div className="p-6 sm:p-8 bg-gradient-to-r from-sky-50 to-pink-50/60 border-b border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedDetail.icon && (
                    <span className="text-3xl">{selectedDetail.icon}</span>
                  )}
                  {selectedDetail.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-white px-3.5 py-1 rounded-full border border-pink-200 shadow-sm">
                      {selectedDetail.badge}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  className="bg-white hover:bg-slate-100 text-slate-700 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border border-slate-200 transition-all cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <h3 className="text-2xl font-bold text-[#1b5e94] leading-snug">
                  {selectedDetail.title}
                </h3>
                <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {splitIntoShortParagraphs(selectedDetail.text).map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:px-8 border-t border-slate-100 flex justify-end bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
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