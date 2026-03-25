'use client'

import { useEffect, useRef } from 'react'
import { Syne } from 'next/font/google'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Target, FileSearch, Sparkles, FileCheck, IndianRupee, Heart } from 'lucide-react'

const syne = Syne({ subsets: ['latin'] })

const features = [
    {
        icon: <Target className="w-6 h-6 text-blue-400" />,
        title: "Real-time ATS Score",
        description: "5-pillar analysis updates instantly as you type your content.",
    },
    {
        icon: <FileSearch className="w-6 h-6 text-purple-400" />,
        title: "Job Description Match",
        description: "Paste any JD and see your match percentage instantly to tailor your resume.",
    },
    {
        icon: <Sparkles className="w-6 h-6 text-amber-400" />,
        title: "AI Writing Assistant",
        description: "Rewrite weak bullets into strong, quantified achievements with one click.",
    },
    {
        icon: <FileCheck className="w-6 h-6 text-emerald-400" />,
        title: "ATS-Safe Templates",
        description: "3 templates mathematically guaranteed to parse correctly in Workday/Taleo.",
    },
    {
        icon: <IndianRupee className="w-6 h-6 text-orange-400" />,
        title: "India-First Design",
        description: "Support for CGPA, board results, and Internshala-ready formats.",
    },
    {
        icon: <Heart className="w-6 h-6 text-rose-400" />,
        title: "Forever Free",
        description: "All features free. PDF downloads free. No credit card ever required.",
    }
]

export function Features() {
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLHeadingElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                }
            })

            // Animate header
            tl.fromTo(headerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            )

            // Animate grid cards with stagger
            if (gridRef.current) {
                const cards = gridRef.current.children
                tl.fromTo(cards,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
                    '-=0.4'
                )
            }
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            id="features"
            ref={containerRef}
            className="py-24 bg-[#0A0A0F]"
        >
            <div className="container mx-auto px-4 md:px-6">
                <h2
                    ref={headerRef}
                    className={`${syne.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-16 opacity-0`}
                >
                    Everything You Need to <span className="text-blue-500">Get Shortlisted</span>
                </h2>

                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                >
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-[#0F172A] border border-white/[0.08] rounded-2xl p-8 hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(59,130,246,0.3)] group opacity-0"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
