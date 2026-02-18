"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [isGold, setIsGold] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        if (isGold) {
            html.setAttribute("data-theme", "gold");
        } else {
            html.removeAttribute("data-theme");
        }
    }, [isGold]);

    return (
        <button
            onClick={() => setIsGold(!isGold)}
            className="relative w-12 h-6 rounded-full glass-panel border border-white/10 hover:border-neon-cyan/30 transition-colors flex items-center cursor-pointer"
            aria-label="Toggle theme"
        >
            <motion.div
                animate={{ x: isGold ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-5 h-5 rounded-full flex items-center justify-center ${isGold
                        ? "bg-gradient-to-br from-yellow-400 to-amber-600"
                        : "bg-gradient-to-br from-cyan-400 to-blue-600"
                    }`}
            >
                {isGold ? <Sun className="w-3 h-3 text-white" /> : <Moon className="w-3 h-3 text-white" />}
            </motion.div>
        </button>
    );
}
