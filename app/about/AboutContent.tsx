"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const defaultCoreValues = [
  { id: 1, title: "Inclusion", desc: "Ensuring that every individual, regardless of their background, has a seat at the table." },
  { id: 2, title: "Integrity", desc: "Operating with transparency and honesty in all our advocacy and business efforts." },
  { id: 3, title: "Resilience", desc: "Standing firm in the face of systemic challenges to secure a better tomorrow." },
  { id: 4, title: "Empowerment", desc: "Providing the tools and resources necessary for our community to lead independent lives." },
];

export default function AboutPage() {
  const { t, getAssetUrl, isPreview } = useLanguage();

  // Cross-origin position-based scroll listener
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

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-sky-900 overflow-x-hidden scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <section 
        id="about-hero" 
        className="scroll-mt-28 relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 flex flex-col items-center text-center"
      >
        <motion.div initial="initial" whileInView="whileInView" variants={fadeInUp} viewport={{ once: true }}>
          <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[11px] uppercase mb-6 px-4 py-1.5 bg-sky-100/80 rounded-full border border-sky-200 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {t("about_hero_label", "OUR HISTORY • OUR MISSION")}
          </span>
            
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2A8ACD] mb-6 tracking-tight">
            {t("about_hero_title", "Advocating for Dignity.")}
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 leading-relaxed text-sm md:text-base">
            {t(
              "about_hero_description",
              "TET is a pioneering social enterprise and advocacy organization in Sri Lanka dedicated to the empowerment of the transgender community. We work towards a society where every person can live with dignity, safety, equality, and freedom."
            )}
          </p>
        </motion.div>

        <div className="relative w-full max-w-4xl h-[320px] md:h-[520px] mt-16 rounded-t-[3rem] md:rounded-t-full overflow-hidden shadow-2xl border-4 border-white border-b-8 border-b-[#2A8ACD]">
          <Image
            src={getAssetUrl("about_hero_image", "https://images.unsplash.com/photo-1573164713988-8665fc963095")}
            fill
            alt="Advocacy Header"
            className="object-cover"
            priority
            unoptimized={isPreview}
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/30 via-transparent to-pink-500/10"></div>
        </div>
      </section>

      {/* 2. VISION & MISSION */}
      <section 
        id="about-vision" 
        className="scroll-mt-28 py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        <motion.div
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-sm p-10 md:p-14 rounded-3xl md:rounded-[3rem] border border-sky-200/80 shadow-sm hover:shadow-md hover:border-pink-300 transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl mb-6 border border-sky-200">
            👁️
          </div>
            
          <h2 className="font-serif text-3xl font-bold text-[#2A8ACD] mb-4">
            {t("about_vision_title", "Our Vision")}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t(
              "about_vision_text",
              "We envision a future where gender identity is no longer a barrier to human rights, healthcare, or employment. Our goal is to foster a Sri Lankan society that celebrates diversity and ensures total legal and social inclusion for all."
            )}
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-sm p-10 md:p-14 rounded-3xl md:rounded-[3rem] border border-pink-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl mb-6 border border-pink-200">
            🎯
          </div>
        
          <h2 className="font-serif text-3xl font-bold text-[#2A8ACD] mb-4">
            {t("about_mission_title", "Our Mission")}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t(
              "about_mission_text",
              "To empower the transgender community through economic opportunities, legislative advocacy, and social support. We provide a platform for voices that have been silenced, creating sustainable change through education and social enterprise."
            )}
          </p>
        </motion.div>
      </section>

      {/* 3. CORE VALUES */}
      <section 
        id="about-values" 
        className="scroll-mt-28 py-24 bg-gradient-to-b from-[#ebf6ff]/70 via-white to-[#fdf2f8]/70 rounded-[3rem] md:rounded-[4.5rem] mx-4 md:mx-10 px-6 border border-sky-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-pink-600 font-bold uppercase text-[10px] tracking-[0.25em] block mb-2">
            Guiding Principles
          </span>
        
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2A8ACD] mb-16 italic">
            {t("about_values_main_title", "Our Core Values")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultCoreValues.map((val) => (
              <motion.div
                key={val.id}
                initial="initial"
                whileInView="whileInView"
                variants={fadeInUp}
                viewport={{ once: true }}
                className="bg-white/80 p-8 rounded-3xl border border-sky-200/70 shadow-sm flex flex-col items-center hover:border-pink-300 hover:shadow-md transition-all"
              >
                <div className="w-2 h-10 bg-gradient-to-b from-[#2A8ACD] to-pink-400 rounded-full mb-6"></div>
                
                <h3 className="font-serif text-xl font-bold text-[#2A8ACD] mb-3">
                  {t(`about_value_${val.id}_title`, val.title)}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed max-w-[220px]">
                  {t(`about_value_${val.id}_text`, val.desc)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LEADERSHIP SPOTLIGHT */}
      <section 
        id="about-leader" 
        className="scroll-mt-28 py-28 max-w-7xl mx-auto px-6"
      >
        <div className="bg-white rounded-3xl md:rounded-[3.5rem] overflow-hidden shadow-xl border border-sky-200/80 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-2/5 h-[400px] lg:h-[580px] relative">
            <Image
              src={getAssetUrl("about_leader_image", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2")}
              fill
              alt="Leader"
              className="object-cover"
              unoptimized={isPreview}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-transparent to-pink-500/10"></div>
          </div>

          <div className="w-full lg:w-3/5 p-10 md:p-16">
            <span className="text-[#2A8ACD] font-bold tracking-[0.25em] text-[10px] uppercase mb-3 block">
              {t("about_leader_label", "Leadership Spotlight")}
            </span>
            
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2A8ACD] mb-2">
              {t("about_leader_name", "Kasuni Mayadunna")}
            </h2>
            <p className="text-pink-600 font-serif italic mb-6 font-semibold">
              {t("about_leader_role", "Executive Director")}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              {t(
                "about_leader_bio",
                "Kasuni Mayadunna is a visionary advocate for transgender rights in Sri Lanka. Under her leadership, TET has evolved from a small collective into a robust social enterprise. She is dedicated to creating institutional change that addresses the economic disparities and social stigma faced by the trans community."
              )}
            </p>

            <div className="grid grid-cols-2 gap-8 border-t border-sky-100 pt-6">
              <div>
            
                <p className="text-3xl font-serif font-bold text-[#2A8ACD]">
                  {t("about_leader_stat1_val", "5,000+")}
                </p>
                <p className="text-[10px] font-bold text-[#2A8ACD] uppercase tracking-widest mt-1">
                  {t("about_leader_stat1_label", "Lives Impacted")}
                </p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-pink-600">
                  {t("about_leader_stat2_val", "24/7")}
                </p>
                <p className="text-[10px] font-bold text-[#2A8ACD] uppercase tracking-widest mt-1">
                  {t("about_leader_stat2_label", "Crisis Support")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR TEAM MEMBERS */}
      <section 
        id="about-team" 
        className="scroll-mt-28 py-24 px-6 bg-gradient-to-b from-[#ebf6ff]/50 via-white to-sky-50/30 border-y border-sky-100"
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
              {t("about_team_label", "COMMUNITY LEADERSHIP • OUR ADVOCATES")}
            </span>
            
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2A8ACD] mb-4">
              {t("about_team_title", "Our Team Members")}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {t(
                "about_team_desc",
                "A dedicated collective of advocates, case workers, and community leaders working together to ensure safe and stigma-free spaces for transgender individuals across Sri Lanka."
              )}
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="whileInView"
            variants={fadeInUp}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-200/50 via-pink-200/40 to-sky-200/50 blur-3xl -z-10 transform scale-95 rounded-full"></div>

            <div className="relative w-full h-[350px] sm:h-[450px] md:h-[560px] rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={getAssetUrl("about_team_group_image", "https://images.unsplash.com/photo-1522071820081-009f0129c71c")}
                fill
                alt="Our Team Members"
                className="object-cover"
                unoptimized={isPreview}
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/50 via-transparent to-pink-500/10"></div>

              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-sky-200 shadow-md text-left">
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest block">
                  Trans Equality Trust
                </span>
                    
                <span className="text-xs md:text-sm font-bold text-[#2A8ACD]">
                  Team &amp; Grassroots Community Organizers
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}