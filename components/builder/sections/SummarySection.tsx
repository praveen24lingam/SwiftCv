'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AIAssist } from '@/components/builder/AIAssist'

export function SummarySection() {
    const { data, updateSummary, setActiveSection } = useResumeStore()
    const summary = data.summary
    const MAX_CHARS = 300

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span>📝</span> Professional Summary
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm max-w-xl">
                        A quick highlight of your background. Keep it punchy!
                    </p>
                </div>

                <AIAssist
                    type="summary"
                    text={data.summary}
                    skills={[...data.skills.technical, ...data.skills.tools]}
                    role="Software Engineer" // Would be dynamic in a full app
                    onAccept={(newText) => updateSummary(newText)}
                />
            </div>

            <Card className="p-6 bg-[#0F172A] border-white/5 space-y-4">

                <div className="bg-blue-900/10 border border-blue-500/10 rounded-lg p-4 mb-4 flex gap-3 text-blue-200/80 text-sm">
                    <span className="text-blue-500">💡</span>
                    <p>
                        <strong>Pro tip:</strong> Write 2-3 sentences max. Formula: [Who you are] + [Top 2 skills] + [What you want to achieve].
                    </p>
                </div>

                <div className="relative">
                    <Textarea
                        value={summary}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_CHARS) {
                                updateSummary(e.target.value)
                            }
                        }}
                        placeholder="Results-driven B.Tech Computer Science student specializing in React and Node.js. Seeking a full-stack engineering role to apply my skills in building scalable web applications..."
                        className="min-h-[160px] bg-black/20 border-white/10 focus-visible:ring-blue-500 text-base resize-none"
                    />

                    <div className={`absolute bottom-3 right-3 text-xs font-medium ${summary.length >= MAX_CHARS ? 'text-red-400' : 'text-slate-500'}`}>
                        {summary.length} / {MAX_CHARS}
                    </div>
                </div>

            </Card>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setActiveSection('personal')}
                    className="text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={() => setActiveSection('education')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Next: Education →
                </button>
            </div>
        </div>
    )
}
