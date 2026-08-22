import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Server, RefreshCw, CheckCircle2, ShieldCheck, Database, 
  ArrowRightLeft, FileSpreadsheet, Building2, Send, Check, Layers
} from 'lucide-react';

export default function ErpIntegrationView() {
  const [activeTab, setActiveTab] = useState('sync'); // 'sync' | 'gl' | 'commitments'
  const [statusData, setStatusData] = useState(null);
  const [syncData, setSyncData] = useState(null);
  const [commitmentsData, setCommitmentsData] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // GL Journal Generator Form State
  const [journalForm, setJournalForm] = useState({
    invoice_ref: 'INV-2026-0892',
    vendor_name: 'Acme Hardware Solutions',
    amount: '4250.00',
    category: 'Software'
  });
  const [postingJournal, setPostingJournal] = useState(false);
  const [postedJournal, setPostedJournal] = useState(null);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadErpData() {
      try {
        const [statusRes, commRes] = await Promise.all([
          axios.get('/api/v1/erp/netsuite/status').catch(() => null),
          axios.get('/api/v1/erp/commitments').catch(() => null)
        ]);

        if (!ignore) {
          if (statusRes?.data) setStatusData(statusRes.data);
          if (commRes?.data) setCommitmentsData(commRes.data);
        }
      } catch (err) {
        console.error('Error fetching ERP status', err);
      }
    }

    loadErpData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    try {
      const res = await axios.post('/api/v1/erp/netsuite/sync');
      setSyncData(res.data);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    } catch (err) {
      console.error('ERP sync error', err);
    } finally {
      setSyncing(false);
    }
  };

  const handlePostJournal = async (e) => {
    e.preventDefault();
    setPostingJournal(true);
    setPostSuccess(false);
    try {
      const res = await axios.post('/api/v1/erp/netsuite/post-journal', {
        invoice_ref: journalForm.invoice_ref,
        vendor_name: journalForm.vendor_name,
        amount: parseFloat(journalForm.amount),
        category: journalForm.category
      });
      setPostedJournal(res.data.journal);
      setPostSuccess(true);
    } catch (err) {
      console.error('Journal posting error', err);
    } finally {
      setPostingJournal(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. NETSUITE CONNECTOR HERO STATUS BANNER */}
      <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Left NetSuite Badge Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#E0F2FE', color: '#149ECA', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#172033', margin: 0 }}>
                  {statusData?.erp_system || 'Oracle NetSuite ERP'}
                </h3>
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} />
                  <span>SuiteTalk API Connected</span>
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                Realm: <strong style={{ color: '#172033' }}>{statusData?.account_realm || 'TSTDRV9921408_SB1'}</strong> • Subsidiary: <strong style={{ color: '#172033' }}>{statusData?.primary_subsidiary || 'Neuronauts India Pvt Ltd'}</strong> • Auth: Token-Based (TBA)
              </p>
            </div>
          </div>

          {/* Right Action: Trigger 2-Way Sync */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
            >
              <RefreshCw className={syncing ? 'animate-spin' : ''} size={16} />
              <span>{syncing ? 'Synchronizing SuiteTalk...' : 'Sync NetSuite ERP'}</span>
            </button>
          </div>
        </div>

        {syncSuccess && (
          <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', padding: '10px 16px', borderRadius: '6px', marginTop: '16px', color: '#16A34A', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} />
            <span>{syncData?.message || 'Bi-directional NetSuite synchronization completed successfully.'}</span>
          </div>
        )}
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('sync')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'sync' ? '#E0F2FE' : 'transparent',
            color: activeTab === 'sync' ? '#149ECA' : '#64748B',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowRightLeft size={16} />
          <span>2-Way Record Sync</span>
        </button>

        <button
          onClick={() => setActiveTab('gl')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'gl' ? '#E0F2FE' : 'transparent',
            color: activeTab === 'gl' ? '#149ECA' : '#64748B',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FileSpreadsheet size={16} />
          <span>GL & Cost Center Mapping</span>
        </button>

        <button
          onClick={() => setActiveTab('commitments')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'commitments' ? '#E0F2FE' : 'transparent',
            color: activeTab === 'commitments' ? '#149ECA' : '#64748B',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Building2 size={16} />
          <span>Budgetary Commitments & Encumbrances</span>
        </button>
      </div>

      {/* 3. TAB 1: BI-DIRECTIONAL RECORD SYNC TELEMETRY */}
      {activeTab === 'sync' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#172033', margin: 0 }}>
                  NetSuite Synchronized Transaction Records
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Bi-directional mapping of VendorBills, PurchaseOrders, ItemReceipts & ExpenseReports.
                </p>
              </div>
              <span className="badge badge-info">SuiteTalk REST v2024.2</span>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>NetSuite Record Type</th>
                    <th>NetSuite Internal ID</th>
                    <th>FINOVA Reference</th>
                    <th>Entity / Vendor</th>
                    <th>Amount / Units</th>
                    <th>NetSuite Posting Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(syncData?.synced_records || [
                    { record_type: 'VendorBill', internal_id: 'VB-10928', tran_id: 'INV-2026-0892', entity: 'Acme Hardware Solutions', amount: 4250.00, status: 'Paid In Full / Posted' },
                    { record_type: 'PurchaseOrder', internal_id: 'PO-8419', tran_id: 'PO-9921', entity: 'Acme Hardware Solutions', amount: 3800.00, status: 'Pending Receipt' },
                    { record_type: 'ItemReceipt', internal_id: 'IR-5521', tran_id: 'GRN-4412', entity: 'Acme Hardware Solutions', amount: '3 Items Verified', status: 'Received' },
                    { record_type: 'ExpenseReport', internal_id: 'EXP-3012', tran_id: 'EXP-NEBULA-01', entity: 'Rahul Sharma', amount: 2490.00, status: 'Approved for Reimbursement' }
                  ]).map((rec, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: '#172033', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={15} color="#149ECA" />
                        <span>{rec.record_type}</span>
                      </td>
                      <td>
                        <code style={{ fontSize: '12px', color: '#149ECA', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                          {rec.internal_id}
                        </code>
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', color: '#64748B' }}>{rec.tran_id}</td>
                      <td style={{ color: '#172033' }}>{rec.entity}</td>
                      <td style={{ fontWeight: 600, color: '#172033' }}>
                        {typeof rec.amount === 'number' ? `₹ ${rec.amount.toLocaleString('en-IN')}` : rec.amount}
                      </td>
                      <td>
                        <span className="badge badge-success">{rec.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: GENERAL LEDGER (GL) AUTO-ACCOUNTING & JOURNAL GENERATOR */}
      {activeTab === 'gl' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          
          {/* Post to GL Form */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#172033', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet color="#149ECA" size={18} />
              <span>NetSuite Double-Entry GL Journal Generator</span>
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px 0' }}>
              Automatically maps invoice line items into standard NetSuite Chart of Accounts with balanced Debits and Credits.
            </p>

            <form onSubmit={handlePostJournal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Invoice Reference</label>
                <input
                  type="text"
                  required
                  value={journalForm.invoice_ref}
                  onChange={(e) => setJournalForm({ ...journalForm, invoice_ref: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Vendor Entity</label>
                <input
                  type="text"
                  required
                  value={journalForm.vendor_name}
                  onChange={(e) => setJournalForm({ ...journalForm, vendor_name: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={journalForm.amount}
                    onChange={(e) => setJournalForm({ ...journalForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Expense Category</label>
                  <select
                    value={journalForm.category}
                    onChange={(e) => setJournalForm({ ...journalForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="Software">Software & Subscriptions (60100)</option>
                    <option value="Hardware">Computer Hardware (52100)</option>
                    <option value="Consulting">Professional Consulting (60300)</option>
                    <option value="Travel">Employee Travel (60500)</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={postingJournal} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
                <Send size={16} />
                <span>{postingJournal ? 'Posting to NetSuite GL...' : 'Generate & Post NetSuite Journal'}</span>
              </button>

              {postSuccess && (
                <p style={{ color: '#16A34A', fontSize: '12px', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
                  <span>Journal posted successfully to Oracle NetSuite GL!</span>
                </p>
              )}
            </form>
          </div>

          {/* Live Journal Entry Debit/Credit Balanced Preview */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#172033', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers color="#16A34A" size={18} />
              <span>NetSuite Double-Entry Ledger Preview</span>
            </h3>
            
            {postedJournal ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <span>Journal ID: <strong style={{ color: '#149ECA' }}>{postedJournal.journal_id}</strong></span>
                  <span>Period: <strong style={{ color: '#172033' }}>{postedJournal.posting_period}</strong></span>
                  <span className="badge badge-success">{postedJournal.netsuite_status}</span>
                </div>

                <div className="data-table-container">
                  <table className="data-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Account / Code</th>
                        <th>Department / Class</th>
                        <th>Debit (₹)</th>
                        <th>Credit (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {postedJournal.lines.map((line, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong style={{ color: '#172033' }}>{line.account_code}</strong>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{line.account_name}</div>
                          </td>
                          <td style={{ color: '#64748B' }}>{line.department}</td>
                          <td style={{ fontWeight: 600, color: line.debit > 0 ? '#16A34A' : '#64748B' }}>
                            {line.debit > 0 ? `₹ ${line.debit.toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td style={{ fontWeight: 600, color: line.credit > 0 ? '#DC2626' : '#64748B' }}>
                            {line.credit > 0 ? `₹ ${line.credit.toLocaleString('en-IN')}` : '—'}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: '#F8FAFC', fontWeight: 700 }}>
                        <td colSpan={2} style={{ textAlign: 'right', color: '#172033' }}>Total Balanced:</td>
                        <td style={{ color: '#16A34A' }}>₹ {postedJournal.total_debit.toLocaleString('en-IN')}</td>
                        <td style={{ color: '#DC2626' }}>₹ {postedJournal.total_credit.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '32px 16px', textAlign: 'center' }}>
                <ShieldCheck size={32} color="#149ECA" style={{ margin: '0 auto 8px auto' }} />
                <p style={{ fontSize: '13px', color: '#172033', fontWeight: 600, margin: 0 }}>Automated NetSuite GL Verification</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Fill the form and click post to preview the balanced NetSuite double-entry ledger.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 3: BUDGETARY COMMITMENTS & ENCUMBRANCES */}
      {activeTab === 'commitments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* KPI Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="card">
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>NetSuite Fiscal Budget</span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#172033', margin: '4px 0 0 0' }}>
                ₹ {(commitmentsData?.total_budget || 4800000).toLocaleString('en-IN')}
              </h3>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>FY2026-2027 Allocation</p>
            </div>

            <div className="card">
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Posted Actual Spend</span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#149ECA', margin: '4px 0 0 0' }}>
                ₹ {(commitmentsData?.total_actual_posted || 1595000).toLocaleString('en-IN')}
              </h3>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>Settled VendorBills</p>
            </div>

            <div className="card">
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Encumbered (Open POs)</span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#D97706', margin: '4px 0 0 0' }}>
                ₹ {(commitmentsData?.total_encumbered_pos || 635000).toLocaleString('en-IN')}
              </h3>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>Committed in Open POs</p>
            </div>

            <div className="card">
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Available Uncommitted</span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#16A34A', margin: '4px 0 0 0' }}>
                ₹ {(commitmentsData?.available_funds || 2570000).toLocaleString('en-IN')}
              </h3>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                {commitmentsData?.utilization_percentage || 46.5}% utilized
              </p>
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#172033', margin: 0 }}>
                NetSuite Chart of Accounts & Departmental Encumbrance Audit
              </h3>
              <span className="badge badge-success">Pre-Commitment Enforcement Active</span>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>GL Code</th>
                    <th>Account Name</th>
                    <th>Department</th>
                    <th>Allocated Budget</th>
                    <th>Actual Spend</th>
                    <th>Encumbered (POs)</th>
                    <th>Available Funds</th>
                  </tr>
                </thead>
                <tbody>
                  {(commitmentsData?.accounts_breakdown || [
                    { account_code: '60100', name: 'IT & Software Subscription Expense', department: 'Engineering (Dept-10)', budget: 1500000, actual: 420000, encumbered: 180000 },
                    { account_code: '52100', name: 'Computer Hardware & Capital Assets', department: 'Operations (Dept-20)', budget: 2000000, actual: 850000, encumbered: 350000 },
                    { account_code: '60300', name: 'Professional Consulting Fees', department: 'Finance & Legal (Dept-30)', budget: 800000, actual: 210000, encumbered: 75000 },
                    { account_code: '60500', name: 'Employee Travel & Subsistence', department: 'Administration (Dept-40)', budget: 500000, actual: 115000, encumbered: 30000 }
                  ]).map((acc, i) => {
                    const avail = acc.budget - (acc.actual + acc.encumbered);
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: '#149ECA', fontFamily: 'monospace' }}>{acc.account_code}</td>
                        <td style={{ fontWeight: 600, color: '#172033' }}>{acc.name}</td>
                        <td style={{ color: '#64748B' }}>{acc.department}</td>
                        <td>₹ {acc.budget.toLocaleString('en-IN')}</td>
                        <td style={{ color: '#172033', fontWeight: 600 }}>₹ {acc.actual.toLocaleString('en-IN')}</td>
                        <td style={{ color: '#D97706', fontWeight: 600 }}>₹ {acc.encumbered.toLocaleString('en-IN')}</td>
                        <td style={{ color: avail >= 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                          ₹ {avail.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
