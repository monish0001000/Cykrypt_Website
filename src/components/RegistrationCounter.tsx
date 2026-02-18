"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export default function RegistrationCounter() {
    const [count, setCount] = useState(0);
    const target = 127;
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            setCount(current);
        }, 30);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 glass-panel rounded-full px-5 py-2.5"
        >
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="digit-segment text-lg md:text-xl font-bold text-neon-cyan">
                {count}+
            </span>
            <span className="text-gray-400 text-xs font-bold tracking-wider">Teams Registered</span>
        </motion.div>
    );
}
