import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
                <div className="prose prose-invert max-w-none flex flex-col gap-4 text-gray-300">
                    <p>This Cookie Policy explains how NEXUS uses cookies and similar technologies to recognize you when you visit our website.</p>
                    <h2 className="text-2xl font-bold text-white mt-4">1. What are Cookies?</h2>
                    <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website.</p>
                    <h2 className="text-2xl font-bold text-white mt-4">2. Why We Use Cookies</h2>
                    <p>We use cookies to improve your experience on our site, analyze site usage, and assist in our marketing efforts.</p>
                    <p className="text-sm text-gray-500 mt-8">Last updated: February 2026</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
