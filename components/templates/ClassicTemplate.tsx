import { ResumeData } from '@/types/resume'

export function ClassicTemplate({ data }: { data: ResumeData }) {
    const p = data.personalInfo

    // A4 dimensions: 210 x 297 mm
    // At 96 DPI: 794 x 1123 px
    return (
        <div
            className="bg-white text-black font-serif w-[794px] h-[1123px] p-10 flex flex-col box-border overflow-hidden relative"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-[26px] font-bold uppercase tracking-wide mb-1 leading-tight">{p.fullName}</h1>

                <div className="text-[12px] flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-gray-800">
                    {p.email && <span>{p.email}</span>}
                    {p.phone && <><span>|</span><span>{p.phone}</span></>}
                    {p.city && <><span>|</span><span>{p.city}</span></>}
                    {p.linkedin && <><span>|</span><span>{p.linkedin.replace('https://', '')}</span></>}
                    {p.github && <><span>|</span><span>{p.github.replace('https://', '')}</span></>}
                    {p.portfolio && <><span>|</span><span>{p.portfolio.replace('https://', '')}</span></>}
                </div>
            </div>

            <div className="w-full h-[2px] bg-[#2563EB] mb-4"></div>

            {/* Dynamic Sections */}
            <div className="flex-1 flex flex-col gap-4 text-[11px]">
                {data.sectionOrder.map((sectionId) => {
                    switch (sectionId) {

                        case 'summary':
                            if (!data.summary) return null
                            return (
                                <div key="summary">
                                    <h2 className="text-[13px] font-bold uppercase text-[#2563EB] border-b border-gray-300 pb-0.5 mb-2">Professional Summary</h2>
                                    <p className="text-justify leading-relaxed">{data.summary}</p>
                                </div>
                            )

                        case 'education':
                            if (data.education.length === 0) return null
                            return (
                                <div key="education">
                                    <h2 className="text-[13px] font-bold uppercase text-[#2563EB] border-b border-gray-300 pb-0.5 mb-2">Education</h2>
                                    <div className="space-y-3">
                                        {data.education.map(edu => (
                                            <div key={edu.id}>
                                                <div className="flex justify-between font-bold text-[12px]">
                                                    <span>{edu.degree} {edu.board ? `- ${edu.board}` : ''}</span>
                                                    <span>{edu.startYear} – {edu.endYear}</span>
                                                </div>
                                                <div className="flex justify-between mt-0.5 text-gray-800">
                                                    <span className="italic">{edu.college}</span>
                                                    <span>{edu.cgpa ? `CGPA: ${edu.cgpa}/10` : edu.percentage ? `${edu.percentage}%` : ''}</span>
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
                                    <h2 className="text-[13px] font-bold uppercase text-[#2563EB] border-b border-gray-300 pb-0.5 mb-2">Experience</h2>
                                    <div className="space-y-3">
                                        {data.experience.map(exp => (
                                            <div key={exp.id}>
                                                <div className="flex justify-between font-bold text-[12px]">
                                                    <span>{exp.title}</span>
                                                    <span>{exp.startDate} – {exp.endDate}</span>
                                                </div>
                                                <div className="italic text-gray-800 mb-1">{exp.company}</div>
                                                <ul className="list-none space-y-1">
                                                    {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                                                        <li key={i} className="flex items-start text-justify">
                                                            <span className="mr-2">–</span>
                                                            <span>{bullet}</span>
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
                                    <h2 className="text-[13px] font-bold uppercase text-[#2563EB] border-b border-gray-300 pb-0.5 mb-2">Projects</h2>
                                    <div className="space-y-3">
                                        {data.projects.map(proj => (
                                            <div key={proj.id}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className="font-bold text-[12px]">{proj.title}</span>
                                                    <span className="text-[10px] text-gray-600 italic">
                                                        {proj.liveUrl && <span className="mr-2">{proj.liveUrl.replace('https://', '')}</span>}
                                                        {proj.githubUrl && <span>{proj.githubUrl.replace('https://', '')}</span>}
                                                    </span>
                                                </div>
                                                {proj.techStack.length > 0 && (
                                                    <div className="text-[10px] italic text-gray-700 mb-1">
                                                        Technologies: {proj.techStack.join(', ')}
                                                    </div>
                                                )}
                                                <ul className="list-none space-y-1">
                                                    {proj.bullets.filter(b => b.trim()).map((bullet, i) => (
                                                        <li key={i} className="flex items-start text-justify">
                                                            <span className="mr-2">–</span>
                                                            <span>{bullet}</span>
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
                                    <h2 className="text-[13px] font-bold uppercase text-[#2563EB] border-b border-gray-300 pb-0.5 mb-2">Technical Skills & Competencies</h2>
                                    <div className="space-y-1">
                                        {data.skills.technical.length > 0 && (
                                            <div><span className="font-bold">Languages/Core: </span>{data.skills.technical.join(', ')}</div>
                                        )}
                                        {data.skills.tools.length > 0 && (
                                            <div><span className="font-bold">Tools & Frameworks: </span>{data.skills.tools.join(', ')}</div>
                                        )}
                                        {data.skills.soft.length > 0 && (
                                            <div><span className="font-bold">Core Competencies: </span>{data.skills.soft.join(', ')}</div>
                                        )}
                                        {data.skills.languages.length > 0 && (
                                            <div><span className="font-bold">Spoken Languages: </span>{data.skills.languages.join(', ')}</div>
                                        )}
                                    </div>
                                </div>
                            )

                        case 'certifications':
                            if (data.certifications.length === 0) return null
                            return (
                                <div key="certifications">
                                    <h2 className="text-[13px] font-bold uppercase text-[#2563EB] border-b border-gray-300 pb-0.5 mb-2">Certifications</h2>
                                    <div className="space-y-1.5">
                                        {data.certifications.map(cert => (
                                            <div key={cert.id} className="flex justify-between">
                                                <div>
                                                    <span className="font-bold">{cert.name}</span>
                                                    <span className="italic text-gray-700">, {cert.issuer}</span>
                                                    {cert.url && <span className="text-gray-500 text-[10px] ml-2">({cert.url.replace('https://', '')})</span>}
                                                </div>
                                                <span className="text-gray-800">{cert.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )

                        case 'achievements':
                            if (data.achievements.length === 0) return null
                            return (
                                <div key="achievements">
                                    <h2 className="text-[13px] font-bold uppercase text-[#2563EB] border-b border-gray-300 pb-0.5 mb-2">Honors & Achievements</h2>
                                    <div className="space-y-2">
                                        {data.achievements.map(ach => (
                                            <div key={ach.id}>
                                                <div className="flex justify-between font-bold">
                                                    <span>{ach.title}</span>
                                                    <span>{ach.date}</span>
                                                </div>
                                                {ach.description && <div className="mt-0.5">{ach.description}</div>}
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
