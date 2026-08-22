import { 
  Activity, ArrowRight, CheckCircle2, Shield, Sparkles, 
  Workflow, Database, Cpu, Lock, Layers, ShoppingCart, 
  FileText, DollarSign, FolderKanban, Award, Users, BarChart3
} from 'lucide-react';

export default function LandingPage({ onNavigateToApp, onOpenAuth }) {
  return (
    <div style={{ background: '#F7F9FC', color: '#172033', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 11. LANDING PAGE NAVBAR */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ background: '#149ECA', padding: '6px', borderRadius: '6px', color: '#FFFFFF', display: 'flex' }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.04em', color: '#172033' }}>FINOVA</span>
            <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '6px' }}>by Neuronauts</span>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '28px', fontSize: '14px', fontWeight: 500, color: '#64748B' }}>
          <a href="#product" style={{ color: 'inherit', textDecoration: 'none' }}>Product</a>
          <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>How It Works</a>
          <a href="#intelligence" style={{ color: 'inherit', textDecoration: 'none' }}>Intelligence</a>
          <a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={onOpenAuth} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Log In
          </button>
          <button onClick={onNavigateToApp} className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* 12. LANDING PAGE HERO */}
      <section style={{ padding: '80px 40px 60px 40px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E0F2FE', color: '#149ECA', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '20px' }}>
          <Sparkles size={14} />
          <span>Finance • Innovation • Intelligence</span>
        </div>

        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#172033', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-0.02em' }}>
          Turn Financial Data Into Smarter Decisions.
        </h1>

        <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '800px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
          FINOVA connects procurement, invoices, expenses and project costs — then uses historical intelligence to help organizations detect anomalies, control spending and make better financial decisions.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
          <button onClick={onNavigateToApp} className="btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            <span>Explore FINOVA</span>
            <ArrowRight size={18} />
          </button>
          <a href="#workflow" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '15px', textDecoration: 'none' }}>
            See How It Works
          </a>
        </div>

        {/* Hero Visual Preview - Neutral Placeholders without fake values */}
        <div className="card" style={{ padding: '24px', borderRadius: '12px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>FINOVA Intelligence Engine</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#172033', margin: 0 }}>Executive Operations Preview</h3>
            </div>
            <span className="badge badge-info">Real Database Integration</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', textAlign: 'left' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Total Spend</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#172033', margin: '4px 0 0 0' }}>₹ —</h4>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>No data yet</span>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Outstanding Invoices</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#172033', margin: '4px 0 0 0' }}>₹ —</h4>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>No data yet</span>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Project Cost Utilization</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#172033', margin: '4px 0 0 0' }}>₹ —</h4>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>No data yet</span>
            </div>
          </div>
        </div>
      </section>

      {/* 13. LANDING PAGE — PROBLEM SECTION */}
      <section id="product" style={{ padding: '60px 40px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#172033', marginBottom: '40px' }}>
            Financial Data Exists. Intelligence Doesn't.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', textAlign: 'left' }}>
            <div className="card" style={{ background: '#F8FAFC' }}>
              <div style={{ background: '#FEE2E2', color: '#DC2626', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Layers size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#172033', marginBottom: '8px' }}>Disconnected</h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                Procurement, invoices, expenses and projects are often managed separately across disconnected spreadsheets and tools.
              </p>
            </div>

            <div className="card" style={{ background: '#F8FAFC' }}>
              <div style={{ background: '#FEF3C7', color: '#D97706', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Workflow size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#172033', marginBottom: '8px' }}>Manual</h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                Finance teams spend excessive time manually entering, validating and following up on repetitive financial processes.
              </p>
            </div>

            <div className="card" style={{ background: '#F8FAFC' }}>
              <div style={{ background: '#E0F2FE', color: '#149ECA', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <BarChart3 size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#172033', marginBottom: '8px' }}>Reactive</h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                Organizations often discover budget overruns and vendor price drift only after spending has already occurred.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. LANDING PAGE — CORE WORKFLOW */}
      <section id="workflow" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#172033', marginBottom: '12px' }}>
          Unified Financial Workflow Architecture
        </h2>
        <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '40px' }}>
          Connecting every transaction to organizational history, project budgets, and explainable AI.
        </p>

        {/* Polished Visual Workflow Diagram */}
        <div className="card" style={{ padding: '32px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', textAlign: 'center' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Users color="#149ECA" size={24} style={{ margin: '0 auto 8px auto' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#172033' }}>Vendors & PO</h4>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Procurement Orders & Goods Received Notes</p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <FolderKanban color="#2563EB" size={24} style={{ margin: '0 auto 8px auto' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#172033' }}>Projects & Budget</h4>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Actual Project Cost & Allocation</p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <DollarSign color="#16A34A" size={24} style={{ margin: '0 auto 8px auto' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#172033' }}>Employee Expenses</h4>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Receipt Uploads & Reimbursements</p>
            </div>
          </div>

          <div style={{ margin: '20px 0', color: '#149ECA', fontSize: '20px', fontWeight: 'bold' }}>↓</div>

          <div style={{ background: '#E0F2FE', padding: '20px', borderRadius: '8px', border: '1px solid #7DD3FC', maxWidth: '500px', margin: '0 auto' }}>
            <Sparkles color="#149ECA" size={24} style={{ margin: '0 auto 8px auto' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', margin: '0 0 4px 0' }}>Analytics + AI Engine</h4>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>3-Way PO/GRN Matching • Historical Price Drift • Explainable Recommendations</p>
          </div>
        </div>
      </section>

      {/* 15. LANDING PAGE — DIFFERENTIATOR */}
      <section style={{ padding: '60px 40px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#149ECA', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Illustrative Shift</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#172033', margin: '8px 0 40px 0' }}>
            From "What Happened?" to "What Should We Do?"
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', textAlign: 'left' }}>
            <div className="card" style={{ background: '#F8FAFC' }}>
              <span className="badge badge-warning" style={{ marginBottom: '12px' }}>Traditional Approach</span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '8px' }}>Transaction → Report</h4>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                Records data into static databases and generates past-looking financial reports after budgets are already exceeded.
              </p>
            </div>

            <div className="card" style={{ background: '#E0F2FE', border: '1px solid #7DD3FC' }}>
              <span className="badge badge-info" style={{ marginBottom: '12px' }}>FINOVA Approach</span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '8px' }}>Transaction → Analysis → AI Recommendation</h4>
              <p style={{ fontSize: '13px', color: '#172033', lineHeight: '1.5', margin: 0 }}>
                Compares transactions against historical organizational baselines to highlight price drift and generate evidence-backed recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 16. LANDING PAGE — FEATURE CARDS */}
      <section id="intelligence" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#172033', marginBottom: '40px' }}>
          Comprehensive Financial Operations Suite
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', textAlign: 'left' }}>
          <div className="card">
            <ShoppingCart color="#149ECA" size={24} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '6px' }}>Procurement Intelligence</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
              Track Purchase Orders, Goods Received Notes (GRN) and invoices with automated 3-way matching.
            </p>
          </div>

          <div className="card">
            <DollarSign color="#16A34A" size={24} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '6px' }}>Expense Management</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
              Manage employee-paid expenses, receipt uploads to Supabase, and reimbursement approval workflows.
            </p>
          </div>

          <div className="card">
            <FolderKanban color="#2563EB" size={24} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '6px' }}>Project Cost Tracking</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
              Connect procurement and employee expenses directly to real project cost allocations.
            </p>
          </div>

          <div className="card">
            <BarChart3 color="#D97706" size={24} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '6px' }}>Historical Analysis</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
              Compare current purchases with organizational purchase history to detect vendor price shifts.
            </p>
          </div>

          <div className="card">
            <Award color="#149ECA" size={24} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '6px' }}>AI Recommendations</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
              Generate explainable recommendations backed by verified historical financial data.
            </p>
          </div>
        </div>
      </section>

      {/* 17. AI INVOICE PROCESSING */}
      <section style={{ padding: '60px 40px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#172033', marginBottom: '12px' }}>
            Upload. Extract. Understand.
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '40px' }}>
            Automated PDF & Image parsing powered by Gemini 2.0 Vision AI.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <FileText size={20} color="#149ECA" />
              <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '8px 0 4px 0' }}>1. Invoice File</h5>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>PDF / PNG / JPG Upload</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Cpu size={20} color="#2563EB" />
              <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '8px 0 4px 0' }}>2. AI Extraction</h5>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Gemini 2.0 Flash Model</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Database size={20} color="#16A34A" />
              <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '8px 0 4px 0' }}>3. Structured Data</h5>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Line Items & Amounts</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <CheckCircle2 size={20} color="#D97706" />
              <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '8px 0 4px 0' }}>4. 3-Way Match</h5>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>PO & GRN Validation</p>
            </div>
          </div>
        </div>
      </section>

      {/* 18 & 19. AUTOMATION & TECHNOLOGY STRIP */}
      <section style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#172033', marginBottom: '12px' }}>
          Automation Behind Every Financial Event
        </h2>
        <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '32px', maxWidth: '700px', margin: '0 auto 32px auto' }}>
          n8n orchestrates repetitive finance workflows such as data validation, approvals, notifications, and AI processing across your stack.
        </p>

        {/* Tech Strip */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '32px' }}>
          <span style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#172033' }}>PostgreSQL</span>
          <span style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#172033' }}>Supabase</span>
          <span style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#172033' }}>FastAPI</span>
          <span style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#172033' }}>n8n Automation</span>
          <span style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#172033' }}>Gemini AI</span>
        </div>
      </section>

      {/* 20. SECURITY SECTION */}
      <section id="security" style={{ padding: '60px 40px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <Shield size={32} color="#149ECA" style={{ margin: '0 auto 12px auto' }} />
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#172033', marginBottom: '32px' }}>
            Built for Sensitive Financial Data
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', textAlign: 'left' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Lock size={18} color="#149ECA" />
              <h5 style={{ fontSize: '13px', fontWeight: 700, margin: '6px 0 2px 0' }}>Secure Auth</h5>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Supabase Authentication</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Users size={18} color="#149ECA" />
              <h5 style={{ fontSize: '13px', fontWeight: 700, margin: '6px 0 2px 0' }}>Role Access</h5>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Role-Based Workspaces</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Database size={18} color="#149ECA" />
              <h5 style={{ fontSize: '13px', fontWeight: 700, margin: '6px 0 2px 0' }}>PostgreSQL</h5>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Structured Data Isolation</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Cpu size={18} color="#149ECA" />
              <h5 style={{ fontSize: '13px', fontWeight: 700, margin: '6px 0 2px 0' }}>Server AI</h5>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Server-Side Key Protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* 21. LANDING PAGE — CTA */}
      <section style={{ padding: '80px 40px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#172033', marginBottom: '12px' }}>
          Make Every Financial Decision Smarter.
        </h2>
        <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '32px' }}>
          Bring procurement, expenses, invoices and project costs together with FINOVA.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button onClick={onNavigateToApp} className="btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Get Started
          </button>
          <button onClick={onNavigateToApp} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '15px' }}>
            Explore Platform
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '24px 40px', textAlign: 'center', fontSize: '12px', color: '#64748B' }}>
        <p style={{ margin: 0 }}>FINOVA by Neuronauts • Finance • Innovation • Intelligence</p>
      </footer>
    </div>
  );
}
