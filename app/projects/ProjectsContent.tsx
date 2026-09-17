"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

interface ProjectItem {
  id: number;
  defCat: string;
  defTitle1: string;
  defTitle2: string;
  defDesc: string;
  defLongDesc: string;
  defStatus: string;
  defImages: string[];
}

const defaultProjects: ProjectItem[] = [
  {
    id: 1,
    defCat: "Legal & Policy Advocacy",
    defTitle1: "Sex Work Policy",
    defTitle2: "Consortium",
    defDesc:
      "A multi-stakeholder advocacy alliance drafting constitutional reform papers and legal safeguards to eliminate arbitrary police detention and systemic discrimination.",
    defLongDesc:
      "The Sex Work Policy Consortium unites human rights lawyers, trans community organizers, and constitutional experts. We provide direct paralegal intervention for arbitrarily detained trans individuals, document human rights infractions, and engage with parliamentary caucuses to reform colonial-era vagrancy statutes. Our field research informs official policy whitepapers submitted to the Ministry of Justice.",
    defStatus: "Active / Phase 02",
    defImages: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b",
    ],
  },
  {
    id: 2,
    defCat: "Economic Empowerment",
    defTitle1: "Digital Literacy &",
    defTitle2: "Employment Paths",
    defDesc:
      "Vocational training bootcamps providing IT skills, resume building, and dignified corporate placement partnerships for transgender youth in Colombo and Kandy.",
    defLongDesc:
      "Economic independence is the single most effective defense against exploitation. Our bootcamps train transgender youth in full-stack web basics, graphic design, social media management, and workplace English. Concurrently, TET sensitizes corporate HR leaders and tech firms in Sri Lanka, opening affirmative hiring pipelines with equal benefits and zero harassment guarantees.",
    defStatus: "150+ Graduates",
    defImages: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    ],
  },
  {
    id: 3,
    defCat: "Emergency Relief & Shelter",
    defTitle1: "TET Safe Spaces &",
    defTitle2: "Crisis Aid",
    defDesc:
      "Providing short-term transitional housing, food relief kits, and crisis mental health counseling for displaced and vulnerable transgender individuals nationwide.",
    defLongDesc:
      "Many transgender youth in Sri Lanka face sudden eviction and family abandonment upon coming out. TET's Safe Spaces project operates confidential, secure emergency houses in key districts. Residents receive safe shelter, daily nutrition, trauma-informed psychological triage, and assistance in obtaining emergency identification cards to regain independence.",
    defStatus: "24/7 Available",
    defImages: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
      "https://images.unsplash.com/photo-1573164713988-8665fc963095",
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca",
    ],
  },
  {
    id: 4,
    defCat: "Health & Well-being",
    defTitle1: "Affirmative Healthcare",
    defTitle2: "Access Network",
    defDesc:
      "Bridging community members with sensitized medical practitioners, hormone therapy guidance, and confidential psychiatric counseling free of judgment.",
    defLongDesc:
      "Discrimination in clinical environments often deters trans individuals from seeking critical medical care. Through this network, TET trains doctors, endocrinologists, and counselors in World Professional Association for Transgender Health (WPATH) standards, connecting community members to safe medical transition pathways, STI testing, and mental wellness care.",
    defStatus: "Islandwide Support",
    defImages: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982",
    ],
  },
];

function ProjectCard({
  project,
  onOpenDetails,
}: {
  project: ProjectItem;
  onOpenDetails: (project: ProjectItem) => void;
}) {
  const { t, getAssetUrl, isPreview } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = [
    getAssetUrl(`pj_${project.id}_img1`, project.defImages[0]),
    getAssetUrl(`pj_${project.id}_img2`, project.defImages[1]),
    getAssetUrl(`pj_${project.id}_img3`, project.defImages[2]),
  ].filter(Boolean);

  const title1 = t(`pj_${project.id}_title1`, project.defTitle1);
  const title2 = t(`pj_${project.id}_title2`, project.defTitle2);

  return (
    <motion.div
      id={`project-card-${project.id}`}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      variants={fadeInUp}
    
      className="scroll-mt-32 bg-white/95 backdrop-blur-sm rounded-3xl md:rounded-[2.5rem] border border-sky-200/80 shadow-sm hover:shadow-xl hover:border-[#2A8ACD] transition-all flex flex-col overflow-hidden group"
    >
      {/* CARD IMAGE VIEWER */}
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
                src={images[activeImageIndex] || project.defImages[0]}
                fill
                alt={title1}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={isPreview}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/50 via-transparent to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A8ACD] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-sky-200">
              {t(`pj_${project.id}_cat`, project.defCat)}
            </span>
          </div>

          <div className="absolute bottom-4 right-4">
            <span className="text-[10px] font-bold text-pink-700 bg-pink-50/90 backdrop-blur-md px-3 py-1 rounded-full border border-pink-200">
              {t(`pj_${project.id}_status`, project.defStatus)}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector */}
        <div className="flex items-center gap-2.5 pt-3 pb-1 px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Gallery:
          </span>
          {images.map((imgSrc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(idx);
              }}
              className={`relative h-12 w-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeImageIndex === idx
                  ? "border-[#2A8ACD] scale-105 shadow-md shadow-sky-200/50"
                  : "border-sky-100 opacity-60 hover:opacity-100 hover:border-[#2A8ACD]"
              }`}
            >
              <Image
                src={imgSrc}
                fill
                alt={`Thumbnail ${idx + 1}`}
                className="object-cover"
                unoptimized={isPreview}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </button>
          ))}
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="p-7 md:p-8 flex flex-col justify-between flex-grow">
        <div>
         
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2A8ACD] mb-3 leading-snug">
            {title1}{" "}
            <span className="text-pride-gradient italic font-normal">
              {title2}
            </span>
          </h3>

          <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">
            {t(`pj_${project.id}_desc`, project.defDesc)}
          </p>
        </div>

        {/* Action Bar */}
        <div className="pt-5 border-t border-sky-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#2A8ACD]">
            TET Community Initiative
          </span>

          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2A8ACD] hover:text-[#2374b0] transition-all uppercase tracking-wider group-hover:translate-x-1 cursor-pointer"
          >
            View Case Study &amp; Details <span>→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Full Detail Modal Component
function ProjectDetailModal({
  project,
  onClose,
}: {
  project: ProjectItem;
  onClose: () => void;
}) {
  const { t, getAssetUrl, isPreview } = useLanguage();
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const images = [
    getAssetUrl(`pj_${project.id}_img1`, project.defImages[0]),
    getAssetUrl(`pj_${project.id}_img2`, project.defImages[1]),
    getAssetUrl(`pj_${project.id}_img3`, project.defImages[2]),
  ].filter(Boolean);

  const title1 = t(`pj_${project.id}_title1`, project.defTitle1);
  const title2 = t(`pj_${project.id}_title2`, project.defTitle2);
  const category = t(`pj_${project.id}_cat`, project.defCat);
  const status = t(`pj_${project.id}_status`, project.defStatus);
  const longDesc = t(`pj_${project.id}_long_desc`, project.defLongDesc || project.defDesc);

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
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          className="absolute top-5 right-5 z-20 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
        >
          ✕
        </button>

        {/* Gallery Hero Viewer */}
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
                src={images[modalImageIndex] || project.defImages[0]}
                fill
                alt={title1}
                className="object-cover"
                unoptimized={isPreview}
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-5 left-5 flex gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A8ACD] bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md">
              {category}
            </span>
            <span className="text-[11px] font-bold text-pink-700 bg-pink-50/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-200">
              {status}
            </span>
          </div>

          {/* Image Slider Controls in Modal */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2">
              {images.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setModalImageIndex(idx)}
                  className={`relative h-12 w-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    modalImageIndex === idx
                      ? "border-[#2A8ACD] scale-105 shadow-md shadow-sky-500/50"
                      : "border-white/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgSrc}
                    fill
                    alt="Thumbnail"
                    className="object-cover"
                    unoptimized={isPreview}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Story Content */}
        <div className="p-8 sm:p-12 overflow-y-auto max-h-[50vh]">
       
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A8ACD] mb-4 leading-tight">
            {title1}{" "}
            <span className="text-pride-gradient italic font-normal">
              {title2}
            </span>
          </h2>

          <div className="w-12 h-1 bg-gradient-to-r from-[#2A8ACD] to-pink-500 rounded-full mb-6"></div>

          <h4 className="text-xs font-bold uppercase tracking-widest text-[#2A8ACD] mb-2">
            Project Case Study &amp; Impact
          </h4>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-8">
            {longDesc}
          </p>

          <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A8ACD] block">
                Trans Equality Trust Program
              </span>
              <span className="text-xs text-slate-600 font-medium">
                Documented Advocacy Initiative • Sri Lanka
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              Close Case Study
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Projects Page
export default function ProjectsPage() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_OPEN_MODAL") {
        const proj = defaultProjects.find((p) => p.id === Number(event.data.id));
        if (proj) setSelectedProject(proj);
      }

      if (event.data?.type === "TET_CLOSE_MODAL") {
        setSelectedProject(null);
      }

      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId, cardIndex } = event.data;

        if (cardIndex) {
          const proj = defaultProjects.find((p) => p.id === Number(cardIndex));
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

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-sky-900 overflow-x-hidden scroll-smooth">
      
      {/* 1. HERO */}
      <section 
        id="projects-hero" 
        className="scroll-mt-28 relative max-w-7xl mx-auto px-6 pt-16 pb-16 md:pt-28 text-center"
      >
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
       
          <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[11px] uppercase mb-5 px-4 py-1.5 bg-sky-50 rounded-full border border-[var(--tet-pink)]/40 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {t("pj_hero_label", "STRATEGIC ADVOCACY • OUR PROJECTS")}
          </span>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2A8ACD] mb-6 tracking-tight">
            {t("pj_hero_title1", "Advocacy in")}{" "}
            <span className="text-pride-gradient italic font-normal font-playfair">
              {t("pj_hero_title2", "Action & Motion.")}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 text-sm md:text-base leading-relaxed">
            {t(
              "pj_hero_desc",
              "Driving long-term systemic change, policy evolution, and economic independence for the transgender community across Sri Lanka."
            )}
          </p>
        </motion.div>
      </section>

      {/* 2. PROJECT CARDS GRID (4 Strategic Projects) */}
      <section 
        id="projects-grid" 
        className="scroll-mt-28 pb-28 max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {defaultProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetails={(item) => setSelectedProject(item)}
            />
          ))}
        </div>
      </section>

      {/* 3. CALL TO ACTION */}
      <section 
        id="projects-cta" 
        className="scroll-mt-28 pb-24 px-6"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-sky-950 via-[#075985] to-sky-900 rounded-3xl md:rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 italic">
              {t("pj_cta_title", "Partner with our ongoing initiatives.")}
            </h2>
            <p className="text-sky-100 text-xs md:text-sm mb-8 max-w-xl mx-auto leading-relaxed">
              {t(
                "pj_cta_desc",
                "We collaborate with legal practitioners, community organizations, and international donors to expand these projects."
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
          
              <Link
                href="/volunteer"
                className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md shadow-sky-100 hover:scale-105 active:scale-95 transition-all"
              >
                Volunteer with a Project
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all"
              >
                Contact Project Leads
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODAL DIALOG WITH KEY-BASED STATE RESET */}
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