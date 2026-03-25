'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Syne } from 'next/font/google'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle2, FileText, Blocks, Briefcase, GraduationCap, Github, Linkedin, Mail, Phone, ChevronRight } from 'lucide-react'

const syne = Syne({ subsets: ['latin'] })

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const badgeRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)
    const trustRef = useRef<HTMLDivElement>(null)
    const mockupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // GSAP animations on mount
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

            // Badge fades in at 0s
            tl.fromTo(badgeRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 0)

            // Headline words stagger in one by one (0.08s delay each)
            if (headlineRef.current) {
                const words = headlineRef.current.querySelectorAll('.word')
                tl.fromTo(words, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.2)
            }

            // Subheading fades up at 0.6s
            tl.fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6)

            // Buttons slide up at 0.9s
            tl.fromTo(buttonsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.9)

            // Trust bar fades in at 1.1s
            tl.fromTo(trustRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 1.1)

            // Resume card slides in from right at 0.4s with spring
            tl.fromTo(mockupRef.current, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 1.2, ease: 'back.out(1.2)' }, 0.4)
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={containerRef}
            className="relative min-h-[100vh] flex items-center pt-24 pb-12 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0F172A] via-[#0A0A0F] to-[#0A0A0F]"
        >
            {/* CSS Dot Grid Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA3KSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

                {/* LEFT SIDE: Content */}
                <div className="w-full lg:w-[60%] flex flex-col items-start text-left">

                    <div
                        ref={badgeRef}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)] opacity-0"
                    >
                        <span>🇮🇳</span> Built for Indian Students & Freshers
                    </div>

                    <h1
                        ref={headlineRef}
                        className={`${syne.className} text-[40px] leading-[1.1] md:text-[56px] lg:text-[68px] font-bold text-white mb-6 tracking-tight max-w-[800px]`}
                    >
                        {/* Split text into words for stagger animation */}
                        <span className="block overflow-hidden pb-2">
                            {"Build a Resume That".split(' ').map((word, i) => (
                                <span key={i} className="word inline-block opacity-0 mr-3">{word}</span>
                            ))}
                        </span>
                        <span className="block overflow-hidden pb-2">
                            {"Actually Gets You".split(' ').map((word, i) => (
                                <span key={`blue-${i}`} className="word inline-block opacity-0 text-blue-500 mr-3">{word}</span>
                            ))}
                        </span>
                        <span className="block overflow-hidden">
                            <span className="word inline-block opacity-0 relative">
                                Shortlisted
                                {/* Underline swoosh effect */}
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-500 opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0 10 Q 50 20 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </span>
                    </h1>

                    <p
                        ref={subRef}
                        className="text-lg md:text-xl text-slate-400 max-w-[480px] mb-10 leading-relaxed opacity-0"
                    >
                        Free ATS-optimized resume builder for students & freshers. Know your ATS score, match any job description, and land more interviews.
                    </p>

                    <div
                        ref={buttonsRef}
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12 opacity-0"
                    >
                        <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-14 px-8 text-base font-medium shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all hover:scale-105">
                            <Link href="/build">
                                Build My Resume Free
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white/20 hover:bg-white/5 text-white rounded-xl h-14 px-8 text-base font-medium transition-all">
                            <Link href="#how-it-works">
                                See How It Works
                            </Link>
                        </Button>
                    </div>

                    <div
                        ref={trustRef}
                        className="flex flex-wrap items-center gap-y-2 text-sm text-slate-500 font-medium opacity-0"
                    >
                        <div className="flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free</div>
                        <span className="mx-3 opacity-30 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Credit Card</div>
                        <span className="mx-3 opacity-30 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ATS Guaranteed</div>
                        <span className="mx-3 opacity-30 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF Download</div>
                    </div>

                </div>

                {/* RIGHT SIDE: Floating Mockup */}
                <div className="hidden lg:flex w-[40%] justify-end relative perspective-[1000px]">
                    <div ref={mockupRef} className="relative z-10 w-[380px] opacity-0" style={{ transformStyle: 'preserve-3d' }}>

                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-[520px] bg-white rounded-lg shadow-2xl relative overflow-hidden border border-slate-200 transform rotate-y-[-5deg] rotate-x-[5deg] rotate-z-[2deg]"
                        >
                            {/* ATS Badge Tooltip */}
                            <div className="absolute -top-3 -right-3 z-20 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                ATS Score: 87/100
                            </div>

                            {/* Resume Header */}
                            <div className="p-6 pb-4 border-b border-slate-100 flex flex-col items-center">
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Arjun Sharma</h3>
                                <p className="text-blue-600 font-medium text-sm mt-1">Software Engineer Intern</p>

                                {/* Contact Icons */}
                                <div className="flex gap-4 mt-3 text-slate-500">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100"><Mail className="w-3 h-3" /></div>
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100"><Phone className="w-3 h-3" /></div>
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100"><Linkedin className="w-3 h-3" /></div>
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100"><Github className="w-3 h-3" /></div>
                                </div>
                            </div>

                            {/* Resume Body */}
                            <div className="p-6 pt-4 space-y-6">

                                {/* Education */}
                                <div>
                                    <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
                                        <GraduationCap className="w-4 h-4 text-slate-400" />
                                        <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Education</h4>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-bold text-slate-800 text-sm">B.Tech in Computer Science</h5>
                                            <p className="text-slate-500 text-xs">National Institute of Technology</p>
                                        </div>
                                        <span className="text-slate-400 text-xs font-medium">2020 - 2024</span>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
                                        <Blocks className="w-4 h-4 text-slate-400" />
                                        <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Skills</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python'].map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Projects */}
                                <div>
                                    <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Projects</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-bold text-slate-800 text-sm">E-commerce Microservices</h5>
                                                <span className="text-slate-400 text-[10px]">React, Node, Docker</span>
                                            </div>
                                            <ul className="list-disc pl-3 mt-1 space-y-1">
                                                <li className="text-[10px] text-slate-500 leading-tight">Built scalable catalog service reducing latency by 40%</li>
                                                <li className="text-[10px] text-slate-500 leading-tight">Implemented JWT auth across 3 separate microservices</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>

                        {/* Glowing backdrop shadow */}
                        <div className="absolute -inset-4 bg-blue-500/20 rounded-xl blur-3xl -z-10 animate-pulse"></div>
                    </div>
                </div>

            </div>
        </section>
    )
}
