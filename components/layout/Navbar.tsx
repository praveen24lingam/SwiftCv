'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Syne } from 'next/font/google'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const syne = Syne({ subsets: ['latin'] })

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navbarRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        // Check initial scroll position
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <header
                ref={navbarRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
                    ? 'bg-[#0A0A0F]/90 backdrop-blur-md border-white/10 py-3'
                    : 'bg-transparent border-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className={`${syne.className} text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors`}>
                            <span className="text-blue-500">⚡</span> SwiftCV
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            Features
                        </Link>
                        <Link href="/templates" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            Templates
                        </Link>
                        <Link href="/learn" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            Learn
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-medium">
                            <Link href="/signup">
                                Build Resume Free
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-zinc-300 hover:text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-[#0A0A0F] pt-24 px-6 transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col gap-6 text-lg">
                    <Link
                        href="#features"
                        className="text-zinc-300 hover:text-white font-medium border-b border-white/10 pb-4"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Features
                    </Link>
                    <Link
                        href="/templates"
                        className="text-zinc-300 hover:text-white font-medium border-b border-white/10 pb-4"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Templates
                    </Link>
                    <Link
                        href="/learn"
                        className="text-zinc-300 hover:text-white font-medium border-b border-white/10 pb-4"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Learn
                    </Link>

                    <div className="flex flex-col gap-4 mt-4">
                        <Button asChild variant="outline" className="w-full bg-transparent border-white/20 text-white h-12">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                Log in
                            </Link>
                        </Button>
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                Build Resume Free
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
