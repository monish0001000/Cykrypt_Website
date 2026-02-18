"use client";

import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import RegistrationCounter from "./RegistrationCounter";

interface CountdownSectionProps {
    onRegister: () => void;
}

export default function CountdownSection({ onRegister }: CountdownSectionProps) {
    return (
        <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#060d20] to-deep-navy" />

            {/* Subtle radial glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
            />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <CountdownTimer />

                <RegistrationCounter />

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={onRegister}
                    className="px-8 py-3 rounded-xl font-bold text-xs tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]"
                    style={{
                        background: "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(59,130,246,0.15))",
                        border: "1px solid rgba(0,240,255,0.3)",
                        color: "var(--accent)",
                        textShadow: "0 0 8px var(--accent-glow)",
                    }}
                >
                    Register Now
                </motion.button>
            </div>
        </section>
    );
}
