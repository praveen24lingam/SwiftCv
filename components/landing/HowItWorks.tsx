'use client'

import { useEffect, useRef } from 'react'
import { Syne } from 'next/font/google'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const syne = Syne({ subsets: ['latin'] })

const steps = [
    {
        icon: '🔐',
        title: 'Sign Up Free',
        desc: 'One click with Google. No forms, no friction.',
    },
    {
        icon: '🎨',
        title: 'Pick a Template',
        desc: 'Choose from 3 ATS-safe, student-optimized layouts.',
    },
    {
        icon: '✍️',
        title: 'Fill Your Resume',
        desc: 'Guided form with live tips and AI suggestions.',
    },
    {
        icon: '📊',
        title: 'Check ATS Score',
        desc: "See exactly what's wrong and how to fix it.",
    },
    {
        icon: '📥',
        title: 'Download & Apply',
        desc: 'Free PDF download. Start applying in minutes.',
    },
]

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<SVGPathElement>(null)
    const stepsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            // Line drawing animation
            if (lineRef.current) {
                const pathLength = lineRef.current.getTotalLength()
                lineRef.current.style.strokeDasharray = pathLength.toString()
                lineRef.current.style.strokeDashoffset = pathLength.toString()

                gsap.to(lineRef.current, {
                    strokeDashoffset: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                        end: 'bottom 80%',
                        scrub: 1, // Smooth scrub
                    }
                })
            }

            // Step cards fade in as you scroll
            if (stepsRef.current) {
                const cards = stepsRef.current.querySelectorAll('.step-card')
                cards.forEach((card, index) => {
                    gsap.fromTo(card,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                            }
                        }
                    )
                })
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
                <div className="text-center mb-20">
                    <h2 className={`${syne.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4`}>
                        From Zero to <span className="text-blue-500">Interview-Ready</span> in 10 Minutes
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto" ref={stepsRef}>

                    {/* Vertical Connecting Line (Desktop) */}
                    <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 overflow-hidden">
                        <svg className="w-full h-full" preserveAspectRatio="none" fill="none">
                            <path
                                ref={lineRef}
                                d="M 2 0 L 2 10000"
                                stroke="#3B82F6"
                                strokeWidth="4"
                                vectorEffect="non-scaling-stroke"
                                className="opacity-50"
                            />
                        </svg>
                        <div className="absolute inset-0 w-full h-full bg-slate-800/50 -z-10"></div>
                    </div>

                    <div className="space-y-12 md:space-y-0 relative">
                        {steps.map((step, idx) => {
                            const isEven = idx % 2 === 0

                            return (
                                <div key={idx} className={`relative flex items-center md:justify-between opacity-0 step-card ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} md:h-40`}>

                                    {/* Empty space for desktop alternating layout */}
                                    <div className="hidden md:block md:w-5/12"></div>

                                    {/* Center Circle */}
                                    <div className="absolute left-0 md:left-1/2 -ml-[20px] md:-ml[24px] w-10 md:w-12 h-10 md:h-12 rounded-full bg-blue-600 border-4 border-[#0F172A] flex items-center justify-center text-white font-bold text-lg z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)] transform md:-translate-x-1/2 mt-1 md:mt-0">
                                        {idx + 1}
                                    </div>

                                    {/* Content Card */}
                                    <div className="w-full md:w-5/12 pl-16 md:pl-0">
                                        <div className={`p-6 bg-[#0A0A0F] border border-white/5 rounded-2xl shadow-xl hover:border-white/10 transition-colors ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                            <div className={`text-3xl mb-3 ${isEven ? 'md:flex md:justify-end' : ''}`}>
                                                {step.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{step.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>

                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </section>
    )
}
