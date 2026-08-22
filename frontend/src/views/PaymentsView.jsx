import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function PaymentsView() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function loadPayments() {
      try {
        const res = await axios.get('/api/v1/invoices/');
        if (!ignore && res.data?.invoices) {
          const mapped = res.data.invoices.map(inv => ({
            invoice: inv.invoice_number,
            vendor: inv.vendor_name,
            amount: inv.total_amount || 0,
            due_date: inv.due_date || '2026-09-04',
            payment_date: inv.payment_status === 'Paid' ? inv.invoice_date : '—',
            status: inv.payment_status || 'Pending'
          }));
          setPayments(mapped);
        }
      } catch (err) {
        console.error('Error fetching payments', err);
      }
    }
    loadPayments();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Track vendor invoice payment schedules, due dates, and settlement status.
        </p>
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments recorded yet" description="Approved invoice payments will appear here once processed." />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Payment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#149ECA', fontFamily: 'monospace' }}>{p.invoice}</td>
                  <td style={{ color: '#172033' }}>{p.vendor}</td>
                  <td style={{ fontWeight: 600, color: '#172033' }}>₹ {p.amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#64748B' }}>{p.due_date}</td>
                  <td style={{ color: '#64748B' }}>{p.payment_date || '—'}</td>
                  <td>
                    <span className={`badge ${p.status === 'Paid' ? 'badge-success' : p.status === 'Overdue' ? 'badge-danger' : 'badge-warning'}`}>
                      {p.status}
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
