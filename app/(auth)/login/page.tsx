'use client'
// Force dynamic rendering to avoid supabase URL error at build time
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Syne, Inter } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const syne = Syne({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setAuthError('')
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error

            // Force a hard navigation instead of Next.js soft-routing 
            // so that middleware.ts reliably catches the new auth cookie
            window.location.href = '/dashboard'
        } catch (error: any) {
            setAuthError(error.message || 'Failed to login')
            toast.error(error.message || 'Failed to login')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            setAuthError(error.message || 'Failed to login with Google')
            toast.error(error.message || 'Failed to login with Google')
            setGoogleLoading(false)
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0F172A] via-[#0A0A0F] to-[#0A0A0F] p-4 ${inter.className}`}>
            <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>

                <div className="text-center mb-8">
                    <h1 className={`${syne.className} text-3xl font-bold text-white mb-2`}>Welcome back</h1>
                    <p className="text-zinc-400 text-sm">Sign in to continue building your SwiftCV</p>
                </div>

                <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white h-12 relative overflow-hidden group transition-all"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading || loading}
                >
                    {googleLoading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    )}
                    Continue with Google
                </Button>

                <div className="my-6 flex items-center gap-4">
                    <Separator className="flex-1 bg-white/10" />
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Or continue with email</span>
                    <Separator className="flex-1 bg-white/10" />
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-300">Email format</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500 h-11"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500 h-11"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {authError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                            <p className="text-sm font-medium text-red-500 text-center">{authError}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-zinc-200 h-11 font-medium transition-colors"
                        disabled={loading || googleLoading}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-400">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-white hover:text-blue-400 font-medium transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
