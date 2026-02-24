import { Navbar } from '@/components/navbar';

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-4xl font-bold mb-4 text-cyan-400">NEXUS Transmissions</h1>
                <p className="text-slate-400 max-w-lg mx-auto mb-8">
                    Insights, updates, and deep dives into the world of neural interfaces and quantum hardware.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden opacity-50">
                            <div className="h-48 bg-slate-800 animate-pulse" />
                            <div className="p-6 space-y-3">
                                <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
                                <div className="h-3 bg-slate-800 rounded w-full animate-pulse" />
                                <div className="h-3 bg-slate-800 rounded w-2/3 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-8 text-sm text-slate-500">Latest articles loading...</p>
            </div>
        </main>
    );
}
