"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// Set event date: March 15, 2026 at 9:00 AM IST
const EVENT_DATE = new Date("2026-03-15T09:00:00+05:30").getTime();

function calcTimeLeft(): TimeLeft {
    const diff = Math.max(0, EVENT_DATE - Date.now());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function DigitBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative glass-panel rounded-xl px-3 py-2 md:px-5 md:py-3 min-w-[52px] md:min-w-[72px] text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
                <motion.span
                    key={value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="digit-segment text-2xl md:text-4xl font-bold text-neon-cyan block"
                >
                    {String(value).padStart(2, "0")}
                </motion.span>
            </div>
            <span className="text-[9px] md:text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase mt-2">{label}</span>
        </div>
    );
}

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                <Clock className="w-3.5 h-3.5 text-neon-cyan" />
                Event Starts In
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                <DigitBox value={timeLeft.days} label="Days" />
                <span className="text-neon-cyan/40 text-xl md:text-2xl font-bold pb-5">:</span>
                <DigitBox value={timeLeft.hours} label="Hours" />
                <span className="text-neon-cyan/40 text-xl md:text-2xl font-bold pb-5">:</span>
                <DigitBox value={timeLeft.minutes} label="Min" />
                <span className="text-neon-cyan/40 text-xl md:text-2xl font-bold pb-5">:</span>
                <DigitBox value={timeLeft.seconds} label="Sec" />
            </div>
        </div>
    );
}
