import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, TrendingUp, Plus, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function ProcurementView() {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poForm, setPoForm] = useState({ po_number: '', vendor_name: '', total_amount: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      const res = await axios.get('/api/v1/procurement/pos');
      setPos(res.data.purchase_orders || []);
    } catch (err) {
      console.error('Failed to fetch POs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/procurement/pos', {
        ...poForm,
        total_amount: parseFloat(poForm.total_amount)
      });
      setMessage(res.data.message);
      setPoForm({ po_number: '', vendor_name: '', total_amount: '' });
      fetchPOs();
    } catch (err) {
      console.error(err);
      setMessage('Failed to create Purchase Order.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Create PO Form */}
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus color="#149ECA" size={18} />
            <span>Create Purchase Order (PO)</span>
          </h3>
          <form onSubmit={handleCreatePO} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>PO Number</label>
              <input
                type="text"
                required
                placeholder="e.g. PO-9922"
                value={poForm.po_number}
                onChange={(e) => setPoForm({ ...poForm, po_number: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Vendor Name</label>
              <input
                type="text"
                required
                placeholder="Enter vendor name"
                value={poForm.vendor_name}
                onChange={(e) => setPoForm({ ...poForm, vendor_name: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Total Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={poForm.total_amount}
                onChange={(e) => setPoForm({ ...poForm, total_amount: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
              Issue Purchase Order
            </button>
            {message && <p style={{ color: '#16A34A', fontSize: '13px', margin: 0 }}>{message}</p>}
          </form>
        </div>

        {/* Historical Procurement Intelligence */}
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp color="#149ECA" size={18} />
            <span>Procurement Intelligence</span>
          </h3>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '12px', color: '#149ECA', fontWeight: 600, margin: '0 0 4px 0' }}>COST-SAVING ANALYSIS</p>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
              FINOVA will compare purchase order pricing against your organizational purchase history once sufficient transaction records exist.
            </p>
          </div>
        </div>
      </div>

      {/* PO List Table */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingCart color="#149ECA" size={18} />
          <span>Active Purchase Orders</span>
        </h3>
        {loading ? (
          <p style={{ color: '#64748B' }}>Loading POs...</p>
        ) : pos.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No purchase orders yet" description="Create a purchase order to start procurement tracking." />
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pos.map((po, i) => (
                  <tr key={i}>
                    <td style={{ color: '#149ECA', fontFamily: 'monospace', fontWeight: 600 }}>{po.po_number}</td>
                    <td style={{ color: '#172033', fontWeight: 600 }}>{po.vendor_name}</td>
                    <td style={{ color: '#172033', fontWeight: 600 }}>₹ {Number(po.total_amount).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${po.status === 'issued' ? 'badge-info' : 'badge-success'}`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
