"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

interface HeaderProps {
    onOpenEvents2025: () => void;
    onOpenEvents2026: () => void;
    onOpenRegistration: () => void;
    onOpenAbout: () => void;
}

const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Header({ onOpenEvents2025, onOpenEvents2026, onOpenRegistration, onOpenAbout }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-bold font-mono tracking-widest text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                    CYKRYPT
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {/* Events dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsEventsDropdownOpen(!isEventsDropdownOpen)}
                            className="text-gray-300 hover:text-neon-cyan transition-colors flex items-center gap-1 font-medium text-sm tracking-wide"
                        >
                            Events <ChevronDown className={`w-4 h-4 transition-transform ${isEventsDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                            {isEventsDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="absolute top-full left-0 mt-3 w-52 glass-panel rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,240,255,0.12)]"
                                >
                                    <button onClick={() => { onOpenEvents2025(); setIsEventsDropdownOpen(false); }}
                                        className="block w-full text-left px-5 py-3 text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors text-sm border-b border-white/5">
                                        2025 — Conducted
                                    </button>
                                    <button onClick={() => { onOpenEvents2026(); setIsEventsDropdownOpen(false); }}
                                        className="block w-full text-left px-5 py-3 text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors text-sm">
                                        2026 — Upcoming
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button onClick={onOpenRegistration} className="text-gray-300 hover:text-neon-cyan transition-colors font-medium text-sm tracking-wide">
                        Registration
                    </button>

                    <button onClick={() => scrollTo("gallery")} className="text-gray-300 hover:text-neon-cyan transition-colors font-medium text-sm tracking-wide">
                        Gallery
                    </button>

                    <button onClick={() => scrollTo("faq")} className="text-gray-300 hover:text-neon-cyan transition-colors font-medium text-sm tracking-wide">
                        FAQ
                    </button>

                    <button onClick={() => scrollTo("contact")} className="text-gray-300 hover:text-neon-cyan transition-colors font-medium text-sm tracking-wide">
                        Contact
                    </button>

                    <button onClick={onOpenAbout} className="text-gray-300 hover:text-neon-cyan transition-colors font-medium text-sm tracking-wide">
                        About
                    </button>
                </nav>

                {/* Mobile: Menu */}
                <div className="flex items-center gap-3 md:hidden">
                    <button className="text-gray-300 hover:text-neon-cyan transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden glass-panel border-t border-white/5 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            <div className="font-bold text-neon-cyan text-xs tracking-widest uppercase mb-1">Events</div>
                            <button onClick={() => { onOpenEvents2025(); setIsMenuOpen(false); }} className="pl-4 text-gray-300 hover:text-neon-cyan text-left text-sm transition-colors">
                                2025 — Conducted
                            </button>
                            <button onClick={() => { onOpenEvents2026(); setIsMenuOpen(false); }} className="pl-4 text-gray-300 hover:text-neon-cyan text-left text-sm transition-colors">
                                2026 — Upcoming
                            </button>

                            <div className="h-px bg-white/5 my-1" />

                            <button onClick={() => { onOpenRegistration(); setIsMenuOpen(false); }} className="text-gray-300 hover:text-neon-cyan text-left font-medium text-sm transition-colors">
                                Registration
                            </button>
                            <button onClick={() => { scrollTo("gallery"); setIsMenuOpen(false); }} className="text-gray-300 hover:text-neon-cyan text-left font-medium text-sm transition-colors">
                                Gallery
                            </button>
                            <button onClick={() => { scrollTo("faq"); setIsMenuOpen(false); }} className="text-gray-300 hover:text-neon-cyan text-left font-medium text-sm transition-colors">
                                FAQ
                            </button>
                            <button onClick={() => { scrollTo("contact"); setIsMenuOpen(false); }} className="text-gray-300 hover:text-neon-cyan text-left font-medium text-sm transition-colors">
                                Contact
                            </button>
                            <button onClick={() => { onOpenAbout(); setIsMenuOpen(false); }} className="text-gray-300 hover:text-neon-cyan text-left font-medium text-sm transition-colors">
                                About
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
