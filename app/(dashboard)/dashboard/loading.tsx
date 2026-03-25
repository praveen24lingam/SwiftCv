'use client'

export default function DashboardLoading() {
    return (
        <div className="p-8">
            {/* Header Skeleton */}
            <div className="mb-12 animate-pulse">
                <div className="h-10 w-64 bg-white/5 rounded mb-4" />
                <div className="h-5 w-48 bg-white/5 rounded" />
            </div>

            {/* Stats Row Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-[#0F172A] border border-white/5 rounded-xl" />
                ))}
            </div>

            {/* Resumes Grid Skeleton */}
            <div className="space-y-6 animate-pulse">
                <div className="flex items-center justify-between mb-6">
                    <div className="h-8 w-40 bg-white/5 rounded" />
                    <div className="h-10 w-32 bg-white/5 rounded" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-[280px] bg-[#0F172A] border border-white/5 rounded-xl overflow-hidden flex flex-col">
                            <div className="h-32 bg-white/5" />
                            <div className="p-5 space-y-4 flex-1">
                                <div className="h-5 w-3/4 bg-white/5 rounded" />
                                <div className="h-4 w-1/2 bg-white/5 rounded" />
                            </div>
                            <div className="h-14 bg-white/5 border-t border-white/5" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
