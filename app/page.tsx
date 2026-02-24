import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { TrustBar } from "@/components/trust-bar"
import { Newsletter } from "@/components/newsletter"

export default function Home() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />
            <Hero />
            <TrustBar />
            <ProductGrid />
            <Newsletter />
        </main>
    )
}
