"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Send, MapPin } from "lucide-react";

const contactInfo = [
    {
        icon: <Mail className="w-5 h-5" />,
        label: "Email",
        value: "cybershield@aec.edu.in",
        href: "mailto:cybershield@aec.edu.in",
    },
    {
        icon: <Phone className="w-5 h-5" />,
        label: "Phone",
        value: "+91 98765 43210",
        href: "tel:+919876543210",
    },
    {
        icon: <Send className="w-5 h-5" />,
        label: "Telegram",
        value: "@CyberShieldAEC",
        href: "https://t.me/CyberShieldAEC",
    },
    {
        icon: <MapPin className="w-5 h-5" />,
        label: "Location",
        value: "Arunai Engineering College, Tiruvannamalai",
        href: "https://maps.google.com/?q=Arunai+Engineering+College+Tiruvannamalai",
    },
];

export default function ContactSection() {
    return (
        <section id="contact" className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#060d20] to-deep-navy" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-neon-cyan/60 mb-3">Get In Touch</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-mono tracking-wider mb-4">
                        CONTACT <span className="text-neon-cyan">US</span>
                    </h2>
                </motion.div>

                {/* Split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left — Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-5"
                    >
                        {contactInfo.map((item, i) => (
                            <motion.a
                                key={i}
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="glass-panel rounded-xl p-5 flex items-center gap-4 hover:border-neon-cyan/30 transition-all group block"
                            >
                                <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan group-hover:bg-neon-cyan/20 transition-colors flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-gray-600 text-[10px] font-bold tracking-[0.15em] uppercase">{item.label}</p>
                                    <p className="text-white text-sm font-medium tracking-wide group-hover:text-neon-cyan transition-colors">{item.value}</p>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* Right — Google Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-panel rounded-2xl overflow-hidden relative"
                        style={{ minHeight: 360 }}
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/25 to-transparent z-10" />
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.6906!2d79.0674!3d12.2253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac1e0e7f2e05fb%3A0x2e291e5b53acf7a3!2sArunai%20Engineering%20College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(0.9)" }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Arunai Engineering College Location"
                            className="absolute inset-0 w-full h-full"
                        />
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-16 py-6 border-t border-white/5"
                >
                    <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase">
                        Department of CSE — Cybersecurity · Arunai Engineering College · Tiruvannamalai
                    </p>
                    <p className="text-gray-700 text-[9px] tracking-wider mt-2">
                        © {new Date().getFullYear()} CyberShield. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
