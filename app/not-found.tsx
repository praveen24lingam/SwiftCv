import Link from 'next/link'
import { FileQuestion, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-4 text-center font-sans space-y-6">

            {/* 404 Illustration Area */}
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 rounded-full" />
                <h1 className="text-8xl sm:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-900 font-syne tracking-tighter drop-shadow-2xl">
                    404
                </h1>
            </div>

            <div className="space-y-3 z-10 max-w-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-syne">
                    Resume not found 😅
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    Looks like this page went to a job interview and never came back. Let's get you back to building your career.
                </p>
            </div>

            <div className="pt-4 z-10">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 group">
                    <Link href="/">
                        Back to SwiftCV
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>

        </div>
    )
}
