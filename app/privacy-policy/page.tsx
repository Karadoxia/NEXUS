import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-invert max-w-none flex flex-col gap-4 text-gray-300">
                    <p>At NEXUS, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
                    <h2 className="text-2xl font-bold text-white mt-4">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
                    <h2 className="text-2xl font-bold text-white mt-4">2. How We Use Information</h2>
                    <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                    <p className="text-sm text-gray-500 mt-8">Last updated: February 2026</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
