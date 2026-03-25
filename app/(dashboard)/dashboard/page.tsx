import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Download, Eye, Plus, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumeCard } from '@/components/dashboard/ResumeCard'

export const revalidate = 0; // Don't cache dashboard

export default async function DashboardPage() {
    const supabase = createClient()

    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError || !session) {
        redirect('/login')
    }

    // Fetch all resumes for the user
    const { data: resumes, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })

    const user = session.user
    const initial = user.email ? user.email.charAt(0).toUpperCase() : 'U'

    // Calculate stats
    const totalResumes = resumes?.length || 0

    // Parse data to find highest ATS score
    let bestScore = 0;
    resumes?.forEach(r => {
        try {
            const parsed = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
            if (parsed.atsScore && parsed.atsScore > bestScore) {
                bestScore = parsed.atsScore;
            }
        } catch (e) { }
    });

    const totalViews = resumes?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0

    // Formatter hook
    const timeAgo = (dateStr: string) => {
        const s = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000)
        if (s < 60) return `${s}s ago`
        if (s < 3600) return `${Math.floor(s / 60)}m ago`
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`
        return `${Math.floor(s / 86400)}d ago`
    }

    return (
        <div className="min-h-screen bg-[#050508] p-4 sm:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-600/20">
                            {initial}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-syne text-white tracking-tight">
                                Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'User'} 👋
                            </h1>
                            <p className="text-slate-400 text-sm">Here's an overview of your career assets.</p>
                        </div>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 shadow-lg">
                        <Link href="/build">
                            <Plus className="w-4 h-4 mr-2" /> Create New Resume
                        </Link>
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={<FileText className="w-5 h-5 text-blue-400" />} label="Total Resumes" value={totalResumes} />
                    <StatCard icon={<Target className="w-5 h-5 text-emerald-400" />} label="Best ATS Score" value={`${bestScore}/100`} />
                    <StatCard icon={<Download className="w-5 h-5 text-purple-400" />} label="Total Downloads" value="---" />
                    <StatCard icon={<Eye className="w-5 h-5 text-amber-400" />} label="Total Views" value={totalViews} />
                </div>

                {/* Resumes Grid */}
                <div className="pt-4">
                    <h2 className="text-xl font-bold text-white mb-6 font-syne">Your Resumes</h2>

                    {totalResumes === 0 ? (
                        <div className="border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-12 bg-white/[0.02]">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="text-lg font-bold text-white mb-2">No resumes yet</h3>
                            <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">
                                You haven't created any ATS-optimized resumes yet. Click the button below to get started!
                            </p>
                            <Button asChild className="bg-white text-black hover:bg-slate-200">
                                <Link href="/build">Build Your First Resume →</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes?.map((resume) => (
                                <ResumeCard key={resume.id} resume={resume} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="bg-[#0A0A0F] border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="p-3 bg-white/5 rounded-lg shrink-0">
                {icon}
            </div>
            <div>
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">{label}</div>
            </div>
        </div>
    )
}
