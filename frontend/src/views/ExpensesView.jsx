import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Plus, Link as LinkIcon } from 'lucide-react';
import { uploadExpenseReceipt } from '../lib/supabaseClient';
import EmptyState from '../components/EmptyState';

export default function ExpensesView() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    employee_name: '',
    project_name: 'Project Nebula',
    category: 'Travel',
    amount: ''
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function loadExpenses() {
      try {
        const res = await axios.get('/api/v1/expenses/');
        if (!ignore && res.data?.expenses) {
          setExpenses(res.data.expenses);
        }
      } catch (err) {
        console.error('Error loading expenses', err);
      }
    }
    loadExpenses();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let receiptUrl = null;
      if (receiptFile) {
        const storageResult = await uploadExpenseReceipt(receiptFile);
        receiptUrl = storageResult.publicUrl;
      }

      await axios.post('/api/v1/expenses/', {
        ...form,
        amount: parseFloat(form.amount),
        receipt_url: receiptUrl
      });

      const newExp = {
        employee_name: form.employee_name,
        project_name: form.project_name,
        category: form.category,
        amount: parseFloat(form.amount),
        date: new Date().toISOString().split('T')[0],
        receipt_url: receiptUrl,
        status: 'Submitted',
        reimbursement_status: 'Pending'
      };

      setExpenses([newExp, ...expenses]);
      setMessage('Expense submitted successfully!');
      setForm({ employee_name: '', project_name: 'Project Nebula', category: 'Travel', amount: '' });
      setReceiptFile(null);
      setTimeout(() => setShowForm(false), 800);
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Employee expense claims and organizational spending tracking.</p>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23, 32, 51, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '16px' }}>Submit Employee Expense</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Employee Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.employee_name}
                  onChange={(e) => setForm({ ...form, employee_name: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Project Allocation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project Nebula"
                  value={form.project_name}
                  onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2500.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
                  >
                    <option value="Travel">Travel</option>
                    <option value="Software">Software & SaaS</option>
                    <option value="Hardware">Hardware & Equip</option>
                    <option value="Meals">Meals & Entertainment</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Receipt Image/PDF (Optional)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#64748B', fontSize: '12px' }}
                />
              </div>

              {message && <p style={{ color: '#16A34A', fontSize: '13px', margin: 0 }}>{message}</p>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Expenses Data Table */}
      {expenses.length === 0 ? (
        <EmptyState icon={DollarSign} title="No expenses yet" description="Add an expense to start tracking organizational spending." actionLabel="Add Expense" onAction={() => setShowForm(true)} />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Project</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Receipt</th>
                <th>Status</th>
                <th>Reimbursement</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#172033' }}>{e.employee_name}</td>
                  <td><span style={{ color: '#149ECA', fontSize: '12px' }}>{e.project_name}</span></td>
                  <td style={{ color: '#64748B' }}>{e.category}</td>
                  <td style={{ fontWeight: 600, color: '#172033' }}>₹ {e.amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#64748B' }}>{e.date}</td>
                  <td>
                    {e.receipt_url ? (
                      <a href={e.receipt_url} target="_blank" rel="noreferrer" style={{ color: '#149ECA', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '12px' }}>
                        <LinkIcon size={14} />
                        <span>View</span>
                      </a>
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: '12px' }}>No Receipt</span>
                    )}
                  </td>
                  <td><span className="badge badge-warning">{e.status}</span></td>
                  <td><span className="badge badge-warning">{e.reimbursement_status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
