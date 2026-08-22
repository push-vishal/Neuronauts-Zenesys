import React, { useState } from 'react';
import axios from 'axios';
import { Upload, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Activity, RefreshCw, DollarSign, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' or 'expenses'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  // Expense form state
  const [expenseData, setExpenseData] = useState({
    employee_name: '',
    project_name: '',
    amount: '',
    category: 'Travel'
  });
  const [expenseMessage, setExpenseMessage] = useState(null);

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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/v1/invoices/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAuditResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to upload and audit invoice.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/expenses/', {
        ...expenseData,
        amount: parseFloat(expenseData.amount)
      });
      setExpenseMessage(response.data.message);
      setExpenseData({ employee_name: '', project_name: '', amount: '', category: 'Travel' });
    } catch (err) {
      console.error(err);
      setExpenseMessage('Failed to submit expense.');
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '8px', color: 'white' }}>
            <Activity size={24} />
          </div>
          <div>
            <h1 style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px', margin: 0, color: '#ffffff' }}>FINOVA</h1>
            <p style={{ fontSize: '12px', color: '#06b6d4', margin: 0 }}>AI Procurement & Intelligence</p>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('audit')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: activeTab === 'audit' ? '#17223b' : 'transparent', borderRadius: '8px', color: activeTab === 'audit' ? '#3b82f6' : '#9ca3af', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 500, width: '100%' }}
          >
            <Upload size={20} />
            <span>Invoice & Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: activeTab === 'expenses' ? '#17223b' : 'transparent', borderRadius: '8px', color: activeTab === 'expenses' ? '#3b82f6' : '#9ca3af', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 500, width: '100%' }}
          >
            <DollarSign size={20} />
            <span>Employee Expenses</span>
          </button>
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #17223b', fontSize: '12px', color: '#9ca3af' }}>
          <p style={{ fontWeight: 600, color: '#d1d5db', margin: '0 0 4px 0' }}>System Status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            <span>Gemini 2.0 Flash Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header-bar">
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#ffffff' }}>
            {activeTab === 'audit' ? 'Procurement & Invoice Intelligence' : 'Employee Reimbursement & Expenses'}
          </h2>
          <div style={{ fontSize: '13px', color: '#ffffff', background: '#17223b', padding: '6px 12px', borderRadius: '20px', border: '1px solid #223055' }}>
            Platform Mode: <span style={{ color: '#06b6d4', fontWeight: 500 }}>Neuronauts AI</span>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'audit' ? (
            <>
              {/* Upload Card */}
              <div className="card">
                <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                  <FileText color="#3b82f6" size={20} />
                  <span>Upload Procurement Invoice PDF or Image</span>
                </h3>

                <div className="dropzone">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                  <Upload size={48} color="#9ca3af" style={{ margin: '0 auto 12px auto', display: 'block' }} />
                  <p style={{ color: '#d1d5db', fontWeight: 500, margin: '0 0 4px 0' }}>
                    {file ? file.name : "Drag and drop your invoice here, or click to browse"}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Supports PDF, PNG, JPG up to 20MB</p>
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
                          <span>Analyzing Historical Data via AI...</span>
                        </>
                      ) : (
                        <span>Run AI Audit & Recommendations</span>
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
                <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                  Submit Expense Report
                </button>
                {expenseMessage && (
                  <p style={{ color: '#4ade80', fontSize: '14px', marginTop: '8px' }}>{expenseMessage}</p>
                )}
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}