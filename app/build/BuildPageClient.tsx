'use client'

import { useState, useEffect } from 'react'
import { Syne } from 'next/font/google'
import Link from 'next/link'
import { Download, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResumeStore } from '@/store/useResumeStore'
import { toast } from 'sonner'
import posthog from 'posthog-js'

import { SectionNav } from '@/components/builder/SectionNav'
import { PersonalInfoSection } from '@/components/builder/sections/PersonalInfoSection'
import { SummarySection } from '@/components/builder/sections/SummarySection'
import { EducationSection } from '@/components/builder/sections/EducationSection'
import { ExperienceSection } from '@/components/builder/sections/ExperienceSection'
import { ProjectsSection } from '@/components/builder/sections/ProjectsSection'
import { SkillsSection } from '@/components/builder/sections/SkillsSection'
import { CertificationsSection } from '@/components/builder/sections/CertificationsSection'
import { AchievementsSection } from '@/components/builder/sections/AchievementsSection'
import { LivePreview } from '@/components/builder/LivePreview'
import { ScoreWidget } from '@/components/ats/ScoreWidget'
import { JDMatcher } from '@/components/ats/JDMatcher'

const syne = Syne({ subsets: ['latin'] })

export function BuildPageClient({ initialData }: { initialData?: any }) {
    const { data, activeSection, isSaving } = useResumeStore()
    const setResumeTitle = useResumeStore(s => s.setResumeTitle)
    const loadResume = useResumeStore(s => s.loadResume)

    useEffect(() => {
        if (initialData) {
            loadResume(initialData)
        }
    }, [initialData, loadResume])

    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)
        const toastId = toast.loading('Generating PDF...')
        try {
            const { downloadResumePDF } = await import('@/lib/download-pdf')
            await downloadResumePDF(data, ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements'])
            toast.success('PDF downloaded ✓', { id: toastId })
            posthog.capture('pdf_downloaded')
        } catch (error) {
            console.error('Failed to generate PDF:', error)
            toast.error('Download failed. Please try again.', { id: toastId })
        } finally {
            setIsDownloading(false)
        }
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'personal': return <PersonalInfoSection />
            case 'summary': return <SummarySection />
            case 'education': return <EducationSection />
            case 'experience': return <ExperienceSection />
            case 'projects': return <ProjectsSection />
            case 'skills': return <SkillsSection />
            case 'certifications': return <CertificationsSection />
            case 'achievements': return <AchievementsSection />
            default: return <PersonalInfoSection />
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#050508] text-slate-200">

            {/* STICKY TOP HEADER */}
            <header className="sticky top-0 z-50 h-16 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4 w-1/3">
                    <Link href="/dashboard" className={`${syne.className} text-xl font-bold text-white tracking-tight hover:text-blue-400 transition-colors`}>
                        <span className="text-blue-500">⚡</span> SwiftCV
                    </Link>
                </div>

                <div className="flex-1 flex justify-center max-w-sm">
                    <Input
                        value={data.title}
                        onChange={(e) => setResumeTitle(e.target.value)}
                        className={`${syne.className} text-center font-semibold text-lg bg-transparent border-transparent hover:border-white/10 focus-visible:ring-1 focus-visible:ring-blue-500 h-9 transition-colors`}
                        placeholder="Untitled Resume"
                    />
                </div>

                <div className="flex items-center justify-end gap-4 w-1/3">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
                        {isSaving ? (
                            <span className="text-blue-400 flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</span>
                        ) : (
                            <span className="text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>
                        )}
                    </div>
                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 h-9 px-4 rounded-lg"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        <span className="hidden sm:inline">Download PDF</span>
                        <span className="sm:hidden">PDF</span>
                    </Button>
                </div>
            </header>

            {/* MAIN 3-COLUMN LAYOUT */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                <aside className="hidden md:block w-[260px] border-r border-white/5 bg-[#0A0A0F] overflow-y-auto h-[calc(100vh-64px)] p-4 shrink-0">
                    <SectionNav />
                </aside>

                <main className="flex-1 overflow-y-auto h-[calc(100vh-64px-60px)] md:h-[calc(100vh-64px)] pb-12 sm:pb-0 scroll-smooth">
                    <div className="max-w-3xl mx-auto p-4 md:p-8 lg:p-12">
                        {renderActiveSection()}
                    </div>
                </main>

                <aside className="hidden xl:flex flex-col w-[450px] border-l border-white/5 bg-[#0A0A0F] h-[calc(100vh-64px)] shrink-0 overflow-y-auto custom-scrollbar">
                    <ScoreWidget />
                    <JDMatcher />
                    <div className="h-px w-full bg-white/5 shrink-0" />
                    <LivePreview />
                </aside>
            </div>

            {/* MOBILE BOTTOM TAB BAR */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-[#0A0A0F] border-t border-white/10 flex items-center justify-around px-2 z-50 pb-safe">
                <button className="flex flex-col items-center justify-center p-2 text-blue-500 w-1/3">
                    <span className="text-xl mb-1">📝</span>
                    <span className="text-[10px] font-medium">Edit</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 text-slate-400 hover:text-white transition-colors w-1/3">
                    <span className="text-xl mb-1">👁️</span>
                    <span className="text-[10px] font-medium">Preview</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 text-slate-400 hover:text-white transition-colors w-1/3">
                    <span className="text-xl mb-1">📊</span>
                    <span className="text-[10px] font-medium">ATS Score</span>
                </button>
            </div>
        </div>
    )
}
