import { create } from 'zustand'
import { ResumeData, Education, Experience, Project, Certification, Achievement, PersonalInfo } from '@/types/resume'
import { supabase } from '@/lib/supabase'

interface ResumeState {
    data: ResumeData;
    activeSection: string;
    isSaving: boolean;
    isDirty: boolean;
    aiCreditsUsed: number;

    // Global modifiers
    setActiveSection: (section: string) => void;
    loadResume: (data: ResumeData) => void;

    // Field modifiers
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    updateSummary: (summary: string) => void;

    addEducation: (edu: Education) => void;
    updateEducation: (id: string, edu: Partial<Education>) => void;
    removeEducation: (id: string) => void;

    addExperience: (exp: Experience) => void;
    updateExperience: (id: string, exp: Partial<Experience>) => void;
    removeExperience: (id: string) => void;

    addProject: (proj: Project) => void;
    updateProject: (id: string, proj: Partial<Project>) => void;
    removeProject: (id: string) => void;

    updateSkills: (category: keyof ResumeData['skills'], skills: string[]) => void;

    addCertification: (cert: Certification) => void;
    updateCertification: (id: string, cert: Partial<Certification>) => void;
    removeCertification: (id: string) => void;

    addAchievement: (ach: Achievement) => void;
    updateAchievement: (id: string, ach: Partial<Achievement>) => void;
    removeAchievement: (id: string) => void;

    // Metadata modifiers
    updateSectionOrder: (order: string[]) => void;
    setTemplate: (templateId: ResumeData['templateId']) => void;
    setAtsScore: (score: number) => void;
    setResumeTitle: (title: string) => void;
    setIsPublic: (isPublic: boolean) => void;
}

const initialData: ResumeData = {
    title: 'My Resume',
    templateId: 'classic',
    personalInfo: { fullName: '', email: '', phone: '', city: '', linkedin: '', github: '', portfolio: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], tools: [], soft: [], languages: [] },
    certifications: [],
    achievements: [],
    sectionOrder: ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements'],
    lastUpdated: new Date().toISOString()
}

let saveTimeout: NodeJS.Timeout;

export const useResumeStore = create<ResumeState>((set, get) => {

    // Auto-Save logic (Debounced 2 seconds)
    const triggerAutoSave = () => {
        set({ isDirty: true });
        const state = get();

        // Only auto-save if the resume already has a DB ID
        if (!state.data.id) return;

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            set({ isSaving: true });
            try {
                const { error } = await supabase
                    .from('resumes')
                    .update({
                        title: state.data.title,
                        data: state.data,
                        ats_score: state.data.atsScore,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', state.data.id);

                if (error) throw error;
            } catch (err) {
                console.error("Auto-save failed", err);
            } finally {
                set({ isSaving: false, isDirty: false });
            }
        }, 2000);
    };

    // Helper to ensure every update triggers autosave
    const updateData = (updater: (data: ResumeData) => ResumeData) => {
        set((state) => ({
            data: updater(state.data),
            lastUpdated: new Date().toISOString()
        }));
        triggerAutoSave();
    };

    return {
        data: initialData,
        activeSection: 'personal',
        isSaving: false,
        isDirty: false,
        aiCreditsUsed: 0,

        setActiveSection: (section) => set({ activeSection: section }),
        loadResume: (data) => {
            // Hotfix: Ensure 'summary' exists in sectionOrder for legacy resumes
            if (!data.sectionOrder.includes('summary')) {
                data.sectionOrder = ['summary', ...data.sectionOrder];
            }
            set({ data, isDirty: false, isSaving: false })
        },

        updatePersonalInfo: (info) => updateData(d => ({ ...d, personalInfo: { ...d.personalInfo, ...info } })),
        updateSummary: (summary) => updateData(d => ({ ...d, summary })),

        addEducation: (edu) => updateData(d => ({ ...d, education: [...d.education, edu] })),
        updateEducation: (id, edu) => updateData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, ...edu } : e) })),
        removeEducation: (id) => updateData(d => ({ ...d, education: d.education.filter(e => e.id !== id) })),

        addExperience: (exp) => updateData(d => ({ ...d, experience: [...d.experience, exp] })),
        updateExperience: (id, exp) => updateData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, ...exp } : e) })),
        removeExperience: (id) => updateData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) })),

        addProject: (proj) => updateData(d => ({ ...d, projects: [...d.projects, proj] })),
        updateProject: (id, proj) => updateData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, ...proj } : p) })),
        removeProject: (id) => updateData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) })),

        updateSkills: (category, skills) => updateData(d => ({ ...d, skills: { ...d.skills, [category]: skills } })),

        addCertification: (cert) => updateData(d => ({ ...d, certifications: [...d.certifications, cert] })),
        updateCertification: (id, cert) => updateData(d => ({ ...d, certifications: d.certifications.map(c => c.id === id ? { ...c, ...cert } : c) })),
        removeCertification: (id) => updateData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== id) })),

        addAchievement: (ach) => updateData(d => ({ ...d, achievements: [...d.achievements, ach] })),
        updateAchievement: (id, ach) => updateData(d => ({ ...d, achievements: d.achievements.map(a => a.id === id ? { ...a, ...ach } : a) })),
        removeAchievement: (id) => updateData(d => ({ ...d, achievements: d.achievements.filter(a => a.id !== id) })),

        updateSectionOrder: (order) => updateData(d => ({ ...d, sectionOrder: order })),
        setTemplate: (templateId) => updateData(d => ({ ...d, templateId })),

        setAtsScore: (score) => updateData(d => ({ ...d, atsScore: score })),

        setResumeTitle: (title) => updateData(d => ({ ...d, title })),
        setIsPublic: (isPublic) => updateData(d => ({ ...d, isPublic })),
    }
})
