import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle2, ShieldAlert, AlertTriangle, Eye, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { uploadInvoiceDocument } from '../lib/supabaseClient';
import EmptyState from '../components/EmptyState';

export default function InvoicesView() {
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState(''); // Uploading..., Extracting..., Validating..., Ready for Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Invoices list state (starts empty if no database records processed yet)
  const [invoices, setInvoices] = useState([]);

  const handleUpload = async (fileToUpload) => {
    if (!fileToUpload) return;
    setFile(fileToUpload);
    setLoading(true);
    setError(null);

    try {
      setUploadStage('Uploading...');
      const storageResult = await uploadInvoiceDocument(fileToUpload);

      setUploadStage('Extracting...');
      await new Promise(r => setTimeout(r, 600));

      setUploadStage('Validating...');
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('storage_url', storageResult.publicUrl || '');

      const response = await axios.post('/api/v1/invoices/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStage('Ready for Review');
      await new Promise(r => setTimeout(r, 400));

      const newInv = {
        invoice_number: response.data.parsed_invoice?.invoice_number || `INV-${Date.now()}`,
        vendor_name: response.data.vendor_name || 'Uploaded Vendor',
        project_code: 'PRJ-NEBULA',
        total_amount: response.data.total_amount || 0,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14*86400000).toISOString().split('T')[0],
        match_status: response.data.anomalies_detected > 0 ? 'PO_MISMATCH' : 'MATCHED',
        payment_status: 'Pending',
        anomalies_count: response.data.anomalies_detected || 0,
        anomalies: response.data.anomalies || [],
        storage_url: storageResult.publicUrl
      };

      setInvoices([newInv, ...invoices]);
      setSelectedInvoice(newInv);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Invoice processing failed.');
    } finally {
      setLoading(false);
      setUploadStage('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Upload Drag & Drop Area */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#149ECA" />
          <span>Upload Invoice</span>
        </h3>

        <div className="drag-drop-zone">
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <Upload size={36} color="#149ECA" style={{ margin: '0 auto 8px auto', display: 'block' }} />
          <p style={{ color: '#172033', fontWeight: 600, fontSize: '14px', margin: '0 0 4px 0' }}>
            Drag & Drop Invoice Here or [ Browse Files ]
          </p>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>PDF / PNG / JPG supported</p>
        </div>

        {loading && (
          <div style={{ background: '#E0F2FE', border: '1px solid #7DD3FC', padding: '12px 16px', borderRadius: '6px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#149ECA' }}>
            <RefreshCw className="animate-spin" size={16} />
            <span style={{ fontWeight: 600 }}>{uploadStage}</span>
          </div>
        )}

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '12px 16px', borderRadius: '6px', marginTop: '12px', color: '#DC2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Invoices Table */}
      {invoices.length === 0 ? (
        <EmptyState icon={FileText} title="No invoices yet" description="Upload your first invoice to start invoice processing." actionLabel="Upload Invoice" onAction={() => document.querySelector('input[type=file]')?.click()} />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Vendor</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Match Status</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#149ECA', fontFamily: 'monospace' }}>{inv.invoice_number}</td>
                  <td style={{ color: '#172033' }}>{inv.vendor_name}</td>
                  <td><span style={{ color: '#64748B', fontSize: '11px', fontFamily: 'monospace' }}>{inv.project_code}</span></td>
                  <td style={{ fontWeight: 600, color: '#172033' }}>₹ {inv.total_amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: '#64748B' }}>{inv.invoice_date}</td>
                  <td style={{ color: '#64748B' }}>{inv.due_date}</td>
                  <td>
                    <span className={`badge ${inv.match_status === 'MATCHED' ? 'badge-success' : 'badge-danger'}`}>
                      {inv.match_status}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-warning">{inv.payment_status}</span>
                  </td>
                  <td>
                    <button onClick={() => setSelectedInvoice(inv)} style={{ background: 'transparent', border: 'none', color: '#149ECA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                      <Eye size={14} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Detail View Drawer */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23, 32, 51, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end', zIndex: 100 }}>
          <div style={{ width: '480px', background: '#FFFFFF', borderLeft: '1px solid #E2E8F0', height: '100%', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', margin: 0 }}>Invoice Details</h3>
              <button onClick={() => setSelectedInvoice(null)} className="btn-secondary" style={{ padding: '4px 8px' }}>Close</button>
            </div>

            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#149ECA' }}>{selectedInvoice.invoice_number}</span>
                <span className={`badge ${selectedInvoice.match_status === 'MATCHED' ? 'badge-success' : 'badge-danger'}`}>
                  {selectedInvoice.match_status}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#172033', margin: '0 0 4px 0', fontWeight: 600 }}>{selectedInvoice.vendor_name}</p>
              <p style={{ fontSize: '18px', fontWeight: 800, color: '#172033', margin: 0 }}>₹ {selectedInvoice.total_amount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
