import { ResumeData } from '@/types/resume'

export interface ScoredItem {
    label: string;
    earned: boolean;
    points: number;
}

export interface ATSScoreResult {
    total: number;
    pillars: {
        format: { score: number; max: 20; items: ScoredItem[] };
        content: { score: number; max: 20; items: ScoredItem[] };
        keyword: { score: number; max: 20; items: ScoredItem[] };
        impact: { score: number; max: 20; items: ScoredItem[] };
        completeness: { score: number; max: 20; items: ScoredItem[] };
    };
    issues: { text: string; priority: 'high' | 'medium' | 'low' }[];
    suggestions: { text: string; priority: 'high' | 'medium' | 'low'; section: string }[];
}

const ACTION_VERBS = [
    'built', 'developed', 'designed', 'created', 'implemented', 'led', 'managed',
    'improved', 'reduced', 'increased', 'launched', 'delivered', 'engineered',
    'architected', 'automated', 'optimized'
];

export function calculateATSScore(data: ResumeData): ATSScoreResult {
    const result: ATSScoreResult = {
        total: 0,
        pillars: {
            format: { score: 0, max: 20, items: [] },
            content: { score: 0, max: 20, items: [] },
            keyword: { score: 0, max: 20, items: [] },
            impact: { score: 0, max: 20, items: [] },
            completeness: { score: 0, max: 20, items: [] },
        },
        issues: [],
        suggestions: []
    };

    const p = data.personalInfo;

    // ============================================
    // PILLAR 1: FORMAT SCORE (20 pts)
    // ============================================
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email);
    const phoneValid = /(\+91[\s-]?)?[6-9]\d{9}/.test(p.phone) || p.phone.length >= 10;
    const hasLinkedIn = !!p.linkedin && p.linkedin.toLowerCase().includes('linkedin');
    const hasGithub = !!p.github && p.github.toLowerCase().includes('github');
    const hasCity = !!p.city && p.city.trim().length > 2;

    result.pillars.format.items.push(
        { label: 'Email present and valid', earned: emailValid, points: 5 },
        { label: 'Phone number present', earned: phoneValid, points: 5 },
        { label: 'LinkedIn URL present', earned: hasLinkedIn, points: 4 },
        { label: 'GitHub URL present', earned: hasGithub, points: 3 },
        { label: 'City/Location present', earned: hasCity, points: 3 }
    );

    result.pillars.format.score = result.pillars.format.items
        .filter(i => i.earned).reduce((sum, i) => sum + i.points, 0);

    // Issues and Suggestions for Format
    if (!emailValid) result.issues.push({ text: "Missing or invalid email format.", priority: 'high' });
    if (!phoneValid) result.issues.push({ text: "Missing valid phone number.", priority: 'high' });
    if (!hasLinkedIn) result.issues.push({ text: "Missing LinkedIn URL — crucial for recruiters.", priority: 'high' });
    if (!hasGithub) result.issues.push({ text: "Missing GitHub URL — adds 3 ATS points + recruiter trust.", priority: 'high' });

    // ============================================
    // PILLAR 2: CONTENT SCORE (20 pts)
    // ============================================
    const summaryValid = !!data.summary && data.summary.trim().length > 60;
    const eduValid = data.education.some(e => e.college && e.college.trim().length > 3);
    const projOrExpValid = data.projects.length > 0 || data.experience.length > 0;

    const allSkillsRaw = [...data.skills.technical, ...data.skills.tools, ...data.skills.soft, ...data.skills.languages];
    const skillsValid = allSkillsRaw.length >= 5;

    // Extract all text to count words pseudo-accurately
    const allText = [
        data.summary,
        ...data.experience.flatMap(e => [e.title, e.company, ...e.bullets]),
        ...data.projects.flatMap(p => [p.title, p.description, ...p.techStack, ...p.bullets]),
        ...allSkillsRaw,
        ...data.education.map(e => `${e.college} ${e.degree}`),
    ].join(' ').trim();

    const wordCount = allText.split(/\s+/).filter(w => w.length > 0).length;
    const lengthValid = wordCount >= 300 && wordCount <= 900;

    result.pillars.content.items.push(
        { label: 'Summary > 60 characters', earned: summaryValid, points: 6 },
        { label: 'Education with college name', earned: eduValid, points: 4 },
        { label: 'Has Project or Experience entry', earned: projOrExpValid, points: 4 },
        { label: 'At least 5 skills listed', earned: skillsValid, points: 3 },
        { label: 'Word count (300-900 words)', earned: lengthValid, points: 3 }
    );

    result.pillars.content.score = result.pillars.content.items
        .filter(i => i.earned).reduce((sum, i) => sum + i.points, 0);

    if (!summaryValid) result.suggestions.push({ text: "Summary is too short — expand to 2-3 sentences.", priority: 'medium', section: 'summary' });
    if (wordCount < 300) result.suggestions.push({ text: `Resume is only ${wordCount} words. Try adding more bullet points to experiences or projects.`, priority: 'medium', section: 'general' });
    if (wordCount > 900) result.suggestions.push({ text: `Resume is ${wordCount} words. Over 900 words is considered too long. Trim down older experiences.`, priority: 'medium', section: 'general' });

    // ============================================
    // PILLAR 3: KEYWORD SCORE (20 pts)
    // ============================================
    const technicalSkillCount = data.skills.technical.length + data.skills.tools.length;
    const techPoints = Math.min(10, technicalSkillCount * 2);

    const allBullets = [
        ...data.experience.flatMap(e => e.bullets),
        ...data.projects.flatMap(p => p.bullets)
    ];
    const allBulletsTextLower = allBullets.join(' ').toLowerCase();

    const hasActionVerbsInBullets = ACTION_VERBS.some(verb => allBulletsTextLower.includes(verb));

    const summaryLower = (data.summary || '').toLowerCase();
    const summaryHasKeyword = ACTION_VERBS.some(verb => summaryLower.includes(verb)) ||
        data.skills.technical.some(skill => summaryLower.includes(skill.toLowerCase()));

    result.pillars.keyword.items.push(
        { label: 'Technical skills (2 pts each)', earned: techPoints > 0, points: techPoints },
        { label: 'Action verbs in bullets', earned: hasActionVerbsInBullets, points: hasActionVerbsInBullets ? 5 : 0 },
        { label: 'Keywords or action verb in summary', earned: summaryHasKeyword, points: summaryHasKeyword ? 5 : 0 }
    );

    result.pillars.keyword.score = techPoints + (hasActionVerbsInBullets ? 5 : 0) + (summaryHasKeyword ? 5 : 0);

    if (!hasActionVerbsInBullets && allBullets.length > 0) result.suggestions.push({ text: "Use action verbs (e.g., Built, Optimized, Reduced) in your bullet points.", priority: 'high', section: 'experience' });

    // ============================================
    // PILLAR 4: IMPACT SCORE (20 pts)
    // ============================================
    const metricRegex = /\d+%|\d+x|x\d+|\$\d+|\d+\s?(users|students|projects|hours|days|ms|seconds|requests|APIs|features|lines|GB|MB|KB)/i;

    let bulletsWithMetrics = 0;
    let bulletsWithStartVerbs = 0;

    allBullets.forEach(bullet => {
        if (metricRegex.test(bullet)) bulletsWithMetrics++;

        // Check if the first word is an action verb
        const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase();
        if (firstWord && ACTION_VERBS.includes(firstWord)) {
            bulletsWithStartVerbs++;
        }
    });

    const metricPoints = Math.min(15, bulletsWithMetrics * 3);
    const startVerbPoints = bulletsWithStartVerbs >= 2 ? 5 : 0;

    result.pillars.impact.items.push(
        { label: 'Bullets with numbers/metrics', earned: metricPoints > 0, points: metricPoints },
        { label: 'Action verbs starting bullets', earned: bulletsWithStartVerbs >= 2, points: startVerbPoints }
    );

    result.pillars.impact.score = metricPoints + startVerbPoints;

    if (bulletsWithMetrics === 0 && allBullets.length > 0) {
        result.issues.push({ text: "No quantified achievements — add numbers like 'Improved speed by 40%'.", priority: 'high' });
    }

    // ============================================
    // PILLAR 5: COMPLETENESS SCORE (20 pts)
    // ============================================
    const hasMultipleProjects = data.projects.length >= 2;
    const hasCert = data.certifications.length >= 1;
    const hasAchievement = data.achievements.length >= 1;
    const hasPortfolio = !!p.portfolio && p.portfolio.length >= 5;
    const basicContactComplete = !!(p.email && p.phone && p.city);

    result.pillars.completeness.items.push(
        { label: '2+ Projects listed', earned: hasMultipleProjects, points: hasMultipleProjects ? 5 : 0 },
        { label: '1+ Certification', earned: hasCert, points: hasCert ? 4 : 0 },
        { label: '1+ Achievement', earned: hasAchievement, points: hasAchievement ? 4 : 0 },
        { label: 'Portfolio URL present', earned: hasPortfolio, points: hasPortfolio ? 4 : 0 },
        { label: 'Basic contact complete', earned: basicContactComplete, points: basicContactComplete ? 3 : 0 }
    );

    result.pillars.completeness.score =
        (hasMultipleProjects ? 5 : 0) +
        (hasCert ? 4 : 0) +
        (hasAchievement ? 4 : 0) +
        (hasPortfolio ? 4 : 0) +
        (basicContactComplete ? 3 : 0);

    if (!hasMultipleProjects) result.issues.push({ text: "Less than 2 projects — freshers need at least 2 strong projects.", priority: 'high' });
    if (!hasCert) result.suggestions.push({ text: "No certifications listed — add Coursera/NPTEL certifications.", priority: 'medium', section: 'certifications' });
    if (!hasPortfolio) result.suggestions.push({ text: "Portfolio URL missing — add if you have one.", priority: 'low', section: 'personal' });

    // ============================================
    // FINAL SCORE CALCULATION
    // ============================================
    result.total =
        result.pillars.format.score +
        result.pillars.content.score +
        result.pillars.keyword.score +
        result.pillars.impact.score +
        result.pillars.completeness.score;

    return result;
}
