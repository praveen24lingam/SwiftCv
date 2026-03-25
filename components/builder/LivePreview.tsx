'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { ClassicTemplate } from '@/components/templates/ClassicTemplate'
import { BoldTemplate } from '@/components/templates/BoldTemplate'
import { FreshTemplate } from '@/components/templates/FreshTemplate'
import { ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react'

// Template configuration for the switcher
const TEMPLATES = [
    { id: 'classic', name: 'Swift Classic', desc: 'Best for: Core Eng, PSU, TCS/Infosys' },
    { id: 'bold', name: 'Swift Bold', desc: 'Best for: Startups, Tech, Product Roles' },
    { id: 'fresh', name: 'Swift Fresh', desc: 'Best for: Freshers, Internships' }
] as const

export function LivePreview() {
    const { data, setTemplate } = useResumeStore()
    const [scale, setScale] = useState(0.65) // Default to fit most screens

    // Render the correct template based on state
    const renderTemplate = () => {
        switch (data.templateId) {
            case 'classic': return <ClassicTemplate data={data} />
            case 'bold': return <BoldTemplate data={data} />
            case 'fresh': return <FreshTemplate data={data} />
            default: return <ClassicTemplate data={data} />
        }
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#0A0A0F]">

            {/* Top Controls Bar */}
            <div className="p-4 border-b border-white/5 shrink-0 space-y-4">

                {/* Header & Badges */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-white">Live Preview</h3>
                        <p className="text-xs text-slate-400 mt-0.5">This is how recruiters & ATS parse your resume</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-medium border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> ATS Safe
                        </span>

                        {/* Zoom Controls */}
                        <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10">
                            <button
                                onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
                                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-medium text-slate-300 w-10 text-center">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={() => setScale(s => Math.min(1.5, s + 0.1))}
                                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Template Switcher */}
                <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTemplate(t.id)}
                            className={`text-left p-2 rounded-lg border transition-all ${data.templateId === t.id ? 'bg-blue-600/10 border-blue-500/50 relative' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                        >
                            <div className={`text-xs font-semibold ${data.templateId === t.id ? 'text-blue-400' : 'text-slate-300'}`}>
                                {t.name}
                            </div>
                            <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                                {t.desc}
                            </div>
                        </button>
                    ))}
                </div>

            </div>

            {/* PDF Rendering Area */}
            <div className="flex-1 overflow-auto bg-slate-900/50 p-6 flex justify-center items-start custom-scrollbar">

                {/* The scaling wrapper */}
                <div
                    className="relative transition-transform duration-200 ease-out origin-top shadow-2xl"
                    style={{
                        transform: `scale(${scale})`,
                        // Set explicit dimensions for the scale wrapper so it reserves layout space
                        width: '794px',
                        height: '1123px',
                        marginBottom: `${(scale - 1) * 1123}px` // Fix scrollbar calculation for scaled elements
                    }}
                >
                    {renderTemplate()}
                </div>

            </div>

        </div>
    )
}
