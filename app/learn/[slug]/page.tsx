import { notFound } from 'next/navigation'
import { Syne } from 'next/font/google'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'

// The actual articles content
const ARTICLE_CONTENT: Record<string, { title: string, category: string, date: string, htmlContent: string }> = {
    'resume-rejected-in-6-seconds': {
        title: 'Why Your Resume Gets Rejected in 6 Seconds',
        category: 'Common Mistakes',
        date: 'March 2024',
        htmlContent: `
      <p class="lead">You spent days perfecting your resume. It lists every project, every skill, and every extracurricular activity you've ever touched. You apply to 50 jobs on LinkedIn and Instahyre. And then... crickets. Absolute silence. You've likely just fall victim to the 6-second filter.</p>
      
      <h2>1. The 6-Second Human Scan</h2>
      <p>A famous eye-tracking study by Ladders found that recruiters spend an average of <strong>7.4 seconds</strong> (often cited as 6 seconds) looking at a resume before making the initial "fit/no fit" decision. In the Indian tech market, where a single fresher opening can attract 5,000+ applications, that number is even lower.</p>
      <p>If a recruiter cannot figure out what you do, what tools you use, and what impact you made within a single glance, you will be rejected. <strong>Actionable fix:</strong> Ditch the two-column resumes. Stick to a clean, single-column top-down hierarchy: Name -> Summary -> Experience -> Projects -> Skills -> Education.</p>
      
      <h2>2. The Invisible Wall: Applicant Tracking Systems (ATS)</h2>
      <p>Before a human even sees your resume for those 6 seconds, it must pass through an Applicant Tracking System. Tools like Workday, Lever, and Greenhouse parse your PDF into raw text. If your resume uses complex CSS formatting, tables, or invisible characters, the ATS cannot read it. It spits out garbled text, and your profile is auto-rejected with a score of 0%.</p>
      <p><strong>Common ATS Killers:</strong></p>
      <ul>
        <li>Using Photoshop or Canva templates with crazy layouts.</li>
        <li>Putting critical info in headers or footers (ATS systems often skip them).</li>
        <li>Using non-standard fonts that don't map to text correctly.</li>
      </ul>

      <h2>3. The Keyword Void</h2>
      <p>ATS systems match the text in your resume against the Job Description (JD). If a startup is hiring for a "MERN Stack Intern", they are querying the database for Resumes containing "React.js", "Node.js", "MongoDB", and "Express".</p>
      <p>If your resume lists "Web Development" or "Frontend Frameworks" but drops the specific name "React", you lose. <strong>Actionable fix:</strong> Always create a robust "Skills" section that lists explicit, atomic technologies (e.g., <em>HTML5, CSS3, JavaScript (ES6+), React.js, Tailwind CSS</em>).</p>

      <h2>4. "Vague" Impact and Passive Voice</h2>
      <p> Indian students often overuse passive verbs: <em>"Helped in building a website."</em> or <em>"Responsible for fixing bugs."</em></p>
      <p>Recruiters hate this. What does "helped" mean? Did you build the whole thing, or did you change the background color? You must use strong action verbs and quantified impact.</p>
      <div class="note">
        <strong>Weak:</strong> Handled database optimization for the final year project.<br/>
        <strong>Strong:</strong> Optimized PostgreSQL queries, reducing database load times by 40% and cutting API response latency from 1.2s to 300ms.
      </div>
      
      <h2>5. Too Much "Fluff"</h2>
      <p>Recruiters do not care that you won a spelling bee in 6th grade, or your hobbies include "Listening to Music and Surfing the Internet." Keep it relevant. If you're applying for an SDE role, only include technical projects, coding achievements, and relevant coursework. Cut the fluff to give the recruiter exactly what they want in those vital 6 seconds.</p>
    `
    },
    'fresher-resume-guide': {
        title: 'Fresher Resume Guide: No Experience? No Problem',
        category: 'Freshers',
        date: 'March 2024',
        htmlContent: `
      <p class="lead">The classic chicken-and-egg problem: You need a job to get experience, but you need experience to get a job. As a fresher graduating from an Indian engineering college, your resume has to compete with thousands of peers. How do you stand out when your "Work Experience" section is empty?</p>
      
      <h2>1. Elevate "Projects" to be your Experience</h2>
      <p>When you lack formal internships, your side projects are your proof of work. Do not just list "Library Management System" with a single line of text. Treat your projects exactly like job experiences.</p>
      <ul>
        <li><strong>Title:</strong> Give it a real name (e.g., "DevFlow - Developer Productivity Tracker")</li>
        <li><strong>Tech Stack:</strong> List the exact tools (React, Supabase, Tailwind)</li>
        <li><strong>Bullets:</strong> Use 3-4 bullet points describing the architecture, features, and technical challenges you overcame.</li>
        <li><strong>Links:</strong> Always include a GitHub repo link AND a deployed Live URL (Vercel, Render, etc.). A deployed app is worth 10x more than a repo.</li>
      </ul>

      <h2>2. Highlight Open Source and Hackathons</h2>
      <p>Did you participate in Smart India Hackathon (SIH)? Did you merge a PR in a random GitHub repo during Hacktoberfest? List it!</p>
      <p>Open source contributions show that you understand Git, collaborative workflows, and reading existing codebases. Hackathons show you can build under pressure and work in a team. Create a dedicated "Achievements" or "Open Source" section for this.</p>
      
      <h2>3. Be Strategic About College and CGPA</h2>
      <p>Unless you are from a Tier-1 college (IIT/NIT/BITS), your college name matters less than your skills. Keep the Education section clean and concise.</p>
      <div class="note">
        <strong>The CGPA Rule:</strong> If your CGPA is above 8.0 (or 80%), proudly display it. If it is between 7.0 and 8.0, include it if the company explicitly asks. If it is below 7.0, leave it off your resume unless it is a mandatory field in an application portal. Let your projects speak for you.
      </div>

      <h2>4. Do Not Fake Skills</h2>
      <p>It is tempting to list 25 different languages in your Skills section just because you wrote a "Hello World" in Python once. Don't.</p>
      <p>A senior engineer will interview you. If they see "Docker" on your resume, they will grill you on containerization. If you falter, they will doubt everything else on the page. Only list technologies you can comfortably talk about for at least 10 minutes.</p>

      <h2>5. Emphasize "Readiness"</h2>
      <p>Companies are afraid of hiring freshers because training them takes months. Your resume must signal: <em>"I am ready to deploy code on day one."</em></p>
      <p>How? Mention modern tooling. If you know Git, CI/CD actions (even basic GitHub actions), testing frameworks (Jest), or cloud deployment (AWS/Vercel), put them front and center. It proves you understand the modern software development lifecycle beyond academic theory.</p>
    `
    }
}

const syne = Syne({ subsets: ['latin'] })

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const article = ARTICLE_CONTENT[params.slug]
    if (!article) return { title: 'Article Not Found | SwiftCV' }
    return {
        title: `${article.title} | SwiftCV Learn`,
        description: `Read about ${article.title} on SwiftCV Learn.`
    }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const article = ARTICLE_CONTENT[params.slug];

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#050508]">
            <Navbar />

            <main className="flex-1 pt-24 pb-24 px-4 sm:px-6">
                <article className="max-w-3xl mx-auto">

                    <Link href="/learn" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-10">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Guide
                    </Link>

                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold tracking-wider uppercase text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                {article.category}
                            </span>
                            <span className="text-sm font-medium text-slate-500">
                                {article.date}
                            </span>
                        </div>
                        <h1 className={`${syne.className} text - 4xl md: text - 5xl font - black text - white leading - tight`}>
                            {article.title}
                        </h1>
                    </header>

                    <div
                        className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white prose-li:text-slate-300 [&>.note]:bg-white/5 [&>.note]:p-6 [&>.note]:rounded-xl [&>.note]:border [&>.note]:border-blue-500/20 [&>.note]:text-blue-100"
                        dangerouslySetInnerHTML={{ __html: article.htmlContent }}
                    />

                    <hr className="my-12 border-white/10" />

                    <div className="bg-[#0A0A0F] border border-white/10 p-8 rounded-2xl text-center">
                        <h3 className={`${syne.className} text - 2xl font - bold text - white mb - 3`}>
                            Ready to fix your resume?
                        </h3>
                        <p className="text-slate-400 mb-6">
                            Apply these learnings right now with SwiftCV's free builder and instant ATS score checker.
                        </p>
                        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                            <Link href="/build">Build Your Resume Now</Link>
                        </Button>
                    </div>

                </article>
            </main>

            <Footer />
        </div>
    )
}
