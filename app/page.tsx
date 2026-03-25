import dynamic from 'next/dynamic';
import { Features } from "@/components/landing/Features";

const Hero = dynamic(() => import('@/components/landing/Hero').then(mod => mod.Hero), { ssr: true });
const ATSDemo = dynamic(() => import('@/components/landing/ATSDemo').then(mod => mod.ATSDemo), { ssr: false });
import { Stats } from "@/components/landing/Stats";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ATS Resume Builder for Indian Students & Freshers",
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <ATSDemo />
      <Features />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
