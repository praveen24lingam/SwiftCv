'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'
import { KeyboardEvent } from 'react'

const SUGGESTIONS = {
    technical: ['React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB', 'AWS', 'TypeScript', 'Next.js'],
    tools: ['Git', 'Docker', 'Figma', 'Postman', 'Jira', 'VS Code', 'Linux', 'Kubernetes'],
    soft: ['Communication', 'Team Leadership', 'Problem Solving', 'Time Management', 'Agile'],
    languages: ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Spanish', 'French']
}

export function SkillsSection() {
    const { data, updateSkills, setActiveSection } = useResumeStore()

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, category: keyof typeof data.skills) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const val = e.currentTarget.value.trim()
            if (val) {
                if (!data.skills[category].includes(val)) {
                    updateSkills(category, [...data.skills[category], val])
                }
                e.currentTarget.value = ''
            }
        }
    }

    const removeSkill = (category: keyof typeof data.skills, skill: string) => {
        updateSkills(category, data.skills[category].filter(s => s !== skill))
    }

    const addSuggestion = (category: keyof typeof data.skills, skill: string) => {
        if (!data.skills[category].includes(skill)) {
            updateSkills(category, [...data.skills[category], skill])
        }
    }

    const renderSkillGroup = (
        title: string,
        category: keyof typeof data.skills,
        placeholder: string
    ) => {
        const activeSkills = data.skills[category]
        const availableSuggestions = SUGGESTIONS[category].filter(s => !activeSkills.includes(s)).slice(0, 6)

        return (
            <div className="space-y-3">
                <Label className="text-slate-300 font-semibold text-base">{title}</Label>

                {/* Input Box */}
                <div className="flex flex-wrap gap-2 p-3 bg-black/20 border border-white/10 rounded-lg min-h-[52px] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    {activeSkills.map(skill => (
                        <span key={skill} className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-sm flex items-center shadow-sm">
                            {skill}
                            <button
                                onClick={() => removeSkill(category, skill)}
                                className="ml-1.5 hover:text-red-200 transition-colors bg-white/10 rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        onKeyDown={(e) => handleKeyDown(e, category)}
                        className="bg-transparent border-none outline-none text-sm text-white flex-1 min-w-[150px]"
                        placeholder={activeSkills.length === 0 ? placeholder : "Add another..."}
                    />
                </div>

                {/* Suggestions */}
                {availableSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-slate-500 py-1">Suggestions:</span>
                        {availableSuggestions.map(suggestion => (
                            <button
                                key={suggestion}
                                onClick={() => addSuggestion(category, suggestion)}
                                className="text-xs text-slate-400 border border-white/5 bg-white/5 hover:bg-white/10 hover:text-slate-200 px-2.5 py-1 rounded-full flex items-center transition-all"
                            >
                                <Plus className="w-3 h-3 mr-1 opacity-50" /> {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span>🛠️</span> Skills
                </h2>
                <p className="text-slate-400 mt-2 text-sm">List skills relevant to the job. Technical skills are critical for passing ATS filters.</p>
            </div>

            <Card className="p-6 md:p-8 bg-[#0F172A] border-white/5 space-y-10">

                {renderSkillGroup('Technical Skills', 'technical', 'e.g. React, Python, Django... (Press Enter to add)')}

                <div className="h-px bg-white/5"></div>
                {renderSkillGroup('Tools & Technologies', 'tools', 'e.g. Git, Docker, Figma...')}

                <div className="h-px bg-white/5"></div>
                {renderSkillGroup('Soft Skills', 'soft', 'e.g. Leadership, Communication...')}

                <div className="h-px bg-white/5"></div>
                {renderSkillGroup('Languages', 'languages', 'e.g. English, Hindi...')}

            </Card>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setActiveSection('projects')}
                    className="text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={() => setActiveSection('certifications')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Next: Certifications →
                </button>
            </div>
        </div>
    )
}
