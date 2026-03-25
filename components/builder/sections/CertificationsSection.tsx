'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export function CertificationsSection() {
    const { data, addCertification, updateCertification, removeCertification, setActiveSection } = useResumeStore()

    const generateId = () => Math.random().toString(36).substr(2, 9)

    useEffect(() => {
        if (data.certifications.length === 0) {
            handleAdd()
        }
    }, [])

    const handleAdd = () => {
        addCertification({
            id: generateId(),
            name: '',
            issuer: '',
            date: '',
            url: '',
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span>📜</span> Certifications
                </h2>
                <p className="text-slate-400 mt-2 text-sm">Add relevant courses and certifications to bulk up your resume.</p>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {data.certifications.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 bg-[#0F172A] border-white/5 relative group">

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-slate-200">Certification #{index + 1}</h3>
                                    <button
                                        onClick={() => removeCertification(cert.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Certificate Name *</Label>
                                        <Input
                                            value={cert.name}
                                            onChange={e => updateCertification(cert.id, { name: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11"
                                            placeholder="e.g. AWS Solutions Architect Associate"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Issuing Organization *</Label>
                                        <Select
                                            value={cert.issuer}
                                            onValueChange={(val) => updateCertification(cert.id, { issuer: val })}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/10 h-11 text-white">
                                                <SelectValue placeholder="Select Issuer" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0F172A] border-white/10 text-white">
                                                <SelectItem value="Coursera">Coursera</SelectItem>
                                                <SelectItem value="Udemy">Udemy</SelectItem>
                                                <SelectItem value="NPTEL">NPTEL</SelectItem>
                                                <SelectItem value="Google">Google</SelectItem>
                                                <SelectItem value="Microsoft">Microsoft</SelectItem>
                                                <SelectItem value="AWS">AWS</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Month / Year Achieved</Label>
                                        <Input
                                            type="month"
                                            value={cert.date}
                                            onChange={e => updateCertification(cert.id, { date: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11 text-slate-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300 flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Credential URL</Label>
                                        <Input
                                            value={cert.url || ''}
                                            onChange={e => updateCertification(cert.id, { url: e.target.value })}
                                            className="bg-black/20 border-white/10 h-11"
                                            placeholder="https://credential.net/..."
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
                    Add Certification
                </Button>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setActiveSection('skills')}
                    className="text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={() => setActiveSection('achievements')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Next: Achievements →
                </button>
            </div>
        </div>
    )
}
