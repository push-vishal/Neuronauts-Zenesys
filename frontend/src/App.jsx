import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, ShieldAlert, FileText, CheckCircle2, AlertTriangle, 
  Activity, RefreshCw, DollarSign, User, CloudUpload, Link as LinkIcon, Database, Building, Edit3
} from 'lucide-react';
import { supabase, isSupabaseConfigured, uploadInvoiceDocument, uploadExpenseReceipt } from './lib/supabaseClient';
import AuthModal from './components/Auth';
import RoleSwitcher, { ROLES } from './components/RoleSwitcher';

// Import Role Views
import ProcurementView from './views/ProcurementView';
import ProjectManagerView from './views/ProjectManagerView';
import CfoDashboardView from './views/CfoDashboardView';
import VendorPortalView from './views/VendorPortalView';

export default function App() {
  const [activeRole, setActiveRole] = useState('finance_team'); // Default role: Finance Team
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' or 'expenses'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  // Organization Profile State
  const [orgDetails, setOrgDetails] = useState(() => {
    const saved = localStorage.getItem('finova_org');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Neuronauts Global Enterprise',
      industry: 'Software & AI Technology',
      size: '51-200 employees',
      taxId: 'TAX-9921408',
      currency: 'USD ($)'
    };
  });

  const handleUpdateOrg = (updated) => {
    setOrgDetails(updated);
    localStorage.setItem('finova_org', JSON.stringify(updated));
  };

  // Supabase Auth State
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Expense form state
  const [expenseData, setExpenseData] = useState({
    employee_name: '',
    project_name: '',
    amount: '',
    category: 'Travel'
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseMessage, setExpenseMessage] = useState(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      setUploadStatus('Uploading document to Supabase Storage...');
      const storageResult = await uploadInvoiceDocument(file);
      
      setUploadStatus('Analyzing historical procurement data via Gemini AI...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('storage_url', storageResult.publicUrl || '');

      const response = await axios.post('/api/v1/invoices/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAuditResult({
        ...response.data,
        supabase_storage_url: storageResult.publicUrl,
        supabase_path: storageResult.path,
        simulated_storage: storageResult.simulated,
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Failed to upload and audit invoice.');
    } finally {
      setLoading(false);
      setUploadStatus('');
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setExpenseLoading(true);
    setExpenseMessage(null);

    try {
      let receiptUrl = null;
      if (receiptFile) {
        const storageResult = await uploadExpenseReceipt(receiptFile);
        receiptUrl = storageResult.publicUrl;
      }

      const response = await axios.post('/api/v1/expenses/', {
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        receipt_url: receiptUrl
      });

      setExpenseMessage(response.data.message + (receiptUrl ? ' Receipt saved in Supabase Storage.' : ''));
      setExpenseData({ employee_name: '', project_name: '', amount: '', category: 'Travel' });
      setReceiptFile(null);
    } catch (err) {
      console.error(err);
      setExpenseMessage('Failed to submit expense.');
    } finally {
      setExpenseLoading(false);
    }
  };

  const currentRoleMeta = ROLES.find(r => r.id === activeRole) || ROLES[1];

  return (
    <div className="app-container">
      {/* Auth & Organization Edit Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        orgDetails={orgDetails}
        onUpdateOrg={handleUpdateOrg}
        onAuthSuccess={(u) => setUser(u)}
      />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ background: currentRoleMeta.color, padding: '8px', borderRadius: '8px', color: 'white' }}>
            <Activity size={24} />
          </div>
          <div>
            <h1 style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px', margin: 0, color: '#ffffff' }}>FINOVA</h1>
            <p style={{ fontSize: '12px', color: '#06b6d4', margin: 0 }}>AI Procurement Platform</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Organization Card */}
          <div style={{ background: '#090d16', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>ORGANIZATION</span>
              <button onClick={() => setIsAuthOpen(true)} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0 }}>
                <Edit3 size={14} />
              </button>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {orgDetails.name}
            </p>
            <p style={{ fontSize: '11px', color: '#06b6d4', margin: 0 }}>{orgDetails.industry}</p>
          </div>

          <div style={{ background: '#090d16', padding: '10px 12px', borderRadius: '8px', border: '1px solid #17223b', marginBottom: '8px' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px 0' }}>ACTIVE WORKSPACE</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: currentRoleMeta.color, margin: 0 }}>{currentRoleMeta.label}</p>
          </div>

          {(activeRole === 'finance_team' || activeRole === 'employee') && (
            <>
              <button
                onClick={() => setActiveTab('audit')}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: activeTab === 'audit' ? '#17223b' : 'transparent', borderRadius: '8px', color: activeTab === 'audit' ? '#3b82f6' : '#9ca3af', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 500, width: '100%' }}
              >
                <Upload size={20} />
                <span>Invoice & 3-Way Audit</span>
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: activeTab === 'expenses' ? '#17223b' : 'transparent', borderRadius: '8px', color: activeTab === 'expenses' ? '#3b82f6' : '#9ca3af', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 500, width: '100%' }}
              >
                <DollarSign size={20} />
                <span>Employee Expenses</span>
              </button>
            </>
          )}
        </nav>

        {/* User Account / Auth Section */}
        <div style={{ padding: '16px', borderTop: '1px solid #17223b' }}>
          <button
            onClick={() => setIsAuthOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#090d16',
              border: '1px solid #223055',
              borderRadius: '8px',
              color: '#d1d5db',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <User size={18} color="#06b6d4" />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user ? user.email : 'Profile & Settings'}
              </span>
            </div>
            <span style={{ fontSize: '11px', background: user ? '#15803d' : '#1e293b', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
              {user ? 'Auth' : 'Settings'}
            </span>
          </button>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #17223b', fontSize: '12px', color: '#9ca3af' }}>
          <p style={{ fontWeight: 600, color: '#d1d5db', margin: '0 0 4px 0' }}>System Status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            <span>Gemini 2.0 & Supabase Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header-bar" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="#38bdf8" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8' }}>{orgDetails.name}</span>
                <span style={{ fontSize: '11px', color: '#64748b', background: '#0f172a', padding: '2px 8px', borderRadius: '4px' }}>{orgDetails.currency}</span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 0 0', color: '#ffffff' }}>
                {currentRoleMeta.label} Workspace
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsAuthOpen(true)}
                style={{
                  fontSize: '12px',
                  color: '#e2e8f0',
                  background: '#1e293b',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={14} color="#06b6d4" />
                <span>Edit Org Profile</span>
              </button>
            </div>
          </div>

          {/* Interactive Profile Role Switcher Header Bar */}
          <RoleSwitcher activeRole={activeRole} onRoleChange={(r) => setActiveRole(r)} />
        </header>

        <div className="content-body">
          {/* Render Dynamic Role View */}
          {activeRole === 'procurement_manager' && <ProcurementView />}
          {activeRole === 'project_manager' && <ProjectManagerView />}
          {activeRole === 'cfo' && <CfoDashboardView />}
          {activeRole === 'vendor' && <VendorPortalView />}

          {(activeRole === 'finance_team' || activeRole === 'employee') && (
            activeTab === 'audit' ? (
              <>
                {/* Upload Card */}
                <div className="card">
                  <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                    <CloudUpload color="#3b82f6" size={20} />
                    <span>Upload Procurement Invoice PDF or Image to Supabase Cloud</span>
                  </h3>

                  <div className="dropzone">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <Upload size={48} color="#3b82f6" style={{ margin: '0 auto 12px auto', display: 'block' }} />
                    <p style={{ color: '#d1d5db', fontWeight: 500, margin: '0 0 4px 0' }}>
                      {file ? file.name : "Drag and drop your invoice here, or click to browse"}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Auto-stores in Supabase Storage & runs Gemini 2.0 AI Audit</p>
                  </div>

                  {file && (
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.5 : 1 }}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="animate-spin" size={18} />
                            <span>{uploadStatus || 'Processing...'}</span>
                          </>
                        ) : (
                          <span>Upload to Supabase & Run AI Audit</span>
                        )}
                      </button>
                    </div>
                  )}

                  {error && (
                    <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(127, 29, 29, 0.3)', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ShieldAlert size={20} style={{ flexShrink: 0 }} />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Audit Results Section */}
                {auditResult && (
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #17223b', paddingBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f9fafb', margin: '0 0 4px 0' }}>{auditResult.vendor_name}</h3>
                        <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Total Amount: <span style={{ color: '#ffffff', fontWeight: 600 }}>${auditResult.total_amount}</span></p>
                      </div>
                      <div>
                        {auditResult.anomalies_detected > 0 ? (
                          <div className="badge-alert">
                            <AlertTriangle size={16} />
                            <span>{auditResult.anomalies_detected} Anomaly Detected</span>
                          </div>
                        ) : (
                          <div className="badge-success">
                            <CheckCircle2 size={16} />
                            <span>Clean Invoice (No Anomalies)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Supabase Storage Reference */}
                    {auditResult.supabase_storage_url && (
                      <div style={{ background: '#090d16', padding: '12px 16px', borderRadius: '8px', border: '1px solid #17223b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                          <Database size={16} color="#06b6d4" />
                          <span>Supabase Storage Path: <code style={{ color: '#38bdf8' }}>{auditResult.supabase_path}</code></span>
                        </div>
                        <a
                          href={auditResult.supabase_storage_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          <LinkIcon size={14} />
                          <span>View Document</span>
                        </a>
                      </div>
                    )}

                    {/* Anomalies List */}
                    {auditResult.anomalies && auditResult.anomalies.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Explainable AI Insights & Price Drift</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {auditResult.anomalies.map((anomaly, idx) => (
                            <div key={idx} style={{ background: '#090d16', border: '1px solid rgba(153, 27, 27, 0.5)', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <ShieldAlert color="#ef4444" size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#f87171' }}>{anomaly.type}</span>
                                  <span style={{ fontSize: '11px', background: 'rgba(153, 27, 27, 0.5)', color: '#fca5a5', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'monospace' }}>{anomaly.severity}</span>
                                </div>
                                <p style={{ fontSize: '14px', color: '#d1d5db', margin: '4px 0 0 0' }}>{anomaly.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Expenses Tab */
              <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Submit Employee Expense</h3>
                <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Employee Name</label>
                    <input
                      type="text"
                      required
                      value={expenseData.employee_name}
                      onChange={(e) => setExpenseData({ ...expenseData, employee_name: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #223055', borderRadius: '6px', color: '#fff' }}
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Project Name / Code</label>
                    <input
                      type="text"
                      required
                      value={expenseData.project_name}
                      onChange={(e) => setExpenseData({ ...expenseData, project_name: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #223055', borderRadius: '6px', color: '#fff' }}
                      placeholder="e.g. Project Nebula"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={expenseData.amount}
                      onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #223055', borderRadius: '6px', color: '#fff' }}
                      placeholder="150.00"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Category</label>
                    <select
                      value={expenseData.category}
                      onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #223055', borderRadius: '6px', color: '#fff' }}
                    >
                      <option value="Travel">Travel</option>
                      <option value="Software">Software & Subscriptions</option>
                      <option value="Hardware">Hardware & Equipment</option>
                      <option value="Meals">Meals & Entertainment</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                      Attach Receipt Image/PDF (Stores in Supabase `receipts` Bucket)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      style={{ width: '100%', padding: '8px', background: '#090d16', border: '1px solid #223055', borderRadius: '6px', color: '#9ca3af', fontSize: '13px' }}
                    />
                  </div>

                  <button type="submit" disabled={expenseLoading} className="btn-primary" style={{ marginTop: '8px' }}>
                    {expenseLoading ? 'Uploading & Submitting...' : 'Submit Expense Report'}
                  </button>
                  {expenseMessage && (
                    <p style={{ color: '#4ade80', fontSize: '14px', marginTop: '8px' }}>{expenseMessage}</p>
                  )}
                </form>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}