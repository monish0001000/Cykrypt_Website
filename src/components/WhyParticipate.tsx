"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, Swords, Users, Laptop, Network } from "lucide-react";

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "Skill Development in Cybersecurity",
        desc: "Strengthen your understanding of cybersecurity fundamentals through hands-on challenges and practical problem-solving scenarios.",
        gradient: "from-cyan-500 to-blue-600",
        glow: "rgba(0,240,255,0.35)",
    },
    {
        icon: <Swords className="w-8 h-8" />,
        title: "Hands-on CTF Experience",
        desc: "Participate in Capture The Flag challenges that test your skills in cryptography, reverse engineering, web exploitation, and forensics.",
        gradient: "from-violet-500 to-purple-600",
        glow: "rgba(139,92,246,0.35)",
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Team Collaboration & Problem Solving",
        desc: "Work with your teammates to solve complex security challenges. Build communication, leadership, and critical-thinking skills.",
        gradient: "from-emerald-500 to-teal-600",
        glow: "rgba(52,211,153,0.35)",
    },
    {
        icon: <Laptop className="w-8 h-8" />,
        title: "Practical Exposure to Real-World Security",
        desc: "Get hands-on experience with real-world security scenarios — from analyzing network traffic to investigating digital forensics evidence.",
        gradient: "from-amber-500 to-orange-600",
        glow: "rgba(245,158,11,0.35)",
    },
    {
        icon: <Network className="w-8 h-8" />,
        title: "Networking with Like-Minded Students",
        desc: "Connect with fellow students passionate about cybersecurity. Share knowledge, learn from peers, and grow your professional network.",
        gradient: "from-pink-500 to-rose-600",
        glow: "rgba(244,63,94,0.35)",
    },
];

/* ─── 3D Tilt Card ─── */
function TiltCard({ feat, index }: { feat: (typeof features)[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 200, damping: 20 });
    const springY = useSpring(y, { stiffness: 200, damping: 20 });

    const rotateX = useTransform(springY, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-12deg", "12deg"]);
    const glareX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);

    const onMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className="cursor-default"
        >
            <div
                className="relative rounded-2xl p-[1px] overflow-hidden group transition-shadow duration-500"
                style={{ boxShadow: `0 0 0px ${feat.glow}` }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 30px ${feat.glow}, 0 8px 32px rgba(0,0,0,0.4)`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 0px ${feat.glow}`)}
            >
                {/* Animated neon border gradient */}
                <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${feat.glow}, transparent 40%, transparent 60%, ${feat.glow})`,
                    }}
                />

                {/* Glassmorphism card body */}
                <div className="relative rounded-2xl bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/[0.06] group-hover:border-transparent p-7 h-full z-10 overflow-hidden">
                    {/* Glare overlay that follows cursor */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none"
                        style={{
                            background: useTransform(
                                [glareX, glareY],
                                ([gx, gy]) => `radial-gradient(600px circle at ${gx} ${gy}, rgba(255,255,255,0.15), transparent 40%)`
                            ),
                        }}
                    />

                    {/* Top scan line */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Icon */}
                    <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                        style={{ transform: "translateZ(30px)" }}
                    >
                        {feat.icon}
                    </div>

                    {/* Title */}
                    <h3
                        className="text-white font-bold text-lg mb-3 tracking-wide group-hover:text-neon-cyan transition-colors duration-300"
                        style={{ transform: "translateZ(20px)" }}
                    >
                        {feat.title}
                    </h3>

                    {/* Description */}
                    <p
                        className="text-gray-400 text-sm leading-relaxed"
                        style={{ transform: "translateZ(10px)" }}
                    >
                        {feat.desc}
                    </p>

                    {/* Bottom glow bar */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Corner brackets */}
                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/[0.06] group-hover:border-neon-cyan/40 transition-colors duration-500" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/[0.06] group-hover:border-neon-cyan/40 transition-colors duration-500" />
                </div>
            </div>
        </motion.div>
    );
}

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feat, i) => (
                        <TiltCard key={i} feat={feat} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
