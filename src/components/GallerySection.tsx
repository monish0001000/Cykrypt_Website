"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useEffect, useRef } from "react";

const galleryImages = [
    { src: "/event_ctf.jpg", caption: "CTF Competition — Teams in action" },
    { src: "/event_forensics.jpg", caption: "Cyber Forensics — Digital investigation" },
    { src: "/event_paper.jpg", caption: "Paper Presentation — Research showcase" },
    { src: "/event_ctf.jpg", caption: "CTF Finals — Championship round" },
    { src: "/event_forensics.jpg", caption: "Forensics Lab — Evidence analysis" },
];

export default function GallerySection() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [autoPlay, setAutoPlay] = useState(false);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const openLightbox = (i: number) => setLightboxIndex(i);
    const closeLightbox = () => { setLightboxIndex(null); setAutoPlay(false); };
    const goNext = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % galleryImages.length : 0);
    const goPrev = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0);

    useEffect(() => {
        if (autoPlay && lightboxIndex !== null) {
            autoPlayRef.current = setInterval(goNext, 3000);
        }
        return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
    }, [autoPlay, lightboxIndex]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxIndex]);

    return (
        <section id="gallery" className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#060d20] to-deep-navy" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <div className="flex items-center justify-center gap-2 text-neon-cyan/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
                        <Camera className="w-3.5 h-3.5" /> Event Highlights
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-mono tracking-wider mb-4">
                        GALLERY — <span className="text-neon-cyan">2025</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">Moments from our inaugural season that defined CyberShield.</p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {galleryImages.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            onClick={() => openLightbox(i)}
                            className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[4/3] glass-panel"
                        >
                            <Image
                                src={img.src}
                                alt={img.caption}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-0 blur-[1px]"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-deep-navy/40 group-hover:bg-deep-navy/10 transition-all duration-500" />
                            {/* Caption */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-deep-navy/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-white text-xs font-bold tracking-wider">{img.caption}</p>
                            </div>
                            {/* HUD corner */}
                            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-neon-cyan/20 group-hover:border-neon-cyan/50 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ═══ Lightbox ═══ */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] lightbox-backdrop flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full mx-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={lightboxIndex}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-panel"
                                >
                                    <Image
                                        src={galleryImages[lightboxIndex].src}
                                        alt={galleryImages[lightboxIndex].caption}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 900px"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Caption */}
                            <p className="text-center text-gray-400 text-sm mt-4 tracking-wider">
                                {galleryImages[lightboxIndex].caption}
                                <span className="text-gray-600 ml-3">{lightboxIndex + 1} / {galleryImages.length}</span>
                            </p>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-4 mt-5">
                                <button onClick={goPrev} className="p-2 glass-panel rounded-full hover:border-neon-cyan/30 transition-colors">
                                    <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-neon-cyan" />
                                </button>
                                <button onClick={() => setAutoPlay(!autoPlay)} className="p-2 glass-panel rounded-full hover:border-neon-cyan/30 transition-colors">
                                    {autoPlay ? <Pause className="w-5 h-5 text-neon-cyan" /> : <Play className="w-5 h-5 text-gray-400 hover:text-neon-cyan" />}
                                </button>
                                <button onClick={goNext} className="p-2 glass-panel rounded-full hover:border-neon-cyan/30 transition-colors">
                                    <ChevronRight className="w-5 h-5 text-gray-400 hover:text-neon-cyan" />
                                </button>
                            </div>

                            {/* Close */}
                            <button onClick={closeLightbox}
                                className="absolute -top-3 -right-3 p-2 glass-panel rounded-full hover:border-neon-cyan/30 transition-colors z-10">
                                <X className="w-4 h-4 text-gray-400 hover:text-neon-cyan" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
