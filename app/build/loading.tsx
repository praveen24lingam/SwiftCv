'use client'

import { Loader2 } from 'lucide-react'

export default function BuildLoading() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0F] text-slate-200">
            <header className="sticky top-0 z-50 h-16 bg-[#0A0A0F]/80 border-b border-white/10 flex items-center justify-between px-6 animate-pulse">
                <div className="h-6 w-24 bg-white/5 rounded" />
                <div className="h-8 w-48 bg-white/5 rounded" />
                <div className="h-8 w-32 bg-white/5 rounded" />
            </header>

            <div className="flex-1 flex flex-col md:flex-row">

                {/* Left Sidebar Skeleton */}
                <aside className="hidden md:flex flex-col w-[260px] border-r border-white/5 p-4 space-y-3 shrink-0">
                    <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse" />
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                </aside>

                {/* Center Canvas Skeleton */}
                <main className="flex-1 p-8 lg:p-12 space-y-8 max-w-3xl mx-auto w-full">
                    <div className="h-10 w-1/3 bg-white/5 rounded animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
                        <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
                        <div className="h-32 w-full bg-white/5 rounded animate-pulse" />
                        <div className="h-12 w-1/2 bg-white/5 rounded animate-pulse" />
                    </div>
                </main>

                {/* Right Panel Skeleton */}
                <aside className="hidden xl:flex flex-col w-[450px] border-l border-white/5 shrink-0 p-6 space-y-6">
                    <div className="w-40 h-40 rounded-full bg-white/5 animate-pulse mx-auto" />
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-2 w-full bg-white/5 rounded animate-pulse" />
                        ))}
                    </div>
                    <div className="h-px w-full bg-white/5 my-4" />
                    <div className="h-[600px] w-full bg-white/5 rounded-xl animate-pulse flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
                    </div>
                </aside>

            </div>
        </div>
    )
}
