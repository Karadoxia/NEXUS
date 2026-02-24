import { Truck, ShieldCheck, RotateCcw, Star } from 'lucide-react';

export function TrustBar() {
    return (
        <div className="bg-black/50 border-y border-cyan-900/30 backdrop-blur-md py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="bg-cyan-500/10 p-3 rounded-full group-hover:bg-cyan-500/20 transition-colors">
                            <Truck className="text-cyan-400" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Free EU Shipping</h4>
                            <p className="text-xs text-slate-400">On orders over €99</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="bg-cyan-500/10 p-3 rounded-full group-hover:bg-cyan-500/20 transition-colors">
                            <ShieldCheck className="text-cyan-400" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Secure Checkout</h4>
                            <p className="text-xs text-slate-400">TLS 1.3 Encrypted</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="bg-cyan-500/10 p-3 rounded-full group-hover:bg-cyan-500/20 transition-colors">
                            <RotateCcw className="text-cyan-400" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">30-Day Returns</h4>
                            <p className="text-xs text-slate-400">No questions asked</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="bg-cyan-500/10 p-3 rounded-full group-hover:bg-cyan-500/20 transition-colors">
                            <Star className="text-cyan-400" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">4.8/5 Rating</h4>
                            <p className="text-xs text-slate-400">From 1,200+ reviews</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
