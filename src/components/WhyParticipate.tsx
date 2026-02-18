"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Swords, Users, Laptop, Network } from "lucide-react";

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "Skill Development in Cybersecurity",
        desc: "Strengthen your understanding of cybersecurity fundamentals through hands-on challenges and practical problem-solving scenarios.",
        gradient: "from-cyan-500 to-blue-600",
    },
    {
        icon: <Swords className="w-8 h-8" />,
        title: "Hands-on CTF Experience",
        desc: "Participate in Capture The Flag challenges that test your skills in cryptography, reverse engineering, web exploitation, and forensics.",
        gradient: "from-violet-500 to-purple-600",
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Team Collaboration & Problem Solving",
        desc: "Work with your teammates to solve complex security challenges. Build communication, leadership, and critical-thinking skills.",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        icon: <Laptop className="w-8 h-8" />,
        title: "Practical Exposure to Real-World Security",
        desc: "Get hands-on experience with real-world security scenarios — from analyzing network traffic to investigating digital forensics evidence.",
        gradient: "from-amber-500 to-orange-600",
    },
    {
        icon: <Network className="w-8 h-8" />,
        title: "Networking with Like-Minded Students",
        desc: "Connect with fellow students passionate about cybersecurity. Share knowledge, learn from peers, and grow your professional network.",
        gradient: "from-pink-500 to-rose-600",
    },
];

export default function WhyParticipate() {
    return (
        <section id="why-participate" className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#060d20] to-deep-navy" />
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
                style={{ background: "conic-gradient(from 0deg, var(--accent), transparent, var(--accent))" }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-neon-cyan/60 mb-3">Why Join Us</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-mono tracking-wider mb-4">
                        WHY PARTICIPATE IN <span className="text-neon-cyan">CYKRYPT?</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-xl mx-auto">
                        A platform for students to explore, learn, and compete in cybersecurity — hosted by the Department of CSE (Cybersecurity), Arunai Engineering College.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ scale: 1.03, y: -4 }}
                            className="glass-panel rounded-2xl p-7 relative overflow-hidden group cursor-default hover:border-neon-cyan/30 transition-all duration-500"
                        >
                            {/* Top glow line */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                                {feat.icon}
                            </div>

                            <h3 className="text-white font-bold text-lg mb-3 tracking-wide group-hover:text-neon-cyan transition-colors">
                                {feat.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {feat.desc}
                            </p>

                            {/* Corner accent */}
                            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-neon-cyan/15 group-hover:border-neon-cyan/40 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
