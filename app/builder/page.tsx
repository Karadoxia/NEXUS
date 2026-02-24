import { Navbar } from '@/components/navbar';
import { BuilderWizard } from '@/components/builder/builder-wizard';

export default function BuilderPage() {
    return (
        <main className="min-h-screen bg-black relative">
            {/* Deep Space Background */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            <div className="relative z-10">
                <Navbar />

                <div className="container mx-auto px-4 py-8 mt-20">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-display uppercase tracking-widest mb-2">
                            System Configurator
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Architect your ultimate machine. AI-assisted compatibility checks ensure every component works in perfect harmony.
                        </p>
                    </div>

                    <BuilderWizard />
                </div>
            </div>
        </main>
    );
}
