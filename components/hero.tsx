import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
                    NEXUS OS v3.0 ONLINE
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
                    BEYOND <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">REALITY</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                    The world&apos;s most advanced IT hardware, delivered to your door at light speed. From pro workstations to next-gen peripherals — NEXUS has your setup covered.
                </p>

                <div className="flex gap-4">
                    <Link href="/store">
                        <button className="h-12 px-8 rounded-lg bg-white text-black font-semibold hover:scale-105 transition-transform">
                            Shop Catalog
                        </button>
                    </Link>
                    <Link href="/store?category=SYSTEM">
                        <button className="h-12 px-8 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-white font-medium backdrop-blur-sm">
                            System Config
                        </button>
                    </Link>
                </div>
            </div>

            {/* Decorative Floor */}
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </section>
    )
}
