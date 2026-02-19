"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
    {
        q: "What is the team size for CYKRYPT events?",
        a: "Each team can have 2 to 4 members, including the team leader. Solo participation is allowed for the Paper Presentation event.",
    },
    {
        q: "Is CYKRYPT conducted online or offline?",
        a: "CTF 2.0 is a hybrid event — online qualifiers followed by an offline grand finale. Cyber Forensics is offline only. Paper Presentation is offline at the campus.",
    },
    {
        q: "What is the registration fee?",
        a: "Registration details including fee structure will be communicated by the event organizer after your initial registration. Early registrations may receive special pricing.",
    },
    {
        q: "How will certificates be provided?",
        a: "All participants receive a digital certificate of participation. Winners receive a physical certificate along with prizes. Certificates are issued within 2 weeks post-event.",
    },
    {
        q: "Can students from any college participate?",
        a: "Yes! CYKRYPT is a national-level event open to students from any recognized college or university across India. International participants are also welcome.",
    },
    {
        q: "What tools or software are required?",
        a: "For CTF and Forensics events, participants should have a laptop with Kali Linux or equivalent tools installed. Detailed tool requirements will be shared after registration.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    return (
        <section id="faq" className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#060d20] to-deep-navy" />

            <div className="relative z-10 max-w-3xl mx-auto px-6">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <div className="flex items-center justify-center gap-2 text-neon-cyan/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
                        <HelpCircle className="w-3.5 h-3.5" /> Common Questions
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-mono tracking-wider mb-4">
                        FREQUENTLY <span className="text-neon-cyan">ASKED</span>
                    </h2>
                </motion.div>

                {/* Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel rounded-xl overflow-hidden hover:border-neon-cyan/20 transition-colors"
                        >
                            <button
                                onClick={() => toggle(i)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className={`text-sm font-bold tracking-wide transition-colors ${openIndex === i ? "text-neon-cyan" : "text-white"}`}>
                                    {faq.q}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 ml-4"
                                >
                                    <ChevronDown className={`w-4 h-4 transition-colors ${openIndex === i ? "text-neon-cyan" : "text-gray-600"}`} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 border-t border-white/5 pt-4">
                                            <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
