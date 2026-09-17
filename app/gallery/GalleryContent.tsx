"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

interface EventItem {
  id: number;
  title: Record<string, string> | string;
  cat?: Record<string, string> | string;
  date: string;
  location: Record<string, string> | string;
  excerpt: Record<string, string> | string;
  fullStory?: Record<string, string> | string;
  full_story?: Record<string, string> | string;
  img?: string;
  cover_image?: string;
  gallery?: string[];
  gallery_images?: string[];
}

const defaultEvents: EventItem[] = [
  {
    id: 1,
    cat: { en: "Community Dialogue" },
    date: "OCT 14, 2026",
    location: { en: "Colombo, Sri Lanka" },
    title: { en: "Voices of Hope: National Transgender Symposium" },
    excerpt: { en: "Over 120 grassroots organizers gathered in Colombo to discuss affirmative healthcare access and constitutional protection." },
    fullStory: { en: "The National Transgender Symposium united transgender activists, medical professionals, and human rights lawyers from across Sri Lanka. Key discussion tracks included safe shelter networks, addressing workplace harassment, and drafting legal reform recommendations to eliminate discriminatory laws." },
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    gallery: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
    ]
  },
  {
    id: 2,
    cat: { en: "Youth & Empowerment" },
    date: "SEP 28, 2026",
    location: { en: "Kandy Safe House" },
    title: { en: "Peer Circles: Creative Expression & Mental Health" },
    excerpt: { en: "A safe weekend retreat focusing on art therapy, trauma healing, and peer mentorship for trans youth." },
    fullStory: { en: "Led by certified counseling liaisons, this workshop provided a non-judgmental sanctuary for gender-diverse youth. Participants engaged in art therapy, storytelling circles, and psycho-social coping strategies, culminating in a collective community mural." },
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    gallery: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18",
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8"
    ]
  },
  {
    id: 3,
    cat: { en: "Advocacy & Law" },
    date: "AUG 19, 2026",
    location: { en: "Galle Heritage Hall" },
    title: { en: "Legal Rights & Anti-Discrimination Training" },
    excerpt: { en: "Training community paralegals to navigate police arbitrary detentions and legal gender recognition paperwork." },
    fullStory: { en: "This legal education summit equipped community members with critical knowledge regarding fundamental rights under the Constitution of Sri Lanka, safe reporting protocols, and legal identity card (NIC) gender change procedures." },
    img: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8",
    gallery: [
      "https://images.unsplash.com/photo-1450133064473-71024230f91b",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
    ]
  }
];

// Event Detail Modal
function EventDetailModal({
  event,
  onClose,
  resolveText,
}: {
  event: EventItem;
  onClose: () => void;
  resolveText: (val: Record<string, string> | string | undefined, fallback?: string) => string;
}) {
  const { getAssetUrl } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const title = resolveText(event.title, "Community Event");
  const category = resolveText(event.cat, "Advocacy");
  const date = event.date || "Recent Event";
  const location = resolveText(event.location, "Sri Lanka");
  const excerpt = resolveText(event.excerpt, "");
  const fullStory = resolveText(event.fullStory || event.full_story, excerpt);
  const mainImg = getAssetUrl(event.img || event.cover_image, "https://images.unsplash.com/photo-1523240795612-9a054b0db644");

  const rawGallery = event.gallery || event.gallery_images || [];
  const galleryPhotos = rawGallery.map((g) => getAssetUrl(g)).filter(Boolean);

  const handleShare = (platform: "facebook" | "whatsapp" | "copy") => {
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/gallery?event=${event.id}` : "";
    const shareText = `${title} - Trans Equality Trust Sri Lanka`;

    if (platform === "facebook") {
      // Opens official Facebook page
      window.open("https://www.facebook.com/share/12G6Xq5jZ15/", "_blank", "width=600,height=500");
    } else if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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
        className="relative w-full max-w-3xl bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-sky-200 overflow-hidden my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-pink-500 hover:text-white text-sky-900 border border-sky-200 flex items-center justify-center transition-all shadow-md font-bold text-sm cursor-pointer"
          aria-label="Close Event Modal"
        >
          ✕
        </button>

        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-sky-100">
          <Image
            src={mainImg}
            fill
            alt={title}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 80vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-950/20 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-pink-500 text-white px-3 py-1 rounded-full shadow-sm inline-block mb-2">
              {category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
              {title}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs">
  
            <div className="flex items-center gap-2 text-[#2A8ACD] font-bold">
              <span>📅</span>
              <span>{date}</span>
            </div>
     
            <div className="flex items-center gap-2 text-[#2A8ACD] font-bold">
              <span>📍</span>
              <span>{location}</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
              Official TET Archive
            </div>
          </div>

          <div className="space-y-3 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {excerpt && <p className="font-medium text-slate-800">{excerpt}</p>}
            <p>{fullStory}</p>
          </div>

          {galleryPhotos.length > 0 && (
            <div className="pt-2">
            
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A8ACD] block mb-3">
                Event Photo Gallery
              </span>
              <div className="grid grid-cols-2 gap-4">
                {galleryPhotos.map((gImg, gIdx) => (
                  <div key={gIdx} className="relative h-32 md:h-44 rounded-2xl overflow-hidden border border-sky-100">
                    <Image src={gImg} fill alt="Event Gallery" className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-sky-100 flex flex-wrap items-center gap-3">
    
            <span className="text-xs font-black uppercase tracking-wider text-[#2A8ACD] mr-auto">
              Share Event:
            </span>

            <button
              onClick={() => handleShare("facebook")}
              className="px-4 py-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Facebook</span>
            </button>

            <button
              onClick={() => handleShare("whatsapp")}
              className="px-4 py-2 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare("copy")}
              className="px-4 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-bold transition-all border border-sky-200 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <span className="text-emerald-700 font-black">Link Copied! ✓</span>
              ) : (
                <span>🔗 Copy Link</span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Main Gallery Page
export default function GalleryPage() {
  const { t, getAssetUrl, locale } = useLanguage();
  const [eventsList, setEventsList] = useState<EventItem[]>(defaultEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setEventsList(data);
          }
        }
      } catch (err) {
        console.warn("Using offline event defaults:", err);
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Listen for Livewire Admin Messages & Auto-Reload
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "TET_RELOAD_COLLECTION") {
        try {
          const res = await fetch(`${API_BASE}/api/events`);
          if (res.ok) {
            const data = await res.json();
            setEventsList(data);
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (event.data?.type === "TET_OPEN_MODAL") {
        const ev = eventsList.find((e) => e.id === Number(event.data.id));
        if (ev) setSelectedEvent(ev);
      }

      if (event.data?.type === "TET_CLOSE_MODAL") {
        setSelectedEvent(null);
      }

      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId, eventId } = event.data;
        const targetId = eventId ? `event-card-${eventId}` : sectionId;
        const target = document.getElementById(targetId);
        if (target) {
          const targetY = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [eventsList]);

  const resolveText = (val: Record<string, string> | string | undefined, fallback: string = "") => {
    if (!val) return fallback;
    if (typeof val === "object") return val[locale] || val["en"] || Object.values(val)[0] || fallback;
    return String(val);
  };

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-sky-900 min-h-screen overflow-x-hidden scroll-smooth">
      
      {/* 1. HEADER SECTION */}
      <section id="gallery-hero" className="scroll-mt-28 py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
       
            <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[11px] uppercase mb-4 px-4 py-1.5 bg-sky-50 rounded-full border border-[var(--tet-pink)]/40 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              {t("gl_events_tag", "COMMUNITY HAPPENINGS • EVENTS & ARCHIVES")}
            </span>

      
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#2A8ACD] mb-4 tracking-tight">
              {t("gl_gallery_title", "Visual Storytelling")} <br />
              <span className="text-pride-gradient italic font-normal font-playfair">
                &amp; Community Events
              </span>
            </h1>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {t(
                "gl_gallery_desc",
                "Explore our ongoing gatherings, workshops, and milestones. Click on any event card to read full details and share it to your social media."
              )}
            </p>
          </div>

          {/* 2. DYNAMIC EVENTS GRID */}
          <div id="gallery-events" className="scroll-mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {eventsList.map((event, i) => {
              const title = resolveText(event.title, "Community Event");
              const category = resolveText(event.cat, "Advocacy");
              const location = resolveText(event.location, "Sri Lanka");
              const excerpt = resolveText(event.excerpt);
              const date = event.date || "Upcoming";
              const imgSrc = getAssetUrl(event.img || event.cover_image, "https://images.unsplash.com/photo-1523240795612-9a054b0db644");

              return (
                <motion.div
                  key={event.id}
                  id={`event-card-${event.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.6 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedEvent(event)}
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

                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                     
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A8ACD] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-sky-200">
                          {category}
                        </span>
                        <span className="text-[10px] font-black text-pink-700 bg-pink-50/95 backdrop-blur-md px-3 py-1 rounded-full border border-pink-200">
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
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-sky-50 text-[11px] font-bold">
                    
                    <span className="text-[#2A8ACD] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read Details &amp; Share →
                    </span>
                    <span className="text-slate-400">TET Archive</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EVENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            key={selectedEvent.id}
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            resolveText={resolveText}
          />
        )}
      </AnimatePresence>
    </div>
  );
}