'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '@/src/stores/cartStore';
import { Address } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';

// Only initialise Stripe when a real publishable key is present (pk_test_ / pk_live_).
// Calling loadStripe('') or loadStripe('placeholder') throws "Failed to load Stripe.js".
const _pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
const stripePromise = _pk.startsWith('pk_') ? loadStripe(_pk) : null;

// ── Brand color map (used for visual card display) ───────────────────────────
const BRAND_COLOR: Record<string, string> = {
  visa: '#1a1f71',
  mastercard: '#eb001b',
  amex: '#016fd0',
  paypal: '#003087',
  discover: '#e65c00',
};
const BRAND_ICON: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  paypal: 'PP',
  discover: 'DISC',
};

// ── Clickable payment-method card ────────────────────────────────────────────
function PmCard({
  pm,
  selected,
  onClick,
}: {
  pm: any;
  selected: boolean;
  onClick: () => void;
}) {
  const key = pm.brand?.toLowerCase() ?? '';
  const isCard = pm.type === 'card';
  const icon = BRAND_ICON[key] ?? pm.brand?.slice(0, 2).toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_12px_rgba(8,145,178,0.3)]'
          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: BRAND_COLOR[key] ?? '#1e293b' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          {isCard ? (
            <>
              <p className="text-white text-sm font-semibold">
                {pm.brand} •••• {pm.last4}
              </p>
              <p className="text-slate-400 text-xs">
                Expires {String(pm.expMonth).padStart(2, '0')}/{pm.expYear}
                {pm.cardholderName ? ` · ${pm.cardholderName}` : ''}
              </p>
            </>
          ) : (
            <>
              <p className="text-white text-sm font-semibold">{pm.brand}</p>
              {pm.accountEmail && (
                <p className="text-slate-400 text-xs">{pm.accountEmail}</p>
              )}
            </>
          )}
        </div>
        {!pm.stripeId && (
          <span className="text-slate-500 text-xs italic shrink-0">demo</span>
        )}
        {selected && (
          <svg
            className="w-5 h-5 text-cyan-400 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

// ── New-card form (must live inside <Elements>) ───────────────────────────────
function NewCardForm({
  total,
  orderId,
  session,
}: {
  total: number;
  orderId: string | null;
  session: any;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    setMessage(null);

    const returnUrl = orderId
      ? `${window.location.origin}/checkout/success?orderId=${orderId}`
      : `${window.location.origin}/checkout/success`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (error) {
      setMessage(
        error.type === 'card_error' || error.type === 'validation_error'
          ? (error.message ?? 'An unexpected error occurred.')
          : 'An unexpected error occurred.',
      );
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              name: session?.user?.name ?? undefined,
              email: session?.user?.email ?? undefined,
            },
          },
        }}
      />
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'PROCESSING…' : `PAY €${total.toLocaleString()}`}
      </button>
      {message && (
        <p className="text-red-400 text-sm text-center">{message}</p>
      )}
    </form>
  );
}

// ── Saved-method form: shows visual card + direct off-session charge ──────────
function SavedMethodForm({
  pm,
  total,
  items,
  selectedAddress,
  session,
  onClear,
}: {
  pm: any;
  total: number;
  items: any[];
  selectedAddress: Address | null;
  session: any;
  onClear: () => void;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isCard = pm.type === 'card';
  const key = pm.brand?.toLowerCase() ?? '';
  const icon = BRAND_ICON[key] ?? pm.brand?.slice(0, 2).toUpperCase();

  const handlePay = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const user = session?.user
        ? { name: session.user.name || 'Customer', email: session.user.email || '' }
        : { name: 'Guest', email: '' };

      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          items,
          paymentMethodId: pm.id,
          customer: user,
          address: selectedAddress,
        }),
      });
      const data = await resp.json();
      if (resp.ok && data.orderId) {
        router.push(`/checkout/success?orderId=${data.orderId}`);
        return;
      }
      throw new Error(data.error || 'Payment failed. Please try again.');
    } catch (err: any) {
      setMessage(err.message ?? 'Payment failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual card — the "auto-filled" display */}
      <div
        className="relative h-44 rounded-2xl p-5 overflow-hidden select-none"
        style={{
          background: `linear-gradient(135deg, ${
            BRAND_COLOR[key] ?? '#1e293b'
          } 0%, #0f172a 100%)`,
        }}
      >
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.15) 10px,rgba(255,255,255,.15) 11px)',
          }}
        />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <span className="text-white/50 text-[10px] uppercase tracking-widest">
              {isCard ? 'Payment Card' : 'Digital Wallet'}
            </span>
            <span className="text-white font-black text-lg tracking-wider">
              {icon}
            </span>
          </div>

          {isCard ? (
            <>
              <div>
                <p className="text-white/40 text-[10px] mb-1 tracking-widest">
                  CARD NUMBER
                </p>
                <p className="text-white font-mono text-xl tracking-[0.35em]">
                  •••• •••• •••• {pm.last4}
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/40 text-[10px] mb-1 tracking-widest">
                    EXPIRES
                  </p>
                  <p className="text-white font-mono text-sm">
                    {String(pm.expMonth).padStart(2, '0')}/{pm.expYear}
                  </p>
                </div>
                {pm.cardholderName && (
                  <div className="text-right">
                    <p className="text-white/40 text-[10px] mb-1 tracking-widest">
                      CARDHOLDER
                    </p>
                    <p className="text-white text-sm font-semibold uppercase tracking-wider">
                      {pm.cardholderName}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <p className="text-white font-bold text-2xl">{pm.brand}</p>
              {pm.accountEmail && (
                <p className="text-white/60 text-sm mt-1">{pm.accountEmail}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'PROCESSING…' : `PAY €${total.toLocaleString()}`}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="w-full text-xs text-slate-400 hover:text-white underline transition-colors"
      >
        Use a different payment method
      </button>
      {message && (
        <p className="text-red-400 text-sm text-center">{message}</p>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  // ← session MUST be declared before the effects that reference it
  const { data: session, status } = useSession();
  const { total, items, checkout } = useCartStore();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  // undefined = "new card" (default)
  const [selectedPm, setSelectedPm] = useState<string | undefined>(undefined);
  const [mockError, setMockError] = useState<string | null>(null);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) router.push('/signin');
  }, [session, status, router]);

  // Fetch saved addresses and payment methods for authenticated users
  useEffect(() => {
    if (!session?.user?.email) return;

    fetch('/api/user/addresses')
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) {
          setAddresses(list);
          if (list.length > 0) setSelectedAddress(list[0]);
        }
      })
      .catch(() => {});

    fetch('/api/user/payment-methods')
      .then((r) => r.json())
      .then((pms) => {
        if (Array.isArray(pms)) setPaymentMethods(pms);
      })
      .catch(() => {});
  }, [session?.user?.email]);

  // Derived flag — true when the selected saved card has a real Stripe token.
  // Computed here (not inside the effect) so it can be a stable dep instead of
  // the full paymentMethods array, preventing a redundant PI request whenever
  // paymentMethods loads after mount.
  const useDirectCharge = !!paymentMethods.find((p) => p.id === selectedPm)?.stripeId;

  // Create a PaymentIntent for the new-card / PayPal flow.
  // Skip when a real Stripe-backed saved method is selected (charged server-side).
  useEffect(() => {
    if (useDirectCharge) return; // direct charge — no PI needed
    if (total() <= 0) return;

    setIsMockMode(false);
    setClientSecret('');

    const controller = new AbortController();
    const timeout = setTimeout(() => setIsMockMode(true), 5000);

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        amount: total(),
        items,
        customer: session?.user
          ? { name: session.user.name, email: session.user.email }
          : undefined,
        address: selectedAddress,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('checkout init failed');
        return r.json();
      })
      .then((data) => {
        clearTimeout(timeout);
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setOrderId(data.orderId ?? null);
        } else {
          setIsMockMode(true);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        clearTimeout(timeout);
        setIsMockMode(true);
      });

    // Cleanup: cancel in-flight request (prevents StrictMode double-invoke from
    // creating two PaymentIntents / two orders)
    return () => { clearTimeout(timeout); controller.abort(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDirectCharge, selectedAddress, selectedPm]);

  const handleMock = async () => {
    setMockError(null);
    try {
      const user = session?.user
        ? { name: session.user.name || 'Customer', email: session.user.email || '' }
        : { name: 'Guest', email: '' };
      const order = await (checkout as any)(user, selectedAddress || undefined, selectedPm);
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (e: any) {
      console.error('mock checkout failed', e);
      setMockError(e?.message ?? 'Checkout failed. Please try again.');
    }
  };

  const selectedPmRecord = paymentMethods.find((p) => p.id === selectedPm);

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#0891b2',
      colorBackground: '#0f172a',
      colorText: '#ffffff',
    },
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-slate-400 mb-8">Add some gear before checking out.</p>
          <Link href="/store" className="text-cyan-400 hover:text-white font-bold">
            BROWSE STORE
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* ── Order Summary ── */}
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-cyan-900/30 h-fit">
            <h2 className="text-2xl font-bold text-white mb-6">ORDER SUMMARY</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-slate-900 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded border border-slate-800 flex items-center justify-center overflow-hidden relative shrink-0">
                      <Image
                        src={(item as any).images?.[0] || ''}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono text-cyan-400">
                    €{(item.price * item.quantity).toLocaleString()}
                  </span>
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

          {/* ── Payment Panel ── */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-cyan-900/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">SECURE PAYMENT</h2>

            {/* Shipping address */}
            {addresses.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Shipping Address
                </label>
                <select
                  aria-label="Shipping Address"
                  value={selectedAddress?.id || ''}
                  onChange={(e) =>
                    setSelectedAddress(
                      addresses.find((a) => a.id === e.target.value) || null,
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm"
                >
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} — {a.line1}, {a.city}
                    </option>
                  ))}
                </select>
                <Link
                  href="/account"
                  className="text-xs text-cyan-400 mt-1 inline-block hover:text-cyan-300"
                >
                  + Add / manage addresses
                </Link>
              </div>
            )}

            {/* Payment method picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                {/* New card / PayPal (default) */}
                <button
                  type="button"
                  onClick={() => setSelectedPm(undefined)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selectedPm === undefined
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_12px_rgba(8,145,178,0.3)]'
                      : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                  }`}
                >
                  <div className="w-12 h-8 rounded-md bg-slate-700 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">
                      New Card / PayPal
                    </p>
                    <p className="text-slate-400 text-xs">
                      Enter card details or pay with PayPal
                    </p>
                  </div>
                  {selectedPm === undefined && (
                    <svg
                      className="w-5 h-5 text-cyan-400 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Saved methods */}
                {paymentMethods.map((pm) => (
                  <PmCard
                    key={pm.id}
                    pm={pm}
                    selected={selectedPm === pm.id}
                    onClick={() => setSelectedPm(pm.id)}
                  />
                ))}

                {paymentMethods.length === 0 && (
                  <Link
                    href="/account"
                    className="block text-xs text-slate-500 hover:text-slate-300 mt-1"
                  >
                    + Save a card for faster checkout
                  </Link>
                )}
              </div>
            </div>

            {/* Payment content area */}
            {useDirectCharge ? (
              /* Saved Stripe-backed method: show visual card + direct charge */
              <SavedMethodForm
                pm={selectedPmRecord}
                total={total()}
                items={items}
                selectedAddress={selectedAddress}
                session={session}
                onClear={() => setSelectedPm(undefined)}
              />
            ) : clientSecret ? (
              /* New card / PayPal via Stripe Elements */
              <Elements
                options={{ clientSecret, appearance }}
                stripe={stripePromise}
              >
                <NewCardForm
                  total={total()}
                  orderId={orderId}
                  session={session}
                />
              </Elements>
            ) : isMockMode ? (
              /* Stripe not configured — mock fallback */
              <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                  <h3 className="text-yellow-400 font-bold text-sm mb-1">
                    Stripe not configured
                  </h3>
                  <p className="text-yellow-200/60 text-xs">
                    Set{' '}
                    <code className="font-mono bg-black/30 px-1 rounded">
                      STRIPE_SECRET_KEY
                    </code>{' '}
                    and{' '}
                    <code className="font-mono bg-black/30 px-1 rounded">
                      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                    </code>{' '}
                    in{' '}
                    <code className="font-mono bg-black/30 px-1 rounded">
                      .env.local
                    </code>{' '}
                    to enable real payments.
                  </p>
                </div>
                <button
                  onClick={handleMock}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-cyan-400 font-bold py-4 rounded-xl border border-slate-600 transition-all text-sm tracking-widest uppercase"
                >
                  Simulate Successful Payment
                </button>
                {mockError && (
                  <p className="text-red-400 text-sm text-center">{mockError}</p>
                )}
                <p className="text-[10px] text-center text-slate-500">
                  No money is charged. For demo/dev use only.
                </p>
              </div>
            ) : (
              /* Loading */
              <div className="flex flex-col items-center justify-center h-48 text-cyan-400 gap-4">
                <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm animate-pulse">
                  Connecting to Secure Gateway…
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
