import '@/app/globals.css'
import { Toaster } from "@/components/ui/sonner"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'

import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

import type { Metadata } from "next";
import VisitorTracker from '@/components/VisitorTracker';

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

import { RecaptchaProvider } from '@/components/recaptcha-provider';

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const messages = await getMessages();
    const locale = await getLocale();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${jakarta.variable} ${inter.variable} font-sans antialiased`}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <RecaptchaProvider>
                        {children}
                        <Toaster />
                        <VisitorTracker />
                    </RecaptchaProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
