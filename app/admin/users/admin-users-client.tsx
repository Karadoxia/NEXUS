'use client';

import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-cyan-500/10   text-cyan-400   border-cyan-500/20',
    editor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    support: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
    user: 'bg-slate-800     text-slate-500  border-slate-700',
};

type UserRow = {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    role: string;
    createdAt: Date;
};

export default function AdminUsersClient({
    users: initialUsers,
    total,
    totalPages,
    page,
    q,
    roleFilter,
}: {
    users: UserRow[];
    total: number;
    totalPages: number;
    page: number;
    q?: string;
    roleFilter?: string;
}) {
    const router = useRouter();

    // UI State
    const [users, setUsers] = useState<UserRow[]>(initialUsers);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Data State for Modals
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
    const [detailedUser, setDetailedUser] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchQuery = formData.get('q') as string;

        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (roleFilter) params.set('role', roleFilter);
        params.set('page', '1');

        router.push(`/admin/users?${params.toString()}`);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create user');

            setIsCreateModalOpen(false);
            router.refresh(); // Refresh page data
            setFormData({ name: '', email: '', phone: '', role: 'user', password: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                    password: formData.password || undefined, // Only send if updating
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update user');

            setIsEditModalOpen(false);
            router.refresh();

            // Update local state temporarily for snappy UI
            setUsers(users.map(u => u.id === data.id ? { ...u, ...data } : u));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete user');

            setIsDeleteModalOpen(false);
            router.refresh();

            setUsers(users.filter(u => u.id !== selectedUser.id));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (user: UserRow) => {
        setSelectedUser(user);
        setFormData({
            name: user.name || '',
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            password: '', // Blank by default, only fill to change
        });
        setError('');
        setIsEditModalOpen(true);
    };

    const openViewModal = async (user: UserRow) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
        setDetailedUser(null); // Show loading state

        try {
            const res = await fetch(`/api/admin/users/${user.id}`);
            if (!res.ok) throw new Error('Failed to fetch details');
            const data = await res.json();
            setDetailedUser(data);
        } catch (err) {
            console.error(err);
        }
    };

    const buildHref = (overrides: Record<string, string | undefined>) => {
        const params = new URLSearchParams();
        const merged = { q, role: roleFilter, page: page.toString(), ...overrides };
        Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
        const qs = params.toString();
        return `/admin/users${qs ? `?${qs}` : ''}`;
    };

    const roles = ['', 'admin', 'editor', 'support', 'user'];

    return (
        <div className="p-8 max-w-screen-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Clients</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {total.toLocaleString()} registered user{total !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ name: '', email: '', phone: '', role: 'user', password: '' });
                        setError('');
                        setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-xl transition-colors"
                >
                    <Plus size={16} />
                    <span>Add User</span>
                </button>
            </div>

            {/* Search + role filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    {roleFilter && <input type="hidden" name="role" value={roleFilter} />}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            name="q"
                            defaultValue={q ?? ''}
                            placeholder="Search email or name…"
                            className="bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-sm w-64 focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 text-sm font-semibold rounded-xl transition-colors"
                    >
                        Filter
                    </button>
                    {(q || roleFilter) && (
                        <button
                            type="button"
                            onClick={() => router.push('/admin/users')}
                            className="px-4 py-2 text-sm text-slate-400 border border-slate-700 rounded-xl hover:border-slate-500 hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </form>

                <div className="flex flex-wrap gap-2 sm:ml-auto">
                    {roles.map((r) => (
                        <a
                            key={r}
                            href={buildHref({ role: r || undefined, page: '1' })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${(roleFilter ?? '') === r
                                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                    : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white'
                                }`}
                        >
                            {r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All Profiles'}
                        </a>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/70">
                                {['Email', 'Name', 'Phone', 'Role', 'Joined', 'Actions'].map((h) => (
                                    <th
                                        key={h}
                                        className={`px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-14 text-center text-slate-500">
                                        No users match this filter
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-5 py-3 text-slate-300 font-medium break-all">{u.email}</td>
                                        <td className="px-5 py-3 text-slate-400">{u.name ?? <span className="text-slate-600">—</span>}</td>
                                        <td className="px-5 py-3 text-slate-400">{u.phone ?? <span className="text-slate-600">—</span>}</td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase ${ROLE_COLORS[u.role] ?? ROLE_COLORS.user}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                                            {new Date(u.createdAt).toLocaleDateString('en', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openViewModal(u)}
                                                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            Page <span className="text-white font-medium">{page}</span> of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            {page > 1 && (
                                <a
                                    href={buildHref({ page: (page - 1).toString() })}
                                    className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                                >
                                    ← Prev
                                </a>
                            )}
                            {page < totalPages && (
                                <a
                                    href={buildHref({ page: (page + 1).toString() })}
                                    className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                                >
                                    Next →
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <h2 className="text-lg font-semibold text-white">Create New User</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
                                    <input
                                        required type="email"
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                                        placeholder="client@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Password *</label>
                                    <input
                                        required type="password"
                                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Account Role</label>
                                        <select
                                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                                        >
                                            <option value="user">User</option>
                                            <option value="editor">Editor</option>
                                            <option value="support">Support</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button disabled={loading} type="submit" className="px-5 py-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors disabled:opacity-50">
                                    {loading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <h2 className="text-lg font-semibold text-white">Edit User</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                                    <input
                                        required type="email"
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Update Password (Optional)</label>
                                    <input
                                        type="password"
                                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-600"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Account Role</label>
                                        <select
                                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                                        >
                                            <option value="user">User</option>
                                            <option value="editor">Editor</option>
                                            <option value="support">Support</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button disabled={loading} type="submit" className="px-5 py-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors disabled:opacity-50">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete User Modal */}
            {isDeleteModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Delete User?</h2>
                            <p className="text-sm text-slate-400 mb-6">
                                Are you sure you want to permanently delete <strong className="text-white">{selectedUser.email}</strong>? This action will remove all their content and cannot be undone.
                            </p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button disabled={loading} onClick={handleDelete} className="px-5 py-2 text-sm font-semibold bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors disabled:opacity-50">
                                    {loading ? 'Deleting...' : 'Confirm Deletion'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {isViewModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-shrink-0 items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur z-10 rounded-t-2xl">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                User Details
                                <span className={`px-2 py-0.5 ml-2 text-[10px] font-bold rounded border uppercase ${ROLE_COLORS[selectedUser.role] ?? ROLE_COLORS.user}`}>
                                    {selectedUser.role}
                                </span>
                            </h2>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {!detailedUser ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                    <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mb-4" />
                                    <p>Loading profile...</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Email</p>
                                            <p className="text-sm text-slate-200 font-medium">{detailedUser.email}</p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Name</p>
                                            <p className="text-sm text-slate-200">{detailedUser.name || '—'}</p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Phone</p>
                                            <p className="text-sm text-slate-200">{detailedUser.phone || '—'}</p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Joined</p>
                                            <p className="text-sm text-slate-200">{new Date(detailedUser.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Activity Summary */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                            Activity Summary
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                <p className="text-2xl font-bold text-white mb-1">{detailedUser._count?.orders || 0}</p>
                                                <p className="text-xs text-slate-500">Total Orders</p>
                                            </div>
                                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                <p className="text-2xl font-bold text-white mb-1">{detailedUser._count?.sessions || 0}</p>
                                                <p className="text-xs text-slate-500">Logins</p>
                                            </div>
                                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                                <p className="text-2xl font-bold text-white mb-1">{detailedUser._count?.logs || 0}</p>
                                                <p className="text-xs text-slate-500">Audit Logs</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connected Accounts */}
                                    {detailedUser.accounts?.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-white mb-3 border-b border-slate-800 pb-2">Connected Accounts</h3>
                                            <div className="space-y-2">
                                                {detailedUser.accounts.map((acc: any) => (
                                                    <div key={acc.id} className="flex items-center justify-between text-sm py-2 px-3 bg-slate-800/30 rounded-lg">
                                                        <span className="font-medium text-slate-300 capitalize">{acc.provider}</span>
                                                        <span className="text-slate-500 text-xs truncate max-w-[200px]">{acc.providerAccountId}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Saved Addresses */}
                                    {detailedUser.addresses?.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-white mb-3 border-b border-slate-800 pb-2">Saved Addresses</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {detailedUser.addresses.map((addr: any) => (
                                                    <div key={addr.id} className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg text-sm">
                                                        <p className="font-medium text-slate-200 mb-1">{addr.label}</p>
                                                        <p className="text-slate-400">{addr.line1}</p>
                                                        {addr.line2 && <p className="text-slate-400">{addr.line2}</p>}
                                                        <p className="text-slate-400">{addr.city}, {addr.state} {addr.postal}</p>
                                                        <p className="text-slate-500 text-xs mt-1 uppercase">{addr.country}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 flex justify-end border-t border-slate-800 bg-slate-900 rounded-b-2xl">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
