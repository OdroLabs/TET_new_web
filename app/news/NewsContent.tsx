"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

interface ActivityItem {
  id: number;
  title: Record<string, string> | string;
  date: string;
  location: Record<string, string> | string;
  excerpt: Record<string, string> | string;
  fullStory?: Record<string, string> | string;
  full_story?: Record<string, string> | string;
  img?: string;
  image?: string;
}

// Modal Component
function ActivityDetailModal({
  activity,
  onClose,
  resolveText,
}: {
  activity: ActivityItem;
  onClose: () => void;
  resolveText: (val: Record<string, string> | string | undefined, fallback?: string) => string;
}) {
  const { getAssetUrl } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const title = resolveText(activity.title, "Field Activity");
  const date = activity.date || "Recent Update";
  const location = resolveText(activity.location, "Sri Lanka");
  const excerpt = resolveText(activity.excerpt, "");
  const fullStory = resolveText(activity.fullStory || activity.full_story, excerpt);
  const imgUrl = getAssetUrl(activity.img || activity.image, "https://images.unsplash.com/photo-1516549655169-df83a0774514");

  const shareToFacebook = () => {
    // Opens official Facebook page
    window.open("https://www.facebook.com/share/12G6Xq5jZ15/", "_blank", "width=600,height=500");
  };

  const shareToWhatsApp = () => {
    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/news?activity=${activity.id}`
      : "https://transequalitytrust.lk/news";
    const msg = `*${title}*\n${excerpt}\nRead more: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-sky-950/60 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-sky-200 overflow-hidden my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-pink-500 hover:text-white text-sky-900 border border-sky-200 flex items-center justify-center transition-all shadow-md font-bold text-sm cursor-pointer"
          aria-label="Close Modal"
        >
          ✕
        </button>

        <div className="relative h-64 w-full bg-sky-100">
          <Image
            src={imgUrl}
            fill
            alt={title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-500 text-white px-3 py-1 rounded-full shadow-sm inline-block mb-2">
              Field Update
            </span>
            <h2 className="font-serif text-2xl font-bold leading-tight">
              {title}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs">
         
            <div className="font-bold text-[#2A8ACD]">📅 {date}</div>
            <div className="font-bold text-[#2A8ACD]">📍 {location}</div>
            <div className="text-[10px] font-black uppercase tracking-wider text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
              TET Field Report
            </div>
          </div>

          <div className="space-y-4 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {excerpt && <p className="font-semibold text-slate-800">{excerpt}</p>}
            <p>{fullStory}</p>
          </div>

          {/* Social Sharing Bar */}
          <div className="pt-6 border-t border-sky-100 flex flex-wrap items-center justify-between gap-3">
           
            <span className="text-xs font-bold uppercase tracking-wider text-[#2A8ACD]">
              Publish / Share Update:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={shareToFacebook}
                className="px-4 py-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Visit Official Facebook Page</span>
              </button>
              <button
                onClick={shareToWhatsApp}
                className="px-4 py-2 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Main News Page
export default function NewsPage() {
  const { t, getAssetUrl, locale } = useLanguage();
  const [activitiesList, setActivitiesList] = useState<ActivityItem[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  // 1. Fetch live collection safely
  useEffect(() => {
    let isMounted = true;

    const loadActivities = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/activities`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setActivitiesList(data);
          }
        }
      } catch (err) {
        console.error("Activities fetch error:", err);
      }
    };

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "TET_RELOAD_COLLECTION") {
        try {
          const res = await fetch(`${API_BASE}/api/activities`);
          if (res.ok) {
            const data = await res.json();
            setActivitiesList(data);
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (event.data?.type === "TET_OPEN_MODAL") {
        const act = activitiesList.find((a) => a.id === Number(event.data.id));
        if (act) setSelectedActivity(act);
      }

      if (event.data?.type === "TET_CLOSE_MODAL") {
        setSelectedActivity(null);
      }

      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId, activityId } = event.data;
        const targetId = activityId ? `activity-card-${activityId}` : sectionId;
        const target = document.getElementById(targetId);
        if (target) {
          const targetY = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activitiesList]);

  const resolveText = (val: Record<string, string> | string | undefined, fallback = "") => {
    if (!val) return fallback;
    if (typeof val === "object") {
      return val[locale] || val["en"] || Object.values(val)[0] || fallback;
    }
    return String(val);
  };

  return (
    <div className="bg-[#f8fbff] min-h-screen text-slate-800 selection:bg-pink-100 selection:text-sky-900 pb-24 scroll-smooth">
      
      {/* 1. HEADER */}
      <section id="news-hero" className="scroll-mt-28 pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto border-b border-sky-100 pb-10 text-center md:text-left">
          <motion.div initial="initial" animate="whileInView" variants={fadeInUp}>
         
            <span className="text-[#2A8ACD] font-bold text-[11px] tracking-[0.3em] uppercase mb-4 px-3.5 py-1.5 bg-sky-50 rounded-full border border-[var(--tet-pink)]/40 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              {t("act_hero_label", "GRASSROOTS IN ACTION • DAILY FIELD UPDATES")}
            </span>
    
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2A8ACD] mb-4 tracking-tight">
              {t("act_hero_title1", "Daily")}{" "}
              <span className="text-pride-gradient italic font-normal font-playfair">
                {t("act_hero_title2", "Activities.")}
              </span>
            </h1>
            <p className="text-slate-600 max-w-2xl text-sm md:text-base leading-relaxed">
              {t(
                "act_hero_desc",
                "Real-time updates, field visits, community support sessions, and grassroots interventions happening across Sri Lanka."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. DYNAMIC ACTIVITIES GRID */}
      <section id="news-grid" className="scroll-mt-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {activitiesList.map((activity, i) => {
            const title = resolveText(activity.title, "Field Activity");
            const location = resolveText(activity.location, "Sri Lanka");
            const excerpt = resolveText(activity.excerpt, "");
            const date = activity.date || "Recent";
            const imgSrc = getAssetUrl(activity.img || activity.image, "https://images.unsplash.com/photo-1516549655169-df83a0774514");

            return (
              <motion.div
                key={activity.id}
                id={`activity-card-${activity.id}`}
                initial="initial"
                whileInView="whileInView"
                variants={fadeInUp}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedActivity(activity)}
         
                className="scroll-mt-32 group bg-white rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-sky-200/80 shadow-sm hover:shadow-xl hover:border-[#2A8ACD] transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-sky-50">
                    <Image
                      src={imgSrc}
                      fill
                      alt={title}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950/60 via-transparent to-transparent"></div>

                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] font-black text-pink-700 bg-pink-50/95 backdrop-blur-md px-3 py-1 rounded-full border border-pink-200 shadow-sm">
                        {date}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 text-white text-xs font-semibold flex items-center gap-1.5 opacity-90">
                      <span>📍</span>
                      <span className="truncate">{location}</span>
                    </div>
                  </div>

                  <div className="p-6 md:p-7">
                
                    <h3 className="font-serif text-xl font-bold text-[#2A8ACD] mb-2.5 leading-snug group-hover:text-[#2374b0] transition-colors">
                      {title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                      {excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-3 border-t border-sky-50 flex items-center justify-between bg-sky-50/30">
            
                  <span className="text-[11px] font-bold text-[#2A8ACD] group-hover:underline">
                    View Full Details →
                  </span>
                  <span className="text-slate-400 text-[10px]">TET Archive</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. DETAIL MODAL */}
      <AnimatePresence>
        {selectedActivity && (
          <ActivityDetailModal
            key={selectedActivity.id}
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
            resolveText={resolveText}
          />
        )}
      </AnimatePresence>
    </div>
  );
}