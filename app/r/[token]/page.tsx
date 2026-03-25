import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { ClassicTemplate } from '@/components/templates/ClassicTemplate'
import { BoldTemplate } from '@/components/templates/BoldTemplate'
import { FreshTemplate } from '@/components/templates/FreshTemplate'
import Link from 'next/link'

export const revalidate = 0; // Disable static caching for dynamic links

export default async function SharedResumePage({ params }: { params: { token: string } }) {
    const supabase = createClient()

    // Find the resume by share_token
    const { data: resume, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('share_token', params.token)
        .single()

    // Basic security / public check
    if (error || !resume || !resume.is_public) {
        notFound()
    }

    // Ideally, track the view asynchronously (skipping robust edge-case checks for brevity)
    // We can do this without awaiting so it doesn't block the render
    supabase.from('resume_views').insert({ resume_id: resume.id }).then()

    // Parse JSON data correctly
    const resumeData = typeof resume.data === 'string' ? JSON.parse(resume.data) : resume.data;
    const template = resume.template || 'classic';

    return (
        <div className="min-h-screen bg-[#050508] py-8 sm:py-16 px-4 font-sans text-slate-200">

            {/* Top action bar */}
            <div className="max-w-[794px] mx-auto w-full mb-6 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold font-syne text-white tracking-tight hover:text-blue-400 transition-colors">
                    <span className="text-blue-500">⚡</span> SwiftCV
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-xs font-semibold px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition border border-blue-500/20">
                        Build Yours For Free
                    </Link>
                </div>
            </div>

            {/* The Resume */}
            <div className="max-w-[794px] mx-auto w-full bg-white shadow-2xl overflow-hidden print:shadow-none print:my-0 pb-16">
                {template === 'classic' && <ClassicTemplate data={resumeData} />}
                {template === 'bold' && <BoldTemplate data={resumeData} />}
                {template === 'fresh' && <FreshTemplate data={resumeData} />}
            </div>

            {/* Bottom Watermark */}
            <div className="max-w-[794px] mx-auto w-full mt-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                Built with <span className="text-blue-500">⚡</span> SwiftCV —
                <Link href="/" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                    Create your own ATS-optimized resume
                </Link>
            </div>

        </div>
    )
}
