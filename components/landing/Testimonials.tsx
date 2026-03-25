'use client'

import { Syne } from 'next/font/google'
import { motion, Variants } from 'framer-motion'
import { Quote } from 'lucide-react'

const syne = Syne({ subsets: ['latin'] })

const testimonials = [
    {
        stars: "⭐⭐⭐⭐⭐",
        text: "My ATS score jumped from 41 to 88. Got 3 interview calls in the first week after updating my resume on SwiftCV.",
        author: "Ravi K.",
        college: "B.Tech CSE, VIT Vellore",
        placedAt: "Placed at TCS Digital"
    },
    {
        stars: "⭐⭐⭐⭐⭐",
        text: "I had no idea why I was getting rejected everywhere. SwiftCV showed me exactly what was wrong. Fixed it in 20 minutes.",
        author: "Priya S.",
        college: "MBA Marketing, Symbiosis Pune",
        placedAt: ""
    },
    {
        stars: "⭐⭐⭐⭐⭐",
        text: "No career cell at my college. SwiftCV literally became my career counselor. Landed my first internship at a Bangalore startup!",
        author: "Arjun M.",
        college: "B.Tech ECE, Tier-3 college, Nagpur",
        placedAt: ""
    }
]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
}

export function Testimonials() {
    return (
        <section className="py-24 bg-[#0A0A0F] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                <div className="text-center mb-16">
                    <h2 className={`${syne.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4`}>
                        Students Getting <span className="text-blue-500">Shortlisted</span> Every Day
                    </h2>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="bg-[#0F172A] border border-white/5 rounded-2xl p-8 flex flex-col relative group hover:border-blue-500/30 transition-colors"
                        >
                            <Quote className="absolute top-6 left-6 text-blue-500/20 w-12 h-12 -z-0" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="text-sm mb-4 tracking-widest">{t.stars}</div>
                                <p className="text-slate-300 mb-8 flex-grow leading-relaxed">
                                    "{t.text}"
                                </p>
                                <div>
                                    <div className="font-bold text-white text-lg">{t.author}</div>
                                    <div className="text-slate-400 text-xs mt-1">{t.college}</div>
                                    {t.placedAt && (
                                        <div className="text-emerald-400 text-xs font-semibold mt-1">{t.placedAt}</div>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    )
}
