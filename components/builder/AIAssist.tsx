'use client'

import { useState } from 'react'
import { Sparkles, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import posthog from 'posthog-js'

interface AIAssistProps {
    text: string;
    role?: string;
    techStack?: string[];
    onAccept: (newText: string) => void;
    type: 'bullet' | 'summary';
    skills?: string[]; // Used for summary generation
}

export function AIAssist({ text, role, techStack, onAccept, type, skills }: AIAssistProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [suggestion, setSuggestion] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [remainingUses, setRemainingUses] = useState<number | null>(null)

    const handleRewrite = async () => {
        setIsGenerating(true)
        setError(null)

        try {
            const payload = type === 'bullet'
                ? { action: 'rewrite_bullet', data: { bullet: text, role, techStack } }
                : { action: 'generate_summary', data: { skills, targetRole: role, currentText: text } }

            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errorData = await res.json()
                if (res.status === 429) {
                    throw new Error("Daily AI limit reached (10/day). Try again tomorrow.")
                }
                throw new Error(errorData.error || "Failed to generate text")
            }

            const data = await res.json()
            setSuggestion(data.result)
            if (data.remaining !== undefined) {
                setRemainingUses(data.remaining)
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsGenerating(false)
        }
    }

    if (suggestion) {
        return (
            <div className="mt-2 bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 text-xs w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="mb-3 space-y-2">
                    {text && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Before</span>
                            <p className="text-slate-400 line-through decoration-red-500/30">{text}</p>
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">After (AI Optimized)</span>
                        <p className="text-slate-200 font-medium">{suggestion}</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSuggestion(null)}
                        className="h-7 text-xs text-slate-400 hover:text-white"
                    >
                        <X className="w-3 h-3 mr-1" /> Reject
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            onAccept(suggestion)
                            setSuggestion(null)
                            toast.success('AI rewrite applied ✓')
                            posthog.capture('ai_rewrite_used', { type })
                        }}
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Check className="w-3 h-3 mr-1" /> Accept
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="ghost"
                size="sm"
                disabled={isGenerating || (!text && type === 'bullet')}
                onClick={handleRewrite}
                className="h-6 px-2 text-[10px] text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 font-semibold"
            >
                {isGenerating ? (
                    <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> {type === 'bullet' ? 'Rewriting...' : 'Generating...'}</>
                ) : (
                    <><Sparkles className="w-3 h-3 mr-1.5" /> {type === 'bullet' ? 'Improve with AI' : 'Generate with AI'}</>
                )}
            </Button>

            {error && <span className="text-[10px] text-red-400 font-medium">{error}</span>}
            {!error && remainingUses !== null && (
                <span className="text-[9px] text-slate-500">{remainingUses} AI uses left today</span>
            )}
        </div>
    )
}
