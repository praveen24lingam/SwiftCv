'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { useEffect } from 'react'

export function AchievementsSection() {
    const { data, addAchievement, updateAchievement, removeAchievement, setActiveSection } = useResumeStore()

    const generateId = () => Math.random().toString(36).substr(2, 9)

    useEffect(() => {
        if (data.achievements.length === 0) {
            handleAdd()
        }
    }, [])

    const handleAdd = () => {
        addAchievement({
            id: generateId(),
            title: '',
            description: '',
            date: '',
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span>🏆</span> Achievements & Awards
                </h2>
                <p className="text-slate-400 mt-2 text-sm">Include hackathon wins, scholarships, competitive programming ranks, or academic honors.</p>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {data.achievements.map((ach, index) => (
                        <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 bg-[#0F172A] border-white/5 relative group">

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-200">Achievement #{index + 1}</h3>
                                    <button
                                        onClick={() => removeAchievement(ach.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-slate-300">Award / Achievement Title *</Label>
                                        <Input
                                            value={ach.title}
                                            onChange={e => updateAchievement(ach.id, { title: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11"
                                            placeholder="e.g. 1st Runner Up - Smart India Hackathon 2024"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2 relative">
                                        <Label className="text-slate-300 flex justify-between">
                                            <span>Short Description</span>
                                            <span className={`text-xs ${ach.description.length > 120 ? 'text-red-400' : 'text-slate-500'}`}>
                                                {ach.description.length} / 120
                                            </span>
                                        </Label>
                                        <Textarea
                                            value={ach.description}
                                            onChange={e => {
                                                if (e.target.value.length <= 120) {
                                                    updateAchievement(ach.id, { description: e.target.value })
                                                }
                                            }}
                                            className="bg-black/20 border-white/10 min-h-[80px] text-sm resize-none"
                                            placeholder="Built an ML model predicting crop yields with 94% accuracy, competing against 500+ teams."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Date (Optional)</Label>
                                        <Input
                                            type="month"
                                            value={ach.date || ''}
                                            onChange={e => updateAchievement(ach.id, { date: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11 text-slate-300 w-full sm:w-1/2"
                                        />
                                    </div>
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
                    Add Achievement
                </Button>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setActiveSection('certifications')}
                    className="text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                    ← Back
                </button>
                {/* If we had a next step, we'd put it here. Right now this is the end of the line. */}
            </div>
        </div>
    )
}
