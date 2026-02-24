import { Navbar } from '@/components/navbar';

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-4xl font-bold mb-4 text-cyan-400">Join the NEXUS</h1>
                <p className="text-slate-400 max-w-lg mx-auto mb-8">
                    We are always looking for visionaries, engineers, and dreamers to help us build the next generation of computing.
                </p>
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl max-w-2xl mx-auto">
                    <p className="text-lg font-semibold mb-4">Current Openings</p>
                    <p className="text-sm text-slate-500 italic">No positions currently available.</p>
                </div>
            </div>
        </main>
    );
}
