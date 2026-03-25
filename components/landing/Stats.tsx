'use client'

import { useEffect, useRef } from 'react'
import { Syne } from 'next/font/google'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const syne = Syne({ subsets: ['latin'] })

const statsData = [
    { prefix: '', target: 10000, suffix: '+', label: 'Resumes Built' },
    { prefix: '', target: 85, suffix: '%', label: 'Avg ATS Score Improvement' },
    { prefix: '', target: 3, suffix: 'x', label: 'More Interview Callbacks' },
    { prefix: '', target: 100, suffix: '%', label: 'Free Forever' },
]

export function Stats() {
    const containerRef = useRef<HTMLDivElement>(null)

    // We use exactly 4 refs for the 4 stats to avoid array mapping issues
    const numberRefs = [
        useRef<HTMLSpanElement>(null),
        useRef<HTMLSpanElement>(null),
        useRef<HTMLSpanElement>(null),
        useRef<HTMLSpanElement>(null)
    ]

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            // Trigger when Stats bar comes into viewport
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top 90%',
                once: true,
                onEnter: () => {
                    statsData.forEach((stat, index) => {
                        const obj = { val: 0 }
                        gsap.to(obj, {
                            val: stat.target,
                            duration: 2.5,
                            ease: 'power3.out',
                            onUpdate: () => {
                                const ref = numberRefs[index].current
                                if (ref) {
                                    // Format numbers above 1000 with commas
                                    const formatted = Math.floor(obj.val).toLocaleString('en-US')
                                    ref.innerText = `${stat.prefix}${formatted}${stat.suffix}`
                                }
                            }
                        })
                    })
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={containerRef}
            className="py-16 bg-[#1E3A5F] w-full"
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-wrap justify-center items-center divide-y md:divide-y-0 md:divide-x divide-white/20">

                    {statsData.map((stat, idx) => (
                        <div
                            key={idx}
                            className="w-full sm:w-1/2 md:w-1/4 p-6 md:p-8 flex flex-col justify-center items-center text-center"
                        >
                            <h4
                                className={`${syne.className} text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight flex items-center`}
                            >
                                <span ref={numberRefs[idx]}>
                                    {stat.prefix}0{stat.suffix}
                                </span>
                            </h4>
                            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    )
}
