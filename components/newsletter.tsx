export function Newsletter() {
    return (
        <section className="py-20 border-t border-cyan-900/30 bg-gradient-to-b from-black to-cyan-950/20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400 mb-4 tracking-tighter">
                    JOIN THE NEXUS NETWORK
                </h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                    Get early access to new drops, exclusive B2B deals, and tech intel before anyone else.
                </p>

                <form className="max-w-md mx-auto flex gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-black/50 border border-cyan-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all">
                        JOIN
                    </button>
                </form>
            </div>
        </section>
    );
}
