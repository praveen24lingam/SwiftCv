'use client'

import { useEffect, useRef } from 'react'
import { Syne } from 'next/font/google'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ChevronRight, Mail, Phone, Linkedin, Github, GraduationCap, Blocks, Briefcase } from 'lucide-react'

const syne = Syne({ subsets: ['latin'] })

export function ATSDemo() {
    const containerRef = useRef<HTMLDivElement>(null)
    const scoreRef = useRef<HTMLSpanElement>(null)
    const circleRef = useRef<SVGCircleElement>(null)
    const barsRef = useRef<HTMLDivElement>(null)
    const mockupRef = useRef<HTMLDivElement>(null)
    const scoreBadgeRef = useRef<HTMLDivElement>(null)

    const scoreData = { value: 0 } // For GSAP to tween

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            // Set up the main timeline for this section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                    once: true,
                }
            })

            // 1. Fade/slide in the mockup from the left
            tl.fromTo(mockupRef.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
            )

            // 2. Animate the circular score logic
            tl.to(scoreData, {
                value: 73,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    if (scoreRef.current) {
                        scoreRef.current.innerText = Math.round(scoreData.value).toString()
                    }

                    // Animate SVG stroke-dashoffset (circumference = 2 * Math.PI * 72 ≈ 452)
                    if (circleRef.current) {
                        const offset = 452 - (452 * scoreData.value) / 100
                        circleRef.current.style.strokeDashoffset = offset.toString()

                        // Color changing logic: red -> yellow -> green
                        let color = '#EF4444' // red
                        if (scoreData.value > 40) color = '#F59E0B' // yellow
                        if (scoreData.value > 70) color = '#84CC16' // yellow-green
                        if (scoreData.value > 90) color = '#22C55E' // green
                        circleRef.current.style.stroke = color
                    }

                    // Sync mockup score badge color text loosely
                    if (scoreBadgeRef.current) {
                        scoreBadgeRef.current.innerText = `ATS Score: ${Math.round(scoreData.value)}/100`
                    }
                }
            }, '-=0.4')

            // 3. Animate the horizontal progress bars sequentially
            if (barsRef.current) {
                const bars = barsRef.current.querySelectorAll('.progress-fill')
                tl.fromTo(bars,
                    { scaleX: 0 },
                    { scaleX: 1, duration: 1, stagger: 0.1, ease: 'power3.out', transformOrigin: 'left center' },
                    '-=1.5'
                )
            }

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            id="how-it-works"
            ref={containerRef}
            className="py-24 bg-[#0F172A] relative overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className={`${syne.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4`}>
                        See Your ATS Score in Action
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Watch how SwiftCV analyzes a real student resume
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

                    {/* LEFT: Fake Resume Card */}
                    <div className="w-full lg:w-[45%] flex justify-center lg:justify-end perspective-[1000px]">
                        <div
                            ref={mockupRef}
                            className="relative w-[340px] opacity-0"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="w-full h-[480px] bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden border border-slate-200 transform rotate-y-[5deg] rotate-x-[2deg]">

                                {/* ATS Badge Tooltip */}
                                <div
                                    ref={scoreBadgeRef}
                                    className="absolute -top-3 -right-3 z-20 bg-[#84CC16] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg"
                                >
                                    ATS Score: 0/100
                                </div>

                                {/* Resume Content (Smaller Scale) */}
                                <div className="p-5 pb-3 border-b border-slate-100 flex flex-col items-center">
                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Arjun Sharma</h3>
                                    <p className="text-blue-600 font-medium text-xs mt-1">Software Engineer Intern</p>

                                    <div className="flex gap-3 mt-3 text-slate-500">
                                        <Mail className="w-2.5 h-2.5" />
                                        <Phone className="w-2.5 h-2.5" />
                                        <Linkedin className="w-2.5 h-2.5" />
                                        <Github className="w-2.5 h-2.5" />
                                    </div>
                                </div>

                                <div className="p-5 pt-4 space-y-4">
                                    <div>
                                        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                                            <GraduationCap className="w-3 h-3 text-slate-400" />
                                            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Education</h4>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="font-bold text-slate-800 text-xs">B.Tech in Computer Science</h5>
                                                <p className="text-slate-500 text-[10px]">National Institute of Technology</p>
                                            </div>
                                            <span className="text-slate-400 text-[10px] font-medium">2020 - 2024</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                                            <Blocks className="w-3 h-3 text-slate-400" />
                                            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Skills</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['React', 'Next.js', 'PostgreSQL'].map(skill => (
                                                <span key={skill} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-semibold rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                                            <Briefcase className="w-3 h-3 text-slate-400" />
                                            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Projects</h4>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 text-xs">E-commerce Microservices</h5>
                                            <ul className="list-disc pl-3 mt-1 space-y-1">
                                                <li className="text-[9px] text-slate-500 bg-red-50 px-1 rounded inline-block mb-0.5">Built catalog service <span className="text-red-500 font-medium">(needs metric)</span></li>
                                                <li className="text-[9px] text-slate-500 leading-tight">Implemented JWT auth across microservices</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Scan-line effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent h-full w-full -translate-y-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none rounded-lg z-30"></div>
                        </div>
                    </div>

                    {/* RIGHT: ATS Score Panel */}
                    <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start max-w-md mx-auto lg:mx-0">

                        {/* Circular SVG Meter */}
                        <div className="relative w-[160px] h-[160px] mb-6 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                <circle
                                    ref={circleRef}
                                    cx="80"
                                    cy="80"
                                    r="72"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    className="transition-colors duration-300"
                                    style={{ strokeDasharray: 452, strokeDashoffset: 452 }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span ref={scoreRef} className={`${syne.className} text-4xl font-bold text-white leading-none`}>0</span>
                                <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-semibold">Score</span>
                            </div>
                        </div>

                        <div className="text-center lg:text-left w-full mb-8">
                            <h3 className="text-xl font-bold text-white mb-1">73/100 — Needs Improvement</h3>
                            <p className="text-slate-400 text-sm">Your resume is decent, but ATS systems will flag several missing elements.</p>
                        </div>

                        {/* Horizontal Progress Bars */}
                        <div ref={barsRef} className="w-full space-y-4 mb-8">
                            {[
                                { label: 'Format Score', value: 82, color: 'bg-emerald-500' },
                                { label: 'Content Score', value: 65, color: 'bg-yellow-400' },
                                { label: 'Keyword Score', value: 55, color: 'bg-orange-400' },
                                { label: 'Impact Score', value: 68, color: 'bg-yellow-400' },
                                { label: 'Completeness', value: 71, color: 'bg-[#84CC16]' },
                            ].map((bar, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs font-medium mb-1.5">
                                        <span className="text-slate-300">{bar.label}</span>
                                        <span className="text-slate-500">{bar.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${bar.color} rounded-full progress-fill origin-left`}
                                            style={{ width: `${bar.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Issues Panel */}
                        <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 space-y-3">
                            <div className="flex gap-3 text-sm text-slate-300 items-start">
                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <p>No quantified achievements found (e.g., "reduced latency by 40%").</p>
                            </div>
                            <div className="flex gap-3 text-sm text-slate-300 items-start">
                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <p>Missing GitHub URL in contact section.</p>
                            </div>
                            <div className="flex gap-3 text-sm text-slate-300 items-start">
                                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                <p>Weak action verbs detected: "Built", "Implemented". Try "Architected".</p>
                            </div>
                        </div>

                        <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 shadow-lg hover:shadow-blue-500/25 transition-all group">
                            <Link href="/build">
                                Fix These Issues
                                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>

                    </div>

                </div>
            </div>

            {/* Add keyframes for scanpass animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}} />
        </section>
    )
}
