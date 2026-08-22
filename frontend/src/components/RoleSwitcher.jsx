import React from 'react';
import { Briefcase, Building2, BarChart3, UserCheck, Shield, Store } from 'lucide-react';

export const ROLES = [
  { id: 'procurement_manager', label: 'Procurement Manager', icon: Briefcase, color: '#149ECA', desc: 'PO creation & vendor price drift analytics' },
  { id: 'finance_team', label: 'Finance Team', icon: Building2, color: '#16A34A', desc: 'Invoices, 3-way matching & approvals' },
  { id: 'project_manager', label: 'Project Manager', icon: BarChart3, color: '#D97706', desc: 'Project budgets & overrun detection' },
  { id: 'employee', label: 'Employee', icon: UserCheck, color: '#6366F1', desc: 'Expense reports & reimbursement tracking' },
  { id: 'cfo', label: 'CFO / Management', icon: Shield, color: '#DC2626', desc: 'Executive intelligence & financial risks' },
  { id: 'vendor', label: 'Vendor Portal', icon: Store, color: '#2563EB', desc: 'Invoice submission & PO tracking' },
];

export default function RoleSwitcher({ activeRole, onRoleChange }) {
  return (
    <div style={{ padding: '16px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0' }}>
      <p style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0', fontWeight: 600 }}>
        Active Organization Flow
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isActive ? '#E0F2FE' : '#FFFFFF',
                border: isActive ? `1px solid ${role.color}` : '1px solid #E2E8F0',
                color: isActive ? '#172033' : '#64748B',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                background: isActive ? role.color : '#F1F5F9',
                color: isActive ? '#FFFFFF' : role.color,
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={16} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500, margin: 0 }}>{role.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
