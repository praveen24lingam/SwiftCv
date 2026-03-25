import { ResumeData } from '@/types/resume'

export function FreshTemplate({ data }: { data: ResumeData }) {
    const p = data.personalInfo

    // Force specific section order for FreshTemplate as requested
    const freshOrder = [
        'personal', // Handled outside the loop
        'summary',
        'skills',
        'projects',
        'education',
        'certifications',
        'achievements',
        'experience'
    ]

    return (
        <div
            className="bg-white text-gray-900 font-sans w-[794px] h-[1123px] p-12 flex flex-col box-border overflow-hidden relative"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
            {/* Centered Minimal Header */}
            <div className="text-center mb-6">
                <h1 className="text-[24px] font-medium tracking-wide mb-2 text-black">{p.fullName}</h1>

                <div className="text-[11px] flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-gray-600">
                    {p.city && <span>{p.city}</span>}
                    {p.city && (p.phone || p.email) && <span className="text-gray-300">•</span>}
                    {p.phone && <span>{p.phone}</span>}
                    {p.phone && p.email && <span className="text-gray-300">•</span>}
                    {p.email && <span>{p.email}</span>}
                </div>

                <div className="text-[10px] flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-blue-600 mt-1.5 font-medium">
                    {p.linkedin && <a href={p.linkedin} className="underline">{p.linkedin.replace('https://www.', '').replace('https://', '')}</a>}
                    {p.github && <a href={p.github} className="underline">{p.github.replace('https://www.', '').replace('https://', '')}</a>}
                    {p.portfolio && <a href={p.portfolio} className="underline">{p.portfolio.replace('https://auto', '').replace('https://', '')}</a>}
                </div>
            </div>

            {/* Dynamic Sections (Using specific order for freshers) */}
            <div className="flex-1 flex flex-col gap-5 text-[11px]">
                {freshOrder.map((sectionId) => {
                    switch (sectionId) {

                        case 'summary':
                            if (!data.summary) return null
                            return (
                                <div key="summary">
                                    <h2 className="text-[14px] font-semibold text-gray-800 mb-1.5 uppercase tracking-wide">Professional Summary</h2>
                                    <p className="leading-relaxed text-gray-600 text-[11px]">{data.summary}</p>
                                </div>
                            )

                        case 'skills':
                            const hasSkills = Object.values(data.skills).some(arr => arr.length > 0)
                            if (!hasSkills) return null
                            return (
                                <div key="skills">
                                    <h2 className="text-[14px] font-semibold text-gray-800 mb-1.5 uppercase tracking-wide">Skills</h2>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                                        {data.skills.technical.length > 0 && (
                                            <div className="flex flex-col"><span className="font-semibold text-gray-700 text-[10px] uppercase tracking-wider mb-0.5">Technical Stack</span><span className="text-gray-600">{data.skills.technical.join(', ')}</span></div>
                                        )}
                                        {data.skills.tools.length > 0 && (
                                            <div className="flex flex-col"><span className="font-semibold text-gray-700 text-[10px] uppercase tracking-wider mb-0.5">Tools & Technologies</span><span className="text-gray-600">{data.skills.tools.join(', ')}</span></div>
                                        )}
                                    </div>
                                </div>
                            )

                        case 'projects':
                            if (data.projects.length === 0) return null
                            return (
                                <div key="projects">
                                    <h2 className="text-[14px] font-semibold text-gray-800 mb-2 uppercase tracking-wide">Selected Projects</h2>
                                    <div className="space-y-4">
                                        {data.projects.map(proj => (
                                            <div key={proj.id}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium text-[13px] text-gray-900">{proj.title}</span>
                                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm font-mono">
                                                        {proj.techStack.join('  ')}
                                                    </span>
                                                </div>
                                                <ul className="list-none space-y-1 mt-1.5">
                                                    {proj.bullets.filter(b => b.trim()).map((bullet, i) => (
                                                        <li key={i} className="flex flex-row items-start">
                                                            <span className="text-gray-400 mr-2 text-[14px] leading-[11px]">▪</span>
                                                            <span className="text-gray-600 leading-relaxed text-[10.5px]">{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        case 'education':
                            if (data.education.length === 0) return null
                            return (
                                <div key="education">
                                    <h2 className="text-[14px] font-semibold text-gray-800 mb-2 uppercase tracking-wide">Education</h2>
                                    <div className="space-y-3">
                                        {data.education.map(edu => (
                                            <div key={edu.id}>
                                                <div className="flex justify-between font-semibold text-[13px] text-gray-900 mb-0.5">
                                                    <span>{edu.degree} {edu.board ? `— ${edu.board}` : ''}</span>
                                                    <span className="text-[11px] font-medium text-gray-500">{edu.startYear} – {edu.endYear}</span>
                                                </div>
                                                <div className="flex justify-between font-medium text-gray-600">
                                                    <span>{edu.college}</span>
                                                    <span className="font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded-sm">{edu.cgpa ? `${edu.cgpa}/10` : edu.percentage ? `${edu.percentage}%` : ''}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        case 'experience':
                            if (data.experience.length === 0) return null
                            return (
                                <div key="experience">
                                    <h2 className="text-[14px] font-semibold text-gray-800 mb-2 uppercase tracking-wide">Experience</h2>
                                    <div className="space-y-4">
                                        {data.experience.map(exp => (
                                            <div key={exp.id}>
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <span className="font-medium text-[13px] text-gray-900">{exp.title}</span>
                                                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{exp.startDate} – {exp.endDate}</span>
                                                </div>
                                                <div className="font-medium text-blue-600 mb-1.5">{exp.company}</div>
                                                <ul className="list-none space-y-1">
                                                    {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                                                        <li key={i} className="flex flex-row items-start">
                                                            <span className="text-gray-400 mr-2 text-[14px] leading-[11px]">▪</span>
                                                            <span className="text-gray-600 leading-relaxed text-[10.5px]">{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        case 'certifications':
                            if (data.certifications.length === 0) return null
                            return (
                                <div key="certifications">
                                    <h2 className="text-[14px] font-semibold text-gray-800 mb-2 uppercase tracking-wide">Certifications</h2>
                                    <div className="space-y-1.5">
                                        {data.certifications.map(cert => (
                                            <div key={cert.id} className="flex justify-between items-center text-gray-700">
                                                <div>
                                                    <span className="font-semibold text-gray-900">{cert.name}</span>
                                                    <span className="mx-1.5 text-gray-300">|</span>
                                                    <span>{cert.issuer}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-500">{cert.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        case 'achievements':
                            if (data.achievements.length === 0) return null
                            return (
                                <div key="achievements">
                                    <h2 className="text-[14px] font-semibold text-gray-800 mb-2 uppercase tracking-wide">Achievements</h2>
                                    <div className="space-y-2 text-gray-700">
                                        {data.achievements.map(ach => (
                                            <div key={ach.id} className="flex gap-2 items-start">
                                                <span className="text-amber-500">🏆</span>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{ach.title}</div>
                                                    {ach.description && <div className="leading-snug text-[10.5px] text-gray-600 mt-0.5">{ach.description}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        default:
                            return null
                    }
                })}
            </div>
        </div>
    )
}
