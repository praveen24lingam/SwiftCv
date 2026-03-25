'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github, Linkedin, ExternalLink } from 'lucide-react'

export function PersonalInfoSection() {
    const { data, updatePersonalInfo } = useResumeStore()
    const p = data.personalInfo

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span>👤</span> Personal Information
                </h2>
                <p className="text-slate-400 mt-2 text-sm">Fill out your primary contact details. This usually sits at the very top of your resume.</p>
            </div>

            <Card className="p-6 bg-[#0F172A] border-white/5 space-y-6">

                {/* Core Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Full Name *</Label>
                        <Input
                            value={p.fullName}
                            onChange={e => updatePersonalInfo({ fullName: e.target.value })}
                            className="bg-black/20 border-white/10 focus-visible:ring-blue-500 h-11"
                            placeholder="e.g. Arjun Sharma"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Email Address *</Label>
                        <Input
                            type="email"
                            value={p.email}
                            onChange={e => updatePersonalInfo({ email: e.target.value })}
                            className="bg-black/20 border-white/10 focus-visible:ring-blue-500 h-11"
                            placeholder="e.g. arjun.s@gmail.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Phone Number *</Label>
                        <div className="flex">
                            <span className="flex items-center justify-center bg-black/40 border border-white/10 border-r-0 rounded-l-md px-3 text-slate-400 text-sm">
                                +91
                            </span>
                            <Input
                                type="tel"
                                value={p.phone}
                                onChange={e => updatePersonalInfo({ phone: e.target.value })}
                                className="bg-black/20 border-white/10 rounded-l-none focus-visible:ring-blue-500 h-11"
                                placeholder="98765 43210"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">City & State *</Label>
                        <Input
                            value={p.city}
                            onChange={e => updatePersonalInfo({ city: e.target.value })}
                            className="bg-black/20 border-white/10 focus-visible:ring-blue-500 h-11"
                            placeholder="e.g. Bangalore, KA"
                        />
                    </div>
                </div>

                <div className="h-px w-full bg-white/5 my-6"></div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-2">
                        <Label className="text-slate-300 flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-blue-500" /> LinkedIn URL
                        </Label>
                        <Input
                            value={p.linkedin}
                            onChange={e => updatePersonalInfo({ linkedin: e.target.value })}
                            className="bg-black/20 border-white/10 focus-visible:ring-blue-500 h-11"
                            placeholder="linkedin.com/in/username"
                        />
                        {p.linkedin && (
                            <a href={`https://${p.linkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1">
                                Verify link <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>

                    <div className="space-y-2 relative group">
                        <Label className="text-slate-300 flex items-center gap-2">
                            <Github className="w-4 h-4 text-slate-100" /> GitHub URL
                        </Label>
                        <Input
                            value={p.github}
                            onChange={e => updatePersonalInfo({ github: e.target.value })}
                            className="bg-black/20 border-white/10 focus-visible:ring-blue-500 h-11"
                            placeholder="github.com/username"
                        />
                        {p.github && (
                            <a href={`https://${p.github.replace('https://', '')}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1">
                                Verify link <ExternalLink className="w-3 h-3" />
                            </a>
                        )}

                        {/* Pro Tip Card */}
                        {!p.github && (
                            <div className="absolute top-12 left-0 right-0 bg-blue-900/20 border border-blue-500/20 text-blue-200 text-xs p-3 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 translate-y-2 group-hover:translate-y-0">
                                <strong>Pro tip:</strong> Add your GitHub profile to increase your ATS software scoring by up to 8 points. Recruiters love seeing code!
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-slate-300 flex items-center gap-2">
                            🌐 Portfolio / Personal Website (Optional)
                        </Label>
                        <Input
                            value={p.portfolio}
                            onChange={e => updatePersonalInfo({ portfolio: e.target.value })}
                            className="bg-black/20 border-white/10 focus-visible:ring-blue-500 h-11"
                            placeholder="yourwebsite.com"
                        />
                    </div>

                </div>

            </Card>

            <div className="flex justify-end pt-4">
                <button
                    onClick={() => useResumeStore.getState().setActiveSection('summary')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Next: Summary →
                </button>
            </div>

        </div>
    )
}
