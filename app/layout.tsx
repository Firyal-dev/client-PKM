import '@/app/globals.css'
import { Toaster } from "@/components/ui/sonner"
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

import type { Metadata } from "next";

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    display: 'swap',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    title: "Puskesmas",
    description: "Sistem Informasi Manajemen Puskesmas",
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${jakarta.variable} ${inter.variable} font-sans antialiased`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
