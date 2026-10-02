"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://qtxzpyl7n4pxoe9ku8fr280l.51.79.156.158.sslip.io").replace(/\/+$/, "");

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0f2fe"/><stop offset="1" stop-color="#fce7f3"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/></svg>'
  );

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

type Tri = Record<string, string> | string | null | undefined;

export interface ApiProject {
  id: number;
  category: Tri;
  title1: Tri;
  title2: Tri;
  summary: Tri;
  long_desc: Tri;
  status: Tri;
  images: string[];
}

function useTr() {
  const { locale } = useLanguage();
  return (v: Tri): string => {
    if (!v) return "";
    if (typeof v === "string") return v;
    return v[locale] || v["en"] || "";
  };
}

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

function ProjectCard({
  project,
  onOpenDetails,
}: {
  project: ApiProject;
  onOpenDetails: (project: ApiProject) => void;
}) {
  const { t, getAssetUrl, isPreview } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const tr = useTr();
  const images = (project.images || []).map((src) => getAssetUrl(src)).filter(Boolean);

  const title1 = tr(project.title1);
  const title2 = tr(project.title2);

  return (
    <motion.div
      id={`project-card-${project.id}`}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="scroll-mt-32 bg-white/95 backdrop-blur-sm rounded-3xl md:rounded-[2.5rem] border border-sky-200/80 shadow-sm hover:shadow-xl hover:border-[#2A8ACD] transition-all flex flex-col justify-between h-full overflow-hidden group"
    >
      <div className="p-4 pb-0">
        <div className="relative h-64 sm:h-72 w-full rounded-2xl md:rounded-[1.75rem] overflow-hidden bg-sky-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[activeImageIndex] || PLACEHOLDER_IMG}
                fill
                alt={title1}
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={isPreview}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/50 via-transparent to-transparent"></div>

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A8ACD] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-sky-200">
              {tr(project.category)}
            </span>
          </div>

          <div className="absolute bottom-4 right-4">
            <span className="text-[10px] font-bold text-pink-700 bg-pink-50/90 backdrop-blur-md px-3 py-1 rounded-full border border-pink-200">
              {tr(project.status)}
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-2.5 pt-3 pb-1 px-1 overflow-x-auto ${images.length > 1 ? "" : "invisible"}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            {t("ui_projects_gallery")}
          </span>
          {images.map((imgSrc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(idx);
              }}
              className={`relative h-12 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeImageIndex === idx
                  ? "border-[#2A8ACD] scale-105 shadow-md shadow-sky-200/50"
                  : "border-sky-100 opacity-60 hover:opacity-100 hover:border-[#2A8ACD]"
              }`}
            >
              <Image
                src={imgSrc}
                fill
                alt={`${t("ui_projects_thumbnail")} ${idx + 1}`}
                className="object-cover object-top"
                unoptimized={isPreview}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="p-7 md:p-8 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1b5e94] mb-3 leading-snug min-h-[3.25rem] flex items-center">
            {title1}{" "}
            <span className="text-pride-gradient font-normal ml-1">
              {title2}
            </span>
          </h3>

          <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3 min-h-[4.25rem]">
            {tr(project.summary)}
          </p>
        </div>

        <div className="pt-5 border-t border-sky-100 flex items-center justify-between mt-auto">
          <span className="text-[11px] font-bold text-[#2A8ACD]">
            {t("ui_projects_tet_community_initiative")}
          </span>

          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2A8ACD] hover:text-[#2374b0] transition-all uppercase tracking-wider group-hover:translate-x-1 cursor-pointer"
          >
            {t("ui_projects_view_case_study_and_details")}{" "}<span>→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectDetailModal({
  project,
  onClose,
}: {
  project: ApiProject;
  onClose: () => void;
}) {
  const { t, getAssetUrl, isPreview } = useLanguage();
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const tr = useTr();
  const images = (project.images || []).map((src) => getAssetUrl(src)).filter(Boolean);

  const title1 = tr(project.title1);
  const title2 = tr(project.title2);
  const category = tr(project.category);
  const status = tr(project.status);
  const longDesc = tr(project.long_desc) || tr(project.summary);
  const descParagraphs = splitIntoShortParagraphs(longDesc);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-sky-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-sky-100 overflow-hidden relative flex flex-col my-8"
      >
        <button
          onClick={onClose}
          aria-label={t("ui_projects_close_modal")}
          className="absolute top-5 right-5 z-20 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
        >
          ✕
        </button>

        <div className="relative h-72 sm:h-96 w-full bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={modalImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[modalImageIndex] || PLACEHOLDER_IMG}
                fill
                alt={title1}
                className="object-cover object-top"
                unoptimized={isPreview}
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <div className="absolute top-5 left-5 flex gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A8ACD] bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md">
              {category}
            </span>
            <span className="text-[11px] font-bold text-pink-700 bg-pink-50/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-200">
              {status}
            </span>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2 overflow-x-auto">
              {images.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setModalImageIndex(idx)}
                  className={`relative h-12 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    modalImageIndex === idx
                      ? "border-[#2A8ACD] scale-105 shadow-md shadow-sky-500/50"
                      : "border-white/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgSrc}
                    fill
                    alt={t("ui_projects_thumbnail")}
                    className="object-cover object-top"
                    unoptimized={isPreview}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 sm:p-12 overflow-y-auto max-h-[50vh]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b5e94] mb-4 leading-snug tracking-normal">
            {title1}{" "}
            <span className="text-pride-gradient font-normal">
              {title2}
            </span>
          </h2>

          <div className="w-12 h-1 bg-gradient-to-r from-[#2A8ACD] to-pink-500 rounded-full mb-6"></div>

          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1b5e94] mb-3">
            {t("ui_projects_project_case_study_and_impact")}
          </h4>
          <div className="space-y-3.5 text-slate-700 text-sm sm:text-base leading-relaxed mb-8">
            {descParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A8ACD] block">
                {t("ui_projects_trans_equality_trust_program")}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {t("ui_projects_documented_advocacy_initiative_sri_lanka")}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              {t("ui_projects_close_case_study")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsPage({
  initialProjects = null,
}: {
  initialProjects?: ApiProject[] | null;
}) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<ApiProject[]>(initialProjects ?? []);
  const [selectedProject, setSelectedProject] = useState<ApiProject | null>(null);
  const projectsRef = useRef(projects);

  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setProjects(data);
          setSelectedProject((current) =>
            current ? data.find((p: ApiProject) => p.id === current.id) ?? null : null
          );
        }
      } catch (err) {
        console.warn("Projects API unavailable:", err);
      }
    };

    loadProjects();

    const handleReload = (event: MessageEvent) => {
      if (event.data?.type === "TET_RELOAD_COLLECTION") loadProjects();
    };
    window.addEventListener("message", handleReload);

    return () => {
      isMounted = false;
      window.removeEventListener("message", handleReload);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_OPEN_MODAL") {
        const proj = projectsRef.current.find((p) => p.id === Number(event.data.id));
        if (proj) setSelectedProject(proj);
      }

      if (event.data?.type === "TET_CLOSE_MODAL") {
        setSelectedProject(null);
      }

      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId, cardIndex } = event.data;

        if (cardIndex) {
          const proj = projectsRef.current.find((p) => p.id === Number(cardIndex));
          if (proj) setSelectedProject(proj);
        } else if (sectionId === "projects-hero" || sectionId === "projects-cta") {
          setSelectedProject(null);
        }

        const targetId = cardIndex ? `project-card-${cardIndex}` : sectionId;
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
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const heroParagraphs = splitIntoShortParagraphs(t("pj_hero_desc"));
  const ctaParagraphs = splitIntoShortParagraphs(t("pj_cta_desc"));

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-sky-900 overflow-x-hidden scroll-smooth">
      <section 
        id="projects-hero" 
        className="scroll-mt-28 relative max-w-7xl mx-auto px-6 pt-12 pb-16 md:pt-20 text-center"
      >
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[10px] uppercase mb-4 px-4 py-1.5 bg-sky-50 rounded-full border border-[#EFBAC6]/40 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {t("pj_hero_label")}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b5e94] mb-4 leading-snug tracking-normal text-balance max-w-4xl mx-auto">
            {t("pj_hero_title1")}
            <span className="block mt-2 font-normal text-pride-gradient text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem]">
              {t("pj_hero_title2")}
            </span>
          </h1>

          <div className="max-w-3xl mx-auto mt-8 text-left bg-white/80 backdrop-blur-sm p-6 sm:p-8 md:p-9 rounded-3xl border border-sky-100 shadow-sm space-y-4">
            {heroParagraphs.map((para, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? "text-slate-800 text-sm md:text-base font-medium leading-relaxed border-l-2 border-[#2A8ACD] pl-4"
                    : "text-slate-600 text-sm md:text-base leading-relaxed pl-4 border-l-2 border-transparent"
                }
              >
                {para}
              </p>
            ))}
          </div>
        </motion.div>
      </section>

      <section 
        id="projects-grid" 
        className="scroll-mt-28 pb-24 md:pb-28 max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetails={(item) => setSelectedProject(item)}
            />
          ))}
        </div>
      </section>

      <section 
        id="projects-cta" 
        className="scroll-mt-28 pb-20 md:pb-24 px-6"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-sky-950 via-[#075985] to-sky-900 rounded-3xl md:rounded-[3rem] p-8 sm:p-12 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-snug tracking-normal text-balance">
              {t("pj_cta_title")}
            </h2>
            <div className="text-sky-100 text-xs md:text-sm mb-8 max-w-xl mx-auto leading-relaxed space-y-2">
              {ctaParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/volunteer"
                className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md shadow-sky-100 hover:scale-105 active:scale-95 transition-all"
              >
                {t("ui_projects_volunteer_with_a_project")}
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all"
              >
                {t("ui_projects_contact_project_leads")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}