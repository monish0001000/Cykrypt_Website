"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, WifiOff } from "lucide-react";

const lines = [
    { text: "$ initializing cybershield...", color: "text-gray-400" },
    { text: "[OK] Firewall Active", color: "text-green-400" },
    { text: "[OK] Encryption Protocols Enabled", color: "text-green-400" },
    { text: "[OK] Threat Detection Online", color: "text-green-400" },
    { text: "[OK] Secure Channel Established", color: "text-neon-cyan" },
    { text: "", color: "" },
    { text: "Welcome, Operator.", color: "text-white font-bold" },
    { text: "CyberShield is ready.", color: "text-neon-cyan" },
];

export default function LoadingScreen() {
    const [show, setShow] = useState(true);
    const [visibleCount, setVisibleCount] = useState(0);
    const [offline, setOffline] = useState(false);

    // Auto-dismiss after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Reveal lines quickly over the 2s window
    useEffect(() => {
        if (visibleCount >= lines.length) return;
        const timer = setTimeout(() => setVisibleCount((c) => c + 1), 200);
        return () => clearTimeout(timer);
    }, [visibleCount]);

    // Offline detection
    useEffect(() => {
        const off = () => setOffline(true);
        const on = () => setOffline(false);
        window.addEventListener("offline", off);
        window.addEventListener("online", on);
        if (!navigator.onLine) setOffline(true);
        return () => { window.removeEventListener("offline", off); window.removeEventListener("online", on); };
    }, []);

    // Offline screen — always visible when offline
    if (offline) {
        return (
            <div className="fixed inset-0 z-[100] bg-deep-navy flex items-center justify-center px-6">
                <div className="text-center">
                    <WifiOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-white text-xl font-bold font-mono tracking-wider mb-2">SYSTEM OFFLINE</h2>
                    <p className="text-gray-500 text-sm">Waiting for network connection...</p>
                </div>
            </div>
        );
    }

    // Loading screen — 2 seconds then gone
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[100] bg-deep-navy flex items-center justify-center px-6"
                >
                    <div className="w-full max-w-xl">
                        <div className="glass-panel rounded-2xl overflow-hidden">
                            {/* Title bar */}
                            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 text-[10px] font-mono tracking-wider">
                                    <Terminal className="w-3 h-3" />
                                    cybershield@operator:~
                                </div>
                            </div>

                            {/* Terminal lines */}
                            <div className="p-6 font-mono text-sm leading-7">
                                {lines.slice(0, visibleCount).map((line, i) => (
                                    <div key={i} className={line.color}>{line.text}</div>
                                ))}
                                {visibleCount < lines.length && (
                                    <span className="inline-block w-2 h-4 bg-neon-cyan animate-pulse ml-0.5" />
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
