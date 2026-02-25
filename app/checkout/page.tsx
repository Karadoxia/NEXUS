'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '@/src/stores/cartStore';
import { Address } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

function CheckoutForm({ total, orderId, selectedAddress }: { total: number; orderId: string | null; selectedAddress: Address | null }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { checkout } = useCartStore();
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const returnUrl = orderId
            ? `${window.location.origin}/checkout/success?orderId=${orderId}`
            : `${window.location.origin}/checkout/success`;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: returnUrl,
            },
        });

        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message ?? 'An unexpected error occurred.');
        } else {
            setMessage('An unexpected error occurred.');
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            {paymentMethods.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-1">Use saved payment method (mock mode only):</label>
                <select
                  className="w-full bg-black border border-slate-700 rounded px-3 py-2 text-white"
                  value={selectedPm || ''}
                  onChange={e => setSelectedPm(e.target.value || undefined)}
                >
                  <option value="">-- none --</option>
                  {paymentMethods.map(pm => (
                      <option key={pm.id} value={pm.id}>
                        {pm.type === 'card'
                          ? `${pm.brand} •••• ${pm.last4}`
                          : `${pm.brand}${pm.accountEmail ? ' ('+pm.accountEmail+')' : ''}`}
                      </option>
                  ))}
                </select>
              </div>
            )}
            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'PROCESSING...' : `PAY €${total.toLocaleString()}`}
            </button>
            {message && <div id="payment-message" className="text-red-500 text-sm text-center">{message}</div>}

            {/* MOCK MODE: Simulate Payment */}
            <div className="pt-6 border-t border-slate-800 mt-6">
                <button
                    type="button"
                    onClick={async () => {
                        try {
                            const user = session?.user
                                ? { name: session.user.name || 'Customer', email: session.user.email || '' }
                                : { name: 'Guest User', email: 'guest@example.com' };
                            const order = await checkout(user, selectedAddress || undefined);
                            router.push(`/checkout/success?orderId=${order.id}`);
                        } catch (e) {
                            console.error('checkout failed', e);
                        }
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold py-3 rounded-lg border border-slate-700 transition-all text-xs tracking-widest uppercase"
                >
                    [MOCK MODE] Simulate Successful Payment
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-2">Use this if you don&apos;t have a valid Stripe key or backend running.</p>
            </div>
        </form>
    );
}

export default function CheckoutPage() {
    const { total, items, checkout } = useCartStore();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState('');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isMockMode, setIsMockMode] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [selectedPm, setSelectedPm] = useState<string | undefined>(undefined);

    useEffect(() => {
        // fetch saved addresses for user
        if (session?.user?.email) {
            fetch('/api/user/addresses')
                .then(r => r.json())
                .then((list) => {
                    setAddresses(list);
                    if (list.length > 0) setSelectedAddress(list[0]);
                });
            fetch('/api/user/payment-methods')
                .then(r => r.json())
                .then((pms) => {
                    if (Array.isArray(pms)) {
                        setPaymentMethods(pms);
                        if (pms.length > 0) setSelectedPm(pms[0].id);
                    }
                });
        }

        // Create PaymentIntent as soon as the page loads
        if (total() > 0) {
            // Set a timeout to fallback to mock mode if backend is slow/down
            const timeout = setTimeout(() => setIsMockMode(true), 2000);

            fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total(),
                    items,
                    paymentMethodId: selectedPm,
                    customer: session?.user ? { name: session.user.name, email: session.user.email } : undefined,
                    address: selectedAddress,
                }),
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then((data) => {
                    clearTimeout(timeout);
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                        setOrderId(data.orderId || null);
                    } else {
                        setIsMockMode(true);
                    }
                })
                .catch(() => {
                    clearTimeout(timeout);
                    setIsMockMode(true);
                });

            return () => clearTimeout(timeout);
        }
    }, [total, selectedAddress]);

    const appearance = {
        theme: 'night' as const,
        variables: {
            colorPrimary: '#0891b2',
            colorBackground: '#0f172a',
            colorText: '#ffffff',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;
        if (!session?.user) {
            router.push('/signin');
        }
    }, [session, status, router]);

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-slate-400 mb-8">Add some gear before checking out.</p>
                    <Link href="/products" className="text-cyan-400 hover:text-white font-bold">BROWSE STORE</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* Order Summary */}
                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-cyan-900/30 h-fit">
                        <h2 className="text-2xl font-bold text-white mb-6">ORDER SUMMARY</h2>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-black rounded border border-slate-800 flex items-center justify-center overflow-hidden relative">
                                            <Image src={item.images?.[0] || ''} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono text-cyan-400">€{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-cyan-900/30 pt-4 space-y-2">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>€{total().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Shipping</span>
                                <span className="text-green-400">FREE</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white pt-2">
                                <span>TOTAL</span>
                                <span>€{total().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-slate-900 p-8 rounded-2xl border border-cyan-900/30 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">SECURE PAYMENT</h2>
                        {/* Address selection (if available) */}
                        {addresses.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-sm text-slate-400 mb-1">Shipping address</label>
                                <select
                                    value={selectedAddress?.id || ''}
                                    onChange={(e) => {
                                        const a = addresses.find(a => a.id === e.target.value);
                                        setSelectedAddress(a || null);
                                    }}
                                    className="w-full bg-slate-800 p-2 rounded"
                                >
                                    {addresses.map(a => (
                                        <option key={a.id} value={a.id}>{a.label} - {a.line1}, {a.city}</option>
                                    ))}
                                </select>
                                <Link href="/account" className="text-xs text-cyan-400 underline">
                                    Manage addresses
                                </Link>
                            </div>
                        )}
                        {clientSecret ? (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm total={total()} orderId={orderId} selectedAddress={selectedAddress} />
                            </Elements>
                        ) : isMockMode ? (
                            <div className="text-center space-y-6">
                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                                    <h3 className="text-yellow-400 font-bold mb-2">Backend Unavailable</h3>
                                    <p className="text-sm text-yellow-200/60">
                                        The payment server is ensuring secure connections. Switching to offline simulation mode using standard test credentials.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4 opacity-50 cursor-not-allowed">
                                        <div className="w-12 h-8 bg-slate-700 rounded"></div>
                                        <div className="flex-1 h-4 bg-slate-700 rounded w-full"></div>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = '/checkout/success'}
                                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-lg shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                                    >
                                        SIMULATE SUCCESSFUL PAYMENT
                                    </button>
                                    <p className="text-xs text-slate-500">
                                        * No actual money will be charged. This is a demonstration.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-cyan-400 gap-4">
                                <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="animate-pulse">Connecting to Secure Gateway...</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
