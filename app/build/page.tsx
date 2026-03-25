import { Metadata } from 'next'
import { BuildPageClient } from './BuildPageClient'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Build Your Resume',
}

export default async function BuildPage({ searchParams }: { searchParams: { id?: string } }) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    let initialData = null;

    if (searchParams.id) {
        // Load existing resume from DB
        const { data: resume } = await supabase.from('resumes').select('*').eq('id', searchParams.id).single()
        if (resume) {
            initialData = typeof resume.data === 'string' ? JSON.parse(resume.data) : resume.data;
            initialData.id = resume.id; // Important: ensure ID is present for auto-save
            if (!initialData.title) initialData.title = resume.title;
        } else {
            redirect('/dashboard') // Invalid ID
        }
    } else {
        // Create new resume in DB
        const defaultData = {
            title: 'Untitled Resume',
            templateId: 'classic',
            personalInfo: { fullName: '', email: '', phone: '', city: '', linkedin: '', github: '', portfolio: '' },
            summary: '',
            education: [],
            experience: [],
            projects: [],
            skills: { technical: [], tools: [], soft: [], languages: [] },
            certifications: [],
            achievements: [],
            sectionOrder: ['experience', 'education', 'projects', 'skills', 'certifications', 'achievements']
        };

        const { data: newResume, error } = await supabase.from('resumes').insert({
            user_id: session.user.id,
            title: 'Untitled Resume',
            data: defaultData,
            template: 'classic',
            is_public: false
        }).select().single()

        if (newResume) {
            redirect(`/build?id=${newResume.id}`)
        } else {
            console.error("Failed to create resume", error)
            redirect('/dashboard')
        }
    }

    return <BuildPageClient initialData={initialData} />
}
