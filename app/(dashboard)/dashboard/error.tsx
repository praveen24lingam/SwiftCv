'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Dashboard Error:', error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-5 max-w-sm">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto opacity-80" />
                <h2 className="text-2xl font-bold text-white">Failed to load dashboard</h2>
                <p className="text-slate-400 text-sm">
                    We encountered an error loading your resumes. This might be a temporary network issue.
                </p>
                <Button
                    onClick={() => reset()}
                    variant="outline"
                    className="mt-4 border-white/10 hover:bg-white/5 text-white"
                >
                    Refresh Dashboard
                </Button>
            </div>
        </div>
    )
}
