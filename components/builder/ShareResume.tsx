'use client'

import { useState } from 'react'
import { Share2, Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/useResumeStore'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import posthog from 'posthog-js'

export function ShareResume() {
    const { data, setIsPublic } = useResumeStore()
    const [isCopied, setIsCopied] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleTogglePublic = async (checked: boolean) => {
        if (!data.id) return
        setIsUpdating(true)
        try {
            await supabase
                .from('resumes')
                .update({ is_public: checked })
                .eq('id', data.id)

            setIsPublic(checked)
        } catch (e) {
            console.error(e)
        } finally {
            setIsUpdating(false)
        }
    }

    // Fallback token for UI before DB integration is fully wired
    const shareToken = data.shareToken || data.id || 'preview-token'
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/r/${shareToken}` : `https://swiftcv.in/r/${shareToken}`

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        setIsCopied(true)
        toast.success('Link copied ✓')
        posthog.capture('resume_shared', { channel: 'copy_link' })
        setTimeout(() => setIsCopied(false), 2000)
    }

    const shareWhatsApp = () => {
        const text = encodeURIComponent(`Hi, please find my ATS-optimized resume here: ${shareUrl}`)
        window.open(`https://wa.me/?text=${text}`, '_blank')
        posthog.capture('resume_shared', { channel: 'whatsapp' })
    }

    return (
        <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-5 w-full flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                        <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">Share Resume</h3>
                        <p className="text-xs text-slate-400">Generate a public link to share</p>
                    </div>
                </div>
                <Switch
                    checked={data.isPublic || false}
                    onCheckedChange={handleTogglePublic}
                    disabled={isUpdating || !data.id}
                    className="data-[state=checked]:bg-blue-600"
                />
            </div>

            {data.isPublic && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3 pt-2 border-t border-white/5">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">Public Link</Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs text-slate-300 font-mono truncate select-all h-9 flex items-center">
                                {shareUrl}
                            </div>
                            <Button size="icon" variant="outline" onClick={copyLink} className="h-9 w-9 shrink-0 border-white/10 hover:bg-white/5 bg-transparent text-slate-300">
                                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <Button
                            onClick={shareWhatsApp}
                            className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 h-9 text-xs font-semibold"
                        >
                            Share on WhatsApp
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.open(shareUrl, '_blank')}
                            className="px-3 h-9 bg-transparent border-white/10 hover:bg-white/5 text-slate-300"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-slate-500 font-medium">
                        <span className="text-blue-400">👁</span> Viewed {data.views || 0} times
                    </div>
                </div>
            )}
        </div>
    )
}
