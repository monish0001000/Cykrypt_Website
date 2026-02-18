"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Scan } from "lucide-react";

const scanSteps = [
    { text: "Scanning Identity...", icon: <Scan className="w-5 h-5" />, delay: 0 },
    { text: "Secure Channel Established.", icon: <Shield className="w-5 h-5" />, delay: 1200 },
    { text: "Encryption Protocol Enabled.", icon: <Lock className="w-5 h-5" />, delay: 2400 },
];

export default function ThreatScan({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        scanSteps.forEach((step, i) => {
            timers.push(setTimeout(() => setCurrentStep(i), step.delay));
        });

        timers.push(setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 500);
        }, 3600));

        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] bg-deep-navy flex items-center justify-center flicker-effect"
                >
                    {/* Scan line */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="scan-sweep-line absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
                    </div>

                    {/* Grid effect */}
                    <div className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: "linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="text-neon-cyan">
                                    {scanSteps[currentStep]?.icon}
                                </div>
                                <p className="text-neon-cyan font-mono text-sm tracking-[0.2em] uppercase">
                                    {scanSteps[currentStep]?.text}
                                </p>
                                {/* Progress dots */}
                                <div className="flex gap-2 mt-4">
                                    {scanSteps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= currentStep ? "bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.5)]" : "bg-gray-700"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
