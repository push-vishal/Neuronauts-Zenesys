import React, { useState } from 'react';
import { Receipt, CheckCircle2, Clock, XCircle } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function ReimbursementsView() {
  const [reimbursements, setReimbursements] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Manage employee expense reimbursement approvals and payment dispatch.
        </p>
      </div>

      {reimbursements.length === 0 ? (
        <EmptyState icon={Receipt} title="No reimbursements yet" description="Employee reimbursement claims will appear here once submitted." />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Project</th>
                <th>Expense</th>
                <th>Amount</th>
                <th>Submission Date</th>
                <th>Approval Status</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {reimbursements.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#172033' }}>{r.employee}</td>
                  <td><span style={{ color: '#149ECA', fontSize: '12px' }}>{r.project}</span></td>
                  <td style={{ color: '#64748B' }}>{r.expense}</td>
                  <td style={{ fontWeight: 600, color: '#172033' }}>₹ {r.amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#64748B' }}>{r.submission_date}</td>
                  <td>
                    <span className={`badge ${r.approval_status === 'Approved' ? 'badge-success' : r.approval_status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {r.approval_status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${r.payment_status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {r.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
