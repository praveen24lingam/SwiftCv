export const WEAK_VERBS = [
    "worked", "helped", "did", "made", "used", "assisted",
    "supported", "participated", "involved", "got", "was responsible"
];

export const STRONG_ALTERNATIVES: Record<string, string[]> = {
    "worked": ["Built", "Developed", "Engineered", "Collaborated", "Spearheaded"],
    "helped": ["Enabled", "Facilitated", "Supported", "Guided", "Mentored"],
    "did": ["Executed", "Delivered", "Implemented", "Achieved", "Completed"],
    "made": ["Created", "Designed", "Developed", "Formulated", "Produced"],
    "used": ["Leveraged", "Implemented", "Utilized", "Deployed", "Harnessed"],
    "assisted": ["Facilitated", "Collaborated", "Supported", "Contributed"],
    "supported": ["Maintained", "Optimized", "Troubleshot", "Strengthened"],
    "participated": ["Contributed", "Engaged", "Partnered", "Co-led"],
    "involved": ["Integral to", "Key contributor to", "Partnered in"],
    "got": ["Acquired", "Obtained", "Secured", "Earned"],
    "was responsible": ["Managed", "Led", "Directed", "Orchestrated", "Oversaw"]
};

export interface WeakVerbMatch {
    verb: string;
    alternatives: string[];
    index: number;
}

/**
 * Scans a string of text for weak action verbs and returns matches.
 */
export function detectWeakVerbs(text: string): WeakVerbMatch[] {
    if (!text) return [];

    const matches: WeakVerbMatch[] = [];
    const lowerText = text.toLowerCase();

    // Create word boundaries safely
    WEAK_VERBS.forEach(verb => {
        // Regex matches the verb as a distinct word or phrase
        const regex = new RegExp(`\\b${verb}\\b`, 'gi');
        let match;

        // Find all occurrences
        while ((match = regex.exec(lowerText)) !== null) {
            matches.push({
                verb,
                alternatives: STRONG_ALTERNATIVES[verb] || ["Improved", "Managed"],
                index: match.index
            });
        }
    });

    // Sort by index so we highlight them in order
    return matches.sort((a, b) => a.index - b.index);
}
