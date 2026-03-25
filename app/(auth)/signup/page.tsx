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

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [authError, setAuthError] = useState('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError('')

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 6) {
            toast.error('Password should be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
                }
            })
            if (error) throw error

            toast.success('Success! Check your email to confirm your account.', {
                duration: 5000,
            })
            // Clear form occasionally, or redirect
            router.push('/login')
        } catch (error: any) {
            setAuthError(error.message || 'Failed to sign up')
            toast.error(error.message || 'Failed to sign up')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
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
            setAuthError(error.message || 'Failed to sign up with Google')
            toast.error(error.message || 'Failed to sign up with Google')
            setGoogleLoading(false)
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0F172A] via-[#0A0A0F] to-[#0A0A0F] p-4 py-12 ${inter.className}`}>
            <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>

                <div className="text-center mb-8">
                    <h1 className={`${syne.className} text-3xl font-bold text-white mb-2`}>Create an account</h1>
                    <p className="text-zinc-400 text-sm">Start building your professional resume today</p>
                </div>

                <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/10 hover:bg-white/5 text-white h-12 relative overflow-hidden group transition-all"
                    onClick={handleGoogleSignup}
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
                    Sign up with Google
                </Button>

                <div className="my-6 flex items-center gap-4">
                    <Separator className="flex-1 bg-white/10" />
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Or continue with email</span>
                    <Separator className="flex-1 bg-white/10" />
                </div>

                <form onSubmit={handleEmailSignup} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-zinc-300">Full Name</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500 h-11"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
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
                        <Label htmlFor="password" className="text-zinc-300">Password</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500 h-11"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        className="w-full bg-white text-black hover:bg-zinc-200 h-11 font-medium transition-colors mt-2"
                        disabled={loading || googleLoading}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create account
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-zinc-500">
                    By signing up you agree to our <Link href="#" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</Link> & <Link href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
                </div>

                <div className="mt-6 text-center text-sm text-zinc-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-white hover:text-blue-400 font-medium transition-colors">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}
