"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Users, Award, UserCircle, Mail, Github, Linkedin } from "lucide-react";

interface AboutPageProps {
    isOpen: boolean;
    onClose: () => void;
}

const associationMembers = [
    { name: "DR.Mohanarangan", role: "Head of Department", designation: "Faculty Advisor", accent: true },
    { name: "---", role: "Associate Professor", designation: "Association Coordinator", accent: false },
];

const organizers = [
    { name: "Sameer anna", role: "President", dept: "IV Year · CSE-CS" },
    { name: "---", role: "Vice President", dept: "IV Year · CSE-CS" },
    { name: "---", role: "Secretary", dept: "III Year · CSE-CS" },
    { name: "---", role: "Treasurer", dept: "III Year · CSE-CS" },
    { name: "---", role: "Technical Lead", dept: "III Year · CSE-CS" },
    { name: "---", role: "Event Coordinator", dept: "III Year · CSE-CS" },
    { name: "---", role: "Design Lead", dept: "II Year · CSE-CS" },
    { name: "---", role: "Social Media Lead", dept: "II Year · CSE-CS" },
];

export default function AboutPage({ isOpen, onClose }: AboutPageProps) {
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
                            <Shield className="text-neon-cyan w-5 h-5" />
                            ABOUT <span className="text-neon-cyan">US</span>
                        </h1>
                        <div className="w-20" />
                    </div>

                    {/* ─── Content ─── */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">

                            {/* ═══ Hero Card — Holographic ═══ */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel rounded-2xl p-8 md:p-10 relative overflow-hidden"
                            >
                                {/* Scan line */}
                                <div className="scan-line" />

                                {/* HUD Corners */}
                                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-neon-cyan/25" />
                                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-neon-cyan/25" />
                                <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-neon-cyan/25" />
                                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-neon-cyan/25" />

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <motion.div
                                        animate={{ rotateY: [0, 360] }}
                                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 8, ease: "easeInOut" }}
                                        className="mb-5"
                                    >
                                        <Shield className="w-14 h-14 text-neon-cyan drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
                                    </motion.div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 font-mono tracking-[0.2em]">
                                        CYBER<span className="text-neon-cyan">SHIELD</span>
                                    </h2>
                                    <div className="h-0.5 w-16 bg-neon-cyan rounded-full mb-6 shadow-[0_0_4px_rgba(0,240,255,0.5)]" />

                                    <div className="space-y-4 text-gray-400 leading-relaxed text-sm max-w-2xl">
                                        <p>
                                            <strong className="text-white">CyberShield</strong> is the premier Student Organization within the Department of
                                            <span className="text-neon-cyan"> B.E. CSE Cybersecurity</span> at <strong className="text-white">Arunai Engineering College</strong>.
                                        </p>
                                        <p>
                                            Founded with a mission to secure the digital frontier, we foster a community of{" "}
                                            <span className="text-neon-cyan font-medium">Ethical Hackers</span>, security researchers, and future{" "}
                                            <span className="text-neon-cyan font-medium">Cyber Defenders</span>.
                                        </p>
                                        <p>
                                            Every year, we conduct our flagship department function —{" "}
                                            <strong className="text-neon-cyan text-base font-mono tracking-wider">CYKRYPT</strong>.
                                            This event brings together the brightest minds to compete, learn, and showcase their skills across{" "}
                                            <span className="text-neon-cyan font-medium">CTF</span>,{" "}
                                            <span className="text-neon-cyan font-medium">Forensics</span>,{" "}
                                            <span className="text-neon-cyan font-medium">Quizzes</span>, and more.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ═══ Association Members ═══ */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Award className="text-neon-cyan w-5 h-5" />
                                    <h3 className="text-lg font-bold text-white tracking-[0.15em] font-mono">
                                        ASSOCIATION <span className="text-neon-cyan">MEMBERS</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {associationMembers.map((member, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 + i * 0.05 }}
                                            className="glass-panel rounded-xl p-6 relative overflow-hidden hover:border-neon-cyan/25 transition-all group"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${member.accent
                                                    ? "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan"
                                                    : "bg-white/5 border border-white/10 text-gray-400"
                                                    }`}>
                                                    <UserCircle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold tracking-wide group-hover:text-neon-cyan transition-colors">{member.name}</h4>
                                                    <p className="text-neon-cyan/70 text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">{member.role}</p>
                                                    <p className="text-gray-500 text-xs mt-1">{member.designation}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* ═══ Event Organizers ═══ */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Users className="text-neon-cyan w-5 h-5" />
                                    <h3 className="text-lg font-bold text-white tracking-[0.15em] font-mono">
                                        EVENT <span className="text-neon-cyan">ORGANIZERS</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {organizers.map((org, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25 + i * 0.04 }}
                                            className="glass-panel rounded-xl p-5 text-center hover:border-neon-cyan/25 transition-all group relative overflow-hidden"
                                        >
                                            {/* Avatar placeholder */}
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan/20 to-blue-600/20 border border-white/10 flex items-center justify-center mx-auto mb-3 group-hover:border-neon-cyan/30 transition-colors">
                                                <span className="text-neon-cyan font-bold text-lg font-mono">
                                                    {org.name.split(" ").map(n => n[0]).join("")}
                                                </span>
                                            </div>
                                            <h4 className="text-white font-bold text-sm tracking-wide group-hover:text-neon-cyan transition-colors">{org.name}</h4>
                                            <p className="text-neon-cyan/60 text-[9px] font-bold tracking-[0.2em] uppercase mt-1">{org.role}</p>
                                            <p className="text-gray-600 text-[10px] mt-1">{org.dept}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* ═══ Footer Note ═══ */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-center py-6 border-t border-white/5"
                            >
                                <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase">
                                    Department of CSE — Cybersecurity · Arunai Engineering College · Tiruvannamalai
                                </p>
                            </motion.div>

                            <div className="h-6" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
