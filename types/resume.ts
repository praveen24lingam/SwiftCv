export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    linkedin: string;
    github: string;
    portfolio: string;
}

export interface Education {
    id: string;
    degree: string;
    college: string;
    board?: string;
    cgpa?: string;
    percentage?: string;
    startYear: string;
    endYear: string;
    currentlyStudying: boolean;
}

export interface Experience {
    id: string;
    title: string;
    company: string;
    type: 'internship' | 'part-time' | 'freelance' | 'full-time';
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
}

export interface Project {
    id: string;
    title: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    description: string;
    bullets: string[];
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    date?: string;
}

export interface ResumeData {
    id?: string;
    title: string;
    templateId: 'classic' | 'bold' | 'fresh';
    personalInfo: PersonalInfo;
    summary: string;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: {
        technical: string[];
        tools: string[];
        soft: string[];
        languages: string[]
    };
    certifications: Certification[];
    achievements: Achievement[];
    sectionOrder: string[];
    atsScore?: number;
    shareToken?: string;
    isPublic?: boolean;
    views?: number;
    lastUpdated: string;
}
