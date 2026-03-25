import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase-server'

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { action, data } = await req.json()
        const supabase = createClient()

        // 1. Authenticate user
        const { data: { session }, error: authError } = await supabase.auth.getSession()

        if (authError || !session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id

        // 2. Rate Limiting Check
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('ai_rewrites_used, ai_rewrites_date')
            .eq('id', userId)
            .single()

        if (profileError && profileError.code !== 'PGRST116') {
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        const today = new Date().toISOString().split('T')[0]
        let usedCount = profile?.ai_rewrites_used || 0
        const lastDate = profile?.ai_rewrites_date || today

        if (lastDate !== today) {
            usedCount = 0
        }

        if (usedCount >= 10) {
            return NextResponse.json({ error: 'Daily AI limit reached (10/day)' }, { status: 429 })
        }

        // 3. Prepare Anthropic Prompt
        let systemPrompt = ""
        let userPrompt = ""

        switch (action) {
            case 'rewrite_bullet':
                systemPrompt = "You are an expert resume writer for Indian students. Rewrite this bullet point to be strong, specific, and ATS-optimized. Start with a powerful action verb (Built, Developed, Designed, Implemented, etc). Add a metric or outcome if logically possible. Maximum 20 words. Return ONLY the rewritten bullet point, nothing else."
                userPrompt = `Rewrite this bullet: ${data.bullet}\nContext: role is ${data.role || 'Software Engineer'}, tech stack is ${data.techStack?.join(', ') || 'N/A'}`
                break

            case 'generate_summary':
                systemPrompt = "You are a resume expert for Indian freshers. Write a 2-3 sentence ATS-friendly career objective. Be specific. Start with a strong opener. Return ONLY the summary text, no labels or quotes."
                userPrompt = `Generate a summary for a student with these skills: ${data.skills?.join(', ') || 'N/A'}. Target role: ${data.targetRole || 'Software Engineer'}.`
                break

            case 'suggest_keywords':
                systemPrompt = "You are an ATS keyword expert. Return exactly 15 relevant technical keywords for this job role as a valid JSON array of strings. Return ONLY the JSON array, nothing else, no explanation."
                userPrompt = `Job role: ${data.role}. Industry: ${data.industry || 'Technology'}`
                break

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        // 4. Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `${systemPrompt}\n\nTask:\n${userPrompt}`;

        const result = await model.generateContent(prompt);
        const resultText = result.response.text().trim();

        // 5. Update Rate Limit in Database
        // Only update if we successfully generated text
        await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ai_rewrites_used: usedCount + 1,
                ai_rewrites_date: today
            })

        return NextResponse.json({
            result: resultText,
            remaining: 10 - (usedCount + 1)
        })

    } catch (error: any) {
        console.error("AI Route Error:", error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
