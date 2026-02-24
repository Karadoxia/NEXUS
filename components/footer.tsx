import Link from 'next/link';
import { Twitter, Linkedin, Disc, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black border-t border-cyan-900/30 text-slate-400 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white tracking-tighter">NEXUS</h3>
                    <p className="text-sm">Premium IT hardware for the next generation.</p>
                    <div className="flex space-x-4">
                        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400"><Twitter size={20} suppressHydrationWarning /></Link>
                        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400"><Linkedin size={20} suppressHydrationWarning /></Link>
                        <Link href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400"><Disc size={20} suppressHydrationWarning /></Link>
                        <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400"><Github size={20} suppressHydrationWarning /></Link>
                    </div>
                </div>

                {/* Shop */}
                <div className="space-y-4">
                    <h4 className="text-white font-semibold">SHOP</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/store?category=peripherals" className="hover:text-cyan-400">Peripherals</Link></li>
                        <li><Link href="/store?category=laptops" className="hover:text-cyan-400">Laptops</Link></li>
                        <li><Link href="/store?category=workstations" className="hover:text-cyan-400">Workstations</Link></li>
                        <li><Link href="/store?category=networking" className="hover:text-cyan-400">Networking</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div className="space-y-4">
                    <h4 className="text-white font-semibold">COMPANY</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/about" className="hover:text-cyan-400">About Us</Link></li>
                        <li><Link href="/business" className="hover:text-cyan-400">Business</Link></li>
                        <li><Link href="/careers" className="hover:text-cyan-400">Careers</Link></li>
                        <li><Link href="/blog" className="hover:text-cyan-400">Blog</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div className="space-y-4">
                    <h4 className="text-white font-semibold">SUPPORT</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/contact" className="hover:text-cyan-400">Contact</Link></li>
                        <li><Link href="/faq" className="hover:text-cyan-400">FAQ</Link></li>
                        <li><Link href="/returns" className="hover:text-cyan-400">Returns</Link></li>
                        <li><Link href="/tracking" className="hover:text-cyan-400">Track Order</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-cyan-900/30 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs">
                    © 2025 NEXUS Technologies SAS. All rights reserved. Boulogne-Billancourt, France 🇫🇷
                </p>
                <div className="flex gap-4 text-xs">
                    <Link href="/privacy-policy" className="hover:text-cyan-400">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-cyan-400">Terms of Service</Link>
                    <Link href="/cookie-policy" className="hover:text-cyan-400">Cookie Policy</Link>
                </div>
            </div>
        </footer>
    );
}
