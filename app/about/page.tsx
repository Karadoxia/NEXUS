import { Navbar } from '@/components/navbar';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                    WHO WE ARE
                </h1>

                <div className="grid md:grid-cols-2 gap-12 text-slate-300 leading-relaxed">
                    <div className="space-y-6">
                        <p className="text-lg">
                            NEXUS was built by tech enthusiasts who were tired of settling.
                            Tired of generic storefronts. Tired of outdated specs. Tired of
                            waiting three weeks for a peripheral that should&apos;ve shipped yesterday.
                        </p>
                        <p className="text-lg">
                            We&apos;re a team of engineers, builders, and gear obsessives operating
                            at the intersection of cutting-edge hardware and lightning-fast fulfillment.
                            We source from the world&apos;s leading manufacturers and distributors, curate
                            only what meets our specs, and get it to you fast.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-cyan-900/30">
                        <h2 className="text-2xl font-bold text-white mb-6">OUR VALUES</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="text-cyan-400 font-bold">→</span>
                                <span><strong className="text-white">Transparency:</strong> Real specs. Real stock. Real prices.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-400 font-bold">→</span>
                                <span><strong className="text-white">Speed:</strong> Orders processed within 24 hours, every time.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-400 font-bold">→</span>
                                <span><strong className="text-white">Trust:</strong> No dark patterns. No fake reviews. No inflated MSRPs.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-cyan-400 font-bold">→</span>
                                <span><strong className="text-white">Community:</strong> Built by the community, for the community.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-cyan-900/30 text-center text-slate-500 font-mono text-sm">
                    NEXUS OS v3.0 // Est. 2025 // Boulogne-Billancourt, FR 🇫🇷
                </div>
            </div>

        </main>
    );
}
