"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function RegistrationCounter() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 glass-panel rounded-full px-5 py-2.5"
        >
            <ShieldCheck className="w-4 h-4 text-neon-cyan" />
            <span className="text-neon-cyan text-xs md:text-sm font-bold tracking-[0.12em] uppercase">
                Secure Your Spot in the Arena
            </span>
        </motion.div>
    );
}

