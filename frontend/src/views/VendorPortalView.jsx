import React, { useState } from 'react';
import axios from 'axios';
import { Store, Upload, CheckCircle2, RefreshCw, FileText } from 'lucide-react';
import { uploadInvoiceDocument } from '../lib/supabaseClient';

export default function VendorPortalView() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleVendorUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const storageResult = await uploadInvoiceDocument(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('storage_url', storageResult.publicUrl || '');

      const res = await axios.post('/api/v1/invoices/upload', formData);
      setStatusMessage(`Invoice ${res.data.filename} submitted successfully to Finance for processing.`);
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatusMessage('Invoice submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store color="#149ECA" size={18} />
          <span>Vendor Self-Service Invoice Portal</span>
        </h3>

        <form onSubmit={handleVendorUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="drag-drop-zone" style={{ position: 'relative' }}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <Upload size={36} color="#149ECA" style={{ margin: '0 auto 12px auto', display: 'block' }} />
            <p style={{ color: '#172033', fontWeight: 600, margin: '0 0 4px 0' }}>
              {file ? file.name : 'Select or drag your vendor invoice PDF/Image here'}
            </p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Direct submission to Finance & Automated PO matching</p>
          </div>

          <button type="submit" disabled={loading || !file} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <FileText size={18} />}
            <span>{loading ? 'Submitting Invoice...' : 'Submit Vendor Invoice'}</span>
          </button>

          {statusMessage && (
            <p style={{ color: '#16A34A', fontSize: '13px', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>{statusMessage}</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
