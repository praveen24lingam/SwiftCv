import Link from 'next/link'
import { Syne } from 'next/font/google'
import { Heart } from 'lucide-react'

const syne = Syne({ subsets: ['latin'] })

export function Footer() {
    return (
        <footer className="bg-[#050508] border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">

                    <div className="max-w-xs">
                        <Link href="/" className="inline-block group mb-4">
                            <span className={`${syne.className} text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors`}>
                                <span className="text-blue-500">⚡</span> SwiftCV
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            The only completely free, ATS-guaranteed resume builder optimized for Indian students and freshers.
                        </p>
                    </div>

                    <div className="flex gap-8 sm:gap-12">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-white font-semibold mb-1">Product</h4>
                            <Link href="/build" className="text-slate-400 hover:text-white transition-colors text-sm">Resume Builder</Link>
                            <Link href="/templates" className="text-slate-400 hover:text-white transition-colors text-sm">Templates</Link>
                            <Link href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-white font-semibold mb-1">Legal</h4>
                            <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                            <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
                            <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Us</Link>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} SwiftCV. Free forever for students.
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Indian students
                    </div>
                </div>

            </div>
        </footer>
    )
}
