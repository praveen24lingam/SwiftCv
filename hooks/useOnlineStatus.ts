'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(true) // Default true for SSR
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        // Set initial state client-side
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            toast.success('Back online — syncing...', {
                id: 'offline-status'
            })
        }

        const handleOffline = () => {
            setIsOnline(false)
            toast.warning("You're offline — changes will sync when reconnected", {
                id: 'offline-status',
                duration: 20000 // Last longer
            })
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Return true during SSR to match server render, then use real status
    return isMounted ? isOnline : true
}
