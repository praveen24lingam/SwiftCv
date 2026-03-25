'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Education } from '@/types/resume'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export function EducationSection() {
    const { data, addEducation, updateEducation, removeEducation, setActiveSection } = useResumeStore()

    // Generate ID helper
    const generateId = () => Math.random().toString(36).substr(2, 9)

    // Ensure there's at least one empty block if none exist
    useEffect(() => {
        if (data.education.length === 0) {
            handleAdd()
        }
    }, [])

    const handleAdd = () => {
        addEducation({
            id: generateId(),
            degree: '',
            college: '',
            startYear: new Date().getFullYear().toString(),
            endYear: (new Date().getFullYear() + 4).toString(),
            currentlyStudying: true,
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span>🎓</span> Education
                </h2>
                <p className="text-slate-400 mt-2 text-sm">List your degrees and schools. Put your most recent education first.</p>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {data.education.map((edu, index) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 bg-[#0F172A] border-white/5 relative group">

                                {/* Header / Delete button */}
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-200">Education #{index + 1}</h3>
                                    {data.education.length > 1 && (
                                        <button
                                            onClick={() => removeEducation(edu.id)}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Remove Education"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Degree Dropdown */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Degree/Course *</Label>
                                        <Select
                                            value={edu.degree}
                                            onValueChange={(val) => updateEducation(edu.id, { degree: val })}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/10 h-11 text-white">
                                                <SelectValue placeholder="Select Degree" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0F172A] border-white/10 text-white">
                                                <SelectItem value="B.Tech">B.Tech</SelectItem>
                                                <SelectItem value="B.E.">B.E.</SelectItem>
                                                <SelectItem value="BCA">BCA</SelectItem>
                                                <SelectItem value="B.Sc">B.Sc</SelectItem>
                                                <SelectItem value="B.Com">B.Com</SelectItem>
                                                <SelectItem value="MBA">MBA</SelectItem>
                                                <SelectItem value="12th">12th Standard</SelectItem>
                                                <SelectItem value="10th">10th Standard</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* College/School Name */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">College / School Name *</Label>
                                        <Input
                                            value={edu.college}
                                            onChange={e => updateEducation(edu.id, { college: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11"
                                            placeholder="e.g. National Institute of Technology"
                                        />
                                    </div>

                                    {/* Conditional Board Field (for 10th/12th) */}
                                    {(edu.degree === '12th' || edu.degree === '10th') && (
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Board</Label>
                                            <Select
                                                value={edu.board}
                                                onValueChange={(val) => updateEducation(edu.id, { board: val })}
                                            >
                                                <SelectTrigger className="bg-black/20 border-white/10 h-11 text-white">
                                                    <SelectValue placeholder="Select Board" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#0F172A] border-white/10 text-white">
                                                    <SelectItem value="CBSE">CBSE</SelectItem>
                                                    <SelectItem value="ICSE">ICSE</SelectItem>
                                                    <SelectItem value="State Board">State Board</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Grades (CGPA or Percentage) */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-slate-300">Grade</Label>
                                            <div className="flex items-center gap-2 text-xs">
                                                <button
                                                    onClick={() => updateEducation(edu.id, { cgpa: undefined, percentage: '' })}
                                                    className={`px-2 py-0.5 rounded ${edu.percentage !== undefined && edu.cgpa === undefined ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                                                >
                                                    %
                                                </button>
                                                <button
                                                    onClick={() => updateEducation(edu.id, { percentage: undefined, cgpa: '' })}
                                                    className={`px-2 py-0.5 rounded ${edu.cgpa !== undefined ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                                                >
                                                    CGPA
                                                </button>
                                            </div>
                                        </div>

                                        {edu.cgpa !== undefined ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={edu.cgpa}
                                                    onChange={e => updateEducation(edu.id, { cgpa: e.target.value })}
                                                    className="bg-black/20 border-white/10 h-11"
                                                    placeholder="8.5"
                                                />
                                                <span className="text-slate-500">/ 10</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={edu.percentage || ''}
                                                    onChange={e => updateEducation(edu.id, { percentage: e.target.value })}
                                                    className="bg-black/20 border-white/10 h-11"
                                                    placeholder="85"
                                                />
                                                <span className="text-slate-500">%</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Dates */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Start Year</Label>
                                        <Input type="number" value={edu.startYear} onChange={e => updateEducation(edu.id, { startYear: e.target.value })} className="bg-black/20 border-white/10 h-11" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">End Year (or Expected)</Label>
                                        <Input
                                            type="number"
                                            value={edu.endYear}
                                            onChange={e => updateEducation(edu.id, { endYear: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11 disabled:opacity-50"
                                            disabled={edu.currentlyStudying}
                                        />
                                    </div>

                                    {/* Currently Studying Toggle */}
                                    <div className="md:col-span-2 flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <Checkbox
                                            id={`current-${edu.id}`}
                                            checked={edu.currentlyStudying}
                                            onCheckedChange={(checked) => {
                                                updateEducation(edu.id, {
                                                    currentlyStudying: checked as boolean,
                                                    endYear: checked ? 'Present' : new Date().getFullYear().toString()
                                                })
                                            }}
                                            className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <label
                                            htmlFor={`current-${edu.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300 cursor-pointer"
                                        >
                                            I am currently studying here
                                        </label>
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
                    Add Education
                </Button>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setActiveSection('summary')}
                    className="text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={() => setActiveSection('experience')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Next: Experience →
                </button>
            </div>
        </div>
    )
}
