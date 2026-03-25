'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Sparkles, X, Github, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState, KeyboardEvent } from 'react'
import { AIAssist } from '@/components/builder/AIAssist'
import { detectWeakVerbs } from '@/lib/verb-checker'

export function ProjectsSection() {
    const { data, addProject, updateProject, removeProject, setActiveSection } = useResumeStore()

    const generateId = () => Math.random().toString(36).substr(2, 9)

    useEffect(() => {
        if (data.projects.length === 0) {
            handleAdd()
        }
    }, [])

    const handleAdd = () => {
        addProject({
            id: generateId(),
            title: '',
            techStack: [],
            liveUrl: '',
            githubUrl: '',
            description: '',
            bullets: [''],
        })
    }

    const handleTechStackKeyDown = (e: KeyboardEvent<HTMLInputElement>, projId: string) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const val = e.currentTarget.value.trim()
            if (val) {
                const proj = data.projects.find(p => p.id === projId)
                if (proj && !proj.techStack.includes(val)) {
                    updateProject(projId, { techStack: [...proj.techStack, val] })
                }
                e.currentTarget.value = ''
            }
        }
    }

    const removeTech = (projId: string, tech: string) => {
        const proj = data.projects.find(p => p.id === projId)
        if (proj) {
            updateProject(projId, { techStack: proj.techStack.filter(t => t !== tech) })
        }
    }

    const updateBullet = (projId: string, bulletIndex: number, text: string) => {
        const proj = data.projects.find(e => e.id === projId)
        if (!proj) return
        const newBullets = [...proj.bullets]
        newBullets[bulletIndex] = text
        updateProject(projId, { bullets: newBullets })
    }

    const addBullet = (projId: string) => {
        const proj = data.projects.find(e => e.id === projId)
        if (!proj) return
        if (proj.bullets.length < 4) {
            updateProject(projId, { bullets: [...proj.bullets, ''] })
        }
    }

    const removeBullet = (projId: string, bulletIndex: number) => {
        const proj = data.projects.find(e => e.id === projId)
        if (!proj) return
        if (proj.bullets.length > 1) {
            const newBullets = proj.bullets.filter((_, i) => i !== bulletIndex)
            updateProject(projId, { bullets: newBullets })
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span>🚀</span> Projects
                </h2>
                <p className="text-slate-400 mt-2 text-sm">For freshers, projects are your proof of skill. Add 2-3 strong projects.</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6 flex gap-3 text-amber-200/90 text-sm">
                <span className="text-amber-500">💡</span>
                <p><strong>Recruiter Secret:</strong> Recruiters look at projects first. Include live links, GitHub repos, and specific technologies you used.</p>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {data.projects.map((proj, index) => (
                        <motion.div
                            key={proj.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 bg-[#0F172A] border-white/5 relative group">

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-200">Project #{index + 1}</h3>
                                    <button
                                        onClick={() => removeProject(proj.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-slate-300">Project Title *</Label>
                                        <Input
                                            value={proj.title}
                                            onChange={e => updateProject(proj.id, { title: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11 text-lg font-medium"
                                            placeholder="e.g. AI-Powered Resume Builder"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-slate-300">Tech Stack (Type and press Enter) *</Label>
                                        <div className="flex flex-wrap gap-2 p-2 bg-black/20 border border-white/10 rounded-md min-h-11">
                                            {proj.techStack.map(tech => (
                                                <span key={tech} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs flex items-center border border-blue-500/20">
                                                    {tech}
                                                    <button onClick={() => removeTech(proj.id, tech)} className="ml-1 hover:text-white">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                onKeyDown={(e) => handleTechStackKeyDown(e, proj.id)}
                                                className="bg-transparent border-none outline-none text-sm text-white flex-1 min-w-[120px]"
                                                placeholder={proj.techStack.length === 0 ? "e.g. React, Node.js, PostgreSQL..." : "Add more..."}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300 flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Live Demo URL</Label>
                                        <Input
                                            value={proj.liveUrl}
                                            onChange={e => updateProject(proj.id, { liveUrl: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11"
                                            placeholder="https://swiftcv.vercel.app"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300 flex items-center gap-2"><Github className="w-4 h-4" /> GitHub Repository</Label>
                                        <Input
                                            value={proj.githubUrl}
                                            onChange={e => updateProject(proj.id, { githubUrl: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11"
                                            placeholder="github.com/username/repo"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-slate-300 flex items-center justify-between">
                                        <span>Project Details / Accomplishments</span>
                                        <span className="text-xs text-slate-500">{proj.bullets.length}/4 bullets</span>
                                    </Label>

                                    <div className="space-y-3">
                                        {proj.bullets.map((bullet, bIdx) => (
                                            <div key={bIdx} className="flex gap-2 items-start group/bullet">
                                                <div className="flex-1 relative">
                                                    <Textarea
                                                        value={bullet}
                                                        onChange={(e) => updateBullet(proj.id, bIdx, e.target.value)}
                                                        placeholder={bIdx === 0 ? "Architected a scalable backend using Node.js..." : "What did you build?"}
                                                        className="min-h-[60px] bg-black/20 border-white/10 focus-visible:ring-blue-500 resize-none pr-24 text-sm leading-relaxed"
                                                    />
                                                    <AIAssist
                                                        type="bullet"
                                                        text={bullet}
                                                        role={proj.title}
                                                        techStack={proj.techStack}
                                                        onAccept={(newText) => updateBullet(proj.id, bIdx, newText)}
                                                    />
                                                </div>

                                                {/* Verb Checker Warnings */}
                                                {bullet && detectWeakVerbs(bullet).length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {detectWeakVerbs(bullet).map((match, mIdx) => (
                                                            <div key={mIdx} className="text-[10px] bg-yellow-500/10 text-yellow-500/90 px-2 py-1 rounded border border-yellow-500/20">
                                                                <span className="font-bold line-through opacity-70 mr-1">{match.verb}</span>
                                                                💡 Try: {match.alternatives.slice(0, 3).join(', ')}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {proj.bullets.length > 1 && (
                                                    <button
                                                        onClick={() => removeBullet(proj.id, bIdx)}
                                                        className="mt-2 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover/bullet:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {proj.bullets.length < 4 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => addBullet(proj.id)}
                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 mt-2"
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add Bullet Point
                                        </Button>
                                    )}
                                </div>

                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <Button
                    variant="outline"
                    onClick={handleAdd}
                    className="w-full border-dashed border-white/20 bg-transparent hover:bg-white/5 text-blue-400 py-6"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                </Button>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setActiveSection('experience')}
                    className="text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={() => setActiveSection('skills')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Next: Skills →
                </button>
            </div>
        </div>
    )
}
