import { Syne } from 'next/font/google'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, CheckCircle2 } from 'lucide-react'

const syne = Syne({ subsets: ['latin'] })

export function CTA() {
    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0A0A0F] via-[#0F1729] to-[#0A0A0F]">
            {/* Radial Dot Pattern Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">

                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <span className="text-3xl">🚀</span>
                </div>

                <h2 className={`${syne.className} text-[40px] md:text-[52px] font-bold text-white mb-6 leading-tight max-w-3xl tracking-tight`}>
                    Your Dream Job Starts With the <span className="text-blue-500">Right Resume</span>
                </h2>

                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                    Join thousands of Indian students building ATS-optimized resumes — completely free.
                </p>

                <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-16 px-10 text-lg font-medium shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] mb-8">
                    <Link href="/build">
                        Build My Free Resume Now
                        <ChevronRight className="ml-2 w-6 h-6" />
                    </Link>
                </Button>

                <div className="flex flex-wrap justify-center items-center gap-y-2 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card</div>
                    <span className="mx-4 opacity-30 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF download free</div>
                    <span className="mx-4 opacity-30 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> All features free</div>
                </div>

            </div>
        </section>
    )
}
