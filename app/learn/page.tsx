import Link from 'next/link'
import { Syne } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BookOpen, AlertTriangle, Sparkles, FileX, Target, Zap } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ATS Resume Guide for Indian Students',
    description: 'Everything Indian students need to know to get shortlisted. Learn about ATS systems, formatting, and how to write strong bullet points.',
}

const syne = Syne({ subsets: ['latin'] })

const ARTICLES = [
    {
        slug: 'what-is-ats',
        title: 'What is ATS? Complete Guide for Indian Students',
        description: 'Understand how Applicant Tracking Systems work and why 75% of resumes are rejected before a human sees them.',
        readTime: '5 min read',
        category: 'Basics',
        icon: <BookOpen className="w-5 h-5 text-blue-400" />
    },
    {
        slug: 'resume-rejected-in-6-seconds',
        title: 'Why Your Resume Gets Rejected in 6 Seconds',
        description: 'The most common formatting and keyword mistakes Indian students make that confuse ATS bots.',
        readTime: '4 min read',
        category: 'Common Mistakes',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
    },
    {
        slug: 'how-to-write-bullet-points',
        title: 'How to Write Bullet Points That Actually Work',
        description: 'Learn the XYZ formula and how to use strong action verbs to make your experience section stand out.',
        readTime: '6 min read',
        category: 'Writing Tips',
        icon: <Sparkles className="w-5 h-5 text-purple-400" />
    },
    {
        slug: 'top-10-ats-mistakes',
        title: 'Top 10 ATS Mistakes Indian Students Make',
        description: 'From using tables to crazy fonts, learn what absolutely not to do on your fresher resume.',
        readTime: '5 min read',
        category: 'Mistakes',
        icon: <FileX className="w-5 h-5 text-red-400" />
    },
    {
        slug: 'tailor-resume-for-jd',
        title: 'How to Tailor Your Resume for Any Job Description',
        description: 'A step-by-step guide to keyword optimization for mass placements vs startups.',
        readTime: '7 min read',
        category: 'Strategy',
        icon: <Target className="w-5 h-5 text-emerald-400" />
    },
    {
        slug: 'fresher-resume-guide',
        title: 'Fresher Resume Guide: No Experience? No Problem',
        description: 'How to leverage college projects, hackathons, and certifications when you have zero work experience.',
        readTime: '8 min read',
        category: 'Freshers',
        icon: <Zap className="w-5 h-5 text-cyan-400" />
    }
]

export default function LearnHub() {
    return (
        <div className="min-h-screen flex flex-col bg-[#050508]">
            <Navbar />

            <main className="flex-1 pt-24 pb-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto space-y-16">

                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <h1 className={`${syne.className} text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600`}>
                            ATS Resume Guide
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Everything Indian students need to know to get shortlisted.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ARTICLES.map((article) => (
                            <Link key={article.slug} href={`/learn/${article.slug}`}>
                                <div className="group h-full bg-[#0A0A0F] border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col">

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="p-3 bg-white/5 group-hover:bg-white/10 rounded-xl transition-colors">
                                            {article.icon}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 group-hover:text-slate-400 transition-colors">
                                                {article.category}
                                            </span>
                                            <span className="text-xs font-medium px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">
                                                {article.readTime}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className={`${syne.className} text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors`}>
                                        {article.title}
                                    </h3>

                                    <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                                        {article.description}
                                    </p>

                                    <div className="flex items-center text-blue-500 text-sm font-semibold group-hover:text-blue-400 transition-colors">
                                        Read Article <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>

                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}
