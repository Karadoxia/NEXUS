'use client';

import { useEffect, useState } from 'react';
import { Plus, Eye, Trash2, RotateCcw } from 'lucide-react';
import CreateEmployeeModal from './_components/CreateEmployeeModal';
import EmployeeDetailsModal from './_components/EmployeeDetailsModal';
import ResetPasswordModal from './_components/ResetPasswordModal';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
  MANAGER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  MARKETING: 'bg-green-500/20 text-green-400 border-green-500/30',
  IT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  SUPPORT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  EDITOR: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  TRAINEE: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/hr/employees');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchEmployees();
  };

  const handleDeactivate = async (id: string, name: string) => {
    if (!confirm(`Deactivate ${name}? They will not be able to log in.`)) return;

    try {
      const res = await fetch(`/api/admin/hr/employees/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to deactivate employee');
      fetchEmployees();
    } catch (err) {
      console.error('Failed to deactivate employee:', err);
      alert('Failed to deactivate employee');
    }
  };

  const handleResetPassword = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowResetPasswordModal(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 mt-1">Manage staff accounts and roles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          Create Account
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No employees found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Last Login</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 text-sm text-white font-medium">{employee.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{employee.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${ROLE_COLORS[employee.role] || ROLE_COLORS.TRAINEE}`}
                      >
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{employee.department || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {employee.lastLogin
                        ? new Date(employee.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          employee.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 hover:bg-slate-700 rounded transition"
                          title="View details"
                        >
                          <Eye size={16} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(employee)}
                          className="p-2 hover:bg-slate-700 rounded transition"
                          title="Reset password"
                        >
                          <RotateCcw size={16} className="text-slate-400" />
                        </button>
                        {employee.isActive && (
                          <button
                            onClick={() => handleDeactivate(employee.id, employee.name)}
                            className="p-2 hover:bg-red-900/30 rounded transition"
                            title="Deactivate"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEmployeeModal onClose={() => setShowCreateModal(false)} onSuccess={handleCreateSuccess} />
      )}

      {showDetailsModal && selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={fetchEmployees}
        />
      )}

      {showResetPasswordModal && selectedEmployee && (
        <ResetPasswordModal
          employee={selectedEmployee}
          onClose={() => setShowResetPasswordModal(false)}
          onSuccess={() => {
            setShowResetPasswordModal(false);
            alert('Password reset successfully');
          }}
        />
      )}
    </div>
  );
}
