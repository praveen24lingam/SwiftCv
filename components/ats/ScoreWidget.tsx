'use client'

import { useEffect, useRef, useState } from 'react'
import { useATSScore } from '@/hooks/useATSScore'
import gsap from 'gsap'
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScoreBreakdown } from './ScoreBreakdown'

export function ScoreWidget() {
    const { total, pillars, issues, isCalculating } = useATSScore()
    const [showBreakdown, setShowBreakdown] = useState(false)

    const scoreRef = useRef<HTMLDivElement>(null)
    const circleRef = useRef<SVGCircleElement>(null)

    // High priority issues
    const topIssues = issues.filter(i => i.priority === 'high').slice(0, 3)

    // Color logic
    const getScoreColor = (score: number) => {
        if (score < 40) return '#EF4444' // Red
        if (score < 71) return '#F59E0B' // Yellow
        return '#10B981' // Green
    }

    // Animate the circle and counter
    useEffect(() => {
        if (isCalculating) return

        const color = getScoreColor(total)

        // SVG Circle setup
        const circle = circleRef.current
        if (circle) {
            const radius = circle.r.baseVal.value
            const circumference = radius * 2 * Math.PI
            circle.style.strokeDasharray = `${circumference} ${circumference}`

            const offset = circumference - (total / 100) * circumference

            gsap.to(circle, {
                strokeDashoffset: offset,
                stroke: color,
                duration: 1.5,
                ease: 'power3.out'
            })
        }

        // Number Counter setup
        if (scoreRef.current) {
            gsap.to(scoreRef.current, {
                innerHTML: total,
                duration: 1.5,
                snap: { innerHTML: 1 },
                ease: 'power3.out',
            })
        }

    }, [total, isCalculating])

    return (
        <>
            <div className="flex flex-col bg-[#0A0A0F] border-b border-white/5 p-6 h-full w-full custom-scrollbar overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white tracking-wide">ATS Resume Score</h3>
                    {isCalculating && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                </div>

                {/* Circular SVG Meter */}
                <div className="flex justify-center mb-8 relative">
                    <svg className="w-40 h-40 transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="#1E293B"
                            strokeWidth="10"
                            fill="transparent"
                        />
                        {/* Foreground Arc */}
                        <circle
                            ref={circleRef}
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="#EF4444" // Starts red, GSAP will handle
                            strokeWidth="10"
                            fill="transparent"
                            strokeLinecap="round"
                            className="transition-colors duration-300"
                            style={{ strokeDasharray: "439.8", strokeDashoffset: "439.8" }}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex items-start">
                            <span ref={scoreRef} className="text-4xl font-black text-white tracking-tighter">0</span>
                            <span className="text-sm font-bold text-slate-500 mt-1 ml-1">/100</span>
                        </div>
                    </div>
                </div>

                {/* 5 Progress Bars */}
                <div className="space-y-4 mb-8">
                    {[
                        { label: 'Format & Contact', val: pillars.format.score, max: 20 },
                        { label: 'Content Depth', val: pillars.content.score, max: 20 },
                        { label: 'Keywords & Verbs', val: pillars.keyword.score, max: 20 },
                        { label: 'Impact Metrics', val: pillars.impact.score, max: 20 },
                        { label: 'Completeness', val: pillars.completeness.score, max: 20 },
                    ].map((bar, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-slate-300">{bar.label}</span>
                                <span className="text-slate-500">{Math.round((bar.val / bar.max) * 100)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(bar.val / bar.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Top Issues list */}
                {topIssues.length > 0 && (
                    <div className="mb-6 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                        <h4 className="text-xs font-bold text-red-400 mb-3 uppercase tracking-widest px-1">Critical Fixes Required</h4>
                        <div className="space-y-3">
                            {topIssues.map((issue, i) => (
                                <div key={i} className="flex gap-2 items-start text-xs text-red-200">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                    <span className="leading-snug">{issue.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setShowBreakdown(true)}
                    className="mt-auto w-full py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 group"
                >
                    View Full Report
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>
            </div>

            {showBreakdown && <ScoreBreakdown onClose={() => setShowBreakdown(false)} />}
        </>
    )
}

