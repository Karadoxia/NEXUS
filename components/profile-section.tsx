'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { User, MapPin, Plus, Pencil, Trash2, Check, X, CreditCard, Phone, Camera } from 'lucide-react';
import { PHONE_CODES } from '@/lib/phone-codes';

interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  brand: string;
  // optional stripe token stored separately
  stripeId?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  cardholderName?: string;
  accountEmail?: string;
}

const CARD_BRANDS = ['Visa', 'Mastercard', 'Amex', 'Discover', 'UnionPay', 'Maestro', 'Other'];
const WALLET_BRANDS = [
  'PayPal', 'Apple Pay', 'Google Pay', 'Amazon Pay', 'Alipay',
  'WeChat Pay', 'Cash App', 'Venmo', 'Klarna', 'Afterpay',
  'Revolut', 'Samsung Pay', 'Stripe', 'Crypto / Bitcoin', 'Other',
];

export default function ProfileSection() {
  const { data: session, update: updateSession } = useSession();

  // Profile
  const [form, setForm] = useState({ name: '', image: '' });
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phoneNum, setPhoneNum] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrForm, setAddrForm] = useState<Record<string, string>>({});
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [showAddrForm, setShowAddrForm] = useState(false);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showPmForm, setShowPmForm] = useState(false);
  const [pmForm, setPmForm] = useState({ type: 'card', brand: 'Visa', last4: '', expMonth: '', expYear: '', cardholderName: '', accountEmail: '' });


  useEffect(() => {
    if (!session?.user?.email) return;
    fetch('/api/user')
      .then(r => r.json())
      .then((u) => {
        setForm({ name: u.name ?? '', image: u.image ?? '' });
        setAddresses(u.addresses ?? []);
        // Parse stored phone: "+33 612345678" → code + number
        const raw: string = u.phone ?? '';
        const m = raw.match(/^(\+\d+)\s+(.+)$/);
        if (m) { setPhoneCode(m[1]); setPhoneNum(m[2]); }
        else if (raw) { setPhoneNum(raw); }
      });
    fetch('/api/user/payment-methods')
      .then(r => r.json())
      .then(pms => Array.isArray(pms) ? setPaymentMethods(pms) : null);
  }, [session]);

  // Revoke blob URL when preview changes
  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const [saveMessage, setSaveMessage] = useState('');

  const saveProfile = async () => {
    setSaveStatus('saving');
    setSaveMessage('');
    try {
      let imageUrl = form.image;

      if (avatarFile) {
        const fd = new FormData();
        fd.append('file', avatarFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!uploadRes.ok) {
          const err = await uploadRes.text();
          throw new Error('Upload failed: ' + err);
        }
        const { url } = await uploadRes.json();
        imageUrl = url;
        setAvatarFile(null);
        setAvatarPreview('');
      }

      const phone = phoneNum.trim() ? `${phoneCode} ${phoneNum.trim()}` : '';
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, image: imageUrl, phone }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error('profile save failed', res.status, json);
        if (res.status === 401) {
          setSaveMessage('Session expired, please sign in again.');
          // optionally redirect
          window.location.href = '/signin';
          return;
        }
        throw new Error(json.error || 'Save failed');
      }
      const u = json;
      // update form including phone code+number
      setForm({ name: u.name ?? '', image: u.image ?? '' });
      if (u.phone) {
        const m = u.phone.match(/^(\+\d+)\s+(.*)$/);
        if (m) {
          setPhoneCode(m[1]);
          setPhoneNum(m[2]);
        } else {
          setPhoneNum(u.phone);
        }
      }
      await updateSession({ name: u.name, image: u.image });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err: any) {
      console.error('saveProfile error', err);
      setSaveStatus('error');
      setSaveMessage(err.message || 'Save failed');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  // ── Addresses ──
  const loadAddresses = async () => {
    const res = await fetch('/api/user/addresses');
    setAddresses(await res.json());
  };

  const saveAddress = async () => {
    const method = editingAddr ? 'PUT' : 'POST';
    const body = editingAddr ? { id: editingAddr.id, ...addrForm } : addrForm;
    await fetch('/api/user/addresses', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setAddrForm({});
    setEditingAddr(null);
    setShowAddrForm(false);
    loadAddresses();
  };

  const deleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
    loadAddresses();
  };

  const startEditAddr = (a: Address) => {
    setEditingAddr(a);
    setAddrForm({ ...a });
    setShowAddrForm(true);
  };

  // ── Payment methods ──
  const loadPaymentMethods = async () => {
    const res = await fetch('/api/user/payment-methods');
    setPaymentMethods(await res.json());
  };

  const PM_RESET = { type: 'card', brand: 'Visa', last4: '', expMonth: '', expYear: '', cardholderName: '', accountEmail: '' };

  const savePaymentMethod = async () => {
    const { type, brand, last4, expMonth, expYear, cardholderName, accountEmail } = pmForm;
    if (type === 'card' && !/^\d{4}$/.test(last4)) return;
    await fetch('/api/user/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        type === 'card'
          ? { type, brand, last4, expMonth: +expMonth, expYear: +expYear, cardholderName: cardholderName || undefined }
          : { type, brand, accountEmail: accountEmail || undefined }
      ),
    });
    setPmForm(PM_RESET);
    setShowPmForm(false);
    loadPaymentMethods();
  };

  const deletePaymentMethod = async (id: string) => {
    if (!confirm('Remove this card?')) return;
    await fetch(`/api/user/payment-methods?id=${id}`, { method: 'DELETE' });
    loadPaymentMethods();
  };

  if (!session?.user) return null;

  const displayImage = avatarPreview || form.image;
  const initials = (form.name || session.user.email || '?')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8">

      {/* ── Profile Card ── */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <User size={18} className="text-cyan-400" /> Profile Information
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 items-start">

          {/* Avatar with upload overlay */}
          <div className="shrink-0 flex flex-col items-center gap-1">
            <div className="relative h-20 w-20 group">
              <div className="h-20 w-20 rounded-full border-2 border-cyan-500/40 overflow-hidden bg-slate-800 flex items-center justify-center">
                {displayImage ? (
                  // Regular img: supports blob:, local /uploads/..., and external URLs without next/image domain config
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayImage}
                    alt="avatar"
                    className="h-full w-full object-cover"
                    onError={() => { setForm(f => ({ ...f, image: '' })); setAvatarPreview(''); }}
                  />
                ) : (
                  <span className="text-2xl font-bold text-cyan-400">{initials}</span>
                )}
              </div>
              <button
                type="button"
                aria-label="Upload profile picture"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera size={22} className="text-white" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload profile picture"
              className="hidden"
              onChange={handleFileSelect}
            />
            <p className="text-[10px] text-slate-500">
              {avatarFile ? avatarFile.name.slice(0, 14) + (avatarFile.name.length > 14 ? '…' : '') : 'Hover to upload'}
            </p>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email (sign-in address)</label>
              <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 text-sm select-all">
                {session.user.email}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Phone size={11} /> Mobile Phone
              </label>
              <div className="flex gap-2">
                <select
                  aria-label="Country dial code"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors w-40 shrink-0"
                  value={phoneCode}
                  onChange={e => setPhoneCode(e.target.value)}
                >
                  {PHONE_CODES.map((c, i) => (
                    <option key={`${c.code}-${c.country}-${i}`} value={c.code}>
                      {c.flag} {c.country} ({c.code})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="6 12 34 56 78"
                  value={phoneNum}
                  onChange={e => setPhoneNum(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={saveProfile}
                disabled={saveStatus === 'saving'}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? <><Check size={14} /> Saved!</> : 'Save Changes'}
              </button>
              {saveStatus === 'error' && (
                <span className="text-red-400 text-xs">{saveMessage || 'Save failed — try again'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-4">
          <p className="text-xs text-slate-500">
            This account uses <span className="text-cyan-400">passwordless sign-in</span>.
            To change your email, contact support. No password is stored.
          </p>
        </div>
      </div>

      {/* ── Addresses Card ── */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin size={18} className="text-cyan-400" /> Saved Addresses
          </h2>
          {!showAddrForm && (
            <button
              type="button"
              onClick={() => setShowAddrForm(true)}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-1.5 transition-colors"
            >
              <Plus size={13} /> Add Address
            </button>
          )}
        </div>

        {addresses.length === 0 && !showAddrForm && (
          <p className="text-sm text-slate-500 text-center py-4">No saved addresses yet.</p>
        )}
        <div className="space-y-3 mb-4">
          {addresses.map(a => (
            <div key={a.id} className="flex items-start justify-between bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
              <div>
                <div className="font-semibold text-white text-sm">{a.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city} {a.postal}, {a.country}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button type="button" aria-label="Edit address" onClick={() => startEditAddr(a)} className="text-cyan-400 hover:text-cyan-300 p-1 rounded transition-colors">
                  <Pencil size={14} />
                </button>
                <button type="button" aria-label="Delete address" onClick={() => deleteAddress(a.id)} className="text-red-400 hover:text-red-300 p-1 rounded transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddrForm && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">{editingAddr ? 'Edit Address' : 'New Address'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'label', placeholder: 'Label (e.g. Home, Work)' },
                { key: 'line1', placeholder: 'Street Address' },
                { key: 'line2', placeholder: 'Apt / Suite (optional)' },
                { key: 'city', placeholder: 'City' },
                { key: 'state', placeholder: 'State / Region' },
                { key: 'postal', placeholder: 'Postal Code' },
                { key: 'country', placeholder: 'Country' },
              ].map(({ key, placeholder }) => (
                <input
                  key={key}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder={placeholder}
                  value={addrForm[key] ?? ''}
                  onChange={e => setAddrForm(f => ({ ...f, [key]: e.target.value }))}
                />
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={saveAddress} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1">
                <Check size={14} /> {editingAddr ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={() => { setEditingAddr(null); setAddrForm({}); setShowAddrForm(false); }} className="text-slate-400 hover:text-white border border-slate-700 px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1">
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Payment Methods Card ── */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard size={18} className="text-cyan-400" /> Payment Methods
            <span className="text-xs font-normal text-slate-500">(optional)</span>
          </h2>
          {!showPmForm && (
            <button
              type="button"
              onClick={() => setShowPmForm(true)}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-1.5 transition-colors"
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>

        {paymentMethods.length === 0 && !showPmForm && (
          <p className="text-sm text-slate-500 text-center py-4">No saved payment methods.</p>
        )}
        <div className="space-y-3 mb-4">
          {paymentMethods.map(pm => (
            <div key={pm.id} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-cyan-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-sm">
                    {pm.brand}
                    {pm.type === 'card' && pm.last4 && <span className="text-slate-400 font-normal"> •••• {pm.last4}</span>}
                    {!pm.stripeId && <span className="text-xs text-yellow-400 ml-2">(no stripe token)</span>}
                  </div>
                  <div className="text-xs text-slate-400">
                    {pm.type === 'card' ? (
                      <>{pm.cardholderName && <span>{pm.cardholderName} · </span>}Exp {String(pm.expMonth).padStart(2, '0')}/{pm.expYear}</>
                    ) : (
                      <>{pm.accountEmail || 'Digital wallet'}</>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label="Remove payment method"
                onClick={() => deletePaymentMethod(pm.id)}
                className="text-red-400 hover:text-red-300 p-1 rounded transition-colors ml-4"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {showPmForm && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Add Payment Method</h3>

            {/* Type toggle */}
            <div className="flex gap-2">
              {(['card', 'wallet'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPmForm(f => ({ ...f, type: t, brand: t === 'card' ? 'Visa' : 'PayPal' }))}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pmForm.type === t
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {t === 'card' ? '💳 Card' : '🌐 Digital Wallet'}
                </button>
              ))}
            </div>

            {pmForm.type === 'card' ? (
              <>
                <p className="text-[11px] text-slate-500">Only the last 4 digits are stored — no full card number is ever saved.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Card Brand</label>
                    <select
                      aria-label="Card Brand"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                      value={pmForm.brand}
                      onChange={e => setPmForm(f => ({ ...f, brand: e.target.value }))}
                    >
                      {CARD_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Last 4 Digits</label>
                    <input
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 tracking-widest"
                      placeholder="1234"
                      maxLength={4}
                      value={pmForm.last4}
                      onChange={e => setPmForm(f => ({ ...f, last4: e.target.value.replace(/\D/g, '') }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Expiry Month</label>
                    <input
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                      placeholder="MM"
                      maxLength={2}
                      value={pmForm.expMonth}
                      onChange={e => setPmForm(f => ({ ...f, expMonth: e.target.value.replace(/\D/g, '') }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Expiry Year</label>
                    <input
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                      placeholder="YYYY"
                      maxLength={4}
                      value={pmForm.expYear}
                      onChange={e => setPmForm(f => ({ ...f, expYear: e.target.value.replace(/\D/g, '') }))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Cardholder Name (optional)</label>
                    <input
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                      placeholder="Name on card"
                      value={pmForm.cardholderName}
                      onChange={e => setPmForm(f => ({ ...f, cardholderName: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Platform</label>
                  <select
                    aria-label="Wallet Platform"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    value={pmForm.brand}
                    onChange={e => setPmForm(f => ({ ...f, brand: e.target.value }))}
                  >
                    {WALLET_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Account Email (optional)</label>
                  <input
                    type="email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="you@example.com"
                    value={pmForm.accountEmail}
                    onChange={e => setPmForm(f => ({ ...f, accountEmail: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={savePaymentMethod}
                disabled={pmForm.type === 'card' && (!/^\d{4}$/.test(pmForm.last4) || !pmForm.expMonth || !pmForm.expYear)}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1"
              >
                <Check size={14} /> Save
              </button>
              <button
                type="button"
                onClick={() => { setShowPmForm(false); setPmForm(PM_RESET); }}
                className="text-slate-400 hover:text-white border border-slate-700 px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
