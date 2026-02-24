import { Navbar } from '@/components/navbar';
import { Building2, Percent, Headphones, FileText } from 'lucide-react';
import Link from 'next/link';

export default function BusinessPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <div className="container mx-auto px-4 py-24">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        NEXUS FOR BUSINESS
                    </h1>
                    <p className="text-xl text-slate-300">
                        Outfit your entire team. Upgrade your fleet. Scale without friction.
                    </p>
                </div>

                {/* Value Props */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    <div className="bg-slate-900 p-8 rounded-xl border border-cyan-900/30 hover:border-cyan-500 transition-colors">
                        <Percent className="text-cyan-400 mb-4" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Volume Discounts</h3>
                        <p className="text-slate-400">Significant savings starting at just 10+ units.</p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-xl border border-cyan-900/30 hover:border-cyan-500 transition-colors">
                        <Building2 className="text-cyan-400 mb-4" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Account Manager</h3>
                        <p className="text-slate-400">A dedicated single point of contact for your company.</p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-xl border border-cyan-900/30 hover:border-cyan-500 transition-colors">
                        <FileText className="text-cyan-400 mb-4" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Net-30 Terms</h3>
                        <p className="text-slate-400">Flexible payment terms available upon approval.</p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-xl border border-cyan-900/30 hover:border-cyan-500 transition-colors">
                        <Headphones className="text-cyan-400 mb-4" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Priority Support</h3>
                        <p className="text-slate-400">Skipt the line with our 1-hour support SLA.</p>
                    </div>
                </div>

                {/* Pricing Table */}
                <div className="max-w-3xl mx-auto bg-black border border-cyan-900 rounded-xl overflow-hidden mb-20">
                    <h3 className="bg-cyan-950/50 p-6 text-xl font-bold text-white border-b border-cyan-900 text-center">POPULAR FLEET PACKAGES</h3>
                    <div className="p-8">
                        <div className="grid grid-cols-3 gap-4 text-center border-b border-slate-800 pb-4 mb-4 font-mono text-sm text-slate-500">
                            <div>TIER</div>
                            <div>UNITS</div>
                            <div>DISCOUNT</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center py-4 border-b border-slate-800">
                            <div className="font-bold text-white">STARTER FLEET</div>
                            <div className="text-slate-300">5–15 units</div>
                            <div className="text-cyan-400">-10%</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center py-4 border-b border-slate-800">
                            <div className="font-bold text-white">TEAM FLEET</div>
                            <div className="text-slate-300">16–50 units</div>
                            <div className="text-cyan-400">-18%</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center py-4">
                            <div className="font-bold text-white">ENTERPRISE</div>
                            <div className="text-slate-300">50+ units</div>
                            <div className="text-purple-400 font-bold">Custom</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/contact?subject=B2B">
                        <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg px-12 py-6 rounded-full shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all hover:scale-105">
                            GET A QUOTE
                        </button>
                    </Link>
                    <p className="mt-4 text-slate-500 text-sm">Response promised within 24 hours.</p>
                </div>

            </div>
        </main>
    );
}
