"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, Shield } from "lucide-react";

const mockData = [
    { rank: 1, team: "fsociety", college: "IIT Madras", score: 2850, status: "Champion" },
    { rank: 2, team: "DarkPulse", college: "NIT Trichy", score: 2720, status: "Runner-up" },
    { rank: 3, team: "ByteForce", college: "VIT Vellore", score: 2680, status: "2nd Runner-up" },
    { rank: 4, team: "CipherX", college: "Anna University", score: 2510, status: "Finalist" },
    { rank: 5, team: "NullSec", college: "SRM University", score: 2440, status: "Finalist" },
    { rank: 6, team: "ShellStorm", college: "BITS Pilani", score: 2380, status: "Finalist" },
    { rank: 7, team: "RedTeamAlpha", college: "Arunai Engg College", score: 2290, status: "Semifinalist" },
    { rank: 8, team: "ZeroDaySquad", college: "PSG Tech", score: 2200, status: "Semifinalist" },
];

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-500 font-mono text-sm font-bold">#{rank}</span>;
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        Champion: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
        "Runner-up": "text-gray-300 border-gray-300/30 bg-gray-300/10",
        "2nd Runner-up": "text-amber-500 border-amber-500/30 bg-amber-500/10",
        Finalist: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
        Semifinalist: "text-gray-500 border-gray-500/30 bg-gray-500/10",
    };
    return (
        <span className={`text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border ${colors[status] || colors.Semifinalist}`}>
            {status}
        </span>
    );
}

export default function LeaderboardSection() {
    return (
        <section id="leaderboard" className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#060d20] to-deep-navy" />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <div className="flex items-center justify-center gap-2 text-neon-cyan/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
                        <Shield className="w-3.5 h-3.5" /> Rankings
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-mono tracking-wider mb-4">
                        LEADER<span className="text-neon-cyan">BOARD</span>
                    </h2>
                    <p className="text-gray-500 text-sm">CTF 2.0 Championship Standings (Mock Data)</p>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel rounded-2xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-6 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">Rank</th>
                                    <th className="text-left px-6 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">Team</th>
                                    <th className="text-left px-6 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase hidden sm:table-cell">College</th>
                                    <th className="text-right px-6 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">Score</th>
                                    <th className="text-right px-6 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase hidden md:table-cell">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockData.map((row, i) => (
                                    <motion.tr
                                        key={row.rank}
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.06 }}
                                        className={`border-b border-white/[0.03] hover:bg-neon-cyan/[0.03] transition-colors ${row.rank <= 3 ? "bg-white/[0.02]" : ""}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center w-8">
                                                <RankBadge rank={row.rank} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-bold text-sm font-mono tracking-wider">{row.team}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="text-gray-500 text-xs">{row.college}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="digit-segment text-neon-cyan font-bold">{row.score.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right hidden md:table-cell">
                                            <StatusBadge status={row.status} />
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
