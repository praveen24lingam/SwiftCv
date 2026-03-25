'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Copy, Trash2, Edit2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import posthog from 'posthog-js'

interface ResumeCardProps {
    resume: any
}

export function ResumeCard({ resume }: ResumeCardProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDuplicating, setIsDuplicating] = useState(false)

    let rData: any = {}
    try { rData = typeof resume.data === 'string' ? JSON.parse(resume.data) : resume.data } catch (e) { }
    const score = rData.atsScore || 0

    const timeAgo = (dateStr: string) => {
        const s = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000)
        if (s < 60) return `${s}s ago`
        if (s < 3600) return `${Math.floor(s / 60)}m ago`
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`
        return `${Math.floor(s / 86400)}d ago`
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this resume? This cannot be undone.')) return
        setIsDeleting(true)
        try {
            const { error } = await supabase.from('resumes').delete().eq('id', resume.id)
            if (error) throw error
            toast.success('Resume deleted')
            posthog.capture('resume_deleted')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete resume')
            setIsDeleting(false)
        }
    }

    const handleDuplicate = async () => {
        setIsDuplicating(true)
        try {
            const { error } = await supabase.from('resumes').insert({
                user_id: resume.user_id,
                title: `${resume.title || 'Untitled'} (Copy)`,
                data: resume.data,
                template: resume.template,
                is_public: false // copies start private
            })
            if (error) throw error
            toast.success('Resume duplicated')
            posthog.capture('resume_duplicated')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Failed to duplicate resume')
            setIsDuplicating(false)
        }
    }

    return (
        <div className="group relative bg-[#0A0A0F] border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            {/* Header line */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <Link href={`/build?id=${resume.id}`} className="hover:underline flex-1">
                        <h3 className="text-lg font-bold text-white truncate pr-4">{resume.title || 'Untitled Resume'}</h3>
                    </Link>
                    <div className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : score >= 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                        {score} ATS
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    <span className="text-[10px] font-medium px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-300 capitalize">
                        {resume.template || 'Classic'} Template
                    </span>
                    {resume.is_public && (
                        <span className="text-[10px] font-medium px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">
                            Public
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
                    <Calendar className="w-3.5 h-3.5" />
                    Edited {timeAgo(resume.updated_at)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                    <Button asChild size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
                        <Link href={`/build?id=${resume.id}`}>
                            <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent border-white/10 hover:bg-white/5 disabled:opacity-50"
                        onClick={handleDuplicate}
                        disabled={isDuplicating || isDeleting}
                    >
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent border-white/10 hover:bg-red-500/10 hover:border-red-500/30 disabled:opacity-50 group/del"
                        onClick={handleDelete}
                        disabled={isDeleting || isDuplicating}
                    >
                        <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover/del:text-red-400" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
