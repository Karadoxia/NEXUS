import { Navbar } from '@/components/navbar';
import { Mail, Shield } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                        GET IN TOUCH
                    </h1>
                    <p className="text-xl text-slate-400 mb-12">
                        Have a question? A bulk order? A partnership proposal?
                        Our support ops run 24/7. We respond within 2 hours — guaranteed.
                    </p>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-cyan-900/30">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Mail className="text-cyan-400" /> CONTACT CHANNELS
                                </h3>
                                <ul className="space-y-4 text-slate-300">
                                    <li className="flex justify-between">
                                        <span>General Inquiries</span>
                                        <span className="text-white hover:text-cyan-400 cursor-pointer">hello@nexus-store.io</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Order Support</span>
                                        <span className="text-white hover:text-cyan-400 cursor-pointer">orders@nexus-store.io</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Business & B2B</span>
                                        <span className="text-white hover:text-cyan-400 cursor-pointer">business@nexus-store.io</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Security Reports</span>
                                        <span className="text-white hover:text-cyan-400 cursor-pointer">security@nexus-store.io</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-xl border border-cyan-900/30">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield className="text-cyan-400" /> RESPONSE TIME COMMITMENT
                                </h3>
                                <ul className="space-y-4 text-slate-300">
                                    <li className="flex justify-between">
                                        <span>Live Chat</span>
                                        <span className="text-green-400 font-mono">&lt; 5 minutes</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Email</span>
                                        <span className="text-green-400 font-mono">&lt; 2 hours</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>B2B Inquiries</span>
                                        <span className="text-green-400 font-mono">&lt; 24 hours</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-slate-900 p-8 rounded-2xl border border-cyan-800 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Name</label>
                                    <input type="text" className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Email</label>
                                    <input type="email" className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Subject</label>
                                    <select className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none">
                                        <option>Order Issue</option>
                                        <option>Product Question</option>
                                        <option>B2B Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Message</label>
                                    <textarea rows={4} className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"></textarea>
                                </div>
                                <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg transition-colors">
                                    SEND MESSAGE
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
