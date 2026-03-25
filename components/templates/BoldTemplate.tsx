import { ResumeData } from '@/types/resume'

export function BoldTemplate({ data }: { data: ResumeData }) {
    const p = data.personalInfo

    return (
        <div
            className="bg-white text-black font-sans w-[794px] h-[1123px] p-10 flex flex-col box-border overflow-hidden relative"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
            {/* Header */}
            <div className="mb-6 flex border-l-4 border-[#2563EB] pl-3 h-fit">
                <div>
                    <h1 className="text-[28px] font-black uppercase tracking-tight leading-none mb-1.5">{p.fullName}</h1>

                    <div className="text-[11px] flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-700 font-medium">
                        {p.email && <span className="flex items-center gap-1">✉ {p.email}</span>}
                        {p.phone && <span className="flex items-center gap-1">📱 {p.phone}</span>}
                        {p.city && <span className="flex items-center gap-1">📍 {p.city}</span>}
                        {p.linkedin && <span className="flex items-center gap-1">🔗 {p.linkedin.replace('https://www.', '').replace('https://', '')}</span>}
                        {p.github && <span className="flex items-center gap-1">💻 {p.github.replace('https://', '')}</span>}
                        {p.portfolio && <span className="flex items-center gap-1">🌐 {p.portfolio.replace('https://', '')}</span>}
                    </div>
                </div>
            </div>

            {/* Dynamic Sections */}
            <div className="flex-1 flex flex-col gap-5 text-[11px]">
                {data.sectionOrder.map((sectionId) => {
                    switch (sectionId) {

                        case 'summary':
                            if (!data.summary) return null
                            return (
                                <div key="summary">
                                    <h2 className="text-[12px] font-bold uppercase tracking-widest border-b-[1.5px] border-black pb-1 mb-2">Summary</h2>
                                    <p className="leading-relaxed">{data.summary}</p>
                                </div>
                            )

                        case 'education':
                            if (data.education.length === 0) return null
                            return (
                                <div key="education">
                                    <h2 className="text-[12px] font-bold uppercase tracking-widest border-b-[1.5px] border-black pb-1 mb-2">Education</h2>
                                    <div className="space-y-3 mt-2">
                                        {data.education.map(edu => (
                                            <div key={edu.id}>
                                                <div className="flex justify-between font-bold text-[13px] mb-0.5">
                                                    <span>{edu.college}</span>
                                                    <span className="text-[11px] font-medium text-gray-600">{edu.startYear} – {edu.endYear}</span>
                                                </div>
                                                <div className="flex justify-between font-medium text-gray-800">
                                                    <span>{edu.degree} {edu.board ? `— ${edu.board}` : ''}</span>
                                                    <span className="font-bold">{edu.cgpa ? `CGPA: ${edu.cgpa}/10` : edu.percentage ? `${edu.percentage}%` : ''}</span>
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
                                    <h2 className="text-[12px] font-bold uppercase tracking-widest border-b-[1.5px] border-black pb-1 mb-2">Experience</h2>
                                    <div className="space-y-4">
                                        {data.experience.map(exp => (
                                            <div key={exp.id}>
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <span className="font-bold text-[13px]">{exp.company}</span>
                                                    <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">{exp.startDate} – {exp.endDate}</span>
                                                </div>
                                                <div className="font-medium text-gray-800 mb-1.5">{exp.title}</div>
                                                <ul className="list-none space-y-1">
                                                    {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                                                        <li key={i} className="flex flex-row items-start">
                                                            <span className="text-gray-400 mr-2 text-[14px] leading-[11px]">•</span>
                                                            <span className="text-gray-800 leading-snug">{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        case 'projects':
                            if (data.projects.length === 0) return null
                            return (
                                <div key="projects">
                                    <h2 className="text-[12px] font-bold uppercase tracking-widest border-b-[1.5px] border-black pb-1 mb-2">Projects</h2>
                                    <div className="space-y-4">
                                        {data.projects.map(proj => (
                                            <div key={proj.id}>
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="font-bold text-[13px]">{proj.title}</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="text-[10px] text-gray-500 font-medium font-mono">
                                                        {proj.techStack.join(' · ')}
                                                    </span>
                                                </div>

                                                <ul className="list-none space-y-1 mt-1.5">
                                                    {proj.bullets.filter(b => b.trim()).map((bullet, i) => (
                                                        <li key={i} className="flex flex-row items-start">
                                                            <span className="text-gray-400 mr-2 text-[14px] leading-[11px]">•</span>
                                                            <span className="text-gray-800 leading-snug">{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        case 'skills':
                            const hasSkills = Object.values(data.skills).some(arr => arr.length > 0)
                            if (!hasSkills) return null
                            return (
                                <div key="skills">
                                    <h2 className="text-[12px] font-bold uppercase tracking-widest border-b-[1.5px] border-black pb-1 mb-2">Technical Skills</h2>
                                    <div className="space-y-1">
                                        {data.skills.technical.length > 0 && (
                                            <div className="flex"><span className="font-bold w-24 shrink-0">Languages</span><span className="text-gray-800">{data.skills.technical.join(', ')}</span></div>
                                        )}
                                        {data.skills.tools.length > 0 && (
                                            <div className="flex"><span className="font-bold w-24 shrink-0">Frameworks</span><span className="text-gray-800">{data.skills.tools.join(', ')}</span></div>
                                        )}
                                        {data.skills.soft.length > 0 && (
                                            <div className="flex"><span className="font-bold w-24 shrink-0">Soft Skills</span><span className="text-gray-800">{data.skills.soft.join(', ')}</span></div>
                                        )}
                                    </div>
                                </div>
                            )

                        case 'certifications':
                            if (data.certifications.length === 0) return null
                            return (
                                <div key="certifications">
                                    <h2 className="text-[12px] font-bold uppercase tracking-widest border-b-[1.5px] border-black pb-1 mb-2">Certifications</h2>
                                    <div className="space-y-1.5">
                                        {data.certifications.map(cert => (
                                            <div key={cert.id} className="flex justify-between items-center text-gray-800">
                                                <div>
                                                    <span className="font-bold text-black">{cert.name}</span>
                                                    <span className="mx-1.5">—</span>
                                                    <span>{cert.issuer}</span>
                                                </div>
                                                <span className="font-mono text-[10px] text-gray-500">{cert.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        case 'achievements':
                            if (data.achievements.length === 0) return null
                            return (
                                <div key="achievements">
                                    <h2 className="text-[12px] font-bold uppercase tracking-widest border-b-[1.5px] border-black pb-1 mb-2">Achievements</h2>
                                    <div className="space-y-2 text-gray-800">
                                        {data.achievements.map(ach => (
                                            <div key={ach.id}>
                                                <div className="flex justify-between items-baseline">
                                                    <span className="font-bold text-black">🏆 {ach.title}</span>
                                                    <span className="text-[10px] text-gray-500 font-mono">{ach.date}</span>
                                                </div>
                                                {ach.description && <div className="mt-0.5 leading-snug text-[10px]">{ach.description}</div>}
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
