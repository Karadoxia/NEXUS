import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-invert max-w-none flex flex-col gap-4 text-gray-300">
                    <p>Welcome to NEXUS. By accessing or using our website, you agree to be bound by these Terms of Service.</p>
                    <h2 className="text-2xl font-bold text-white mt-4">1. Acceptance of Terms</h2>
                    <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
                    <h2 className="text-2xl font-bold text-white mt-4">2. Purchases</h2>
                    <p>If you wish to purchase any product or service made available through the Service, you may be asked to supply certain information relevant to your Purchase.</p>
                    <p className="text-sm text-gray-500 mt-8">Last updated: February 2026</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
