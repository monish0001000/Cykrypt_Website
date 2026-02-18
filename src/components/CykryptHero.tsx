"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, FileDown } from "lucide-react";

interface CykryptHeroProps {
  onExplore: () => void;
  onRegister: () => void;
}

export default function CykryptHero({ onExplore, onRegister }: CykryptHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-[url('/bg_mob.svg')] md:bg-[url('/bg_pc.svg')] parallax-bg"
        aria-hidden="true"
      />

      {/* Bottom-Left: Explore + Brochure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7, ease: "easeOut" }}
        className="absolute bottom-12 left-6 md:left-12 z-10 flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={onExplore}
          className="group relative flex items-center gap-3 px-7 py-3.5 rounded-xl bg-black/40 backdrop-blur-md border border-transparent cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
          style={{ borderImage: "linear-gradient(135deg, #00f0ff, #1e3a8a) 1" }}
        >
          <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
          <span
            className="text-xs font-bold tracking-[0.25em] uppercase"
            style={{
              background: "linear-gradient(135deg, #00f0ff, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Explore
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>

        <a
          href="/CYKRYPT_2026_Brochure.pdf"
          download
          className="group relative flex items-center gap-3 px-6 py-3.5 rounded-xl bg-black/40 backdrop-blur-md border border-transparent cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
          style={{ borderImage: "linear-gradient(135deg, #00f0ff, #1e3a8a) 1" }}
        >
          <FileDown className="w-4 h-4 text-cyan-400 group-hover:animate-bounce transition-transform" />
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{
              background: "linear-gradient(135deg, #00f0ff, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Brochure
          </span>
        </a>
      </motion.div>
    </section>
  );
}
