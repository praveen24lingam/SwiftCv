'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Target, CheckCircle2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import posthog from 'posthog-js'
import gsap from 'gsap'

export function JDMatcher() {
    const [expanded, setExpanded] = useState(false)
    const [jdText, setJdText] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [results, setResults] = useState<{ match: number, found: string[], missing: string[] } | null>(null)

    const { data, updateSkills } = useResumeStore()

    // Simplified local English stop words
    const STOP_WORDS = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not', 'we', 'will', 'your', 'about', 'can', 'from', 'an', 'they', 'which', 'by', 'up', 'more', 'when', 'has', 'would', 'what', 'there', 'their', 'who', 'some', 'he', 'she', 'do', 'no', 'my', 'one', 'all', 'any', 'me', 'very', 'like', 'how', 'our'])

    // High-value hardcoded tech glossary to ensure good exact hits 
    const TECH_GLOSSARY = new Set(['react', 'node', 'node.js', 'python', 'java', 'c++', 'javascript', 'typescript', 'aws', 'docker', 'kubernetes', 'sql', 'mysql', 'postgresql', 'mongodb', 'graphql', 'rest', 'api', 'git', 'ci/cd', 'linux', 'html', 'css', 'sass', 'tailwind', 'redux', 'next.js', 'express', 'django', 'flask', 'spring', 'agile', 'scrum'])

    const analyzeJD = () => {
        if (!jdText.trim()) return

        setIsAnalyzing(true)

        // Simulate a slight delay so it feels like "hard work" is happening
        setTimeout(() => {
            // 1. Extract potential keywords from JD
            const words = jdText.toLowerCase()
                .replace(/[^\w\s\.-]/g, ' ')
                .split(/\s+/)
                .filter(w => w.length > 2 && !STOP_WORDS.has(w))

            // Keep words that are in our glossary, OR look like big tech words (4+ chars, capitalized in original)
            // *This is a local pseudo-NLP tactic*
            const originalWords = jdText.replace(/[^\w\s\.-]/g, ' ').split(/\s+/)
            const extractedKeywords = new Set<string>()

            words.forEach((w, i) => {
                if (TECH_GLOSSARY.has(w)) {
                    extractedKeywords.add(w)
                } else if (w.length > 4) {
                    // Check if capitalized in original text (proxy for proper noun / tech)
                    const orig = originalWords[i]
                    if (orig && /^[A-Z]/.test(orig)) {
                        extractedKeywords.add(w)
                    }
                }
            })

            // We only compare top ~20 most frequent or high-value keywords to avoid noise
            const keywordList = Array.from(extractedKeywords).slice(0, 25)

            // 2. Scan entire resume text
            const allSkills = [
                ...data.skills.technical,
                ...data.skills.tools,
                ...data.skills.languages,
                ...data.skills.soft
            ].map(s => s.toLowerCase())

            const resumeBlob = [
                data.summary,
                ...data.experience.flatMap(e => [e.title, e.company, ...e.bullets]),
                ...data.projects.flatMap(p => [p.title, p.description, ...p.bullets, ...p.techStack])
            ].join(' ').toLowerCase()

            // 3. Match logic
            const found: string[] = []
            const missing: string[] = []

            keywordList.forEach(kw => {
                const hasSkill = allSkills.some(s => s === kw || s.includes(kw))
                const hasText = resumeBlob.includes(kw)

                if (hasSkill || hasText) {
                    found.push(kw)
                } else {
                    missing.push(kw)
                }
            })

            // Format for display
            const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
            const foundFormatted = Array.from(new Set(found)).map(cap)
            const missingFormatted = Array.from(new Set(missing)).map(cap)

            const totalKws = foundFormatted.length + missingFormatted.length
            const matchScore = totalKws === 0 ? 0 : Math.round((foundFormatted.length / totalKws) * 100)

            setResults({
                match: matchScore,
                found: foundFormatted,
                missing: missingFormatted
            })

            posthog.capture('jd_pasted', { match_percent: matchScore })
            setIsAnalyzing(false)
        }, 800)
    }

    const addToSkills = (kw: string) => {
        // Add to technical skills in Zustand
        if (!data.skills.technical.includes(kw)) {
            updateSkills('technical', [...data.skills.technical, kw])
            toast.success('Keyword added to skills ✓')
            posthog.capture('keyword_added_from_jd', { keyword: kw })
        }
        // Remove from missing visually
        if (results) {
            setResults({
                ...results,
                missing: results.missing.filter(m => m !== kw),
                found: [...results.found, kw]
            })
        }
    }

    return (
        <div className="bg-[#0A0A0F] border-t border-b border-white/5 w-full flex flex-col shrink-0">

            {/* Toggle Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span>JD Matcher</span>
                </div>
                <div className="flex items-center gap-3">
                    {results && !expanded && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${results.match > 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {results.match}% Match
                        </span>
                    )}
                    <span className="text-slate-500 text-sm">{expanded ? '↑' : '↓'}</span>
                </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t border-white/5 space-y-4">

                            {!results ? (
                                // Input Phase
                                <div className="space-y-3 mt-4 animate-in fade-in">
                                    <div className="text-xs text-blue-300 bg-blue-900/20 p-2.5 rounded border border-blue-500/20 leading-snug">
                                        💡 <strong>Pro Tip:</strong> Resumes matching 70%+ of JD keywords are 3x more likely to be shortlisted by an ATS.
                                    </div>
                                    <Textarea
                                        value={jdText}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJdText(e.target.value)}
                                        placeholder="Paste job description here (from LinkedIn, Naukri, Internshala...)"
                                        className="min-h-[140px] bg-black/20 border-white/10 text-xs resize-none"
                                    />
                                    <Button
                                        onClick={analyzeJD}
                                        disabled={isAnalyzing || jdText.trim().length < 20}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10"
                                    >
                                        {isAnalyzing ? 'Extracting Keywords...' : 'Analyze Job Description'}
                                    </Button>
                                </div>
                            ) : (
                                // Results Phase
                                <div className="space-y-5 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                    {/* Big Number */}
                                    <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                                        <div>
                                            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">ATS JD Match</div>
                                            <div className={`text-3xl font-black ${results.match > 70 ? 'text-emerald-400' : results.match > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                                                {results.match}%
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setResults(null)} className="h-8 text-xs text-slate-500 hover:text-white">
                                            New Scan
                                        </Button>
                                    </div>

                                    {/* Missing Keywords (Actionable) */}
                                    {results.missing.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-red-400 mb-2.5 flex justify-between">
                                                <span>Keywords Missing ({results.missing.length})</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {results.missing.map(kw => (
                                                    <button
                                                        key={kw}
                                                        onClick={() => addToSkills(kw)}
                                                        className="bg-red-500/10 hover:bg-blue-500/20 border border-red-500/20 hover:border-blue-500/40 text-red-300 hover:text-blue-300 px-2 py-1 rounded text-[10px] sm:text-xs font-medium transition-colors flex items-center group"
                                                        title="Click to add to your resume Skills"
                                                    >
                                                        <Plus className="w-3 h-3 mr-1 opacity-50 group-hover:opacity-100" />
                                                        {kw}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2">Click a missing keyword to instantly add it to your Technical Skills.</p>
                                        </div>
                                    )}

                                    {/* Found Keywords */}
                                    {results.found.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-emerald-400 mb-2.5 flex items-center justify-between">
                                                <span>Keywords Found ({results.found.length})</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {results.found.map(kw => (
                                                    <div key={kw} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded text-[10px] sm:text-xs tracking-wide">
                                                        {kw}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
