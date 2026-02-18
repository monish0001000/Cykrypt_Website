"use client";

import { useState } from "react";
import CykryptHero from "@/components/CykryptHero";
import Header from "@/components/Header";
import EventsPage from "@/components/EventsModal";
import RegistrationPage from "@/components/RegistrationModal";
import AboutPage from "@/components/AboutModal";
import CountdownSection from "@/components/CountdownSection";
import WhyParticipate from "@/components/WhyParticipate";
import GallerySection from "@/components/GallerySection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import MatrixRain from "@/components/MatrixRain";
import CyberParticles from "@/components/CyberParticles";
import LoadingScreen from "@/components/FakeTerminal";

export default function Home() {
  const [modalState, setModalState] = useState<{
    type: "events2025" | "events2026" | "registration" | "about" | null;
  }>({ type: null });

  const closeModal = () => setModalState({ type: null });

  return (
    <>
      {/* Loading overlay (2s) + Offline screen */}
      <LoadingScreen />

      <main className="bg-deep-navy text-white relative">
        {/* Background effects */}
        <MatrixRain />
        <CyberParticles />

        {/* Fixed header */}
        <Header
          onOpenEvents2025={() => setModalState({ type: "events2025" })}
          onOpenEvents2026={() => setModalState({ type: "events2026" })}
          onOpenRegistration={() => setModalState({ type: "registration" })}
          onOpenAbout={() => setModalState({ type: "about" })}
        />

        {/* Hero — full viewport image */}
        <CykryptHero
          onExplore={() => setModalState({ type: "events2026" })}
          onRegister={() => setModalState({ type: "registration" })}
        />

        {/* Scrollable sections */}
        <div className="relative z-[2]">
          <CountdownSection onRegister={() => setModalState({ type: "registration" })} />
          <WhyParticipate />
          <GallerySection />
          <FAQSection />
          <ContactSection />
        </div>

        {/* Full-page overlays */}
        <EventsPage
          isOpen={modalState.type === "events2025" || modalState.type === "events2026"}
          onClose={closeModal}
          initialYear={modalState.type === "events2025" ? "2025" : "2026"}
        />
        <RegistrationPage
          isOpen={modalState.type === "registration"}
          onClose={closeModal}
        />
        <AboutPage
          isOpen={modalState.type === "about"}
          onClose={closeModal}
        />
      </main>
    </>
  );
}
