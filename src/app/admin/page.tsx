"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Download, CheckCircle, Search, LogOut, Users, Eye } from "lucide-react";

interface Registration {
    id: string;
    teamName: string;
    event: string;
    college: string;
    ctfMode: string;
    leader: { name: string; phone: string; email: string; yearDept: string };
    members: { name: string; phone: string; email: string }[];
    verified: boolean;
    timestamp: string;
}

const ADMIN_PASSWORD = "cybershield2026";

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [search, setSearch] = useState("");
    const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

    const handleLogin = () => {
        if (password === ADMIN_PASSWORD) {
            setAuthed(true);
            setError("");
            loadRegistrations();
        } else {
            setError("Invalid credentials");
        }
    };

    const loadRegistrations = () => {
        // Mock data — in production, fetch from /api/admin
        setRegistrations([
            {
                id: "REG-001", teamName: "fsociety", event: "CTF 2.0 (Hybrid)", college: "IIT Madras",
                ctfMode: "Online", leader: { name: "Arun K", phone: "+91 98765 43210", email: "arun@iitm.ac.in", yearDept: "III Year · CSE" },
                members: [{ name: "Priya R", phone: "+91 98765 43211", email: "priya@iitm.ac.in" }],
                verified: true, timestamp: "2026-02-15T10:30:00",
            },
            {
                id: "REG-002", teamName: "DarkPulse", event: "Cyber Forensics", college: "NIT Trichy",
                ctfMode: "N/A", leader: { name: "Kiran S", phone: "+91 87654 32100", email: "kiran@nitt.edu", yearDept: "IV Year · IT" },
                members: [{ name: "Meena V", phone: "+91 87654 32101", email: "meena@nitt.edu" }, { name: "Raj P", phone: "+91 87654 32102", email: "raj@nitt.edu" }],
                verified: false, timestamp: "2026-02-16T14:15:00",
            },
            {
                id: "REG-003", teamName: "ByteForce", event: "CTF 2.0 (Hybrid)", college: "VIT Vellore",
                ctfMode: "Offline", leader: { name: "Deepa M", phone: "+91 76543 21000", email: "deepa@vit.ac.in", yearDept: "III Year · CSE-CS" },
                members: [{ name: "Suresh L", phone: "+91 76543 21001", email: "suresh@vit.ac.in" }],
                verified: false, timestamp: "2026-02-17T09:45:00",
            },
        ]);
    };

    const toggleVerify = (id: string) => {
        setRegistrations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, verified: !r.verified } : r))
        );
    };

    const downloadCSV = () => {
        const headers = ["ID", "Team Name", "Event", "College", "CTF Mode", "Leader Name", "Leader Phone", "Leader Email", "Leader Year/Dept", "Members", "Verified", "Timestamp"];
        const rows = registrations.map((r) => [
            r.id, r.teamName, r.event, r.college, r.ctfMode,
            r.leader.name, r.leader.phone, r.leader.email, r.leader.yearDept,
            r.members.map((m) => `${m.name} (${m.phone})`).join("; "),
            r.verified ? "Yes" : "No", r.timestamp,
        ]);
        const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cykrypt_registrations.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const filtered = registrations.filter(
        (r) =>
            r.teamName.toLowerCase().includes(search.toLowerCase()) ||
            r.college.toLowerCase().includes(search.toLowerCase()) ||
            r.leader.name.toLowerCase().includes(search.toLowerCase())
    );

    // ═══ LOGIN SCREEN ═══
    if (!authed) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-2xl p-10 max-w-md w-full"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-neon-cyan" />
                        </div>
                        <h1 className="text-2xl font-bold text-white font-mono tracking-wider">ADMIN PANEL</h1>
                        <p className="text-gray-600 text-xs tracking-wider mt-2">CyberShield Command Center</p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input
                                type="password"
                                placeholder="Enter access code"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                className="w-full glass-panel rounded-xl px-10 py-3 text-white text-sm border border-white/10 focus:border-neon-cyan/40 outline-none bg-transparent"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs text-center">{error}</p>
                        )}

                        <button
                            onClick={handleLogin}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold tracking-wider hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
                        >
                            ACCESS DASHBOARD
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ═══ DASHBOARD ═══
    return (
        <div className="min-h-screen bg-deep-navy text-white">
            {/* Top bar */}
            <header className="border-b border-white/5 bg-deep-navy/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-neon-cyan" />
                        <span className="font-bold font-mono tracking-widest text-neon-cyan text-sm">CYKRYPT ADMIN</span>
                    </div>
                    <button
                        onClick={() => { setAuthed(false); setPassword(""); }}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-xs font-bold tracking-wider transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" /> LOGOUT
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Total Teams", value: registrations.length, icon: <Users className="w-5 h-5 text-neon-cyan" /> },
                        { label: "Verified", value: registrations.filter((r) => r.verified).length, icon: <CheckCircle className="w-5 h-5 text-green-400" /> },
                        { label: "Pending", value: registrations.filter((r) => !r.verified).length, icon: <Eye className="w-5 h-5 text-amber-400" /> },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel rounded-xl p-5 flex items-center gap-4"
                        >
                            {stat.icon}
                            <div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Search by team, college, or leader..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full glass-panel rounded-xl px-10 py-2.5 text-white text-sm border border-white/10 focus:border-neon-cyan/40 outline-none bg-transparent"
                        />
                    </div>
                    <button
                        onClick={downloadCSV}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
                    >
                        <Download className="w-4 h-4" /> EXPORT CSV
                    </button>
                </div>

                {/* Table */}
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-5 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">ID</th>
                                    <th className="text-left px-5 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">Team</th>
                                    <th className="text-left px-5 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase hidden md:table-cell">Event</th>
                                    <th className="text-left px-5 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase hidden lg:table-cell">College</th>
                                    <th className="text-left px-5 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">Leader</th>
                                    <th className="text-center px-5 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">Status</th>
                                    <th className="text-center px-5 py-4 text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((reg, i) => (
                                    <motion.tr
                                        key={reg.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-white/[0.03] hover:bg-neon-cyan/[0.03] transition-colors"
                                    >
                                        <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{reg.id}</td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-white font-mono tracking-wider">{reg.teamName}</td>
                                        <td className="px-5 py-3.5 text-xs text-gray-400 hidden md:table-cell">{reg.event}</td>
                                        <td className="px-5 py-3.5 text-xs text-gray-400 hidden lg:table-cell">{reg.college}</td>
                                        <td className="px-5 py-3.5 text-xs text-gray-300">{reg.leader.name}</td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className={`text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border ${reg.verified
                                                    ? "text-green-400 border-green-400/30 bg-green-400/10"
                                                    : "text-amber-400 border-amber-400/30 bg-amber-400/10"
                                                }`}>
                                                {reg.verified ? "Verified" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedReg(reg)}
                                                    className="p-1.5 rounded-lg hover:bg-neon-cyan/10 transition-colors cursor-pointer"
                                                    title="View details"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-500 hover:text-neon-cyan" />
                                                </button>
                                                <button
                                                    onClick={() => toggleVerify(reg.id)}
                                                    className="p-1.5 rounded-lg hover:bg-green-400/10 transition-colors cursor-pointer"
                                                    title={reg.verified ? "Unverify" : "Verify"}
                                                >
                                                    <CheckCircle className={`w-4 h-4 ${reg.verified ? "text-green-400" : "text-gray-600 hover:text-green-400"}`} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-600 text-sm">No registrations found.</div>
                    )}
                </div>
            </div>

            {/* ═══ Detail Modal ═══ */}
            <AnimatePresence>
                {selectedReg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-deep-navy/90 backdrop-blur-md flex items-center justify-center px-6"
                        onClick={() => setSelectedReg(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel rounded-2xl p-8 max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-white font-mono tracking-wider mb-1">{selectedReg.teamName}</h3>
                            <p className="text-gray-500 text-xs mb-6">{selectedReg.id} · {selectedReg.event} · {selectedReg.college}</p>

                            <div className="space-y-4">
                                <div className="glass-panel rounded-xl p-4 border !border-neon-cyan/10">
                                    <p className="text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase mb-2">Team Leader</p>
                                    <p className="text-white text-sm font-bold">{selectedReg.leader.name}</p>
                                    <p className="text-gray-400 text-xs">{selectedReg.leader.phone} · {selectedReg.leader.email}</p>
                                    <p className="text-gray-500 text-xs">{selectedReg.leader.yearDept}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] text-gray-600 font-bold tracking-[0.15em] uppercase mb-2">Team Members</p>
                                    {selectedReg.members.map((m, i) => (
                                        <div key={i} className="glass-panel rounded-xl p-3 mb-2">
                                            <p className="text-white text-sm">{m.name}</p>
                                            <p className="text-gray-500 text-xs">{m.phone} · {m.email}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedReg(null)}
                                className="w-full mt-6 py-2.5 rounded-xl border border-white/10 text-gray-400 text-xs font-bold tracking-wider hover:border-neon-cyan/30 hover:text-neon-cyan transition-colors cursor-pointer"
                            >
                                CLOSE
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
