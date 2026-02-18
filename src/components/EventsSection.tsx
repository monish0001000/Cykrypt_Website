"use client";

import React from "react";
import { motion } from "framer-motion";
import Tilt from "./Tilt";
import { Terminal, Shield, Cpu, Code2, Lock } from "lucide-react";

const pastEvents = [
    {
        title: "CyberDefend 2025",
        date: "Oct 15, 2025",
        description: "A workshop on securing enterprise networks against modern threats.",
        icon: <Shield className="w-8 h-8 text-cyan-400" />,
    },
    {
        title: "HackTheBox Meetup",
        date: "Aug 20, 2025",
        description: "Community gathering to solve HTB machines and share techniques.",
        icon: <Terminal className="w-8 h-8 text-green-400" />,
    },
    {
        title: "CryptoGraphy 101",
        date: "June 10, 2025",
        description: "Introductory session on cryptographic algorithms and their applications.",
        icon: <Lock className="w-8 h-8 text-purple-400" />,
    },
];

const OngoingEvent = () => (
    <div className="relative w-full max-w-5xl mx-auto mt-20 p-1">
        {/* Glowing Border Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 rounded-2xl blur opacity-75 animate-pulse" />

        <div className="relative bg-black border border-cyan-500/50 rounded-2xl overflow-hidden p-8 md:p-12">
            <div className="absolute top-0 right-0 p-4 opacity-20 hover:opacity-100 transition-opacity">
                <Cpu className="w-24 h-24 text-cyan-500 animate-spin-slow" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h3 className="text-cyan-400 font-mono text-lg mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        LIVE NOW
                    </h3>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4 shadow-cyan-500/50 drop-shadow-sm">
                        CYKRYPT-2026
                    </h2>
                    <p className="text-zinc-400 max-w-xl text-lg">
                        The ultimate national-level cybersecurity summit. Compete, Learn, and Conquer.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        {["CTF Competition", "Paper Presentation", "Cyber Forensics"].map((item) => (
                            <span key={item} className="px-4 py-2 bg-cyan-950/30 border border-cyan-500/30 rounded text-cyan-300 font-mono text-sm">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105">
                    REGISTER NOW
                </button>
            </div>
        </div>
    </div>
);

export default function EventsSection() {
    return (
        <section className="py-20 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Past <span className="text-cyan-500">Events</span>
                    </h2>
                    <p className="text-zinc-400">Discover what we've achieved together.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Tilt className="h-full">
                                <div className="h-full bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:border-cyan-500/50 transition-colors group backdrop-blur-sm">
                                    <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg inline-block group-hover:bg-cyan-900/30 transition-colors">
                                        {event.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    <p className="text-sm text-cyan-400 mb-4 font-mono">{event.date}</p>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </Tilt>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <OngoingEvent />
                </motion.div>
            </div>
        </section>
    );
}
