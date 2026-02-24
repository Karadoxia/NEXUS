import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AiAssistant } from '../components/ai-assistant';
import { SocialProof } from '../components/social-proof';
import { Toaster } from '../components/ui/toaster';
import { MobileNav } from '../components/mobile-nav';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import { CartDrawer } from '../components/cart-drawer';
import { PageTransition } from '../components/page-transition';
import AuthProvider from '../components/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });
export const metadata: Metadata = {
    metadataBase: new URL('https://nexus-store.vercel.app'), // Placeholder URL
    title: {
        default: 'NEXUS | The Future of Tech',
        template: '%s | NEXUS'
    },
    description: 'NEXUS is a premium e-commerce destination for next-generation technology, neural interfaces, and quantum computing hardware.',
    openGraph: {
        title: 'NEXUS | The Future of Tech',
        description: 'Experience the next generation of neural interfaces and quantum hardware.',
        url: 'https://nexus-store.vercel.app',
        siteName: 'NEXUS',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NEXUS | The Future of Tech',
        description: 'Experience the next generation of neural interfaces and quantum hardware.',
    },
    manifest: '/manifest.json',
    robots: {
        index: true,
        follow: true,
    }
};

export const viewport: Viewport = {
    themeColor: '#0A0F1E',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <AuthProvider>
                    <Navbar />
                    <PageTransition>
                        {children}
                    </PageTransition>
                    <CartDrawer />
                    <Footer />
                    <AiAssistant />
                    <SocialProof />
                    <Toaster />
                    <MobileNav />
                </AuthProvider>
            </body>
        </html>
    );
}
