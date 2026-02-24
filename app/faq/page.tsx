import { Navbar } from '@/components/navbar';

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                    FREQUENTLY ASKED QUESTIONS
                </h1>

                <div className="max-w-3xl mx-auto space-y-12">

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-cyan-900/50 pb-2">SHIPPING & DELIVERY</h2>
                        <div className="space-y-6">
                            <div className="bg-slate-900/40 p-6 rounded-lg">
                                <h3 className="font-bold text-white mb-2">How long does delivery take?</h3>
                                <p className="text-slate-400">Standard: 3–7 business days EU. Express: 1–2 days. US: 5–10 days.</p>
                            </div>
                            <div className="bg-slate-900/40 p-6 rounded-lg">
                                <h3 className="font-bold text-white mb-2">Do you ship internationally?</h3>
                                <p className="text-slate-400">Yes. We ship to 40+ countries. Customs fees may apply for non-EU orders.</p>
                            </div>
                            <div className="bg-slate-900/40 p-6 rounded-lg">
                                <h3 className="font-bold text-white mb-2">Can I track my order?</h3>
                                <p className="text-slate-400">Yes. A tracking link is emailed the moment your order ships.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-cyan-900/50 pb-2">PRODUCTS & STOCK</h2>
                        <div className="space-y-6">
                            <div className="bg-slate-900/40 p-6 rounded-lg">
                                <h3 className="font-bold text-white mb-2">Are your products brand new?</h3>
                                <p className="text-slate-400">All products are 100% new unless listed as &quot;Certified Refurbished.&quot;</p>
                            </div>
                            <div className="bg-slate-900/40 p-6 rounded-lg">
                                <h3 className="font-bold text-white mb-2">Do you sell to businesses?</h3>
                                <p className="text-slate-400">Absolutely. We have a dedicated B2B pricing program. Contact business@nexus-store.io.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-cyan-900/50 pb-2">PAYMENTS & RETURNS</h2>
                        <div className="space-y-6">
                            <div className="bg-slate-900/40 p-6 rounded-lg">
                                <h3 className="font-bold text-white mb-2">What payment methods do you accept?</h3>
                                <p className="text-slate-400">Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, and crypto (BTC/ETH).</p>
                            </div>
                            <div className="bg-slate-900/40 p-6 rounded-lg">
                                <h3 className="font-bold text-white mb-2">What is your return policy?</h3>
                                <p className="text-slate-400">30-day no-questions-asked returns on all items. Items must be in original condition.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
