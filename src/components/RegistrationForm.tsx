"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2, Send } from "lucide-react";

interface FormData {
    name: string;
    department: string;
    event: string;
    phone: string;
}

const INITIAL_DATA: FormData = {
    name: "",
    department: "",
    event: "CYKRYPT-2026",
    phone: "",
};

const STEPS = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Event Details" },
    { id: 3, title: "Confirm" },
];

export default function RegistrationForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const updateField = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const sendToTelegram = async (data: FormData) => {
        const token = "8294839950:AAFwqdTpOZQREyME9ZYonPW-Kwaas3ajTqc";
        const chatId = "5932177382";

        // Formatting the message
        const text = `
🔐 *CYKRYPT-2026 Registration*
👤 Name: ${data.name}
🏫 Dept: ${data.department}
🎯 Event: ${data.event}
📱 Phone: ${data.phone}
    `;

        try {
            const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: "Markdown",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }
            return true;
        } catch (error) {
            console.error("Telegram Error:", error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const success = await sendToTelegram(formData);

        setIsSubmitting(false);
        if (success) {
            setIsSuccess(true);
        } else {
            alert("Something went wrong. Please try again.");
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-md mx-auto bg-zinc-900 border border-green-500/30 p-8 rounded-2xl text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Check className="w-10 h-10 text-black" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
                <p className="text-zinc-400">Thank you for registering for CYKRYPT-2026. We've sent your details to the admins.</p>
                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setStep(1);
                        setFormData(INITIAL_DATA);
                    }}
                    className="mt-8 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors"
                >
                    Register Another
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-8 relative">
                <div className="flex justify-between items-center mb-4">
                    {STEPS.map((s) => (
                        <div key={s.id} className="flex flex-col items-center z-10">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s.id ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-zinc-800 text-zinc-500"
                                    }`}
                            >
                                {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${step >= s.id ? "text-cyan-400" : "text-zinc-600"}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 w-full h-1 bg-zinc-800 -z-0" />
                {/* Active Progress Bar */}
                <motion.div
                    className="absolute top-5 left-0 h-1 bg-cyan-500 -z-0"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 rounded-2xl shadow-xl relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Department</label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => updateField("department", e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                        placeholder="e.g. Computer Science"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!formData.name || !formData.department}
                                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next Step <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Select Event</label>
                                    <select
                                        value={formData.event}
                                        onChange={(e) => updateField("event", e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value="CYKRYPT-2026">CYKRYPT-2026 (All Access)</option>
                                        <option value="CTF Only">CTF Only</option>
                                        <option value="Paper Presentation">Paper Presentation Only</option>
                                    </select>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!formData.phone}
                                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Review <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">Confirm Registration</h2>

                                <div className="bg-zinc-800/50 p-6 rounded-xl space-y-4">
                                    <div className="flex justify-between border-b border-zinc-700 pb-2">
                                        <span className="text-zinc-400">Name</span>
                                        <span className="text-white font-medium">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-700 pb-2">
                                        <span className="text-zinc-400">Department</span>
                                        <span className="text-white font-medium">{formData.department}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-700 pb-2">
                                        <span className="text-zinc-400">Phone</span>
                                        <span className="text-white font-medium">{formData.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Event</span>
                                        <span className="text-cyan-400 font-bold">{formData.event}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-70 disabled:cursor-wait"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                                        {isSubmitting ? "Processing..." : "Submit Registration"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}
