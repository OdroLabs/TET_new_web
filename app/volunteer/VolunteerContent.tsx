"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const SRI_LANKA_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara",
  "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota",
  "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu",
  "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam",
  "Anuradhapura", "Polonnaruwa",
  "Badulla", "Monaragala",
  "Ratnapura", "Kegalle"
];

const defaultYouthServices = [
  {
    id: 1,
    icon: "🤝",
    tag: "Community",
    title: "Safe Youth Circles",
    desc: "Confidential peer-support sessions and safe spaces where young individuals can share experiences, connect, and receive peer validation.",
  },
  {
    id: 2,
    icon: "🧠",
    tag: "Wellbeing",
    title: "Affirmative Mental Health",
    desc: "Free, trauma-informed counseling and psycho-social support by certified professionals trained in transgender youth care.",
  },
  {
    id: 3,
    icon: "💻",
    tag: "Growth",
    title: "Skill Building & Tech Literacy",
    desc: "Vocational workshops, computer literacy, digital advocacy training, and career pathway mentoring for youth independence.",
  },
  {
    id: 4,
    icon: "🛡️",
    tag: "Protection",
    title: "Emergency Shelter & Legal Aid",
    desc: "Rapid response aid for displaced youth, including emergency housing support, crisis kits, and guidance on legal documentation changes.",
  },
];

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
      setErrorMessage("You must agree to provide a stigma and discrimination-free service to proceed.");
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
        throw new Error("Failed to submit details. Please try again.");
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
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-[#2A8ACD] overflow-x-hidden scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <section 
        id="volunteer-hero" 
        className="scroll-mt-28 relative max-w-7xl mx-auto px-6 pt-14 pb-20 md:pt-28 flex flex-col lg:flex-row items-center gap-14"
      >
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="w-full lg:w-1/2 flex flex-col items-start text-left z-20"
        >
          <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[11px] uppercase mb-5 px-3.5 py-1.5 bg-sky-50 rounded-full border border-[var(--tet-pink)]/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {t("v_hero_label", "COMMUNITY & YOUTH EMPOWERMENT")}
          </span>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2A8ACD] mb-6 leading-[1.1] tracking-tight">
            {t("v_hero_title1", "Shape the")} <br />
            <span className="italic font-normal text-pride-gradient font-playfair">
              {t("v_hero_title2", "Future Together.")}
            </span>
          </h1>

          <p className="max-w-lg text-slate-600 leading-relaxed text-sm md:text-base mb-8">
            {t(
              "v_hero_desc",
              "Lend your voice, skills, and empathy. Whether you are joining as a general supporter or a youth peer volunteer, you help build a stigma-free Sri Lanka for the transgender community."
            )}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#volunteer-form"
              className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md shadow-sky-100 transition-all hover:scale-105 active:scale-95"
            >
              {t("v_hero_btn1", "Volunteer Registry")}
            </a>
            <a
              href="#volunteer-youth"
              className="border border-[#2A8ACD] hover:border-pink-400 bg-white/80 hover:bg-sky-50 text-[#2A8ACD] px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all"
            >
              {t("v_hero_btn2", "Explore Youth Services")}
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
              src={getAssetUrl("v_hero_img", "https://images.unsplash.com/photo-1531482615713-2afd69097998")}
              fill
              alt="Community Volunteers"
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={isPreview}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/30 via-transparent to-pink-500/10"></div>
          </motion.div>
        </div>
      </section>

      {/* 2. YOUTH SERVICES SHOWCASE SECTION */}
      <section 
        id="volunteer-youth" 
        className="scroll-mt-28 py-24 bg-gradient-to-b from-[#ebf6ff]/70 to-[#fdf2f8]/70 border-y border-sky-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-pink-600 font-bold uppercase text-[10px] tracking-[0.25em] block mb-2">
              {t("v_youth_label", "Empowering the Next Generation")}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#2A8ACD] mb-4">
              {t("v_youth_title", "Our Youth Services")}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {t(
                "v_youth_desc",
                "TET provides tailored programs dedicated to young transgender and gender-diverse youth across Sri Lanka to ensure safety, mental well-being, and growth."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultYouthServices.map((service) => (
              <motion.div
                key={service.id}
                id={`youth-card-${service.id}`}
                whileHover={{ y: -6 }}
                className="scroll-mt-32 bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-sky-200/80 shadow-sm hover:shadow-lg hover:border-[#2A8ACD] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl">
                      {t(`v_youth_${service.id}_icon`, service.icon)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                      {t(`v_youth_${service.id}_tag`, service.tag)}
                    </span>
                  </div>
                  <h3 className="text-[#2A8ACD] font-bold text-lg mb-2">
                    {t(`v_youth_${service.id}_title`, service.title)}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {t(`v_youth_${service.id}_desc`, service.desc)}
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-sky-50">
                  <span className="text-[#2A8ACD] text-[11px] font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Youth Driven • Stigma Free
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VOLUNTEER APPLICATION FORM */}
      <section 
        id="volunteer-form" 
        className="scroll-mt-28 py-24 px-6"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl border border-sky-200 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-pink-400 p-8 md:p-12 text-white">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-100 block mb-2">
              {t("v_form_tag", "Make a Lasting Impact")}
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
              {t("v_form_title", "Volunteer Application Form")}
            </h3>
            <p className="text-sky-50 text-xs md:text-sm mt-2 max-w-xl">
              {t(
                "v_form_desc",
                "All information submitted is securely routed directly to our admin team. Please ensure details match your official documents."
              )}
            </p>
          </div>

          <div className="p-8 md:p-14">
            {submitStatus === "success" ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-sky-100 text-[#2A8ACD] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-sky-300">
                  ✓
                </div>
                <h4 className="text-2xl font-bold text-[#2A8ACD] mb-2">Application Received!</h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                  Thank you for volunteering with Trans Equality Trust. Our administrative coordinator will review your profile and contact you soon.
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  Submit Another Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Role Choice */}
                <div>
                  <label className="block text-[#2A8ACD] font-bold text-xs uppercase tracking-wider mb-3">
                    Select Volunteer Role <span className="text-pink-500">*</span>
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
                        <div className="font-bold text-sm">General Volunteer</div>
                        <div className="text-[11px] text-slate-500">Legal, healthcare, events, and community advocacy</div>
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
                        <div className="font-bold text-sm">Youth Volunteer</div>
                        <div className="text-[11px] text-slate-500">Peer circles, youth empowerment, mental wellness support</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#2A8ACD] font-bold text-xs uppercase tracking-wider mb-2">
                      Full Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g. Kasun Fernando"
                      className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2A8ACD] font-bold text-xs uppercase tracking-wider mb-2">
                      Contact Number <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact_number"
                      required
                      value={formData.contact_number}
                      onChange={handleChange}
                      placeholder="07X XXX XXXX"
                      className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2A8ACD] font-bold text-xs uppercase tracking-wider mb-2">
                      National Identity Card (NIC) <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nic"
                      required
                      value={formData.nic}
                      onChange={handleChange}
                      placeholder="e.g. 2000XXXXXXXX or XXXXXXXXXV"
                      className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2A8ACD] font-bold text-xs uppercase tracking-wider mb-2">
                      Birth Year <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="birth_year"
                      required
                      min="1950"
                      max={new Date().getFullYear() - 14}
                      value={formData.birth_year}
                      onChange={handleChange}
                      placeholder="YYYY (e.g. 2002)"
                      className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30"
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="block text-[#2A8ACD] font-bold text-xs uppercase tracking-wider mb-2">
                    Current Living District <span className="text-pink-500">*</span>
                  </label>
                  <select
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/30 text-slate-700"
                  >
                    <option value="">-- Select Your District --</option>
                    {SRI_LANKA_DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Consent */}
                <div className="bg-sky-50/60 p-6 rounded-2xl border border-sky-200">
                  <span className="block font-bold text-[#2A8ACD] text-xs uppercase tracking-wider mb-2">
                    Declaration &amp; Consent <span className="text-pink-500">*</span>
                  </span>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4">
                    <strong>TET Declaration:</strong>{" "}
                    {t(
                      "v_form_consent_text",
                      "Are you willing to connect with Trans Equality Trust (TET) and commit to providing a stigma- and discrimination-free service for the transgender community?"
                    )}
                  </p>
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
                      <span>Yes (I Agree)</span>
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
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-[#2A8ACD] hover:bg-[#2374b0] disabled:opacity-50 text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-md shadow-sky-100 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {isSubmitting ? "Submitting to Admin..." : t("v_form_btn", "Submit Volunteer Application")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 4. FOOTER QUOTE */}
      <section 
        id="volunteer-quote" 
        className="scroll-mt-28 py-20 px-6 text-center border-t border-sky-200/60"
      >
        <div className="max-w-2xl mx-auto">
          <span className="text-4xl text-pink-400 mb-4 block font-serif">
            &quot;
          </span>
          <p className="font-serif text-2xl md:text-3xl text-[#2A8ACD] italic mb-4 leading-relaxed">
            {t(
              "v_footer_quote",
              "Collective strength is the only path toward systemic equality. Your time is an investment in human dignity."
            )}
          </p>
          <p className="text-[10px] font-bold text-[#2A8ACD] uppercase tracking-[0.3em]">
            {t("v_footer_cite", "Trans Equality Trust Sri Lanka")}
          </p>
        </div>
      </section>
    </div>
  );
}