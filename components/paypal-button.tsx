'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface PayPalButtonProps {
  cartItems: CartItem[];
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

export default function PayPalButton({ cartItems, onSuccess, onError }: PayPalButtonProps) {
  const router = useRouter();
  const [nexusOrderId, setNexusOrderId] = useState<string | null>(null);

  const createOrder = async () => {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    setNexusOrderId(data.nexusOrderId);
    return data.paypalOrderId;
  };

  const onApprove = async (data: { orderID: string }) => {
    const res = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paypalOrderId: data.orderID, nexusOrderId }),
    });
    const result = await res.json();
    if (result.success) {
      onSuccess?.(result.orderId);
      router.push(`/success?order=${result.orderId}&method=paypal`);
    } else {
      onError?.('Payment capture failed. Please try again.');
    }
  };

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!clientId || clientId === 'replace_with_paypal_client_id') {
    return (
      <div className="p-4 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm text-center">
        PayPal not configured yet — add <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> to .env
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'EUR',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'rect', color: 'gold', label: 'paypal' }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError?.('PayPal encountered an error. Please try again.');
        }}
        onCancel={() => console.log('PayPal payment cancelled')}
      />
    </PayPalScriptProvider>
  );
}
