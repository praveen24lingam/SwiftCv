'use client'

import { useATSScore } from '@/hooks/useATSScore'
import { X, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function ScoreBreakdown({ onClose }: { onClose: () => void }) {
    const { total, pillars, suggestions } = useATSScore()
    const circleRef = useRef<SVGCircleElement>(null)

    // Prioritize suggestions
    const priorityFixes = [...suggestions]
        .sort((a, b) => {
            const pmap = { high: 3, medium: 2, low: 1 }
            return pmap[b.priority] - pmap[a.priority]
        }).slice(0, 3)

    const getScoreColor = (score: number) => {
        if (score < 40) return '#EF4444' // Red
        if (score < 71) return '#F59E0B' // Yellow
        return '#10B981' // Green
    }

    const getScoreLabel = (score: number) => {
        if (score < 40) return 'Needs Major Work'
        if (score < 71) return 'Getting There'
        if (score < 85) return 'Good'
        return 'Excellent'
    }

    useEffect(() => {
        const color = getScoreColor(total)
        const circle = circleRef.current
        if (circle) {
            const radius = circle.r.baseVal.value
            const circumference = radius * 2 * Math.PI
            circle.style.strokeDasharray = `${circumference} ${circumference}`

            const offset = circumference - (total / 100) * circumference

            // We start slightly zoomed/faded, and GSAP draws it in
            gsap.fromTo(circle,
                { strokeDashoffset: circumference },
                {
                    strokeDashoffset: offset,
                    stroke: color,
                    duration: 1.5,
                    delay: 0.2,
                    ease: 'power3.out'
                }
            )
        }
    }, [total])

    // Simple accordion structure logic (simplified for immediate rendering)
    const renderPillar = (title: string, data: { score: number, max: number, items: Array<{ label: string, earned: boolean, points: number }> }) => (
        <div key={title} className="bg-black/20 border border-white/5 rounded-xl overflow-hidden mb-4">
            <div className="p-4 flex justify-between items-center bg-white/[0.02]">
                <h4 className="font-bold text-white text-sm">{title}</h4>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/40 text-slate-300">
                    {data.score} / {data.max} pts
                </span>
            </div>
            <div className="p-4 space-y-3 bg-black/10">
                {data.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                        {item.earned ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-500/80 shrink-0 mt-0.5" />
                        )}
                        <div>
                            <div className={`text-sm ${item.earned ? 'text-slate-300' : 'text-slate-400'}`}>{item.label}</div>
                            {!item.earned && <div className="text-xs text-red-400 mt-0.5 font-medium">Missing {item.points} pts</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl w-full max-w-2xl max-h-full overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-xl font-bold text-white tracking-wide">Detailed ATS Report</h2>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

                    {/* Top Score Readout */}
                    <div className="flex flex-col items-center justify-center mb-10">
                        <div className="relative mb-4">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="84" stroke="#1E293B" strokeWidth="12" fill="transparent" />
                                <circle
                                    ref={circleRef}
                                    cx="96"
                                    cy="96"
                                    r="84"
                                    stroke="#1E293B"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-white">{total}</span>
                            </div>
                        </div>
                        <div className="text-lg font-bold" style={{ color: getScoreColor(total) }}>
                            {total} — {getScoreLabel(total)}
                        </div>
                    </div>

                    {/* Benchmark Comparison */}
                    <div className="mb-12 bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-white mb-4">Your score vs average shortlisted resume</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                    <span>You</span>
                                    <span>{total} / 100</span>
                                </div>
                                <div className="h-2 w-full bg-[#1E293B] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${total}%`, backgroundColor: getScoreColor(total) }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                    <span>Average Shortlisted</span>
                                    <span>79 / 100</span>
                                </div>
                                <div className="h-2 w-full bg-[#1E293B] rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full w-[79%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Priority Fix List */}
                    {priorityFixes.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Priority Fix List
                            </h3>
                            <p className="text-sm text-slate-400 mb-4">Fix these {priorityFixes.length} things to instantly boost your score:</p>

                            <div className="space-y-3">
                                {priorityFixes.map((s, i) => (
                                    <div key={i} className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                        <p className="text-sm text-amber-200/90 leading-snug">{s.text}</p>
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded w-fit shrink-0">
                                            {s.priority} Priority
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detailed Pillars */}
                    <h3 className="text-base font-bold text-white mb-5">Score Breakdown by Pillar</h3>
                    {renderPillar("Format & Contact Base", pillars.format)}
                    {renderPillar("Deep Content Quality", pillars.content)}
                    {renderPillar("Keyword & Vocabulary Match", pillars.keyword)}
                    {renderPillar("Impact & Metric Frequency", pillars.impact)}
                    {renderPillar("Profile Completeness", pillars.completeness)}

                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-end">
                    <Button onClick={onClose} className="px-8 font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                        Got it, let's fix this <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

            </div>
        </div>
    )
}
