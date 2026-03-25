'use client'

import { useResumeStore } from '@/store/useResumeStore'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, CheckCircle2 } from 'lucide-react'
import { ShareResume } from '@/components/builder/ShareResume'

// Section configurations
const SECTION_CONFIG: Record<string, { label: string; icon: string }> = {
    personal: { label: 'Personal Info', icon: '👤' },
    summary: { label: 'Summary', icon: '📝' },
    experience: { label: 'Experience', icon: '💼' },
    education: { label: 'Education', icon: '🎓' },
    projects: { label: 'Projects', icon: '🚀' },
    skills: { label: 'Skills', icon: '🛠️' },
    certifications: { label: 'Certifications', icon: '📜' },
    achievements: { label: 'Achievements', icon: '🏆' },
}

// Draggable Item Component
function SortableNavItem({ id, isActive, isComplete, onClick }: { id: string, isActive: boolean, isComplete: boolean, onClick: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const section = SECTION_CONFIG[id]
    if (!section) return null

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center group rounded-lg mb-1 transition-colors ${isActive ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="p-3 cursor-grab active:cursor-grabbing text-slate-600 hover:text-white transition-colors"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Clickable Area */}
            <button
                onClick={onClick}
                className="flex-1 flex items-center py-3 pr-3 text-left"
            >
                <span className="text-lg mr-3 shadow-sm">{section.icon}</span>
                <span className="font-semibold text-sm flex-1">{section.label}</span>

                {/* Completion Checkmark */}
                {isComplete && (
                    <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-emerald-500'} opacity-80`} />
                )}
            </button>
        </div>
    )
}

export function SectionNav() {
    const { data, activeSection, setActiveSection, updateSectionOrder } = useResumeStore()

    // Always show Personal Info and Summary fixed at the top
    const fixedTop = ['personal', 'summary']
    const sortableSections = data.sectionOrder.filter(s => !fixedTop.includes(s))

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = sortableSections.indexOf(active.id as string)
            const newIndex = sortableSections.indexOf(over.id as string)
            const newOrder = arrayMove(sortableSections, oldIndex, newIndex)

            // Update store: preserving the fixed sections at top
            updateSectionOrder([...fixedTop, ...newOrder])
        }
    }

    // Check if a section has data to show the green checkmark
    const isComplete = (sectionId: string) => {
        switch (sectionId) {
            case 'personal': return !!data.personalInfo.fullName && !!data.personalInfo.email;
            case 'summary': return data.summary.length > 10;
            case 'education': return data.education.length > 0;
            case 'experience': return data.experience.length > 0;
            case 'projects': return data.projects.length > 0;
            case 'skills': return Object.values(data.skills).some(arr => arr.length > 0);
            case 'certifications': return data.certifications.length > 0;
            case 'achievements': return data.achievements.length > 0;
            default: return false;
        }
    }

    return (
        <div className="w-full">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">
                Resume Sections
            </div>

            {/* Fixed Top Sections */}
            <div className="mb-4 bg-white/[0.02] p-1 rounded-xl">
                {fixedTop.map(id => (
                    <div
                        key={id}
                        className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors mb-1 ${activeSection === id ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
                        onClick={() => setActiveSection(id)}
                    >
                        <span className="text-lg mr-4 opacity-80">{SECTION_CONFIG[id].icon}</span>
                        <span className="font-semibold text-sm flex-1">{SECTION_CONFIG[id].label}</span>
                        {isComplete(id) && (
                            <CheckCircle2 className={`w-4 h-4 ${activeSection === id ? 'text-blue-500' : 'text-emerald-500'} opacity-80`} />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between px-3 mb-2 font-medium">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Sortable Sections
                </div>
            </div>

            {/* Sortable List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="bg-white/[0.02] p-1 rounded-xl">
                    <SortableContext
                        items={sortableSections}
                        strategy={verticalListSortingStrategy}
                    >
                        {sortableSections.map(id => (
                            <SortableNavItem
                                key={id}
                                id={id}
                                isActive={activeSection === id}
                                isComplete={isComplete(id)}
                                onClick={() => setActiveSection(id)}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            <div className="mt-8 px-3">
                <p className="text-xs text-slate-500 flex items-start gap-2 bg-blue-500/5 p-3 rounded border border-blue-500/10 mb-6">
                    <span>💡</span>
                    <span>Drag the dots to reorder sections. This updates your PDF structure instantly!</span>
                </p>

                {/* Share Component */}
                <ShareResume />
            </div>
        </div>
    )
}
