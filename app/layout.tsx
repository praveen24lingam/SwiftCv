import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { Toaster } from "@/components/ui/sonner";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { CSPostHogProvider } from "@/providers/PostHogProvider";

const syne = Syne({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://swiftcv.in'),
  title: { default: 'SwiftCV — Free ATS Resume Builder for Indian Students', template: '%s | SwiftCV' },
  description: 'Build ATS-optimized resumes free. Real-time ATS score, job description matching, AI writing assistant. Built for Indian students and freshers.',
  keywords: ['free resume builder India', 'ATS resume builder', 'resume for freshers', 'ATS score checker', 'resume builder students India', 'free CV maker India'],
  openGraph: { type: 'website', locale: 'en_IN', siteName: 'SwiftCV' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${syne.className} antialiased bg-[#0A0A0F] text-foreground`} suppressHydrationWarning>
        <CSPostHogProvider>
          <SmoothScrollProvider>
            <OfflineBanner />
            {children}
          </SmoothScrollProvider>
          <Toaster theme="dark" richColors position="bottom-right" />
        </CSPostHogProvider>
      </body>
    </html>
  );
}
