"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Calendar, Trophy, Lock, FileText, Monitor, Zap, Cpu, Globe } from "lucide-react";

interface EventsPageProps {
    isOpen: boolean;
    onClose: () => void;
    initialYear?: "2025" | "2026";
}

const eventsData = {
    "2025": [
        {
            title: "CTF (Capture The Flag)",
            icon: <Trophy className="w-6 h-6" />,
            desc: "A high-octane hacking competition where participants solved cryptographic puzzles and exploited web vulnerabilities to find hidden flags. Teams battled through binary exploitation, reverse engineering, and steganography to claim the championship.",
            gradient: "from-yellow-600 via-amber-500 to-orange-600",
            image: "/event_ctf.jpg",
            tag: "COMPLETED",
            decorIcons: [<Zap key="z" className="w-4 h-4" />, <Cpu key="c" className="w-4 h-4" />],
        },
        {
            title: "Cyber Forensics",
            icon: <Monitor className="w-6 h-6" />,
            desc: "Participants investigated simulated cybercrime scenes, analyzing digital evidence to track down perpetrators. Challenges included disk image analysis, deleted file recovery, and timeline reconstruction from Windows event logs.",
            gradient: "from-green-600 via-emerald-500 to-teal-600",
            image: "/event_forensics.jpg",
            tag: "COMPLETED",
            decorIcons: [<Cpu key="c" className="w-4 h-4" />, <Globe key="g" className="w-4 h-4" />],
        },

        {
            title: "Paper Presentation",
            icon: <FileText className="w-6 h-6" />,
            desc: "Students presented research papers on emerging threats like AI-driven malware, quantum cryptography, and zero-trust architectures. Judges evaluated originality, technical depth, and presentation quality.",
            gradient: "from-blue-600 via-sky-500 to-cyan-600",
            image: "/event_paper.jpg",
            tag: "COMPLETED",
            decorIcons: [<Globe key="g" className="w-4 h-4" />, <Cpu key="c" className="w-4 h-4" />],
        },
    ],
    "2026": [
        {
            title: "CTF 2.0 (Hybrid)",
            icon: <Trophy className="w-6 h-6" />,
            desc: "Bigger and tougher. Now featuring both Online Qualifiers and an intense Offline Grand Finale. New categories include cloud security exploitation, smart contract vulnerabilities, and AI model manipulation.",
            gradient: "from-yellow-600 via-amber-500 to-orange-600",
            image: "/event_ctf.jpg",
            tag: "FLAGSHIP",
            decorIcons: [<Zap key="z" className="w-4 h-4" />, <Cpu key="c" className="w-4 h-4" />],
        },
        {
            title: "Cyber Forensics",
            icon: <Lock className="w-6 h-6" />,
            desc: "Advanced scenarios involving ransomware analysis, memory dump inspection, and network traffic reconstruction. Participants will use industry-grade tools like Autopsy, Volatility, and Wireshark.",
            gradient: "from-red-600 via-rose-500 to-pink-600",
            image: "/event_forensics.jpg",
            tag: "ADVANCED",
            decorIcons: [<Cpu key="c" className="w-4 h-4" />, <Globe key="g" className="w-4 h-4" />],
        },

        {
            title: "Paper Presentation",
            icon: <FileText className="w-6 h-6" />,
            desc: "Showcase your innovations in cybersecurity. Topics range from Blockchain security and Zero Trust Architecture to adversarial machine learning and post-quantum cryptography.",
            gradient: "from-cyan-600 via-teal-500 to-emerald-600",
            image: "/event_paper.jpg",
            tag: "OPEN",
            decorIcons: [<Globe key="g" className="w-4 h-4" />, <Cpu key="c" className="w-4 h-4" />],
        },

    ],
};

export default function EventsPage({ isOpen, onClose, initialYear = "2026" }: EventsPageProps) {
    const [activeYear, setActiveYear] = useState(initialYear);
    useEffect(() => { if (isOpen) setActiveYear(initialYear); }, [isOpen, initialYear]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 260 }}
                    className="fixed inset-0 z-50 bg-deep-navy overflow-hidden flex flex-col"
                >
                    {/* ─── Top Bar ─── */}
                    <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 backdrop-blur-md bg-deep-navy/80 z-10">
                        <button onClick={onClose}
                            className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold tracking-[0.15em] uppercase">Back</span>
                        </button>
                        <h1 className="text-lg md:text-xl font-bold text-white tracking-[0.2em] font-mono flex items-center gap-3">
                            <Calendar className="text-neon-cyan w-5 h-5" />
                            CYKRYPT <span className="text-neon-cyan">EVENTS</span>
                        </h1>
                        <div className="w-20" />
                    </div>

                    {/* ─── Year Tabs ─── */}
                    <div className="flex border-b border-white/5 px-6 md:px-10">
                        {(["2025", "2026"] as const).map(year => (
                            <button key={year} onClick={() => setActiveYear(year)}
                                className={`py-4 px-6 text-xs font-bold tracking-[0.2em] transition-all relative ${activeYear === year ? "text-neon-cyan" : "text-gray-600 hover:text-gray-400"
                                    }`}>
                                {year === "2025" ? "2025 — COMPLETED" : "2026 — UPCOMING"}
                                {activeYear === year && (
                                    <motion.div layoutId="yearTab"
                                        className="absolute bottom-0 left-[10%] w-[80%] h-0.5 bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.4)]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ─── Content ─── */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeYear}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-6 md:p-10 space-y-6 max-w-6xl mx-auto"
                            >
                                {/* Year Header */}
                                <div className="mb-2">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white font-mono tracking-wider">
                                        Season <span className="text-neon-cyan">{activeYear}</span>
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-2 tracking-wider">
                                        {activeYear === "2025"
                                            ? "Successfully conducted events — our inaugural season."
                                            : "Upcoming events — register now to secure your spot."}
                                    </p>
                                </div>

                                {/* Event Cards */}
                                {eventsData[activeYear].map((event, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="group glass-panel rounded-2xl overflow-hidden hover:border-neon-cyan/25 transition-all duration-500"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Image Area */}
                                            <div className="relative w-full md:w-[340px] h-56 md:h-auto flex-shrink-0 overflow-hidden">
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, 340px"
                                                />
                                                {/* Gradient overlay on image */}
                                                <div className={`absolute inset-0 bg-gradient-to-t ${event.gradient} opacity-40 mix-blend-multiply`} />
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-navy/80 hidden md:block" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 to-transparent md:hidden" />

                                                {/* Tag */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border backdrop-blur-sm ${event.tag === "FLAGSHIP" ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" :
                                                        event.tag === "NEW" ? "text-orange-400 border-orange-400/30 bg-orange-400/10" :
                                                            event.tag === "ADVANCED" ? "text-red-400 border-red-400/30 bg-red-400/10" :
                                                                event.tag === "COMPLETED" ? "text-gray-400 border-gray-400/30 bg-gray-400/10" :
                                                                    "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10"
                                                        }`}>
                                                        {event.tag}
                                                    </span>
                                                </div>

                                                {/* Floating icons */}
                                                <div className="absolute bottom-4 right-4 text-white/20 flex gap-2 z-10">
                                                    {event.decorIcons.map((ic, idx) => (
                                                        <motion.div key={idx}
                                                            animate={{ y: [0, -3, 0] }}
                                                            transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}>
                                                            {ic}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${event.gradient} text-white`}>
                                                        {event.icon}
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider group-hover:text-neon-cyan transition-colors font-mono">
                                                        {event.title}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                                    {event.desc}
                                                </p>
                                                <div className="flex items-center gap-4 text-[10px] text-gray-600 tracking-[0.15em] uppercase">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {activeYear === "2025" ? "Mar 2025" : "Mar 2026"}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                    <span>CYKRYPT {activeYear}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                    <span>Arunai Engineering College</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                <div className="h-10" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
