import { Navbar } from '@/components/navbar';
import Link from 'next/link';

export default function ReturnsPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-cyan-400">Returns & Refunds</h1>

                    <div className="space-y-8 text-slate-300">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-2">30-Day Satisfaction Guarantee</h2>
                            <p>
                                If you are not completely satisfied with your NEXUS hardware, you may return it within 30 days of receipt for a full refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-2">Return Process</h2>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>Initiate a return from your <Link href="/account" className="text-cyan-400 hover:underline">Account Dashboard</Link>.</li>
                                <li>Print the provided shipping label.</li>
                                <li>Pack the item in its original packaging.</li>
                                <li>Drop off the package at any authorized carrier location.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-2">Warranty</h2>
                            <p>
                                All NEXUS products come with a 2-year manufacturer verification warranty covering defects in materials and workmanship.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
