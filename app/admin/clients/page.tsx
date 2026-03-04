'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, Trash2, Eye, Mail, Phone, MapPin, CreditCard, Calendar, Edit, Save, X } from 'lucide-react';

interface ClientProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  image?: string;
  createdAt: string;
  _count: {
    orders: number;
    addresses: number;
  };
}

interface ClientDetails extends ClientProfile {
  updatedAt: string;
  addresses: Array<{
    id: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
}

export default function ClientsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [passwordResetRequested, setPasswordResetRequested] = useState(false);

  // Check admin
  useEffect(() => {
    if (session && !session.user.isAdmin) {
      router.push('/');
      return;
    }
    loadClients();
  }, [session, router]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients');
      if (!res.ok) throw new Error('Failed to load clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error('Load clients error:', err);
      alert('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const loadClientDetails = async (clientId: string) => {
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`);
      if (!res.ok) throw new Error('Failed to load client details');
      const data = await res.json();
      setSelectedClient(data);
      setFormData({ 
        name: data.name || '', 
        phone: data.phone || '', 
        password: '' 
      });
    } catch (err) {
      console.error('Load client details error:', err);
      alert('Failed to load client details');
    }
  };

  const saveClientChanges = async () => {
    if (!selectedClient) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/clients/${selectedClient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || undefined,
          phone: formData.phone || undefined,
          ...(formData.password && { password: formData.password }),
        }),
      });

      if (!res.ok) throw new Error('Failed to save changes');
      
      const updated = await res.json();
      alert('Client updated successfully' + (formData.password ? ' (password reset)' : ''));
      
      // Reload clients list
      loadClients();
      
      // Close editor
      setIsEditing(false);
      setPasswordResetRequested(false);
      setFormData({ name: '', phone: '', password: '' });
      
      // Reload details
      await loadClientDetails(selectedClient.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteClient = async (clientId: string, email: string) => {
    if (!confirm(`Delete client ${email} and all their data?`)) return;

    setDeleting(clientId);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setClients(c => c.filter(x => x.id !== clientId));
      setShowDetails(false);
      alert('Client deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = clients.filter(c =>
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.name && c.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (!session?.user.isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
        <p className="text-slate-400">Manage client accounts, view profiles, and delete records</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by email or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Clients Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading clients…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No clients found</div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-300">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-300">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-300">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-300">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-cyan-400">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{client.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{client._count.orders}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={async () => {
                            setSelectedClient(client as ClientDetails);
                            setShowDetails(true);
                            await loadClientDetails(client.id);
                          }}
                          className="p-1 text-cyan-400 hover:text-cyan-300 rounded transition-colors"
                          title="View & edit details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => deleteClient(client.id, client.email)}
                          disabled={deleting === client.id}
                          className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50 rounded transition-colors"
                          title="Delete client"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {showDetails && selectedClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedClient.name || selectedClient.email}</h2>
                <p className="text-sm text-slate-400 font-mono mt-1">{selectedClient.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setIsEditing(false);
                  setPasswordResetRequested(false);
                }}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {isEditing ? (
              // Edit Form
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Client name"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Phone number"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Password Reset */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="reset-pw"
                      checked={passwordResetRequested}
                      onChange={(e) => {
                        setPasswordResetRequested(e.target.checked);
                        if (!e.target.checked) {
                          setFormData({...formData, password: ''});
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="reset-pw" className="text-sm font-semibold text-slate-300">Reset Password</label>
                  </div>
                  {passwordResetRequested && (
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="New password"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setPasswordResetRequested(false);
                      setFormData({ name: selectedClient.name || '', phone: selectedClient.phone || '', password: '' });
                    }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={saveClientChanges}
                    disabled={saving}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-white mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-slate-500" />
                      <div className="flex-1 font-mono text-cyan-400">{selectedClient.email}</div>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-slate-500" />
                        <div className="text-slate-300">{selectedClient.phone}</div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-slate-500" />
                      <div className="text-slate-300">Joined {new Date(selectedClient.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                {selectedClient.addresses && selectedClient.addresses.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <MapPin size={16} /> Saved Addresses ({selectedClient.addresses.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedClient.addresses.map((addr) => (
                        <div key={addr.id} className="bg-slate-900/50 p-3 rounded-lg text-sm">
                          <div className="font-semibold text-cyan-400">{addr.firstName} {addr.lastName}</div>
                          <div className="text-slate-400">{addr.street}</div>
                          <div className="text-slate-400">{addr.city}, {addr.state} {addr.postalCode}</div>
                          <div className="text-slate-500">{addr.country}</div>
                          {addr.isDefault && <div className="text-xs text-amber-400 mt-1">Default Address</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-white mb-3">Account Activity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Orders:</span>
                      <span className="text-white font-bold">{selectedClient._count.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Saved Addresses:</span>
                      <span className="text-white font-bold">{selectedClient._count.addresses}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      deleteClient(selectedClient.id, selectedClient.email);
                    }}
                    disabled={deleting === selectedClient.id}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    {deleting === selectedClient.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Total Clients</div>
          <div className="text-2xl font-bold text-cyan-400">{clients.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Active Clients</div>
          <div className="text-2xl font-bold text-cyan-400">{clients.filter(c => c._count.orders > 0).length}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-cyan-400">{clients.reduce((s, c) => s + c._count.orders, 0)}</div>
        </div>
      </div>
    </div>
  );
}
