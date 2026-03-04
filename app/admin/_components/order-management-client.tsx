'use client';

import { useState } from 'react';
import { Trash2, Download, AlertTriangle } from 'lucide-react';

interface OrderManagementClientProps {
  totalOrders: number;
}

export default function OrderManagementClient({ totalOrders }: OrderManagementClientProps) {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const exportOrders = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/admin/orders?action=export');
      if (!res.ok) throw new Error('Export failed');
      const data = await res.json();

      // Generate JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`✅ Exported ${data.count} orders successfully`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const deleteAllOrders = async () => {
    if (!confirm('⚠️ This will DELETE ALL ORDERS and clear the order cache.\n\nMake sure you have exported them first if needed.\n\nContinue?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch('/api/admin/orders?action=delete-all', { method: 'DELETE' });
      if (!res.ok) throw new Error('Deletion failed');
      const data = await res.json();

      alert(`✅ ${data.message}\n\nDeleted: ${data.deletedCount} orders`);
      // Reload page to refresh counts
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <AlertTriangle size={20} className="text-red-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-300 mb-2">Order Management</h3>
          <p className="text-sm text-slate-400 mb-4">
            You have <strong>{totalOrders.toLocaleString()} orders</strong> in the system.
            Export your data before deletion to preserve records.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportOrders}
              disabled={exporting}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              <Download size={16} />
              {exporting ? 'Exporting…' : 'Export Orders'}
            </button>
            <button
              onClick={deleteAllOrders}
              disabled={deleting}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              <Trash2 size={16} />
              {deleting ? 'Deleting…' : 'Delete All Orders'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
