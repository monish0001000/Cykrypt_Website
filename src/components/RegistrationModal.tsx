"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, AlertCircle,
    Plus, Trash2, UserCircle, Users, Shield, Sparkles, Phone, Mail, Clock, Loader2, AlertTriangle
} from "lucide-react";
import ThreatScan from "./ThreatScan";
import {
    sanitize,
    validateStep1, validateStep2, validateStep3,
    validateName, validatePhone, validateEmail,
    isTimingSuspicious, MAX_SESSION_SUBMISSIONS,
    type StepErrors, type StepWarnings,
} from "@/lib/validation";

interface RegistrationPageProps {
    isOpen: boolean;
    onClose: () => void;
}

type Member = { name: string; phone: string; email: string };

// ─── Inline Error Component ───
function FieldError({ error }: { error?: string }) {
    if (!error) return null;
    return (
        <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="field-error-text"
        >
            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            {error}
        </motion.p>
    );
}

function FieldWarning({ warning }: { warning?: string }) {
    if (!warning) return null;
    return (
        <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="field-warning-text"
        >
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            {warning}
        </motion.p>
    );
}

/** Returns the CSS class for an input field based on its validation state */
function inputState(field: string, errors: StepErrors, touched: Set<string>): string {
    if (!touched.has(field)) return "hud-input";
    if (errors[field]) return "hud-input hud-input-error";
    return "hud-input hud-input-valid";
}

export default function RegistrationPage({ isOpen, onClose }: RegistrationPageProps) {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [showScan, setShowScan] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Validation state
    const [errors, setErrors] = useState<StepErrors>({});
    const [warnings, setWarnings] = useState<StepWarnings>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());

    // Anti-bot
    const formOpenedAt = useRef(Date.now());
    const honeypotRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && !scanComplete) {
            setShowScan(true);
            formOpenedAt.current = Date.now();
        }
        if (!isOpen) {
            setScanComplete(false);
            setShowScan(false);
        }
    }, [isOpen, scanComplete]);

    const handleScanComplete = useCallback(() => {
        setShowScan(false);
        setScanComplete(true);
    }, []);

    const [teamName, setTeamName] = useState("");
    const [event, setEvent] = useState("CTF 2.0 (Hybrid)");
    const [college, setCollege] = useState("");
    const [ctfMode, setCtfMode] = useState("Online");

    const [leader, setLeader] = useState({ name: "", phone: "", email: "", yearDept: "" });
    // Start with 2 members (minimum required)
    const [members, setMembers] = useState<Member[]>([
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" },
    ]);

    const addMember = () => {
        if (members.length < 3) setMembers([...members, { name: "", phone: "", email: "" }]);
    };
    const removeMember = (i: number) => {
        // Enforce minimum of 2 members
        if (members.length > 2) setMembers(members.filter((_, idx) => idx !== i));
    };
    const updateMember = (i: number, field: keyof Member, val: string) => {
        const m = [...members]; m[i][field] = val; setMembers(m);
    };

    // Mark a field as touched on blur
    const touch = (field: string) => {
        setTouched(prev => new Set(prev).add(field));
    };

    // Auto-trim on blur
    const trimAndSet = (setter: (v: string) => void, field: string) => (e: React.FocusEvent<HTMLInputElement>) => {
        setter(sanitize(e.target.value));
        touch(field);
    };

    // ─── Step Validation ───
    const validateCurrentStep = (): boolean => {
        let result;
        if (step === 1) {
            result = validateStep1(teamName, college);
            // Mark all step 1 fields as touched
            setTouched(prev => {
                const n = new Set(prev);
                n.add("teamName"); n.add("college");
                return n;
            });
        } else if (step === 2) {
            result = validateStep2(leader);
            setTouched(prev => {
                const n = new Set(prev);
                n.add("leaderName"); n.add("leaderPhone"); n.add("leaderEmail"); n.add("leaderYearDept");
                return n;
            });
        } else {
            result = validateStep3(members);
            setTouched(prev => {
                const n = new Set(prev);
                members.forEach((_, i) => {
                    n.add(`member${i}_name`); n.add(`member${i}_phone`); n.add(`member${i}_email`);
                });
                return n;
            });
        }
        setErrors(result.errors);
        setWarnings(result.warnings);
        return result.valid;
    };

    // Live validation on field changes (only for touched fields)
    useEffect(() => {
        if (step === 1 && touched.size > 0) {
            const result = validateStep1(teamName, college);
            setErrors(prev => {
                const next: StepErrors = {};
                for (const key of Object.keys(result.errors)) {
                    if (touched.has(key)) next[key] = result.errors[key];
                }
                return next;
            });
        }
    }, [teamName, college, step, touched]);

    useEffect(() => {
        if (step === 2 && touched.size > 0) {
            const result = validateStep2(leader);
            setErrors(prev => {
                const next: StepErrors = {};
                for (const key of Object.keys(result.errors)) {
                    if (touched.has(key)) next[key] = result.errors[key];
                }
                return next;
            });
            setWarnings(result.warnings);
        }
    }, [leader, step, touched]);

    useEffect(() => {
        if (step === 3 && touched.size > 0) {
            const result = validateStep3(members);
            setErrors(prev => {
                const next: StepErrors = {};
                for (const key of Object.keys(result.errors)) {
                    if (touched.has(key)) next[key] = result.errors[key];
                }
                return next;
            });
            setWarnings(result.warnings);
        }
    }, [members, step, touched]);

    const handleNext = () => {
        if (validateCurrentStep() && step < 3) {
            setStep(step + 1);
            setErrors({});
            setWarnings({});
            setTouched(new Set());
        }
    };
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setErrors({});
            setWarnings({});
            setTouched(new Set());
        }
    };

    const resetForm = () => {
        setStep(1); setStatus("idle"); setErrorMessage("");
        setTeamName(""); setEvent("CTF 2.0 (Hybrid)"); setCollege(""); setCtfMode("Online");
        setLeader({ name: "", phone: "", email: "", yearDept: "" });
        setMembers([{ name: "", phone: "", email: "" }, { name: "", phone: "", email: "" }]);
        setErrors({}); setWarnings({}); setTouched(new Set());
        formOpenedAt.current = Date.now();
    };

    const handleSubmit = async () => {
        // Final step validation
        if (!validateCurrentStep()) return;

        // Anti-bot: honeypot
        if (honeypotRef.current && honeypotRef.current.value) {
            // Bot detected — silently show success to not reveal detection
            setStatus("success");
            return;
        }

        // Anti-bot: timing
        if (isTimingSuspicious(formOpenedAt.current)) {
            setStatus("error");
            setErrorMessage("Submission too fast. Please take your time filling the form.");
            return;
        }

        // Session rate limit
        const sessionKey = "cybershield_reg_count";
        const count = parseInt(sessionStorage.getItem(sessionKey) || "0", 10);
        if (count >= MAX_SESSION_SUBMISSIONS) {
            setStatus("error");
            setErrorMessage("Maximum registration attempts reached. Please try again later.");
            return;
        }

        setStatus("submitting");
        setErrorMessage("");

        try {
            // Sanitize all inputs before sending
            const sanitizedLeader = {
                name: sanitize(leader.name),
                phone: sanitize(leader.phone),
                email: sanitize(leader.email),
                yearDept: sanitize(leader.yearDept),
            };
            const sanitizedMembers = members.map(m => ({
                name: sanitize(m.name),
                phone: sanitize(m.phone),
                email: sanitize(m.email),
            }));

            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamName: sanitize(teamName),
                    event,
                    college: sanitize(college),
                    ctfMode: event.includes("CTF") ? ctfMode : "N/A",
                    leader: sanitizedLeader,
                    members: sanitizedMembers,
                    _hp: honeypotRef.current?.value || "",
                    _ts: formOpenedAt.current,
                }),
            });

            if (res.ok) {
                setStatus("success");
                sessionStorage.setItem(sessionKey, String(count + 1));
            } else {
                const data = await res.json().catch(() => ({}));
                setStatus("error");
                setErrorMessage(data.error || "Submission failed. Please check your connection and try again.");
                // If there are field-level errors from server
                if (data.fieldErrors) {
                    setErrors(data.fieldErrors);
                }
            }
        } catch {
            setStatus("error");
            setErrorMessage("Network error. Please check your connection and try again.");
        }
    };

    const steps = [
        { num: 1, label: "Team Configuration", icon: <Shield className="w-3.5 h-3.5" /> },
        { num: 2, label: "Team Leader", icon: <UserCircle className="w-3.5 h-3.5" /> },
        { num: 3, label: "Team Members", icon: <Users className="w-3.5 h-3.5" /> },
    ];

    return (
        <>
            {showScan && <ThreatScan onComplete={handleScanComplete} />}
            <AnimatePresence>
                {isOpen && scanComplete && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className="fixed inset-0 z-50 bg-deep-navy overflow-hidden flex flex-col"
                    >
                        {/* ─── Top Bar ─── */}
                        <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 backdrop-blur-md bg-deep-navy/80 z-10">
                            <button onClick={() => { onClose(); resetForm(); }}
                                className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-bold tracking-[0.15em] uppercase">Back</span>
                            </button>
                            <h1 className="text-lg md:text-xl font-bold text-white tracking-[0.2em] font-mono flex items-center gap-3">
                                <Shield className="text-neon-cyan w-5 h-5" />
                                CYKRYPT <span className="text-neon-cyan">REGISTRATION</span>
                            </h1>
                            <div className="w-20" />
                        </div>

                        {/* ─── Content ─── */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="max-w-2xl mx-auto p-6 md:p-10">

                                {/* ═══ SUCCESS OVERLAY ═══ */}
                                <AnimatePresence>
                                    {status === "success" && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-[60] flex items-center justify-center bg-deep-navy/95 backdrop-blur-xl"
                                        >
                                            {/* Radiating rings */}
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0.5 }}
                                                animate={{ scale: 4, opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                                className="absolute w-32 h-32 rounded-full border border-neon-cyan/30"
                                            />
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0.3 }}
                                                animate={{ scale: 3, opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                                                className="absolute w-32 h-32 rounded-full border border-green-400/20"
                                            />

                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", damping: 15, stiffness: 150, delay: 0.15 }}
                                                className="relative z-10 flex flex-col items-center text-center max-w-lg px-8"
                                            >
                                                {/* Animated Checkmark Circle */}
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.3 }}
                                                    className="relative mb-8"
                                                >
                                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.4)]">
                                                        <CheckCircle className="w-12 h-12 text-white" />
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                        className="absolute -inset-3 rounded-full border border-dashed border-green-400/30"
                                                    />
                                                </motion.div>

                                                {/* Sparkle icon */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.6 }}
                                                    className="flex items-center gap-2 mb-4"
                                                >
                                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-green-400/80">Registration Confirmed</span>
                                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                                </motion.div>

                                                <motion.h2
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.7 }}
                                                    className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono tracking-wider"
                                                >
                                                    Registration <span className="text-green-400">Successful!</span>
                                                </motion.h2>

                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.85 }}
                                                    className="space-y-4 mb-8"
                                                >
                                                    <p className="text-gray-300 text-sm leading-relaxed">
                                                        Your registration for <strong className="text-neon-cyan font-mono">CYKRYPT 2026</strong> has been completed successfully.
                                                        Your team details have been securely transmitted to our systems.
                                                    </p>
                                                    <div className="glass-panel rounded-xl p-5 border border-white/5">
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-shrink-0 mt-0.5">
                                                                <Clock className="w-4 h-4 text-amber-400" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-white text-sm font-semibold mb-1">What happens next?</p>
                                                                <p className="text-gray-400 text-xs leading-relaxed">
                                                                    Our event organizer will reach out to you shortly via <strong className="text-gray-300">phone call</strong> or <strong className="text-gray-300">official communication channels</strong> to confirm your participation and share further instructions.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-4 text-[10px] text-gray-600 tracking-[0.15em] uppercase">
                                                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> Expect a call</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> or an email</span>
                                                    </div>
                                                </motion.div>

                                                <motion.button
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 1 }}
                                                    onClick={() => { onClose(); resetForm(); }}
                                                    className="px-8 py-3 bg-neon-cyan/10 text-neon-cyan font-bold rounded-xl border border-neon-cyan/20 hover:bg-neon-cyan/20 hover:border-neon-cyan/40 transition-all text-xs tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.1)]"
                                                >
                                                    CLOSE &amp; RETURN
                                                </motion.button>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* ═══ REGISTRATION HEADER BANNER ═══ */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden text-center"
                                >
                                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
                                    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-neon-cyan/20" />
                                    <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-neon-cyan/20" />
                                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-neon-cyan/20" />
                                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-neon-cyan/20" />

                                    <motion.div
                                        animate={{ rotateY: [0, 360] }}
                                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 10, ease: "easeInOut" }}
                                        className="inline-block mb-3"
                                    >
                                        <Shield className="w-10 h-10 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.35)]" />
                                    </motion.div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white font-mono tracking-[0.15em] mb-2">
                                        CYKRYPT <span className="text-neon-cyan">2026</span>
                                    </h2>
                                    <p className="text-gray-500 text-xs tracking-wider max-w-sm mx-auto">
                                        Register your team for the premier national-level cybersecurity competition. Complete all three steps to finalize your entry.
                                    </p>
                                    {/* Security badge */}
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/15">
                                            <Shield className="w-3 h-3 text-green-400" />
                                            <span className="text-[9px] font-bold tracking-[0.15em] text-green-400/70 uppercase">Secured & Validated</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ═══ Step Indicators ═══ */}
                                <div className="flex items-center justify-center gap-2 mb-10">
                                    {steps.map((s, i) => (
                                        <div key={s.num} className="flex items-center gap-2">
                                            <motion.div
                                                animate={step >= s.num ? { boxShadow: "0 0 12px rgba(0,240,255,0.2)" } : { boxShadow: "none" }}
                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold tracking-wider border transition-all cursor-default ${step >= s.num
                                                    ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan"
                                                    : "border-white/5 text-gray-600"
                                                    }`}>
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step > s.num
                                                    ? "bg-neon-cyan text-deep-navy"
                                                    : step === s.num
                                                        ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50"
                                                        : "bg-white/5 text-gray-600"
                                                    }`}>
                                                    {step > s.num ? <CheckCircle className="w-3 h-3" /> : s.num}
                                                </span>
                                                <span className="hidden sm:inline">{s.label}</span>
                                            </motion.div>
                                            {i < 2 && (
                                                <div className="relative w-10 h-px">
                                                    <div className="absolute inset-0 bg-white/5" />
                                                    <motion.div
                                                        className="absolute inset-y-0 left-0 bg-neon-cyan/50"
                                                        animate={{ width: step > s.num ? "100%" : "0%" }}
                                                        transition={{ duration: 0.4 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* ═══ Form Container ═══ */}
                                <div className="glass-panel rounded-2xl p-8 md:p-10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

                                    {/* Progress bar */}
                                    <div className="absolute top-0 left-0 w-full h-0.5 bg-white/5">
                                        <motion.div className="h-full bg-gradient-to-r from-neon-cyan to-blue-500 shadow-[0_0_8px_rgba(0,240,255,0.5)]" animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.4 }} />
                                    </div>

                                    {/* Honeypot — hidden from humans, bots fill it */}
                                    <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                                        <input
                                            type="text"
                                            name="website_url"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            ref={honeypotRef}
                                        />
                                    </div>

                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <AnimatePresence mode="wait">
                                            {/* ─── STEP 1: Team Configuration ─── */}
                                            {step === 1 && (
                                                <motion.div key="s1" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-7">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-white tracking-wider font-mono">
                                                            TEAM <span className="text-neon-cyan">CONFIGURATION</span>
                                                        </h2>
                                                        <p className="text-gray-500 text-xs tracking-wider mt-1">Set up your team identity and select your event</p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">Team Name</label>
                                                        <input type="text" required value={teamName} onChange={e => setTeamName(e.target.value)}
                                                            onBlur={trimAndSet(setTeamName, "teamName")}
                                                            className={inputState("teamName", errors, touched)} placeholder="Enter your team name" />
                                                        <FieldError error={errors.teamName} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">Event Category</label>
                                                        <select value={event} onChange={e => setEvent(e.target.value)} className="hud-select">
                                                            <option>CTF 2.0 (Hybrid)</option>
                                                            <option>Cyber Forensics</option>
                                                            <option>Paper Presentation</option>
                                                        </select>
                                                    </div>
                                                    {event.includes("CTF") && (
                                                        <div>
                                                            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">Participation Mode</label>
                                                            <div className="flex gap-3">
                                                                {["Online", "Offline"].map(mode => (
                                                                    <button key={mode} type="button" onClick={() => setCtfMode(mode)}
                                                                        className={`flex-1 py-2.5 text-xs font-bold tracking-wider rounded-lg border transition-all ${ctfMode === mode
                                                                            ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.15)]"
                                                                            : "border-white/5 text-gray-600 hover:text-gray-400"
                                                                            }`}>
                                                                        {mode}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">College / Institution</label>
                                                        <input type="text" required value={college} onChange={e => setCollege(e.target.value)}
                                                            onBlur={trimAndSet(setCollege, "college")}
                                                            className={inputState("college", errors, touched)} placeholder="Enter your college name" />
                                                        <FieldError error={errors.college} />
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* ─── STEP 2: Team Leader ─── */}
                                            {step === 2 && (
                                                <motion.div key="s2" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-7">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-white tracking-wider font-mono">
                                                            TEAM <span className="text-neon-cyan">LEADER</span>
                                                        </h2>
                                                        <p className="text-gray-500 text-xs tracking-wider mt-1">Provide the team leader&apos;s contact details</p>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">Full Name</label>
                                                            <input type="text" required value={leader.name}
                                                                onChange={e => setLeader({ ...leader, name: e.target.value })}
                                                                onBlur={(e) => { setLeader({ ...leader, name: sanitize(e.target.value) }); touch("leaderName"); }}
                                                                className={inputState("leaderName", errors, touched)} placeholder="Team leader's full name" />
                                                            <FieldError error={errors.leaderName} />
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                            <div>
                                                                <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">Phone Number</label>
                                                                <input type="tel" required value={leader.phone}
                                                                    onChange={e => setLeader({ ...leader, phone: e.target.value })}
                                                                    onBlur={(e) => { setLeader({ ...leader, phone: e.target.value.trim() }); touch("leaderPhone"); }}
                                                                    className={inputState("leaderPhone", errors, touched)} placeholder="10-digit phone number" />
                                                                <FieldError error={errors.leaderPhone} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">Year / Department</label>
                                                                <input type="text" required value={leader.yearDept}
                                                                    onChange={e => setLeader({ ...leader, yearDept: e.target.value })}
                                                                    onBlur={(e) => { setLeader({ ...leader, yearDept: sanitize(e.target.value) }); touch("leaderYearDept"); }}
                                                                    className={inputState("leaderYearDept", errors, touched)} placeholder="III / CSE-CS" />
                                                                <FieldError error={errors.leaderYearDept} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">Email Address</label>
                                                            <input type="email" required value={leader.email}
                                                                onChange={e => setLeader({ ...leader, email: e.target.value })}
                                                                onBlur={(e) => { setLeader({ ...leader, email: e.target.value.trim().toLowerCase() }); touch("leaderEmail"); }}
                                                                className={inputState("leaderEmail", errors, touched)} placeholder="leader@college.edu.in" />
                                                            <FieldError error={errors.leaderEmail} />
                                                            <FieldWarning warning={warnings.leaderEmail} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* ─── STEP 3: Team Members ─── */}
                                            {step === 3 && (
                                                <motion.div key="s3" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-6">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-white tracking-wider font-mono">
                                                            TEAM <span className="text-neon-cyan">MEMBERS</span>
                                                        </h2>
                                                        <p className="text-gray-500 text-xs tracking-wider mt-1">
                                                            Add 2–3 members to your team <span className="text-red-400/70">(minimum 2 required)</span>
                                                        </p>
                                                    </div>

                                                    {errors._members && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                                            className="glass-panel rounded-xl p-3 border border-red-500/20 bg-red-500/5"
                                                        >
                                                            <p className="text-red-400 text-xs flex items-center gap-2">
                                                                <AlertCircle className="w-3.5 h-3.5" /> {errors._members}
                                                            </p>
                                                        </motion.div>
                                                    )}

                                                    <div className="space-y-5">
                                                        {members.map((m, i) => (
                                                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                                className="relative glass-panel rounded-xl p-5 space-y-4 hover:border-neon-cyan/15 transition-all">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-neon-cyan text-[10px] font-bold tracking-[0.15em] uppercase flex items-center gap-1.5">
                                                                        <UserCircle className="w-3.5 h-3.5" />
                                                                        Member {i + 1}
                                                                        {i < 2 && <span className="text-red-400/60 ml-1">(required)</span>}
                                                                    </span>
                                                                    {/* Only allow removing if more than 2 members */}
                                                                    {members.length > 2 && (
                                                                        <button type="button" onClick={() => removeMember(i)}
                                                                            className="text-red-400/50 hover:text-red-400 transition-colors">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <input type="text" required value={m.name}
                                                                        onChange={e => updateMember(i, "name", e.target.value)}
                                                                        onBlur={(e) => { updateMember(i, "name", sanitize(e.target.value)); touch(`member${i}_name`); }}
                                                                        className={inputState(`member${i}_name`, errors, touched)} placeholder="Member's full name" />
                                                                    <FieldError error={errors[`member${i}_name`]} />
                                                                </div>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <input type="tel" required value={m.phone}
                                                                            onChange={e => updateMember(i, "phone", e.target.value)}
                                                                            onBlur={() => touch(`member${i}_phone`)}
                                                                            className={inputState(`member${i}_phone`, errors, touched)} placeholder="Phone number" />
                                                                        <FieldError error={errors[`member${i}_phone`]} />
                                                                    </div>
                                                                    <div>
                                                                        <input type="email" required value={m.email}
                                                                            onChange={e => updateMember(i, "email", e.target.value)}
                                                                            onBlur={(e) => { updateMember(i, "email", e.target.value.trim().toLowerCase()); touch(`member${i}_email`); }}
                                                                            className={inputState(`member${i}_email`, errors, touched)} placeholder="Email address" />
                                                                        <FieldError error={errors[`member${i}_email`]} />
                                                                        <FieldWarning warning={warnings[`member${i}_email`]} />
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    {members.length < 3 && (
                                                        <button type="button" onClick={addMember}
                                                            className="w-full py-3 border border-dashed border-white/10 rounded-xl text-gray-500 hover:border-neon-cyan/30 hover:text-neon-cyan transition-all flex items-center justify-center gap-2 text-xs font-bold tracking-wider group">
                                                            <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" /> Add Team Member (Optional)
                                                        </button>
                                                    )}

                                                    {status === "error" && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="glass-panel rounded-xl p-4 border border-red-500/20 bg-red-500/5"
                                                        >
                                                            <div className="text-red-400 text-xs flex items-center gap-2">
                                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                                <span>{errorMessage || "Submission failed. Please check your connection and try again."}</span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* ═══ Navigation ═══ */}
                                        <div className="mt-10 flex gap-3">
                                            {step > 1 && status !== "success" && (
                                                <button type="button" onClick={handleBack}
                                                    className="ghost-btn flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-wider">
                                                    <ChevronLeft className="w-4 h-4" /> Previous Step
                                                </button>
                                            )}
                                            {status !== "success" && (
                                                <motion.button
                                                    type="button"
                                                    onClick={step < 3 ? handleNext : handleSubmit}
                                                    disabled={status === "submitting"}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`flex-1 py-3 font-bold rounded-xl border transition-all flex items-center justify-center gap-2 text-xs tracking-wider disabled:opacity-40 disabled:cursor-not-allowed ${step === 3
                                                        ? "bg-gradient-to-r from-green-500/15 to-emerald-500/15 text-green-400 border-green-500/25 hover:from-green-500/25 hover:to-emerald-500/25 hover:border-green-500/40 shadow-[0_0_15px_rgba(52,211,153,0.1)]"
                                                        : "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 hover:bg-neon-cyan/20 hover:border-neon-cyan/40 shadow-[0_0_12px_rgba(0,240,255,0.1)]"
                                                        }`}>
                                                    {status === "submitting" ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Submitting Registration...
                                                        </>
                                                    ) : step < 3 ? (
                                                        <>Continue <ChevronRight className="w-4 h-4" /></>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            Submit Registration
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="h-10" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
