import { useState, useEffect } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { ATSScoreResult, calculateATSScore } from '@/lib/ats-scorer'

export function useATSScore(): ATSScoreResult & { isCalculating: boolean } {
    const resumeData = useResumeStore(state => state.data)
    const setAtsScore = useResumeStore(state => state.setAtsScore)

    const [result, setResult] = useState<ATSScoreResult>({
        total: 0,
        pillars: {
            format: { score: 0, max: 20, items: [] },
            content: { score: 0, max: 20, items: [] },
            keyword: { score: 0, max: 20, items: [] },
            impact: { score: 0, max: 20, items: [] },
            completeness: { score: 0, max: 20, items: [] }
        },
        issues: [],
        suggestions: []
    })

    const [isCalculating, setIsCalculating] = useState(false)

    useEffect(() => {
        setIsCalculating(true)

        // 500ms debounce on keystrokes
        const timeout = setTimeout(() => {
            const calculation = calculateATSScore(resumeData)
            setResult(calculation)

            // Update store so it visually syncs and saves to DB. 
            // Important to only update if changed to avoid circular useEffect firing.
            if (resumeData.atsScore !== calculation.total) {
                setAtsScore(calculation.total)
            }

            setIsCalculating(false)
        }, 500)

        return () => clearTimeout(timeout)
    }, [resumeData])

    return { ...result, isCalculating }
}
