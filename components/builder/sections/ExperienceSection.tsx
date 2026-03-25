'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Sparkles, GripVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { AIAssist } from '@/components/builder/AIAssist'
import { detectWeakVerbs } from '@/lib/verb-checker'

export function ExperienceSection() {
    const { data, addExperience, updateExperience, removeExperience, setActiveSection } = useResumeStore()

    const generateId = () => Math.random().toString(36).substr(2, 9)

    useEffect(() => {
        if (data.experience.length === 0) {
            handleAdd()
        }
    }, [])

    const handleAdd = () => {
        addExperience({
            id: generateId(),
            title: '',
            company: '',
            type: 'internship',
            startDate: '',
            endDate: '',
            current: false,
            bullets: [''],
        })
    }

    const updateBullet = (expId: string, bulletIndex: number, text: string) => {
        const exp = data.experience.find(e => e.id === expId)
        if (!exp) return
        const newBullets = [...exp.bullets]
        newBullets[bulletIndex] = text
        updateExperience(expId, { bullets: newBullets })
    }

    const addBullet = (expId: string) => {
        const exp = data.experience.find(e => e.id === expId)
        if (!exp) return
        if (exp.bullets.length < 5) {
            updateExperience(expId, { bullets: [...exp.bullets, ''] })
        }
    }

    const removeBullet = (expId: string, bulletIndex: number) => {
        const exp = data.experience.find(e => e.id === expId)
        if (!exp) return
        if (exp.bullets.length > 1) {
            const newBullets = exp.bullets.filter((_, i) => i !== bulletIndex)
            updateExperience(expId, { bullets: newBullets })
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span>💼</span> Work Experience
                </h2>
                <p className="text-slate-400 mt-2 text-sm">Include internships, part-time jobs, and freelance work. Focus on impact and metrics!</p>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {data.experience.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 bg-[#0F172A] border-white/5 relative group">

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-200">Experience #{index + 1}</h3>
                                    <button
                                        onClick={() => removeExperience(exp.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Job Type Tabs */}
                                <div className="flex flex-wrap gap-2 mb-6 p-1 bg-black/20 rounded-lg w-fit border border-white/5">
                                    {['internship', 'full-time', 'part-time', 'freelance'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => updateExperience(exp.id, { type: type as any })}
                                            className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${exp.type === type ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                            {type.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Job Title *</Label>
                                        <Input
                                            value={exp.title}
                                            onChange={e => updateExperience(exp.id, { title: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11"
                                            placeholder="e.g. Frontend Developer Intern"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Company Name *</Label>
                                        <Input
                                            value={exp.company}
                                            onChange={e => updateExperience(exp.id, { company: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11"
                                            placeholder="e.g. Google"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Start Date</Label>
                                        <Input
                                            type="month"
                                            value={exp.startDate}
                                            onChange={e => updateExperience(exp.id, { startDate: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11 text-slate-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">End Date</Label>
                                        <Input
                                            type="month"
                                            value={exp.endDate}
                                            onChange={e => updateExperience(exp.id, { endDate: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11 text-slate-300 disabled:opacity-50"
                                            disabled={exp.current}
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/5 w-fit">
                                        <Checkbox
                                            id={`current-job-${exp.id}`}
                                            checked={exp.current}
                                            onCheckedChange={(checked) => {
                                                updateExperience(exp.id, {
                                                    current: checked as boolean,
                                                    endDate: checked ? 'Present' : ''
                                                })
                                            }}
                                            className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <label htmlFor={`current-job-${exp.id}`} className="text-sm font-medium text-slate-300 cursor-pointer">
                                            I currently work here
                                        </label>
                                    </div>
                                </div>

                                {/* Bullets Manager */}
                                <div className="space-y-3">
                                    <Label className="text-slate-300 flex items-center justify-between">
                                        <span>Key Achievements / Responsibilities</span>
                                        <span className="text-xs text-slate-500">{exp.bullets.length}/5 bullets</span>
                                    </Label>

                                    <div className="space-y-3">
                                        {exp.bullets.map((bullet, bIdx) => (
                                            <div key={bIdx} className="flex gap-2 items-start group/bullet">
                                                <div className="mt-3 text-slate-600 cursor-grab">
                                                    <GripVertical className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 relative">
                                                    <Textarea
                                                        value={bullet}
                                                        onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                                                        placeholder={bIdx === 0 ? "Developed a new feature using React that reduced load time by 40%..." : "Another achievement..."}
                                                        className="min-h-[60px] bg-black/20 border-white/10 focus-visible:ring-blue-500 resize-none pr-24 text-sm leading-relaxed"
                                                    />
                                                    <AIAssist
                                                        type="bullet"
                                                        text={bullet}
                                                        role={exp.title}
                                                        onAccept={(newText) => updateBullet(exp.id, bIdx, newText)}
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

                                                {exp.bullets.length > 1 && (
                                                    <button
                                                        onClick={() => removeBullet(exp.id, bIdx)}
                                                        className="mt-2 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover/bullet:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {exp.bullets.length < 5 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => addBullet(exp.id)}
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
                    Add Experience
                </Button>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setActiveSection('education')}
                    className="text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={() => setActiveSection('projects')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Next: Projects →
                </button>
            </div>
        </div>
    )
}
