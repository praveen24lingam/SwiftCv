'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function BuildError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Build Page Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center space-y-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Something went wrong</h2>
                    <p className="text-sm text-slate-400">
                        Don't worry, your resume data is auto-saved locally. Try refreshing the page.
                    </p>
                </div>

                <Button
                    onClick={() => reset()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        </div>
    )
}
