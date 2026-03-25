'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
    const isOnline = useOnlineStatus()

    if (isOnline) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black py-1.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold shadow-md animate-in slide-in-from-top">
            <WifiOff className="w-3.5 h-3.5" />
            <span>You're offline — changes will sync when reconnected</span>
        </div>
    )
}
