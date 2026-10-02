"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const youthServiceSlots = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

interface SelectedYouthService {
  id: number;
  icon: string;
  tag: string;
  title: string;
  desc: string;
}

export default function VolunteerPage() {
  const { t, getAssetUrl, isPreview } = useLanguage();

  const [formData, setFormData] = useState({
    volunteer_type: "youth",
    full_name: "",
    contact_number: "",
    nic: "",
    birth_year: "",
    district: "",
    anti_stigma_consent: "yes",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedYouthService, setSelectedYouthService] = useState<SelectedYouthService | null>(null);

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
        const { sectionId, cardIndex } = event.data;
        const targetId = cardIndex ? `youth-card-${cardIndex}` : sectionId;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (formData.anti_stigma_consent !== "yes") {
      setErrorMessage(t("ui_volunteer_consent_error"));
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submitted_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(t("ui_volunteer_submit_failed"));
      }

      setSubmitStatus("success");
      setFormData({
        volunteer_type: "youth",
        full_name: "",
        contact_number: "",
        nic: "",
        birth_year: "",
        district: "",
        anti_stigma_consent: "yes",
      });
    } catch (err: unknown) {
      setSubmitStatus("error");
      setErrorMessage(err instanceof Error ? err.message : t("ui_volunteer_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const heroParagraphs = splitIntoShortParagraphs(t("v_hero_desc"));
  const youthParagraphs = splitIntoShortParagraphs(t("v_youth_desc"));
  const formParagraphs = splitIntoShortParagraphs(t("v_form_desc"));

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-[#2A8ACD] overflow-x-hidden scroll-smooth">
      <section 
        id="volunteer-hero" 
        className="scroll-mt-28 relative max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-14"
      >
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="w-full lg:w-1/2 flex flex-col items-start text-left z-20"
        >
          <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[10px] uppercase mb-4 px-3.5 py-1.5 bg-sky-50 rounded-full border border-[#EFBAC6]/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {t("v_hero_label")}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#1b5e94] mb-6 leading-snug md:leading-[1.25] tracking-normal text-balance">
            {t("v_hero_title1")}
            <span className="block mt-2 font-normal text-pride-gradient">
              {t("v_hero_title2")}
            </span>
          </h1>

          <div className="space-y-3.5 mb-8 max-w-lg text-sm md:text-[15px] leading-relaxed">
            {heroParagraphs.map((para, idx) => (
              <p key={idx} className={idx === 0 ? "text-slate-700 font-medium" : "text-slate-500"}>
                {para}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <a
              href="#volunteer-form"
              className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md shadow-sky-100 transition-all hover:scale-105 active:scale-95"
            >
              {t("v_hero_btn1")}
            </a>
            <a
              href="#volunteer-youth"
              className="border border-[#2A8ACD] hover:border-pink-400 bg-white/80 hover:bg-sky-50 text-[#2A8ACD] px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all"
            >
              {t("v_hero_btn2")}
            </a>
          </div>
        </motion.div>

        <div className="w-full lg:w-1/2 relative h-[420px] md:h-[580px]">
          <div className="absolute top-10 right-0 w-4/5 h-full bg-[#EFB9C5]/30 blur-[100px] rounded-full animate-pulse"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute top-0 right-0 w-full h-full rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
          >
            <Image
              src={getAssetUrl("v_hero_img")}
              fill
              alt={t("ui_volunteer_community_volunteers")}
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={isPreview}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/30 via-transparent to-pink-500/10"></div>
          </motion.div>
        </div>
      </section>

      <section 
        id="volunteer-youth" 
        className="scroll-mt-28 py-20 md:py-24 bg-gradient-to-b from-[#ebf6ff]/70 to-[#fdf2f8]/70 border-y border-sky-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-pink-600 font-bold uppercase text-[10px] tracking-[0.25em] block mb-2">
              {t("v_youth_label")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b5e94] mb-4 leading-snug tracking-normal text-balance">
              {t("v_youth_title")}
            </h2>
            <div className="space-y-2 text-slate-600 text-sm md:text-base leading-relaxed">
              {youthParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {youthServiceSlots.map((service) => {
              const icon = t(`v_youth_${service.id}_icon`);
              const tag = t(`v_youth_${service.id}_tag`);
              const title = t(`v_youth_${service.id}_title`);
              const desc = t(`v_youth_${service.id}_desc`);

              return (
                <motion.div
                  key={service.id}
                  id={`youth-card-${service.id}`}
                  whileHover={{ y: -6 }}
                  className="scroll-mt-32 bg-white/90 backdrop-blur-sm p-7 rounded-3xl border border-sky-200/80 shadow-sm hover:shadow-lg hover:border-[#2A8ACD] transition-all flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-3xl">{icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                        {tag}
                      </span>
                    </div>
                    <h3 className="text-[#1b5e94] font-bold text-lg mb-3 leading-snug min-h-[3.25rem] flex items-center">
                      {title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 min-h-[4.5rem]">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-sky-50 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedYouthService({
                          id: service.id,
                          icon,
                          tag,
                          title,
                          desc,
                        })
                      }
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section 
        id="volunteer-form" 
        className="scroll-mt-28 py-20 md:py-24 px-6"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl border border-sky-200 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-pink-400 p-8 md:p-12 text-white">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-100 block mb-2">
              {t("v_form_tag")}
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-normal leading-snug">
              {t("v_form_title")}
            </h3>
            <div className="text-sky-50 text-xs md:text-sm mt-2 max-w-xl space-y-1.5">
              {formParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-14">
            {submitStatus === "success" ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-sky-100 text-[#2A8ACD] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-sky-300">
                  ✓
                </div>
                <h4 className="text-2xl font-bold text-[#2A8ACD] mb-2">{t("ui_volunteer_application_received")}</h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                  {t("ui_volunteer_thank_you_for_volunteering_with")}
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  {t("ui_volunteer_submit_another_response")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-[#1b5e94] font-bold text-xs uppercase tracking-wider mb-3">
                    {t("ui_volunteer_select_volunteer_role")}{" "}<span className="text-pink-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                        formData.volunteer_type === "general"
                          ? "border-[#2A8ACD] bg-sky-50/70 text-[#2A8ACD] shadow-sm"
                          : "border-slate-200 hover:border-sky-200 text-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="volunteer_type"
                        value="general"
                        checked={formData.volunteer_type === "general"}
                        onChange={handleChange}
                        className="accent-[#2A8ACD] w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-sm">{t("ui_volunteer_general_volunteer")}</div>
                        <div className="text-[11px] text-slate-500">{t("ui_volunteer_legal_healthcare_events_and_community")}</div>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                        formData.volunteer_type === "youth"
                          ? "border-pink-400 bg-pink-50/70 text-pink-950 shadow-sm"
                          : "border-slate-200 hover:border-pink-200 text-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="volunteer_type"
                        value="youth"
                        checked={formData.volunteer_type === "youth"}
                        onChange={handleChange}
                        className="accent-pink-500 w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-sm">{t("ui_volunteer_youth_volunteer")}</div>
                        <div className="text-[11px] text-slate-500">{t("ui_volunteer_peer_circles_youth_empowerment_mental")}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#1b5e94] font-bold text-xs uppercase tracking-wider mb-2">
                      {t("ui_volunteer_full_name")}{" "}<span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder={t("ui_volunteer_e_g_kasun_fernando")}
                      className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1b5e94] font-bold text-xs uppercase tracking-wider mb-2">
                      {t("ui_volunteer_contact_number")}{" "}<span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact_number"
                      required
                      value={formData.contact_number}
                      onChange={handleChange}
                      placeholder={t("ui_volunteer_07x_xxx_xxxx")}
                      className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1b5e94] font-bold text-xs uppercase tracking-wider mb-2">
                      {t("ui_volunteer_national_identity_card_nic")}{" "}<span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nic"
                      required
                      value={formData.nic}
                      onChange={handleChange}
                      placeholder={t("ui_volunteer_e_g_2000xxxxxxxx_or_xxxxxxxxxv")}
                      className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1b5e94] font-bold text-xs uppercase tracking-wider mb-2">
                      {t("ui_volunteer_birth_year")}{" "}<span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="birth_year"
                      required
                      min="1950"
                      max={new Date().getFullYear() - 14}
                      value={formData.birth_year}
                      onChange={handleChange}
                      placeholder={t("ui_volunteer_yyyy_e_g_2002")}
                      className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1b5e94] font-bold text-xs uppercase tracking-wider mb-2">
                    {t("ui_volunteer_current_living_district")}{" "}<span className="text-pink-500">*</span>
                  </label>
                  <select
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30 text-slate-700"
                  >
                    <option value="">{t("ui_volunteer_select_your_district")}</option>
                    {t("v_districts").split(",").map((d) => d.trim()).filter(Boolean).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-sky-50/60 p-6 rounded-2xl border border-sky-200">
                  <span className="block font-bold text-[#1b5e94] text-xs uppercase tracking-wider mb-2">
                    {t("ui_volunteer_declaration_and_consent")}{" "}<span className="text-pink-500">*</span>
                  </span>
                  <div className="space-y-2 text-slate-600 text-xs md:text-sm leading-relaxed mb-4">
                    <p>
                      <strong>{t("ui_volunteer_tet_declaration")}</strong>{" "}
                      {t("v_form_consent_text")}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#2A8ACD]">
                      <input
                        type="radio"
                        name="anti_stigma_consent"
                        value="yes"
                        checked={formData.anti_stigma_consent === "yes"}
                        onChange={handleChange}
                        className="accent-[#2A8ACD] w-4 h-4"
                      />
                      <span>{t("ui_volunteer_yes_i_agree")}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-500">
                      <input
                        type="radio"
                        name="anti_stigma_consent"
                        value="no"
                        checked={formData.anti_stigma_consent === "no"}
                        onChange={handleChange}
                        className="accent-pink-500 w-4 h-4"
                      />
                      <span>{t("ui_volunteer_no")}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-[#2A8ACD] hover:bg-[#2374b0] disabled:opacity-50 text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-md shadow-sky-100 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {isSubmitting ? t("ui_volunteer_submitting") : t("v_form_btn")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section 
        id="volunteer-quote" 
        className="scroll-mt-28 py-20 px-6 text-center border-t border-sky-200/60"
      >
        <div className="max-w-2xl mx-auto">
          <span className="text-4xl text-pink-400 mb-4 block font-serif">
            {t("ui_volunteer_text")}
          </span>
          <p className="font-serif text-2xl md:text-3xl text-[#1b5e94] mb-4 leading-snug">
            {t("v_footer_quote")}
          </p>
          <p className="text-[10px] font-bold text-[#2A8ACD] uppercase tracking-[0.3em]">
            {t("v_footer_cite")}
          </p>
        </div>
      </section>

      <AnimatePresence>
        {selectedYouthService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedYouthService(null)}
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
                  <span className="text-4xl">{selectedYouthService.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-white px-3 py-1 rounded-full border border-pink-200 shadow-sm">
                    {selectedYouthService.tag}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedYouthService(null)}
                  className="bg-white hover:bg-slate-100 text-slate-700 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border border-slate-200 transition-all cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <h3 className="text-2xl font-bold text-[#1b5e94] leading-snug">
                  {selectedYouthService.title}
                </h3>
                <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {splitIntoShortParagraphs(selectedYouthService.desc).map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:px-8 border-t border-slate-100 flex justify-end bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setSelectedYouthService(null)}
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