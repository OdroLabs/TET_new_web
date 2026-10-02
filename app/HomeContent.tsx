"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useLanguage } from "./context/LanguageContext";

interface HomeContentProps {
  customTitle?: string;
}

interface ImpactCardItem {
  cat: Record<string, string> | string;
  title: Record<string, string> | string;
  image?: string;
  img?: string;
}

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomeContent({ customTitle }: HomeContentProps) {
  const { t, getAsset, isPreview, data, locale } = useLanguage();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3500 })]
  );

  const rawCards = data["impact_cards"];
  let impactCards: ImpactCardItem[] = [];

  if (Array.isArray(rawCards)) {
    impactCards = rawCards as ImpactCardItem[];
  } else if (typeof rawCards === "string") {
    try {
      const parsed = JSON.parse(rawCards);
      if (Array.isArray(parsed)) impactCards = parsed;
    } catch {
      impactCards = [];
    }
  }

  useEffect(() => {
    const handleScrollMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId, slideIndex } = event.data;

        if (sectionId) {
          const targetElement = document.getElementById(sectionId);

          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = rect.top + scrollTop - 80;

            window.scrollTo({
              top: targetY,
              behavior: "smooth"
            });

            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }

        if (emblaApi && slideIndex !== null && slideIndex !== undefined) {
          emblaApi.scrollTo(slideIndex);
        }
      }
    };

    window.addEventListener("message", handleScrollMessage);
    return () => window.removeEventListener("message", handleScrollMessage);
  }, [emblaApi]);

  const getCardText = (value: Record<string, string> | string | undefined) => {
    if (!value) return "";
    if (typeof value === "object") {
      return value[locale] || value["en"] || "";
    }
    return String(value);
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

  const heroParagraphs = splitIntoShortParagraphs(t("hero_description"));
  const storyParagraphs = splitIntoShortParagraphs(t("story_description"));

  return (
    <div className="w-full bg-[#fdfcf9] text-[#2c3e50] selection:bg-[#e8d5c4] overflow-x-hidden scroll-smooth">
      <section id="section-hero" className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="w-full lg:w-1/2"
        >
          <span className="text-[#8e7f71] font-bold tracking-[0.35em] text-[10px] uppercase mb-4 block border-l-2 border-[#2A8ACD] pl-3">
            {t("hero_top_label")}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#1b5e94] mb-6 leading-snug md:leading-[1.25] tracking-normal text-balance">
            {customTitle || t("hero_title_1")}
            <span className="block mt-2 font-normal text-pride-gradient">
              {t("hero_title_2")}
            </span>
          </h1>

          <div className="space-y-4 mb-8 max-w-xl text-sm md:text-[15.5px] leading-relaxed">
            {heroParagraphs.map((para, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "text-slate-700 font-medium leading-relaxed"
                    : "text-slate-500 leading-relaxed"
                }
              >
                {para}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <Link
              href={t("btn_support_url")}
              className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-widest hover:shadow-lg transition-all uppercase"
            >
              {t("btn_support")}
            </Link>
            <Link
              href={t("btn_mission_url")}
              className="border border-[#2A8ACD] text-[#2A8ACD] px-8 py-3 rounded-full text-[10px] font-bold tracking-widest hover:bg-sky-50 transition-all uppercase"
            >
              {t("btn_mission")}
            </Link>
          </div>
        </motion.div>

        <div className="w-full lg:w-1/2 relative h-[420px] md:h-[580px]">
          <div className="absolute top-10 right-0 w-4/5 h-full bg-pride-line opacity-10 blur-[100px] rounded-full animate-pulse"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute top-0 right-0 w-4/5 h-full rounded-t-full overflow-hidden shadow-2xl"
          >
            <Image
              src={getAsset("hero_image_main")}
              fill
              alt={t("ui_home_advocacy_header")}
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={isPreview}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-6 left-0 w-1/2 h-1/2 rounded-full border-[10px] border-[#fdfcf9] overflow-hidden shadow-xl z-10"
          >
            <Image
              src={getAsset("hero_image_sub")}
              fill
              alt={t("ui_home_community_support")}
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
              unoptimized={isPreview}
            />
          </motion.div>
        </div>
      </section>

      <section id="section-impact" className="py-20 bg-[#F8F4FF] overflow-hidden rounded-[3rem] md:rounded-[4.5rem] mx-4 md:mx-10 shadow-sm border border-blue-50/50">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div className="max-w-xl">
              <motion.h2
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="font-serif text-3xl md:text-4xl text-[#1a365d] font-bold tracking-normal"
              >
                {t("impact_title")}
              </motion.h2>
              <p className="text-blue-400 mt-3 text-[9px] font-bold uppercase tracking-[0.4em]">
                {t("impact_label")}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {impactCards.map((item, i) => {
                  const imagePath = item.image || item.img || "";
                  const categoryText = getCardText(item.cat);
                  const titleText = getCardText(item.title);

                  return (
                    <div
                      key={i}
                      className="flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_23.5%] min-w-0"
                    >
                      <motion.div
                        whileHover={{ y: -8 }}
                        className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-xl bg-white transition-all"
                      >
                        {imagePath && (
                          <Image
                            src={getAsset(imagePath)}
                            alt={titleText}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover"
                            unoptimized={isPreview}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2A8ACD]/90 via-transparent flex flex-col justify-end p-8">
                          <span className="text-[#EFB9C5] text-[8px] font-bold uppercase tracking-[0.25em] mb-1">
                            {categoryText}
                          </span>
                          <h3 className="text-white font-serif text-xl font-bold leading-tight">
                            {titleText}
                          </h3>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-stats" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center group p-8 md:p-10 rounded-[2.5rem] bg-[#FFF1F5] border border-pink-50 transition-colors"
            >
              <h3 className="font-serif text-4xl md:text-5xl text-[#d88998] mb-2">
                {t(`stat_${i}_val`)}
              </h3>
              <p className="font-bold text-[#d88998] text-[9px] tracking-[0.3em] uppercase mb-4">
                {t(`stat_${i}_label`)}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t(`stat_${i}_desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="section-story" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-20">
          <div className="w-full md:w-1/2 relative h-[420px] md:h-[550px] group">
            <div className="absolute -inset-4 bg-[#f3f0ec] rounded-[3.5rem] -rotate-2"></div>
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image
                src={getAsset("story_image")}
                fill
                alt={t("ui_home_breaking_systemic_barriers")}
                className="object-cover opacity-90"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={isPreview}
              />
              <a
                href={t("story_video_url")}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] md:border-t-[12px] border-t-transparent border-l-[16px] md:border-l-[20px] border-l-[#2A8ACD] border-b-[10px] md:border-b-[12px] border-b-transparent ml-1.5"></div>
                </div>
              </a>
            </div>
          </div>

          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="w-full md:w-1/2"
          >
            <span className="text-pink-500 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">
              {t("story_label")}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1a365d] font-bold leading-tight mb-6">
              {t("story_title")}
            </h2>
            <div className="space-y-3 mb-8 text-sm md:text-base leading-relaxed">
              {storyParagraphs.map((para, index) => (
                <p
                  key={index}
                  className={index === 0 ? "text-slate-700" : "text-slate-500"}
                >
                  {para}
                </p>
              ))}
            </div>
            <div className="flex gap-10 items-center">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-serif text-[#1a365d]">
                  {t("story_stat_val")}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  {t("story_stat_label")}
                </span>
              </div>
              <Link
                href={t("explore_services_url")}
                className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md transition-all"
              >
                {t("explore_services")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}