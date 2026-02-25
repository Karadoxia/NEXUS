'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

export default function ProfileSection() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({});
  const [addrForm, setAddrForm] = useState<any>({});
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch('/api/user').then(r => r.json()).then((u) => { setProfile(u); setForm({ name:u.name||'', image:u.image||''}); setAddresses(u.addresses||[]); });
  }, [session]);

  const saveProfile = async () => {
    await fetch('/api/user', { method: 'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)});
    // refresh
    const res= await fetch('/api/user'); const u = await res.json(); setProfile(u);
  };

  const loadAddresses = async () => {
    const res = await fetch('/api/user/addresses');
    setAddresses(await res.json());
  };

  const saveAddress = async () => {
    const url = '/api/user/addresses';
    const method = editingAddr ? 'PUT' : 'POST';
    const body = editingAddr ? { id: editingAddr.id, ...addrForm } : addrForm;
    await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    setAddrForm({}); setEditingAddr(null); loadAddresses();
  };

  const deleteAddress = async (id:string) => {
    if(!confirm('Delete address?')) return;
    await fetch(`/api/user/addresses?id=${id}`, { method:'DELETE' });
    loadAddresses();
  };

  if (!session?.user) return null;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-12">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <div className="space-y-3 mb-8">
        <input className="w-full bg-slate-800 p-2 rounded" placeholder="Name" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="w-full bg-slate-800 p-2 rounded" placeholder="Avatar URL" value={form.image||''} onChange={e=>setForm({...form,image:e.target.value})}/>
        <button className="bg-cyan-600 px-4 py-2 rounded" onClick={saveProfile}>Save Profile</button>
      </div>

      <h2 className="text-xl font-bold mb-4">Addresses</h2>
      <div className="space-y-2 mb-4">
        {addresses.map(a=>(
          <div key={a.id} className="flex justify-between bg-slate-800 p-3 rounded">
            <div>
              <div className="font-semibold">{a.label}</div>
              <div className="text-xs">{a.line1}{a.line2 && ','+a.line2}, {a.city} {a.postal} {a.country}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-cyan-400" onClick={()=>{setEditingAddr(a); setAddrForm(a);}}>Edit</button>
              <button className="text-xs text-red-400" onClick={()=>deleteAddress(a.id)}>Del</button>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-4">
        <input className="w-full bg-slate-800 p-2 rounded" placeholder="Label" value={addrForm.label||''} onChange={e=>setAddrForm({...addrForm,label:e.target.value})}/>
        <input className="w-full bg-slate-800 p-2 rounded" placeholder="Line1" value={addrForm.line1||''} onChange={e=>setAddrForm({...addrForm,line1:e.target.value})}/>
        <input className="w-full bg-slate-800 p-2 rounded" placeholder="Line2" value={addrForm.line2||''} onChange={e=>setAddrForm({...addrForm,line2:e.target.value})}/>
        <input className="w-full bg-slate-800 p-2 rounded" placeholder="City" value={addrForm.city||''} onChange={e=>setAddrForm({...addrForm,city:e.target.value})}/>
        <input className="w-full bg-slate-800 p-2 rounded" placeholder="Postal" value={addrForm.postal||''} onChange={e=>setAddrForm({...addrForm,postal:e.target.value})}/>
        <input className="w-full bg-slate-800 p-2 rounded" placeholder="Country" value={addrForm.country||''} onChange={e=>setAddrForm({...addrForm,country:e.target.value})}/>
        <button className="bg-cyan-600 px-4 py-2 rounded" onClick={saveAddress}>{editingAddr?'Update':'Add'} Address</button>
      </div>
    </div>
  );
}
